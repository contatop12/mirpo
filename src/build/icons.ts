/** Ícones inline 24×24, traço 1.75, cor herdada (currentColor). */
import { raw, type Safe } from '../shared/html.ts';

const P: Record<string, string> = {
  phone: '<path d="M5 3h3.2l1.6 4.4-2.2 1.4a11 11 0 0 0 7.6 7.6l1.4-2.2L21 15.8V19a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2Z"/>',
  whatsapp:
    '<path d="M4.6 19.4 5.7 15.7A8.2 8.2 0 1 1 8.6 18.5Z"/><path d="M9.3 8.6c.2-.5.5-.5.8-.5h.5c.2 0 .4 0 .5.4l.7 1.6c.1.2 0 .4-.1.6l-.5.6c-.1.1-.2.3 0 .5a5.6 5.6 0 0 0 2.6 2.3c.2.1.4.1.5-.1l.6-.7c.2-.2.4-.2.6-.1l1.6.8c.2.1.3.2.3.4a2.1 2.1 0 0 1-1.6 1.9c-.9.2-2.1 0-3.7-.8a8.6 8.6 0 0 1-3.4-3.3c-.7-1.2-.8-2.2-.4-3.6Z" fill="currentColor" stroke="none"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 6.5 8.5 6.5 8.5-6.5"/>',
  pin: '<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.2 2"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  send: '<path d="M20.5 3.5 10.5 13.5"/><path d="M20.5 3.5 14 20.5l-3.5-7-7-3.5 17-6.5Z"/>',
  shield: '<path d="M12 3 4.5 6v5.6c0 4.6 3.2 8.2 7.5 9.4 4.3-1.2 7.5-4.8 7.5-9.4V6Z"/><path d="m8.8 12 2.3 2.3 4.2-4.6"/>',
  box: '<path d="M3.5 7.5 12 3l8.5 4.5v9L12 21l-8.5-4.5Z"/><path d="M3.5 7.5 12 12l8.5-4.5M12 12v9"/>',
  tag: '<path d="M3 12.2V4a1 1 0 0 1 1-1h8.2L21 11.8 11.8 21Z"/><circle cx="7.5" cy="7.5" r="1.5"/>',
  heart: '<path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10Z"/>',
  grid: '<rect x="3.5" y="3.5" width="7" height="7" rx="1"/><rect x="13.5" y="3.5" width="7" height="7" rx="1"/><rect x="3.5" y="13.5" width="7" height="7" rx="1"/><rect x="13.5" y="13.5" width="7" height="7" rx="1"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.2a6.5 6.5 0 0 1 3.5 5.8"/>',
  factory: '<path d="M3 21V10l5 3V10l5 3V10l5 3V4h3v17Z"/><path d="M7 17h2M12 17h2M17 17h2"/>',
  handshake:
    '<path d="m2.5 11 4-4.5 3.5 1.2L13 6l5 1 3.5 4"/><path d="m21.5 11-4 4.4-1.5 1.3a1.5 1.5 0 0 1-2-.1l-.4-.4-.6.5a1.5 1.5 0 0 1-2-.1l-.4-.4-.4.3a1.5 1.5 0 0 1-2-.1L2.5 11"/><path d="m13 6-3.3 3.3a1.5 1.5 0 0 0 2.1 2.1L14 9.5"/>',
  store: '<path d="M4 10v10h16V10"/><path d="M3 6.5 4.5 4h15L21 6.5V8a2.5 2.5 0 0 1-4.5 1.5A2.5 2.5 0 0 1 12 9.5a2.5 2.5 0 0 1-4.5 0A2.5 2.5 0 0 1 3 8Z"/><path d="M10 20v-5h4v5"/>',
  receipt: '<path d="M6 3h12v18l-2-1.4-2 1.4-2-1.4-2 1.4-2-1.4L6 21Z"/><path d="M9 8h6M9 12h6M9 16h3"/>',
  barcode: '<path d="M4 5v14M7 5v14M10.5 5v14M13 5v14M16.5 5v14M20 5v14"/>',
  car: '<path d="M4 15.5V12l1.8-4.4A2 2 0 0 1 7.7 6.3h8.6a2 2 0 0 1 1.9 1.3L20 12v3.5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Z"/><path d="M4 12h16"/><circle cx="7.5" cy="16.5" r="1.8"/><circle cx="16.5" cy="16.5" r="1.8"/>',
  truck: '<path d="M2.5 6h11v10h-11zM13.5 9.5h4.2l3.3 3.3V16h-7.5"/><circle cx="6.5" cy="17" r="1.8"/><circle cx="17.5" cy="17" r="1.8"/>',
  classic: '<path d="M3 16v-2.2c0-.7.4-1.3 1-1.6l2.3-1.1L8.4 7.4A3 3 0 0 1 10.9 6h2.3a3 3 0 0 1 2.4 1.2l2.7 3.6 2 .7c.7.2 1.2.9 1.2 1.6V16"/><path d="M3 16h18"/><circle cx="7" cy="16.5" r="2"/><circle cx="17" cy="16.5" r="2"/>',
  wheel: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2.2"/><path d="M12 3v6.8M4.3 15.3l5.7-2.2M19.7 15.3l-5.7-2.2"/>',
  wrench: '<path d="M14.5 6.5a4 4 0 0 0 5 5L21 13a6 6 0 0 1-7.6 1.4L7 20.8a2 2 0 0 1-2.8-2.8l6.4-6.4A6 6 0 0 1 12 4l1.5 1.5Z"/>',
  play: '<path d="M8 5.5v13l10.5-6.5Z" fill="currentColor"/>',
  pause: '<path d="M8.5 5.5v13M15.5 5.5v13" stroke-width="3"/>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>',
  external: '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
  chevron: '<path d="m6 9 6 6 6-6"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  map: '<path d="M9 4 3.5 6v14L9 18l6 2 5.5-2V4L15 6Z"/><path d="M9 4v14M15 6v14"/>',
  alert: '<path d="M12 3.5 2.5 20h19Z"/><path d="M12 10v4.5M12 17.3v.2"/>',
  facebook: '<path d="M14.5 8H17V4.5h-2.5A4.5 4.5 0 0 0 10 9v2.5H7.5V15H10v6h3.5v-6H16l.7-3.5h-3.2V9a1 1 0 0 1 1-1Z"/>',
  instagram: '<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".6" fill="currentColor"/>',
  linkedin: '<rect x="3.5" y="3.5" width="17" height="17" rx="2.5"/><path d="M8 10.5V17M8 7.4v.2M11.8 17v-6.5M11.8 13.2c0-1.6 1-2.7 2.4-2.7s2.2 1 2.2 2.7V17"/>',
};

export type IconName = keyof typeof P;

export const icon = (name: string, cls = 'icon'): Safe => {
  const body = P[name];
  if (!body) throw new Error(`Ícone desconhecido: ${name}`);
  return raw(
    `<svg class="${cls}" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${body}</svg>`,
  );
};
