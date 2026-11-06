/**
 * Pipeline de imagens: gera AVIF + WebP em várias larguras (com cache em .cache/img)
 * e oferece helpers <picture> e preload para os templates.
 */
import sharp, { type OverlayOptions } from 'sharp';
import { createHash } from 'node:crypto';
import { mkdir, readdir, readFile, stat, writeFile, copyFile, access } from 'node:fs/promises';
import { join, relative, dirname, extname } from 'node:path';
import { html, attrs, type Safe } from '../shared/html.ts';

export interface Variant {
  w: number;
  file: string;
}

export interface ImageInfo {
  src: string;
  width: number;
  height: number;
  color: string;
  alpha: boolean;
  avif: Variant[];
  webp: Variant[];
}

const ROOT = process.cwd();
const SRC_DIR = join(ROOT, 'assets-src', 'images');
const CACHE_DIR = join(ROOT, '.cache', 'img');
const PUBLIC_PREFIX = '/img/';
const PIPELINE_VERSION = 'v3';

/** Larguras por pasta. A largura original sempre entra como teto. */
const WIDTHS: Record<string, number[]> = {
  banners: [480, 800, 1200, 1600, 2400],
  pecas: [320, 480, 720, 1080],
  empresa: [360, 640, 1080],
  fornecedores: [360, 640, 1080],
  marcas: [160, 300],
  videos: [360, 640],
  site: [240, 480],
};

const QUALITY = {
  avif: { quality: 52, effort: 5 },
  webp: { quality: 74, effort: 5 },
};

const manifest = new Map<string, ImageInfo>();

const exists = async (p: string): Promise<boolean> => {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
};

const walk = async (dir: string): Promise<string[]> => {
  const out: string[] = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(p)));
    else if (/\.(jpe?g|png|webp|avif)$/i.test(entry.name)) out.push(p);
  }
  return out;
};

const toHex = (r: number, g: number, b: number): string =>
  '#' + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');

const processOne = async (abs: string): Promise<ImageInfo> => {
  const rel = relative(SRC_DIR, abs).replace(/\\/g, '/');
  const folder = rel.split('/')[0] ?? '';
  const buf = await readFile(abs);
  const hash = createHash('sha1').update(buf).update(PIPELINE_VERSION).update(JSON.stringify(WIDTHS[folder] ?? [])).digest('hex').slice(0, 8);
  const base = rel.replace(extname(rel), '');
  const metaFile = join(CACHE_DIR, `${base}.${hash}.json`);

  if (await exists(metaFile)) {
    return JSON.parse(await readFile(metaFile, 'utf8')) as ImageInfo;
  }

  const img = sharp(buf, { failOn: 'none' });
  const meta = await img.metadata();
  const width = meta.width ?? 0;
  const height = meta.height ?? 0;
  const stats = await img.stats();
  const alpha = Boolean(meta.hasAlpha) && !stats.isOpaque;
  const d = stats.dominant;

  const widths = [...new Set([...(WIDTHS[folder] ?? [640, 1280]).filter((w) => w < width), Math.min(width, Math.max(...(WIDTHS[folder] ?? [1280])))])].sort((a, b) => a - b);

  const info: ImageInfo = { src: rel, width, height, color: toHex(d.r, d.g, d.b), alpha, avif: [], webp: [] };
  await mkdir(dirname(join(CACHE_DIR, base)), { recursive: true });

  await Promise.all(
    widths.flatMap((w) =>
      (['avif', 'webp'] as const).map(async (fmt) => {
        const file = `${base}-${w}.${hash}.${fmt}`;
        const out = join(CACHE_DIR, file);
        let pipe = sharp(buf, { failOn: 'none' }).resize({ width: w, withoutEnlargement: true });
        pipe = fmt === 'avif' ? pipe.avif(QUALITY.avif) : pipe.webp({ ...QUALITY.webp, alphaQuality: 90 });
        await pipe.toFile(out);
        info[fmt].push({ w, file });
      }),
    ),
  );
  info.avif.sort((a, b) => a.w - b.w);
  info.webp.sort((a, b) => a.w - b.w);
  await writeFile(metaFile, JSON.stringify(info));
  return info;
};

export const buildImages = async (distDir: string, log = console.log): Promise<void> => {
  const files = await walk(SRC_DIR);
  const started = Date.now();
  const queue = [...files];
  const workers = Array.from({ length: 4 }, async () => {
    while (queue.length) {
      const f = queue.shift()!;
      const info = await processOne(f);
      manifest.set(info.src, info);
    }
  });
  await Promise.all(workers);

  // copia variantes para dist
  let bytes = 0;
  for (const info of manifest.values()) {
    for (const v of [...info.avif, ...info.webp]) {
      const to = join(distDir, 'img', v.file);
      await mkdir(dirname(to), { recursive: true });
      await copyFile(join(CACHE_DIR, v.file), to);
      bytes += (await stat(to)).size;
    }
  }
  log(`  imagens: ${manifest.size} fontes → ${(bytes / 1024 / 1024).toFixed(2)} MB em AVIF/WebP (${Date.now() - started} ms)`);
};

export const image = (src: string): ImageInfo => {
  const info = manifest.get(src);
  if (!info) throw new Error(`Imagem não encontrada no manifesto: ${src}`);
  return info;
};

export const url = (file: string): string => PUBLIC_PREFIX + file;

const srcset = (vs: Variant[]): string => vs.map((v) => `${url(v.file)} ${v.w}w`).join(', ');

export interface PictureOptions {
  alt: string;
  sizes?: string;
  class?: string;
  imgClass?: string;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  /** Largura máxima de variante usada no src de fallback. */
  fallbackWidth?: number;
  style?: string;
}

export const picture = (src: string, o: PictureOptions): Safe => {
  const info = image(src);
  const fb = info.webp.find((v) => v.w >= (o.fallbackWidth ?? 800)) ?? info.webp[info.webp.length - 1]!;
  const sizes = o.sizes ?? '100vw';
  const bg = info.alpha ? undefined : `background-color:${info.color}`;
  return html`<picture${attrs({ class: o.class })}><source type="image/avif" srcset="${srcset(info.avif)}" sizes="${sizes}"><source type="image/webp" srcset="${srcset(info.webp)}" sizes="${sizes}"><img${attrs({
    src: url(fb.file),
    alt: o.alt,
    width: info.width,
    height: info.height,
    loading: o.priority ? 'eager' : (o.loading ?? 'lazy'),
    decoding: o.priority ? 'sync' : 'async',
    fetchpriority: o.priority ? 'high' : undefined,
    class: o.imgClass,
    style: [bg, o.style].filter(Boolean).join(';') || undefined,
  })}></picture>`;
};

/** <link rel=preload> responsivo para a imagem LCP. */
export const preloadImage = (src: string, sizes: string): Safe => {
  const info = image(src);
  return html`<link rel="preload" as="image" type="image/avif" imagesrcset="${srcset(info.avif)}" imagesizes="${sizes}" fetchpriority="high">`;
};

/** URL absoluta de uma variante (para schema, OG etc.). */
export const bestUrl = (src: string, minWidth = 1200, fmt: 'webp' | 'avif' = 'webp'): string => {
  const info = image(src);
  const list = info[fmt];
  return url((list.find((v) => v.w >= minWidth) ?? list[list.length - 1]!).file);
};

/** Gera um JPEG 1200x630 para Open Graph a partir de uma imagem-fonte. */
export const ogImage = async (
  distDir: string,
  name: string,
  src: string,
  opts: { fit?: 'cover' | 'contain'; logo: Buffer; background?: string },
): Promise<string> => {
  const out = join(distDir, 'og', `${name}.jpg`);
  await mkdir(dirname(out), { recursive: true });
  const W = 1200;
  const H = 630;
  const fit = opts.fit ?? 'cover';
  const bgColor = opts.background ?? '#283378';
  const photo = await sharp(await readFile(join(SRC_DIR, src)))
    .resize(fit === 'cover' ? { width: W, height: H, fit: 'cover' } : { width: 760, height: 480, fit: 'contain', background: '#ffffff' })
    .toBuffer();
  const band = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><rect x="0" y="${H - 132}" width="${W}" height="132" fill="${bgColor}"/><rect x="0" y="${H - 138}" width="${W}" height="6" fill="#FFC72C"/></svg>`,
  );
  const logo = await sharp(opts.logo).resize({ height: 84 }).png().toBuffer();
  const layers: OverlayOptions[] =
    fit === 'cover'
      ? [{ input: photo, left: 0, top: 0 }]
      : [{ input: photo, left: (W - 760) / 2, top: 10 }];
  layers.push({ input: band, left: 0, top: 0 }, { input: logo, left: 56, top: H - 108 });
  await sharp({ create: { width: W, height: H, channels: 3, background: fit === 'cover' ? bgColor : '#ffffff' } })
    .composite(layers)
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(out);
  return `/og/${name}.jpg`;
};
