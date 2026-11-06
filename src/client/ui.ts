import { onFrame, toast, track } from './util.ts';

/* ------------------------------------------------ header: sombra e auto-hide */

export const initHeader = (): void => {
  const header = document.querySelector<HTMLElement>('[data-header]');
  const fab = document.querySelector<HTMLElement>('[data-fab]');
  if (!header) return;
  let lastY = window.scrollY;
  onFrame((y) => {
    const dy = y - lastY;
    header.classList.toggle('is-scrolled', y > 8);
    const busy = document.querySelector('[data-mega-root].is-open, .drawer.is-open');
    if (y < 320 || dy < -6 || busy) header.classList.remove('is-hidden');
    else if (dy > 6) header.classList.add('is-hidden');
    fab?.classList.toggle('is-visible', y > 640);
    lastY = y;
  });
};

/* ---------------------------------------------------------------- mega menu */

export const initMega = (): void => {
  const root = document.querySelector<HTMLElement>('[data-mega-root]');
  const btn = root?.querySelector<HTMLButtonElement>('[data-mega-toggle]');
  if (!root || !btn) return;
  let openT = 0;
  let closeT = 0;

  const set = (open: boolean): void => {
    root.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', String(open));
  };

  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  root.addEventListener('pointerenter', (e) => {
    if (e.pointerType !== 'mouse' || !fine.matches) return;
    clearTimeout(closeT);
    openT = window.setTimeout(() => set(true), 110);
  });
  root.addEventListener('pointerleave', (e) => {
    if (e.pointerType !== 'mouse') return;
    clearTimeout(openT);
    closeT = window.setTimeout(() => set(false), 220);
  });
  btn.addEventListener('click', () => set(!root.classList.contains('is-open')));
  root.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && root.classList.contains('is-open')) {
      set(false);
      btn.focus();
    }
  });
  root.addEventListener('focusout', (e) => {
    if (!root.contains(e.relatedTarget as Node)) set(false);
  });
  document.addEventListener('pointerdown', (e) => {
    if (!root.contains(e.target as Node)) set(false);
  });
};

/* ------------------------------------------------------------- drawer mobile */

export const initDrawer = (): void => {
  const drawer = document.querySelector<HTMLElement>('[data-drawer]');
  const toggle = document.querySelector<HTMLButtonElement>('[data-drawer-toggle]');
  if (!drawer || !toggle) return;
  const panel = drawer.querySelector<HTMLElement>('.drawer__panel')!;
  const closeBtn = drawer.querySelector<HTMLButtonElement>('[data-drawer-close]');

  const focusables = (): HTMLElement[] =>
    Array.from(panel.querySelectorAll<HTMLElement>('a[href], button, summary')).filter((el) => el.offsetParent !== null);

  const onKey = (e: KeyboardEvent): void => {
    if (e.key === 'Escape') close();
    if (e.key !== 'Tab') return;
    const f = focusables();
    const first = f[0];
    const last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last?.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first?.focus();
    }
  };

  const open = (): void => {
    drawer.hidden = false;
    void drawer.offsetWidth;
    drawer.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    document.documentElement.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);
    closeBtn?.focus();
  };

  function close(): void {
    drawer!.classList.remove('is-open');
    toggle!.setAttribute('aria-expanded', 'false');
    document.documentElement.style.overflow = '';
    document.removeEventListener('keydown', onKey);
    const done = (): void => {
      if (!drawer!.classList.contains('is-open')) drawer!.hidden = true;
    };
    panel.addEventListener('transitionend', done, { once: true });
    window.setTimeout(done, 450);
    toggle!.focus();
  }

  toggle.addEventListener('click', open);
  closeBtn?.addEventListener('click', close);
  drawer.addEventListener('click', (e) => {
    if (e.target === drawer) close();
  });
  panel.addEventListener('click', (e) => {
    if ((e.target as Element).closest('a[href]')) close();
  });
};

/* --------------------------------------------------- revelação ao rolar */

export const initReveal = (): void => {
  document.querySelectorAll('.stamp').forEach((el) => el.classList.add('reveal'));
  const items = Array.from(document.querySelectorAll<HTMLElement>('.reveal'));
  if (!items.length) return;
  // atraso escalonado entre irmãos
  const byParent = new Map<Element, HTMLElement[]>();
  for (const el of items) {
    const p = el.parentElement!;
    const list = byParent.get(p) ?? [];
    list.push(el);
    byParent.set(p, list);
  }
  byParent.forEach((list) => list.forEach((el, i) => el.style.setProperty('--i', String(Math.min(i, 8)))));

  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-in'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const en of entries) {
        if (!en.isIntersecting) continue;
        en.target.classList.add('is-in');
        io.unobserve(en.target);
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
  );
  items.forEach((el) => io.observe(el));
};

/* ------------------------------------------------- aberto / fechado agora */

const DAY_NAMES = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];

const spNow = (): { day: number; minutes: number } => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Sao_Paulo',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date());
  const get = (t: string): string => parts.find((p) => p.type === t)?.value ?? '0';
  const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
  return { day, minutes: Number(get('hour')) * 60 + Number(get('minute')) };
};

const toMin = (hhmm: string): number => {
  const [h, m] = hhmm.split(':').map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
};

const hourLabel = (hhmm: string): string => {
  const [h, m] = hhmm.split(':');
  return m === '00' ? `${Number(h)}h` : `${Number(h)}h${m}`;
};

export const statusText = (): { open: boolean; text: string } => {
  const h = window.MIRPO?.hours;
  if (!h) return { open: false, text: '' };
  const { day, minutes } = spNow();
  const opens = toMin(h.opens);
  const closes = toMin(h.closes);
  const isDay = h.days.includes(day);
  if (isDay && minutes >= opens && minutes < closes) {
    const left = closes - minutes;
    return { open: true, text: left <= 60 ? `Aberto agora, fecha em ${left} min` : `Aberto agora, até as ${hourLabel(h.closes)}` };
  }
  // próxima abertura
  for (let i = 0; i < 8; i++) {
    const d = (day + i) % 7;
    if (!h.days.includes(d)) continue;
    if (i === 0 && minutes >= opens) continue;
    const when = i === 0 ? 'hoje' : i === 1 ? 'amanhã' : DAY_NAMES[d];
    return { open: false, text: `Fechado agora. Abre ${when} às ${hourLabel(h.opens)}` };
  }
  return { open: false, text: h.label };
};

export const initStatus = (): void => {
  const els = document.querySelectorAll<HTMLElement>('[data-status-text]');
  if (!els.length) return;
  const update = (): void => {
    const s = statusText();
    if (!s.text) return;
    els.forEach((el) => {
      el.textContent = s.text;
      el.toggleAttribute('data-open', s.open);
      el.closest('[data-status]')?.toggleAttribute('data-open', s.open);
    });
  };
  update();
  window.setInterval(update, 60_000);
};

/* ---------------------------------------------------------------- copiar */

export const initCopy = (): void => {
  document.addEventListener('click', async (e) => {
    const btn = (e.target as Element).closest<HTMLElement>('[data-copy]');
    if (!btn) return;
    try {
      await navigator.clipboard.writeText(btn.dataset.copy ?? '');
      toast(btn.dataset.copyDone ?? 'Copiado');
      track('copy', { value: 'endereco' });
    } catch {
      toast('Não foi possível copiar. Selecione o texto manualmente.');
    }
  });
};
