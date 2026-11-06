/**
 * Formulário de orçamento: valida, registra o pedido no endpoint (src/data/site.ts →
 * Worker /api/orcamento → n8n) e abre o WhatsApp ou o e-mail com a mensagem pronta.
 */
import { toast, track } from './util.ts';

const STORE_KEY = 'mirpo:contato';
const REMEMBER = ['nome', 'telefone', 'email', 'cidade'] as const;

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

const showError = (form: HTMLFormElement, msg: string): void => {
  const box = form.querySelector<HTMLElement>('[data-form-error]');
  if (!box) return;
  box.textContent = msg;
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

export const initForms = (): void => {
  const forms = document.querySelectorAll<HTMLFormElement>('[data-quote-form]');
  if (!forms.length) return;
  const cfg = window.MIRPO;

  let saved: Partial<Record<(typeof REMEMBER)[number], string>> = {};
  try {
    saved = JSON.parse(localStorage.getItem(STORE_KEY) ?? '{}');
  } catch {
    /* sem storage */
  }

  forms.forEach((form) => {
    for (const k of REMEMBER) {
      const el = form.elements.namedItem(k) as HTMLInputElement | null;
      if (el && saved[k] && !el.value) el.value = saved[k]!;
    }

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

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitter = (e as SubmitEvent).submitter as HTMLButtonElement | null;
      const channel = submitter?.value === 'email' ? 'email' : 'whatsapp';
      const data = new FormData(form);

      if (String(data.get('empresa_site') ?? '')) {
        toast('Pedido enviado.');
        return;
      }
      const invalid = validate(form);
      if (invalid) {
        invalid.focus();
        return;
      }

      try {
        const toSave: Record<string, string> = {};
        for (const k of REMEMBER) toSave[k] = String(data.get(k) ?? '');
        localStorage.setItem(STORE_KEY, JSON.stringify(toSave));
      } catch {
        /* sem storage */
      }

      const message = buildMessage(data);
      track('generate_lead', { method: channel });

      // Registra o pedido (Worker → n8n → Pulseboard) sem esperar a resposta:
      // keepalive garante o envio mesmo abrindo o WhatsApp/e-mail em seguida, e abrir a
      // janela ainda dentro do clique evita o bloqueador de pop-up.
      if (cfg?.endpoint) {
        fetch(cfg.endpoint, {
          method: 'POST',
          keepalive: true,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...Object.fromEntries(data), pecas: data.getAll('pecas'), canal: channel, pagina: location.href }),
        }).catch(() => {
          /* o pedido segue pelo WhatsApp/e-mail de qualquer forma */
        });
      }

      if (channel === 'email') {
        const subject = `Orçamento pelo site: ${String(data.get('nome') ?? '')}`;
        location.href = `mailto:${cfg?.email ?? 'vendas@mirpo.com.br'}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message.replace(/\*/g, ''))}`;
        toast('Abrimos seu e-mail com a mensagem pronta.');
      } else {
        const url = `https://wa.me/${cfg?.wa ?? '5511996661687'}?text=${encodeURIComponent(message)}`;
        const win = window.open(url, '_blank');
        if (win) win.opener = null;
        else location.href = url;
        toast('Abrimos o WhatsApp com a mensagem pronta.');
      }
    });
  });
};
