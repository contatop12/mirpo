/**
 * Geometria e cinemática do motor em corte (monocilíndrico, 4 tempos, DOHC).
 * Usado no build (gera o SVG) e no cliente (anima o SVG conforme o scroll).
 *
 * Ângulo do virabrequim θ em graus, ciclo de 720°:
 *   0 PMS (início da admissão) → 180 PMI → 360 PMS (ignição) → 540 PMI → 720 PMS
 */

export const G = {
  w: 560,
  h: 790,
  cx: 280,
  crank: { x: 280, y: 610, r: 52 },
  rod: 196,
  piston: { half: 72, crown: 50, skirt: 40 },
  cam: { y: 112, base: 17, lift: 10, xs: [245, 315] as const },
  valveX: [245, 315] as const,
  /** Topo do tucho em repouso = cam.y + cam.base */
  tappetTop: 129,
  tappetH: 22,
  springSeat: 198,
  /** Centros dos eventos de válvula (graus do virabrequim) e meia duração. */
  intake: { center: 110, half: 120 },
  exhaust: { center: 610, half: 120 },
  sprocket: { cam: 34, crank: 20 },
  tensioner: { x: 356, y: 360, r: 12 },
} as const;

const RAD = Math.PI / 180;

/** Elevação suave 0→1→0 para |u| < 1. */
export const bump = (u: number): number => (Math.abs(u) >= 1 ? 0 : 0.5 * (1 + Math.cos(Math.PI * u)));

/** Distância angular com sinal dentro do ciclo de 720°, em [-360, 360). */
export const cycleDelta = (theta: number, center: number): number => {
  let d = (((theta - center) % 720) + 720) % 720;
  if (d >= 360) d -= 720;
  return d;
};

export interface Pose {
  /** Centro do moente (olhal maior da biela). */
  bx: number;
  by: number;
  /** Y do pino do pistão. */
  pinY: number;
  /** Rotação da biela em graus. */
  rodAngle: number;
  /** Rotação de cada came (admissão, escape) em graus. */
  cams: [number, number];
  /** Elevação de cada válvula em unidades do SVG. */
  lifts: [number, number];
  /** Intensidade da combustão 0..1. */
  burn: number;
}

export const pose = (theta: number): Pose => {
  const { crank, rod, cam } = G;
  const t = theta * RAD;
  const sx = crank.r * Math.sin(t);
  const cy = crank.r * Math.cos(t);
  const bx = crank.x + sx;
  const by = crank.y - cy;
  const beta = Math.asin(sx / rod);
  const pinY = crank.y - (cy + Math.sqrt(rod * rod - sx * sx));

  const di = cycleDelta(theta, G.intake.center);
  const de = cycleDelta(theta, G.exhaust.center);
  const lifts: [number, number] = [cam.lift * bump(di / G.intake.half), cam.lift * bump(de / G.exhaust.half)];
  const cams: [number, number] = [di / 2, de / 2];
  const burn = bump(cycleDelta(theta, 378) / 40);

  return { bx, by, pinY, rodAngle: -beta / RAD, cams, lifts, burn };
};

/** Perfil polar do came: raio em função do ângulo (0 = apontando para o tucho). */
export const camRadius = (phiDeg: number): number => {
  const { base, lift } = G.cam;
  // meia-duração no came = metade da do virabrequim
  return base + lift * bump(phiDeg / (G.intake.half / 2));
};
