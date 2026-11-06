/**
 * Template literal com escape automático.
 * Tudo que não for `Safe` é escapado; arrays são concatenados.
 */

export class Safe {
  readonly value: string;
  constructor(value: string) {
    this.value = value;
  }
  toString(): string {
    return this.value;
  }
}

type Value = Safe | string | number | boolean | null | undefined | Value[];

const ESC: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export const esc = (s: string): string => s.replace(/[&<>"']/g, (c) => ESC[c] ?? c);

const render = (v: Value): string => {
  if (v === null || v === undefined || v === false || v === true) return '';
  if (v instanceof Safe) return v.value;
  if (Array.isArray(v)) return v.map(render).join('');
  return esc(String(v));
};

export const html = (strings: TemplateStringsArray, ...values: Value[]): Safe => {
  let out = strings[0] ?? '';
  for (let i = 0; i < values.length; i++) out += render(values[i] as Value) + (strings[i + 1] ?? '');
  return new Safe(out);
};

export const raw = (s: string): Safe => new Safe(s);

/** Atributos opcionais: attrs({ id: 'x', hidden: true, title: undefined }) */
export const attrs = (o: Record<string, string | number | boolean | null | undefined>): Safe =>
  raw(
    Object.entries(o)
      .filter(([, v]) => v !== undefined && v !== null && v !== false)
      .map(([k, v]) => (v === true ? ` ${k}` : ` ${k}="${esc(String(v))}"`))
      .join(''),
  );

/** JSON seguro para <script type="application/ld+json">. */
export const jsonScript = (data: unknown): Safe =>
  raw(JSON.stringify(data).replace(/</g, '\\u003c').replace(/-->/g, '--\\u003e'));
