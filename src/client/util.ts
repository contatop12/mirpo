/** Laço único de requestAnimationFrame acionado por scroll/resize. */

/** Recebe o scrollY lido uma única vez no início do quadro (evita reflow forçado). */
type Task = (scrollY: number) => boolean | void;

const tasks = new Set<Task>();
let running = false;

const loop = (): void => {
  let again = false;
  const y = window.scrollY;
  for (const t of tasks) if (t(y)) again = true;
  if (again) requestAnimationFrame(loop);
  else running = false;
};

export const kick = (): void => {
  if (running) return;
  running = true;
  requestAnimationFrame(loop);
};

/** Registra uma tarefa; retorne true para pedir o próximo quadro. */
export const onFrame = (fn: Task): void => {
  tasks.add(fn);
  kick();
};

addEventListener('scroll', kick, { passive: true });
addEventListener('resize', kick, { passive: true });

export const reducedMotion = (): boolean => matchMedia('(prefers-reduced-motion: reduce)').matches;

let toastTimer = 0;
export const toast = (msg: string): void => {
  const el = document.querySelector<HTMLElement>('[data-toast]');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('is-on');
  clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => el.classList.remove('is-on'), 2600);
};

declare global {
  interface Window {
    dataLayer?: unknown[];
    MIRPO?: {
      gtm: string;
      endpoint: string;
      wa: string;
      email: string;
      hours: { days: number[]; opens: string; closes: string; label: string };
    };
  }
}

export const track = (event: string, data: Record<string, unknown> = {}): void => {
  (window.dataLayer ??= []).push({ event, ...data });
};
