import { track } from './util.ts';

/** Carrega o GTM só após a primeira interação (ou 5 s ocioso): não pesa no LCP/INP. */
export const initAnalytics = (): void => {
  const id = window.MIRPO?.gtm;
  if (id) {
    let loaded = false;
    const load = (): void => {
      if (loaded) return;
      loaded = true;
      events.forEach((ev) => removeEventListener(ev, load));
      (window.dataLayer ??= []).push({ 'gtm.start': Date.now(), event: 'gtm.js' });
      const s = document.createElement('script');
      s.async = true;
      s.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(id)}`;
      document.head.append(s);
    };
    const events = ['pointerdown', 'keydown', 'scroll', 'touchstart'] as const;
    events.forEach((ev) => addEventListener(ev, load, { once: true, passive: true }));
    const idle = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
    window.setTimeout(() => (idle ? idle(load, { timeout: 2000 }) : load()), 5000);
  }

  document.addEventListener('click', (e) => {
    const el = (e.target as Element).closest<HTMLElement>('[data-track]');
    if (!el) return;
    const label = el.dataset.track ?? '';
    const channel = label.split('-')[0];
    track('contact_click', { channel, placement: label });
  });
};

/** Pré-carrega páginas internas no hover quando não há Speculation Rules. */
export const initPrefetch = (): void => {
  const supports = (HTMLScriptElement as unknown as { supports?: (t: string) => boolean }).supports?.('speculationrules');
  if (supports) return;
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  if (conn?.saveData || /2g/.test(conn?.effectiveType ?? '')) return;
  const done = new Set<string>([location.pathname]);
  const prefetch = (e: Event): void => {
    const a = (e.target as Element).closest?.<HTMLAnchorElement>('a[href]');
    if (!a || a.origin !== location.origin || a.hash || a.hasAttribute('download')) return;
    if (done.has(a.pathname)) return;
    done.add(a.pathname);
    const l = document.createElement('link');
    l.rel = 'prefetch';
    l.href = a.pathname;
    document.head.append(l);
  };
  document.addEventListener('pointerover', prefetch, { passive: true });
  document.addEventListener('touchstart', prefetch, { passive: true });
  document.addEventListener('focusin', prefetch);
};
