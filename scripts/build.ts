/**
 * Build do site estático Mirpo.
 *   node scripts/build.ts            → gera dist/
 *   node scripts/build.ts --watch    → refaz ao salvar arquivos em src/
 *   node scripts/build.ts --serve    → também sobe o servidor local
 */
import { build as esbuild } from 'esbuild';
import sharp from 'sharp';
import { createHash } from 'node:crypto';
import { mkdir, rm, writeFile, readFile, copyFile, readdir, stat } from 'node:fs/promises';
import { watch } from 'node:fs';
import { join, dirname } from 'node:path';
import { gzipSync, brotliCompressSync } from 'node:zlib';

const ROOT = process.cwd();
const DIST = join(ROOT, 'dist');
const args = new Set(process.argv.slice(2));

const hash = (buf: Buffer | string): string => createHash('sha1').update(buf).digest('hex').slice(0, 10);

const write = async (path: string, content: string | Buffer): Promise<void> => {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, content);
};

const brandAssets = async (): Promise<{ logo: string; logoWhite: string; logoPng: string; logoBuf: Buffer }> => {
  const svg = await readFile(join(ROOT, 'assets-src/brand/logo.svg'), 'utf8');
  const icon = await readFile(join(ROOT, 'assets-src/brand/icon.svg'), 'utf8');
  const colored = (s: string, color: string): string => s.replace('<path ', `<path fill="${color}" `);
  const navy = colored(svg, '#283378');
  const white = colored(svg, '#ffffff');
  const hn = hash(navy);
  const hw = hash(white);
  await write(join(DIST, `brand/logo.${hn}.svg`), navy);
  await write(join(DIST, `brand/logo-branco.${hw}.svg`), white);

  // favicons e ícones do PWA a partir do "M"
  const iconNavy = colored(icon, '#283378');
  await write(join(DIST, 'favicon.svg'), iconNavy.replace('<svg ', '<svg width="32" height="32" '));
  const square = async (size: number, pad: number, bg: string, fg: string): Promise<Buffer> => {
    const inner = Math.round(size * (1 - pad * 2));
    const glyph = await sharp(Buffer.from(colored(icon, fg)), { density: 600 }).resize(inner, inner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
    return sharp({ create: { width: size, height: size, channels: 4, background: bg } })
      .composite([{ input: glyph, gravity: 'center' }])
      .png({ compressionLevel: 9 })
      .toBuffer();
  };
  await write(join(DIST, 'apple-touch-icon.png'), await square(180, 0.18, '#ffffff', '#283378'));
  await write(join(DIST, 'icon-192.png'), await square(192, 0.16, '#ffffff', '#283378'));
  await write(join(DIST, 'icon-512.png'), await square(512, 0.16, '#ffffff', '#283378'));
  await write(join(DIST, 'icon-maskable-512.png'), await square(512, 0.26, '#283378', '#ffffff'));
  const ico32 = await square(32, 0.08, '#ffffff', '#283378');
  // ICO com PNG embutido (suportado por todos os navegadores atuais)
  const header = Buffer.alloc(22);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);
  header.writeUInt8(32, 6);
  header.writeUInt8(32, 7);
  header.writeUInt8(0, 8);
  header.writeUInt8(0, 9);
  header.writeUInt16LE(1, 10);
  header.writeUInt16LE(32, 12);
  header.writeUInt32LE(ico32.length, 14);
  header.writeUInt32LE(22, 18);
  await write(join(DIST, 'favicon.ico'), Buffer.concat([header, ico32]));
  // logo PNG para schema.org (Google exige formato rasterizável ≥ 112px)
  const logoPng = await sharp(Buffer.from(navy), { density: 400 }).resize(512, 512, { fit: 'contain', background: '#ffffff' }).flatten({ background: '#ffffff' }).png().toBuffer();
  await write(join(DIST, 'brand/mirpo-logo-512.png'), logoPng);
  const logoWhiteBuf = await sharp(Buffer.from(white), { density: 400 }).resize({ width: 600 }).png().toBuffer();

  return { logo: `/brand/logo.${hn}.svg`, logoWhite: `/brand/logo-branco.${hw}.svg`, logoPng: '/brand/mirpo-logo-512.png', logoBuf: logoWhiteBuf };
};

const bundle = async (): Promise<{ css: string; js: string }> => {
  const js = await esbuild({
    entryPoints: [join(ROOT, 'src/client/main.ts')],
    bundle: true,
    minify: true,
    format: 'esm',
    target: ['es2020', 'chrome100', 'safari15', 'firefox100'],
    write: false,
    legalComments: 'none',
  });
  const css = await esbuild({
    entryPoints: [join(ROOT, 'src/styles/site.css')],
    bundle: true,
    minify: true,
    target: ['chrome100', 'safari15.4', 'firefox100'],
    external: ['/fonts/*'],
    write: false,
  });
  const jsCode = js.outputFiles[0]!.contents;
  const cssCode = css.outputFiles[0]!.contents;
  const jsName = `assets/main.${hash(Buffer.from(jsCode))}.js`;
  const cssName = `assets/site.${hash(Buffer.from(cssCode))}.css`;
  await write(join(DIST, jsName), Buffer.from(jsCode));
  await write(join(DIST, cssName), Buffer.from(cssCode));
  return { css: `/${cssName}`, js: `/${jsName}` };
};

const copyFonts = async (): Promise<string[]> => {
  const dir = join(ROOT, 'assets-src/fonts');
  for (const f of await readdir(dir)) await copyFile(join(dir, f), join(DIST, 'fonts', f)).catch(async () => {
    await mkdir(join(DIST, 'fonts'), { recursive: true });
    await copyFile(join(dir, f), join(DIST, 'fonts', f));
  });
  return ['/fonts/barlow-400.woff2', '/fonts/big-shoulders-display.woff2'];
};

const sizeReport = async (): Promise<void> => {
  const files: { path: string; size: number; gz: number; br: number }[] = [];
  const walk = async (d: string): Promise<void> => {
    for (const e of await readdir(d, { withFileTypes: true })) {
      const p = join(d, e.name);
      if (e.isDirectory()) await walk(p);
      else if (/\.(html|css|js|svg|xml|txt)$/.test(e.name)) {
        const buf = await readFile(p);
        files.push({ path: p.slice(DIST.length + 1).replace(/\\/g, '/'), size: buf.length, gz: gzipSync(buf).length, br: brotliCompressSync(buf).length });
      }
    }
  };
  await walk(DIST);
  const pick = files.filter((f) => /^(index\.html|pistoes\/index\.html|assets\/|brand\/logo\.)/.test(f.path));
  for (const f of pick) console.log(`  ${f.path.padEnd(42)} ${(f.size / 1024).toFixed(1).padStart(7)} kB  (br ${(f.br / 1024).toFixed(1)} kB)`);
};

const run = async (): Promise<void> => {
  const t0 = Date.now();
  const images = await import('../src/build/images.ts');
  await rm(DIST, { recursive: true, force: true });
  await mkdir(DIST, { recursive: true });

  console.log('▸ imagens');
  await images.buildImages(DIST);
  if (args.has('--images-only')) return;

  console.log('▸ marca, CSS e JS');
  const brand = await brandAssets();
  const assets = await bundle();
  const fonts = await copyFonts();

  const imagesBase = images;

  const { renderPage } = await import('../src/build/layout.ts');
  const { homePage } = await import('../src/build/pages/home.ts');
  const { partPage, catalogPage } = await import('../src/build/pages/parts.ts');
  const inst = await import('../src/build/pages/institutional.ts');
  const seo = await import('../src/build/seo-files.ts');
  const { parts } = await import('../src/data/parts.ts');

  console.log('▸ imagens Open Graph');
  const og = async (name: string, src: string, fit: 'cover' | 'contain' = 'cover'): Promise<string> =>
    imagesBase.ogImage(DIST, name, src, { fit, logo: brand.logoBuf });
  const ogHome = await og('mirpo', 'banners/hero-mecanico.jpg');
  const ogAbout = await og('a-empresa', 'banners/fachada-loja.jpg');
  const ogSuppliers = await og('fornecedores', 'banners/motor-render.jpg', 'contain');
  const ogQuote = await og('orcamento', 'banners/prancheta-maos.webp');
  const ogCatalog = await og('pecas-de-motores', 'banners/cabecote-maos.webp');
  const ogContact = await og('contato', 'banners/fachada-loja.jpg');
  const ogParts = new Map<string, string>();
  for (const p of parts) ogParts.set(p.slug, await og(p.slug, p.image, 'contain'));

  console.log('▸ páginas');
  const modified = new Date().toISOString();
  const pages = [
    homePage({ og: ogHome, modified, logoPng: brand.logoPng }),
    catalogPage({ og: ogCatalog, modified }),
    ...parts.map((p) => partPage(p, { og: ogParts.get(p.slug)!, modified })),
    inst.aboutPage({ og: ogAbout, modified }),
    inst.suppliersPage({ og: ogSuppliers, modified }),
    inst.quotePage({ og: ogQuote, modified }),
    inst.contactPage({ og: ogContact, modified }),
    inst.privacyPage({ og: ogHome, modified }),
    inst.notFoundPage({ og: ogHome, modified }),
  ];
  const assetsAll = { ...assets, fonts, logo: brand.logo, logoWhite: brand.logoWhite };
  for (const page of pages) {
    const file = page.path.endsWith('.html') ? join(DIST, page.path) : join(DIST, page.path, 'index.html');
    await write(file, renderPage(page, assetsAll));
  }

  console.log('▸ SEO: sitemap, robots, llms');
  const lastmod = modified.slice(0, 10);
  const imgUrl = (src: string): string => imagesBase.bestUrl(src, 1080);
  await write(join(DIST, 'sitemap.xml'), seo.sitemapXml(pages, lastmod, imgUrl));
  await write(join(DIST, 'robots.txt'), seo.robotsTxt());
  await write(join(DIST, 'llms.txt'), seo.llmsTxt());
  await write(join(DIST, 'llms-full.txt'), seo.llmsFullTxt());
  await write(join(DIST, 'manifest.webmanifest'), seo.manifest());
  await write(join(DIST, '_headers'), seo.headersFile());
  await write(join(DIST, '_redirects'), seo.redirectsFile());
  await write(join(DIST, '.htaccess'), seo.htaccess());
  // Cloudflare Workers: arquivos de configuração não são publicados como assets
  await write(join(DIST, '.assetsignore'), '.htaccess\n_headers\n_redirects\n');
  await write(join(DIST, 'humans.txt'), `/* EQUIPE */\nCliente: Mirpo Distribuidora — São Paulo, SP\nDesenvolvimento: P12 Digital — https://p12digital.com.br\n\n/* SITE */\nAtualizado: ${lastmod}\nIdioma: pt-BR\nTecnologia: HTML, CSS, TypeScript (esbuild), sharp\n`);

  console.log(`✓ ${pages.length} páginas em ${((Date.now() - t0) / 1000).toFixed(1)} s`);
  await sizeReport();
};

if (args.has('--watch')) {
  // cada rebuild roda num processo novo: sem cache de módulos ESM
  const { spawn } = await import('node:child_process');
  let child: ReturnType<typeof spawn> | null = null;
  let timer: NodeJS.Timeout | undefined;
  const rebuild = (): void => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      child?.kill();
      child = spawn(process.execPath, [join(ROOT, 'scripts/build.ts')], { stdio: 'inherit' });
    }, 150);
  };
  rebuild();
  watch(join(ROOT, 'src'), { recursive: true }, rebuild);
  watch(join(ROOT, 'assets-src'), { recursive: true }, rebuild);
  console.log('… observando src/ e assets-src/');
  if (args.has('--serve')) await import('./serve.ts');
} else {
  await run();
  if (args.has('--serve')) await import('./serve.ts');
}

void stat;
