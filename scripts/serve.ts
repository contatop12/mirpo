/** Servidor estático local para dist/ (barra final, 404 e MIME corretos). */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, normalize } from 'node:path';
import { brotliCompressSync, gzipSync, constants } from 'node:zlib';

const DIST = join(process.cwd(), 'dist');
const PORT = Number(process.env.PORT ?? 4321);

const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
  '.json': 'application/json',
};

const isFile = async (p: string): Promise<boolean> => {
  try {
    return (await stat(p)).isFile();
  } catch {
    return false;
  }
};

createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', 'http://localhost');
  let path = decodeURIComponent(url.pathname);
  const safe = normalize(path).replace(/^(\.\.[/\\])+/, '');
  let file = join(DIST, safe);
  if (!file.startsWith(DIST)) {
    res.writeHead(403).end();
    return;
  }
  if (!extname(path) && !path.endsWith('/') && (await isFile(join(file, 'index.html')))) {
    res.writeHead(301, { Location: `${path}/${url.search}` }).end();
    return;
  }
  if (path.endsWith('/')) file = join(file, 'index.html');
  let status = 200;
  if (!(await isFile(file))) {
    status = 404;
    file = join(DIST, '404.html');
    path = '/404.html';
  }
  const body = await readFile(file);
  const type = MIME[extname(file)] ?? 'application/octet-stream';
  const immutable = /\/(assets|img|fonts)\//.test(path);
  const headers: Record<string, string> = {
    'Content-Type': type,
    'Cache-Control': immutable ? 'public, max-age=31536000, immutable' : 'no-cache',
    Vary: 'Accept-Encoding',
  };
  // compressão como na hospedagem de produção (texto apenas)
  const accept = String(req.headers['accept-encoding'] ?? '');
  let out: Buffer = body;
  if (/^(text\/|application\/(xml|json|manifest)|image\/svg)/.test(type)) {
    if (accept.includes('br')) {
      out = brotliCompressSync(body, { params: { [constants.BROTLI_PARAM_QUALITY]: 9 } });
      headers['Content-Encoding'] = 'br';
    } else if (accept.includes('gzip')) {
      out = gzipSync(body);
      headers['Content-Encoding'] = 'gzip';
    }
  }
  res.writeHead(status, headers);
  res.end(out);
}).listen(PORT, () => console.log(`▸ servidor em http://localhost:${PORT}`));
