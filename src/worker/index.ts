/**
 * Worker do site Mirpo. Os arquivos estáticos (dist/) são servidos direto pela Cloudflare;
 * este código só roda em /api/* (ver `run_worker_first` no wrangler.jsonc).
 *
 * POST /api/orcamento → valida o pedido do formulário e repassa ao n8n
 * (fluxo "P12 Mirpo — Formulário de Orçamento (Site)", que envia ao Pulseboard).
 * O endereço e o token do n8n ficam só no servidor: N8N_WEBHOOK_URL (vars) e N8N_WEBHOOK_TOKEN (secret).
 */

interface RateLimit {
  limit(options: { key: string }): Promise<{ success: boolean }>;
}

interface Env {
  N8N_WEBHOOK_URL?: string;
  N8N_WEBHOOK_TOKEN?: string;
  LEADS_RATE?: RateLimit;
}

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
    return json(404, { ok: false, motivo: 'não encontrado' });
  },
};
