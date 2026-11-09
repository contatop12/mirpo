/**
 * Vídeo de fundo da hero (home). Roda só localmente, quando o vídeo mudar — precisa do ffmpeg:
 *   npm run video
 *
 * Origem: Reels da Mirpo (instagram.com/p/DYp7SqQjm5K), 720×1280, salvo em
 * assets-src/video/original/ (fora do git). Usa só os trechos sem texto e sem a tela final
 * com o logo e gera, em assets-src/video/ (versionado e copiado pelo build):
 *   hero-desktop.{mp4,webp}  720×400, faixa horizontal do quadro (telas largas)
 *   hero-mobile.{mp4,webp}   432×768, quadro vertical inteiro (celular)
 * Só H.264 (decodificação por hardware em todo navegador; VP9 saiu maior aqui). Sem áudio,
 * 24 fps, ~8 s em loop. Fica sob uma camada escura, então a compressão pode ser alta.
 */
import { spawnSync } from 'node:child_process';
import { mkdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const SRC = join(ROOT, 'assets-src/video/original/hero-instagram-DYp7SqQjm5K.mp4');
const OUT = join(ROOT, 'assets-src/video');

/** Trechos limpos (segundos): sem as palavras animadas e antes da tela do logo. */
const SEGMENTS: [number, number][] = [
  [7.3, 11.7],
  [14.3, 18.2],
];

const VARIANTS = {
  // faixa central do quadro vertical: pessoa no corredor + prateleiras
  desktop: 'crop=720:400:0:420',
  mobile: 'scale=432:768:flags=lanczos',
} as const;

const ffmpeg = (args: string[]): void => {
  const r = spawnSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...args], { stdio: 'inherit' });
  if (r.status !== 0) throw new Error(`ffmpeg falhou: ${args.join(' ')}`);
};

const graph = (shape: string): string => {
  const parts = SEGMENTS.map(([a, b], i) => `[0:v]trim=${a}:${b},setpts=PTS-STARTPTS,fps=24,${shape},setsar=1,format=yuv420p[s${i}]`);
  return `${parts.join(';')};${SEGMENTS.map((_, i) => `[s${i}]`).join('')}concat=n=${SEGMENTS.length}:v=1:a=0[v]`;
};

mkdirSync(OUT, { recursive: true });
for (const [name, shape] of Object.entries(VARIANTS)) {
  const base = join(OUT, `hero-${name}`);
  const common = ['-i', SRC, '-filter_complex', graph(shape), '-map', '[v]', '-an'];
  ffmpeg([...common, '-c:v', 'libx264', '-profile:v', 'high', '-preset', 'slow', '-crf', '32', '-movflags', '+faststart', `${base}.mp4`]);
  // poster: primeiro quadro do loop (para movimento reduzido e enquanto o vídeo carrega)
  ffmpeg(['-ss', String(SEGMENTS[0]![0]), '-i', SRC, '-frames:v', '1', '-vf', shape, '-c:v', 'libwebp', '-quality', '72', `${base}.webp`]);
  for (const ext of ['mp4', 'webp']) console.log(`  hero-${name}.${ext}`.padEnd(26), `${(statSync(`${base}.${ext}`).size / 1024).toFixed(0)} kB`);
}
