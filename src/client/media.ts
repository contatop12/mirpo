import { reducedMotion, track } from './util.ts';

/* ------------------------------------------------ vídeo de fundo da hero */

type Connection = { saveData?: boolean; effectiveType?: string };

/**
 * O poster (1º quadro) já está na tela desde o HTML. O vídeo só começa a baixar depois do
 * `load` + ocioso, para não disputar banda com o conteúdo principal. Fica parado com
 * movimento reduzido, economia de dados ou rede 2G; pausa fora da tela e tem botão de pausa.
 */
export const initHeroVideo = (): void => {
  const video = document.querySelector<HTMLVideoElement>('.hero__video');
  const hero = video?.closest<HTMLElement>('.hero');
  if (!video || !hero) return;
  const conn = (navigator as Navigator & { connection?: Connection }).connection;
  if (reducedMotion() || conn?.saveData || /2g$/.test(conn?.effectiveType ?? '')) return;

  const toggle = hero.querySelector<HTMLButtonElement>('.hero__toggle');
  let userPaused = false;
  let visible = true;
  let started = false;

  const play = (): void => {
    if (started && !userPaused && visible) video.play().catch(() => undefined);
  };

  const start = (): void => {
    const portrait = matchMedia('(orientation: portrait)').matches;
    const src = portrait ? video.dataset.mobile : video.dataset.desktop;
    if (!src) return;
    video.src = src;
    started = true;
    video.addEventListener(
      'playing',
      () => {
        if (toggle) toggle.hidden = false;
      },
      { once: true },
    );
    play();
  };

  toggle?.addEventListener('click', () => {
    userPaused = !userPaused;
    // nome fixo ("Pausar o vídeo de fundo") + aria-pressed indica o estado
    toggle.setAttribute('aria-pressed', String(userPaused));
    if (userPaused) video.pause();
    else play();
  });

  new IntersectionObserver(([entry]) => {
    visible = !!entry?.isIntersecting;
    if (visible) play();
    else video.pause();
  }).observe(hero);

  const whenIdle = (fn: () => void): void => {
    if ('requestIdleCallback' in window) requestIdleCallback(fn, { timeout: 3000 });
    else setTimeout(fn, 1500);
  };
  if (document.readyState === 'complete') whenIdle(start);
  else addEventListener('load', () => whenIdle(start), { once: true });
};

const preconnected = new Set<string>();
const preconnect = (href: string): void => {
  if (preconnected.has(href)) return;
  preconnected.add(href);
  const l = document.createElement('link');
  l.rel = 'preconnect';
  l.href = href;
  l.crossOrigin = '';
  document.head.append(l);
};

/* ---------------------------------------------- YouTube sob demanda (facade) */

export const initVideos = (): void => {
  const frames = document.querySelectorAll<HTMLElement>('[data-yt]');
  frames.forEach((frame) => {
    const warm = (): void => {
      preconnect('https://www.youtube-nocookie.com');
      preconnect('https://i.ytimg.com');
      preconnect('https://www.google.com');
    };
    frame.addEventListener('pointerenter', warm, { once: true });
    frame.addEventListener('focusin', warm, { once: true });
    frame.querySelector('button')?.addEventListener('click', () => {
      const id = frame.dataset.yt!;
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
      iframe.title = frame.dataset.ytTitle ?? 'Vídeo';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      iframe.allowFullscreen = true;
      iframe.referrerPolicy = 'strict-origin-when-cross-origin';
      frame.replaceChildren(iframe);
      iframe.focus();
      track('video_play', { video_id: id });
    });
  });
};

/* ------------------------------------------------------ mapa sob demanda */

export const initMap = (): void => {
  const map = document.querySelector<HTMLElement>('[data-map]');
  const btn = map?.querySelector<HTMLButtonElement>('[data-map-load]');
  if (!map || !btn) return;
  btn.addEventListener('pointerenter', () => preconnect('https://www.google.com'), { once: true });
  btn.addEventListener('click', () => {
    const iframe = document.createElement('iframe');
    iframe.src = map.dataset.map!;
    iframe.title = 'Mapa: Mirpo, Alameda Barão de Limeira, 365, Campos Elíseos, São Paulo';
    iframe.loading = 'lazy';
    iframe.referrerPolicy = 'no-referrer-when-downgrade';
    iframe.allowFullscreen = true;
    map.querySelector('.map__poster')?.remove();
    map.append(iframe);
    track('map_open');
  });
};

/* ----------------------------------------------------- galeria (lightbox) */

export const initGallery = (): void => {
  const galleries = document.querySelectorAll<HTMLElement>('[data-gallery]');
  if (!galleries.length || typeof HTMLDialogElement === 'undefined') return;

  const dialog = document.createElement('dialog');
  dialog.className = 'lightbox';
  dialog.setAttribute('aria-label', 'Foto ampliada');
  dialog.innerHTML =
    '<button class="lightbox__close" type="button" aria-label="Fechar foto"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button><img alt=""><p></p>';
  document.body.append(dialog);
  const img = dialog.querySelector('img')!;
  const cap = dialog.querySelector('p')!;
  let list: HTMLButtonElement[] = [];
  let index = 0;

  const show = (i: number): void => {
    index = (i + list.length) % list.length;
    const b = list[index]!;
    img.src = b.dataset.full ?? '';
    img.alt = b.dataset.alt ?? '';
    cap.textContent = b.dataset.alt ?? '';
  };

  galleries.forEach((g) => {
    const buttons = Array.from(g.querySelectorAll<HTMLButtonElement>('.gallery__btn'));
    buttons.forEach((b, i) =>
      b.addEventListener('click', () => {
        list = buttons;
        show(i);
        dialog.showModal();
      }),
    );
  });

  dialog.querySelector('.lightbox__close')!.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close();
  });
  dialog.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') show(index + 1);
    if (e.key === 'ArrowLeft') show(index - 1);
  });
};
