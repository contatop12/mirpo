/**
 * Worker do site Mirpo. Os arquivos estáticos (dist/) são servidos direto pela Cloudflare;
 * este código só roda em /api/* e /video/* (ver `run_worker_first` no wrangler.jsonc).
 *
 * POST /api/orcamento → valida o pedido do formulário e repassa ao n8n
 * (fluxo "P12 Mirpo — Formulário de Orçamento (Site)", que envia ao Pulseboard).
 * O endereço e o token do n8n ficam só no servidor: N8N_WEBHOOK_URL (vars) e N8N_WEBHOOK_TOKEN (secret).
 *
 * /video/* → mesmo arquivo dos assets, mas atendendo `Range` com 206 (o Safari só toca vídeo
 * assim; os assets estáticos respondem 200 com o arquivo inteiro).
 */

interface RateLimit {
  limit(options: { key: string }): Promise<{ success: boolean }>;
}

interface Assets {
  fetch(input: Request | string, init?: RequestInit): Promise<Response>;
}

interface Env {
  ASSETS: Assets;
  N8N_WEBHOOK_URL?: string;
  N8N_WEBHOOK_TOKEN?: string;
  LEADS_RATE?: RateLimit;
}

const VIDEO_CACHE = 'public, max-age=31536000, immutable';

const serveVideo = async (request: Request, env: Env): Promise<Response> => {
  if (request.method !== 'GET' && request.method !== 'HEAD') return new Response(null, { status: 405, headers: { allow: 'GET, HEAD' } });
  const range = request.headers.get('range');
  const m = range?.match(/^bytes=(\d*)-(\d*)$/);

  // Sem Range (ou Range com vários trechos): resposta normal dos assets, avisando que aceita Range
  if (!m || (m[1] === '' && m[2] === '')) {
    const res = await env.ASSETS.fetch(request);
    const out = new Response(res.body, res);
    out.headers.set('accept-ranges', 'bytes');
    out.headers.set('cache-control', res.ok || res.status === 304 ? VIDEO_CACHE : 'no-store');
    return out;
  }

  const full = await env.ASSETS.fetch(new Request(request.url, { method: 'GET' }));
  if (!full.ok) {
    const out = new Response(full.body, full);
    out.headers.set('cache-control', 'no-store');
    return out;
  }
  const buf = await full.arrayBuffer();
  const size = buf.byteLength;
  let start: number;
  let end: number;
  if (m[1] === '') {
    // "bytes=-500": últimos 500 bytes
    start = Math.max(0, size - Number(m[2]));
    end = size - 1;
  } else {
    start = Number(m[1]);
    end = m[2] === '' ? size - 1 : Math.min(Number(m[2]), size - 1);
  }
  if (start >= size || start > end) {
    return new Response(null, { status: 416, headers: { 'content-range': `bytes */${size}`, 'accept-ranges': 'bytes' } });
  }
  const headers = new Headers({
    'content-type': full.headers.get('content-type') ?? 'video/mp4',
    'content-length': String(end - start + 1),
    'content-range': `bytes ${start}-${end}/${size}`,
    'accept-ranges': 'bytes',
    'cache-control': VIDEO_CACHE,
    'x-content-type-options': 'nosniff',
  });
  const etag = full.headers.get('etag');
  if (etag) headers.set('etag', etag);
  return new Response(request.method === 'HEAD' ? null : buf.slice(start, end + 1), { status: 206, headers });
};

const MAX_BODY = 16_000;

/** Campos aceitos e tamanho máximo de cada um; o resto é descartado. */
const FIELDS = {
  nome: 120,
  telefone: 30,
  email: 160,
  cidade: 120,
  linha: 60,
  veiculo: 120,
  ano: 10,
  motor: 120,
  mensagem: 2000,
  canal: 20,
  pagina: 300,
} as const;

const json = (status: number, body: Record<string, unknown>, headers: Record<string, string> = {}): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...headers },
  });

const text = (v: unknown, max: number): string =>
  (typeof v === 'string' || typeof v === 'number' ? String(v) : '').replace(/\s+/g, ' ').trim().slice(0, max);

const handleQuote = async (request: Request, env: Env): Promise<Response> => {
  if (request.method !== 'POST') return json(405, { ok: false, motivo: 'método não permitido' }, { allow: 'POST' });

  // Só aceita envio do próprio site (o navegador sempre manda Origin em POST via fetch)
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) return json(403, { ok: false, motivo: 'origem não permitida' });

  if (!(request.headers.get('content-type') ?? '').includes('application/json')) {
    return json(415, { ok: false, motivo: 'envie JSON' });
  }

  const ip = request.headers.get('cf-connecting-ip') ?? 'local';
  if (env.LEADS_RATE) {
    const { success } = await env.LEADS_RATE.limit({ key: ip });
    if (!success) return json(429, { ok: false, motivo: 'muitos envios, tente em 1 minuto' }, { 'retry-after': '60' });
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY) return json(413, { ok: false, motivo: 'pedido muito grande' });

  let input: Record<string, unknown>;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('formato');
    input = parsed as Record<string, unknown>;
  } catch {
    return json(400, { ok: false, motivo: 'JSON inválido' });
  }

  // Honeypot: robô preencheu o campo escondido → finge sucesso e descarta
  if (text(input.empresa_site, 200)) return json(200, { ok: true });

  const lead: Record<string, unknown> = {};
  for (const [key, max] of Object.entries(FIELDS)) lead[key] = text(input[key], max);
  const pecas = Array.isArray(input.pecas) ? input.pecas : [input.pecas];
  lead.pecas = pecas.map((p) => text(p, 80)).filter(Boolean).slice(0, 30);

  if (String(lead.nome).length < 2 || String(lead.telefone).replace(/\D/g, '').length < 10) {
    return json(422, { ok: false, motivo: 'nome ou telefone inválido' });
  }

  if (!env.N8N_WEBHOOK_URL || !env.N8N_WEBHOOK_TOKEN) return json(503, { ok: false, motivo: 'recebimento não configurado' });

  try {
    const res = await fetch(env.N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-mirpo-token': env.N8N_WEBHOOK_TOKEN },
      body: JSON.stringify(lead),
      signal: AbortSignal.timeout(10_000),
    });
    if (res.ok) return json(200, { ok: true });
    if (res.status === 422) return json(422, { ok: false, motivo: 'nome ou telefone inválido' });
    console.error('n8n respondeu', res.status);
  } catch (err) {
    console.error('falha ao chamar o n8n', err instanceof Error ? err.message : err);
  }
  return json(502, { ok: false, motivo: 'não foi possível registrar agora' });
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url);
    if (pathname === '/api/orcamento') return handleQuote(request, env);
    if (pathname.startsWith('/video/')) return serveVideo(request, env);
    return json(404, { ok: false, motivo: 'não encontrado' });
  },
};
