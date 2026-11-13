/**
 * Formulário de orçamento: valida, envia o pedido ao endpoint (src/data/site.ts →
 * Worker /api/orcamento → n8n → Pulseboard) e mostra a confirmação no lugar dos campos.
 * Se o envio falhar, o erro traz um link de WhatsApp com o pedido já escrito,
 * para o contato não se perder.
 */
import { track } from './util.ts';

const STORE_KEY = 'mirpo:contato';
const REMEMBER = ['nome', 'telefone', 'email', 'cidade'] as const;
const TIMEOUT_MS = 15_000;

const digits = (s: string): string => s.replace(/\D/g, '');

const maskPhone = (v: string): string => {
  let d = digits(v);
  if (d.startsWith('55') && d.length > 11) d = d.slice(2);
  d = d.slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : '';
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
};

/** Texto do pedido para o WhatsApp (usado só quando o envio pelo site falha). */
const buildMessage = (data: FormData): string => {
  const get = (k: string): string => String(data.get(k) ?? '').trim();
  const pecas = data.getAll('pecas').map(String);
  const fields = [
    `*Nome:* ${get('nome')}`,
    `*Telefone:* ${get('telefone')}`,
    get('email') && `*E-mail:* ${get('email')}`,
    get('cidade') && `*Cidade:* ${get('cidade')}`,
    get('linha') && `*Linha:* ${get('linha')}`,
    get('veiculo') && `*Veículo:* ${get('veiculo')}`,
    get('ano') && `*Ano:* ${get('ano')}`,
    get('motor') && `*Motor:* ${get('motor')}`,
    pecas.length ? `*Peças:* ${pecas.join(', ')}` : '',
    get('mensagem') && `*Mensagem:* ${get('mensagem')}`,
  ].filter(Boolean);
  return ['Olá, Mirpo! Quero um orçamento.', '', ...fields, '', `Enviado pelo site: ${location.href.split('#')[0]}`].join('\n');
};

const showError = (form: HTMLFormElement, msg: string, whatsappUrl?: string): void => {
  const box = form.querySelector<HTMLElement>('[data-form-error]');
  if (!box) return;
  box.replaceChildren(msg);
  if (msg && whatsappUrl) {
    const a = document.createElement('a');
    a.href = whatsappUrl;
    a.target = '_blank';
    a.rel = 'noopener';
    a.textContent = 'envie pelo WhatsApp';
    a.dataset.track = 'whatsapp-form-fallback';
    box.append(' Se preferir, ', a, ' com o pedido já escrito.');
  }
  box.hidden = !msg;
};

const validate = (form: HTMLFormElement): HTMLElement | null => {
  const nome = form.elements.namedItem('nome') as HTMLInputElement;
  const tel = form.elements.namedItem('telefone') as HTMLInputElement;
  const email = form.elements.namedItem('email') as HTMLInputElement;
  const consent = form.elements.namedItem('consentimento') as HTMLInputElement;
  const problems: [HTMLElement, string][] = [];
  if (nome.value.trim().length < 2) problems.push([nome, 'Informe seu nome.']);
  if (digits(tel.value).length < 10) problems.push([tel, 'Informe um telefone com DDD.']);
  if (email.value && !email.checkValidity()) problems.push([email, 'Confira o e-mail digitado.']);
  if (!consent.checked) problems.push([consent, 'Marque a autorização de contato para enviar.']);
  [nome, tel, email].forEach((el) => el.removeAttribute('aria-invalid'));
  problems.forEach(([el]) => el.setAttribute('aria-invalid', 'true'));
  showError(form, problems.map(([, m]) => m).join(' '));
  return problems[0]?.[0] ?? null;
};

const loadSaved = (): Partial<Record<(typeof REMEMBER)[number], string>> => {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY) ?? '{}');
  } catch {
    return {};
  }
};

const restore = (form: HTMLFormElement): void => {
  const saved = loadSaved();
  for (const k of REMEMBER) {
    const el = form.elements.namedItem(k) as HTMLInputElement | null;
    if (el && saved[k] && !el.value) el.value = saved[k]!;
  }
};

const remember = (data: FormData): void => {
  try {
    const toSave: Record<string, string> = {};
    for (const k of REMEMBER) toSave[k] = String(data.get(k) ?? '');
    localStorage.setItem(STORE_KEY, JSON.stringify(toSave));
  } catch {
    /* sem storage */
  }
};

/** Envia o pedido; devolve o status HTTP, ou 0 se a rede falhou ou demorou demais. */
const send = async (endpoint: string, body: unknown): Promise<number> => {
  const ctrl = new AbortController();
  const timer = window.setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: ctrl.signal,
    });
    return res.status;
  } catch {
    return 0;
  } finally {
    window.clearTimeout(timer);
  }
};

const setBusy = (form: HTMLFormElement, busy: boolean): void => {
  form.classList.toggle('is-busy', busy);
  const btn = form.querySelector<HTMLButtonElement>('[data-submit]');
  if (!btn) return;
  btn.classList.toggle('is-busy', busy);
  btn.setAttribute('aria-disabled', String(busy));
  const label = btn.querySelector('[data-submit-label]');
  if (label) label.textContent = busy ? 'Enviando…' : 'Enviar pedido';
};

const showDone = (form: HTMLFormElement): void => {
  const panel = form.querySelector<HTMLElement>('[data-form-done]');
  if (!panel) return;
  showError(form, '');
  form.classList.add('is-sent');
  panel.hidden = false;
  panel.querySelector<HTMLElement>('[data-form-done-title]')?.focus({ preventScroll: true });
  // Os campos somem e o formulário encolhe: traz a confirmação para a tela.
  const top = form.getBoundingClientRect().top;
  if (top < 0 || top > window.innerHeight * 0.6) {
    const smooth = !matchMedia('(prefers-reduced-motion: reduce)').matches;
    form.scrollIntoView({ block: 'center', behavior: smooth ? 'smooth' : 'auto' });
  }
};

export const initForms = (): void => {
  const forms = document.querySelectorAll<HTMLFormElement>('[data-quote-form]');
  if (!forms.length) return;
  const cfg = window.MIRPO;

  forms.forEach((form) => {
    restore(form);

    const tel = form.elements.namedItem('telefone') as HTMLInputElement;
    tel.addEventListener('input', () => {
      const pos = tel.value.length - (tel.selectionStart ?? tel.value.length);
      tel.value = maskPhone(tel.value);
      const p = Math.max(0, tel.value.length - pos);
      tel.setSelectionRange(p, p);
    });

    form.addEventListener('input', () => {
      if (!form.querySelector('[data-form-error]')?.hasAttribute('hidden')) validate(form);
    });

    let started = false;
    form.addEventListener('focusin', () => {
      if (started) return;
      started = true;
      track('form_start', { form: form.closest('section')?.id ?? 'orcamento' });
    });

    form.querySelector('[data-form-again]')?.addEventListener('click', () => {
      form.reset();
      restore(form);
      form.classList.remove('is-sent');
      form.querySelector<HTMLElement>('[data-form-done]')!.hidden = true;
      (form.elements.namedItem('veiculo') as HTMLInputElement | null)?.focus();
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (form.classList.contains('is-busy')) return;
      const data = new FormData(form);

      // Campo-isca preenchido = robô: finge sucesso e não envia nada
      if (String(data.get('empresa_site') ?? '')) {
        showDone(form);
        return;
      }
      const invalid = validate(form);
      if (invalid) {
        invalid.focus();
        return;
      }
      remember(data);

      setBusy(form, true);
      const status = cfg?.endpoint
        ? await send(cfg.endpoint, { ...Object.fromEntries(data), pecas: data.getAll('pecas'), canal: 'site', pagina: location.href })
        : 0;
      setBusy(form, false);

      if (status === 200) {
        track('generate_lead', { method: 'form' });
        showDone(form);
        return;
      }

      track('form_error', { status: String(status) });
      const whatsappUrl = `https://wa.me/${cfg?.wa ?? '5511996661687'}?text=${encodeURIComponent(buildMessage(data))}`;
      if (status === 422) showError(form, 'Confira o nome e o telefone com DDD.');
      else if (status === 429) showError(form, 'Muitos envios seguidos. Aguarde um minuto e tente de novo.', whatsappUrl);
      else showError(form, 'Não foi possível enviar agora. Tente de novo em instantes.', whatsappUrl);
    });
  });
};
