/**
 * Gera o SVG do motor em corte. Estrutura fixa em hachura (padrão de desenho
 * técnico), peças móveis em branco. Cada peça do catálogo tem data-part e link.
 */
import { G, pose, camRadius } from '../shared/engine.ts';
import { partBySlug } from '../data/parts.ts';
import { raw, esc, type Safe } from '../shared/html.ts';

const f = (n: number): string => {
  const r = Math.round(n * 10) / 10;
  return Object.is(r, -0) ? '0' : String(r);
};

const pt = (x: number, y: number): string => `${f(x)} ${f(y)}`;

interface Circle {
  x: number;
  y: number;
  r: number;
}

/** Caminho fechado de correia em volta de círculos (ordem horária, y para baixo). */
const beltPath = (cs: Circle[]): { d: string; length: number } => {
  const n = cs.length;
  const tangents: { a: [number, number]; b: [number, number] }[] = [];
  for (let i = 0; i < n; i++) {
    const c1 = cs[i]!;
    const c2 = cs[(i + 1) % n]!;
    const dx = c2.x - c1.x;
    const dy = c2.y - c1.y;
    const L = Math.hypot(dx, dy);
    const ux = dx / L;
    const uy = dy / L;
    const cosA = (c1.r - c2.r) / L;
    const sinA = Math.sqrt(Math.max(0, 1 - cosA * cosA));
    // normal externa (lado de fora para percurso horário em y-baixo)
    const px = uy;
    const py = -ux;
    const nx = ux * cosA + px * sinA;
    const ny = uy * cosA + py * sinA;
    tangents.push({ a: [c1.x + c1.r * nx, c1.y + c1.r * ny], b: [c2.x + c2.r * nx, c2.y + c2.r * ny] });
  }
  let d = '';
  let length = 0;
  const start = tangents[0]!.a;
  d += `M${pt(start[0], start[1])}`;
  for (let i = 0; i < n; i++) {
    const t = tangents[i]!;
    d += `L${pt(t.b[0], t.b[1])}`;
    length += Math.hypot(t.b[0] - t.a[0], t.b[1] - t.a[1]);
    const c = cs[(i + 1) % n]!;
    const next = tangents[(i + 1) % n]!.a;
    const a0 = Math.atan2(t.b[1] - c.y, t.b[0] - c.x);
    const a1 = Math.atan2(next[1] - c.y, next[0] - c.x);
    let sweep = a1 - a0;
    while (sweep < 0) sweep += Math.PI * 2;
    const large = sweep > Math.PI ? 1 : 0;
    d += `A${f(c.r)} ${f(c.r)} 0 ${large} 1 ${pt(next[0], next[1])}`;
    length += sweep * c.r;
  }
  return { d: d + 'Z', length };
};

const camPath = (): string => {
  let d = '';
  for (let a = 0; a < 360; a += 4) {
    const phi = a > 180 ? a - 360 : a;
    const r = camRadius(phi);
    const rad = (a * Math.PI) / 180;
    const x = -r * Math.sin(rad);
    const y = r * Math.cos(rad);
    d += `${a === 0 ? 'M' : 'L'}${pt(x, y)}`;
  }
  return d + 'Z';
};

const gearPath = (teeth: number, ro: number, ri: number): string => {
  let d = '';
  const steps = teeth * 4;
  for (let i = 0; i < steps; i++) {
    const a = (i / steps) * Math.PI * 2;
    const r = i % 4 < 2 ? ro : ri;
    d += `${i === 0 ? 'M' : 'L'}${pt(r * Math.cos(a), r * Math.sin(a))}`;
  }
  return d + 'Z';
};

const springPath = (h: number, coils: number, half: number): string => {
  let d = `M${pt(-half, -h)}`;
  const seg = coils * 2;
  for (let i = 1; i <= seg; i++) {
    const y = -h + (h * i) / seg;
    const x = i % 2 === 1 ? half : -half;
    d += `L${pt(x, y)}`;
  }
  return d;
};

const annulus = (cx: number, cy: number, ro: number, ri: number): string =>
  `M${pt(cx - ro, cy)}A${ro} ${ro} 0 1 0 ${pt(cx + ro, cy)}A${ro} ${ro} 0 1 0 ${pt(cx - ro, cy)}Z` +
  `M${pt(cx - ri, cy)}A${ri} ${ri} 0 1 1 ${pt(cx + ri, cy)}A${ri} ${ri} 0 1 1 ${pt(cx - ri, cy)}Z`;

export interface EngineOptions {
  /** Slug destacado de forma fixa (páginas de peça). */
  highlight?: string;
  /** Ângulo inicial (renderização sem JS). */
  theta?: number;
  label: string;
}

export const engineSvg = ({ highlight, theta = 40, label }: EngineOptions): Safe => {
  const p = pose(theta);
  const { cx, crank } = G;
  const [vxI, vxE] = G.valveX;
  const springH = G.springSeat - (G.tappetTop + G.tappetH);

  /** Abre um link de peça. `parts` = lista separada por espaço; o primeiro é o destino. */
  const part = (parts: string, body: string, extra = ''): string => {
    const primary = parts.split(' ')[0]!;
    const info = partBySlug.get(primary);
    const hl = highlight && parts.split(' ').includes(highlight) ? ' is-hl' : '';
    const name = info ? info.name : primary;
    const short = info ? info.short : '';
    return `<a href="/${primary}/" class="e-part${hl}" data-part="${parts}" data-name="${esc(name)}" data-short="${esc(short)}" aria-label="${esc(name)}" tabindex="-1"${extra}>${body}</a>`;
  };

  const belt = beltPath([
    { x: G.cam.xs[0], y: G.cam.y, r: G.sprocket.cam },
    { x: G.cam.xs[1], y: G.cam.y, r: G.sprocket.cam },
    { x: G.tensioner.x, y: G.tensioner.y, r: G.tensioner.r },
    { x: crank.x, y: crank.y, r: G.sprocket.crank },
  ]);

  const cam = camPath();
  const valve = (x: number): string =>
    `M${pt(x - 3.5, 151)}V268C${pt(x - 3.5, 280)} ${pt(x - 18, 288)} ${pt(x - 26, 290)}V296H${f(x + 26)}V290C${pt(x + 18, 288)} ${pt(x + 3.5, 280)} ${pt(x + 3.5, 268)}V151Z`;
  const seat = (x: number): string =>
    `M${pt(x - 31, 293)}L${pt(x - 31, 287)}L${pt(x - 26, 287)}L${pt(x - 21, 293)}Z` +
    `M${pt(x + 31, 293)}L${pt(x + 31, 287)}L${pt(x + 26, 287)}L${pt(x + 21, 293)}Z`;

  // Biela (coordenadas locais: moente em 0,0; pé em 0,-rod)
  const rodD =
    `M-30 0a30 30 0 1 0 60 0a30 30 0 1 0-60 0Z` +
    `M-13 -18L13 -18L8 ${-G.rod + 14}L-8 ${-G.rod + 14}Z` +
    `M-18 ${-G.rod}a18 18 0 1 0 36 0a18 18 0 1 0-36 0Z`;

  // Virabrequim (coordenadas absolutas, gira em torno do centro)
  const cwA = (55 * Math.PI) / 180;
  const crankD =
    `M${pt(cx - 24, crank.y - crank.r)}a24 24 0 0 1 48 0V${f(crank.y + 6)}H${f(cx - 24)}Z` +
    `M${pt(cx - 28, crank.y + 4)}L${pt(cx - 82 * Math.sin(cwA), crank.y + 82 * Math.cos(cwA))}` +
    `A82 82 0 0 0 ${pt(cx + 82 * Math.sin(cwA), crank.y + 82 * Math.cos(cwA))}L${pt(cx + 28, crank.y + 4)}Z`;

  const svg = `
<svg class="engine__svg" viewBox="104 62 400 704" width="400" height="704" role="img" aria-labelledby="engine-title" focusable="false">
<title id="engine-title">${esc(label)}</title>
<defs>
  <pattern id="e-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
    <rect class="e-hatch-bg" width="7" height="7"/><line class="e-hatch-line" x1="0" y1="0" x2="0" y2="7"/>
  </pattern>
  <radialGradient id="e-burn-g" cx="50%" cy="40%" r="60%">
    <stop offset="0" class="e-burn-0"/><stop offset=".55" class="e-burn-1"/><stop offset="1" class="e-burn-2"/>
  </radialGradient>
  <clipPath id="e-bore"><rect x="205" y="286" width="150" height="60"/></clipPath>
</defs>

<!-- Tampa de válvulas e cabeçote -->
<path class="e-cut" d="M150 140V100Q150 72 178 72H382Q410 72 410 100V140Z"/>
<path class="e-void" d="M162 140V104Q162 84 182 84H378Q398 84 398 104V140Z"/>
<rect class="e-cut" x="150" y="142" width="260" height="158"/>
<rect class="e-void" x="${vxI - 20}" y="142" width="40" height="${G.springSeat - 142}"/>
<rect class="e-void" x="${vxE - 20}" y="142" width="40" height="${G.springSeat - 142}"/>
<rect class="e-void" x="271" y="142" width="18" height="150"/>
<rect class="e-cool" x="164" y="152" width="34" height="38" rx="6"/>
<rect class="e-cool" x="362" y="152" width="34" height="38" rx="6"/>
<path class="e-void" d="M150 206C215 206 262 224 ${vxI + 22} 262L${vxI + 22} 292L${vxI - 22} 292C${vxI - 25} 262 190 246 150 246Z"/>
<path class="e-void" d="M410 206C345 206 298 224 ${vxE - 22} 262L${vxE - 22} 292L${vxE + 22} 292C${vxE + 25} 262 370 246 410 246Z"/>
<path class="e-void" d="M205 300L215 292H345L355 300Z"/>

<!-- Bloco -->
<path class="e-cut" d="M150 306H410V530L440 560V690H120V560L150 530Z"/>
<path class="e-void" d="M196 306H364V530L410 575V690H150V575L196 530Z"/>
<rect class="e-cool" x="162" y="318" width="22" height="160" rx="5"/>
<rect class="e-cool" x="376" y="318" width="22" height="160" rx="5"/>

<!-- Cárter -->
<path class="e-shell" d="M120 692V704Q122 752 162 754H398Q438 752 440 704V692Z"/>
<path class="e-oil" d="M124 728Q160 722 200 728T280 728T360 728T436 728V706Q434 748 398 750H162Q126 748 124 706Z"/>

<!-- Galeria de óleo -->
<path class="e-oilway" d="M428 652H446M446 586H404V150H${vxE + 26}"/>

<!-- Combustão -->
<ellipse data-e="burn" class="e-burn" cx="${cx}" cy="300" rx="78" ry="22" clip-path="url(#e-bore)" style="opacity:${f(p.burn)}"/>

<!-- Camisas -->
${part('camisas-de-cilindro kit-de-motor', `<path d="M196 306H205V520H196ZM355 306H364V520H355Z"/>`)}

<!-- Pistão -->
<g data-e="piston" transform="translate(0 ${f(p.pinY)})">
  ${part('pistoes kit-de-motor', `<path d="M${cx - G.piston.half} -50H${cx + G.piston.half}V40H${cx + G.piston.half - 12}V-30H${cx - G.piston.half + 12}V40H${cx - G.piston.half}Z"/><rect x="${cx - 60}" y="-15" width="22" height="30" rx="3"/><rect x="${cx + 38}" y="-15" width="22" height="30" rx="3"/>`)}
  ${part('aneis-de-segmento kit-de-motor', `<path d="M206 -46h12v4h-12zM342 -46h12v4h-12zM206 -39h12v4h-12zM342 -39h12v4h-12zM206 -32h12v4h-12zM342 -32h12v4h-12z"/>`, ' data-thin=""')}
</g>

<!-- Virabrequim -->
<g data-e="crank" transform="rotate(${f(theta)} ${crank.x} ${crank.y})">
  <path class="e-union-o" d="${crankD}"/><path class="e-union-f" d="${crankD}"/>
  <circle class="e-mark" cx="${cx}" cy="${crank.y + 52}" r="5"/>
</g>

<!-- Mancal principal -->
<circle class="e-journal" cx="${crank.x}" cy="${crank.y}" r="20"/>
${part('bronzinas', `<path fill-rule="evenodd" d="${annulus(crank.x, crank.y, 26, 20)}"/>`)}
${part('arruelas-de-encosto', `<path d="M${pt(crank.x - 37, crank.y)}A37 37 0 0 0 ${pt(crank.x + 37, crank.y)}L${pt(crank.x + 30, crank.y)}A30 30 0 0 1 ${pt(crank.x - 30, crank.y)}Z"/>`)}
<circle class="e-axis" cx="${crank.x}" cy="${crank.y}" r="4"/>

<!-- Biela -->
<g data-e="rod" transform="translate(${f(p.bx)} ${f(p.by)}) rotate(${f(p.rodAngle)})">
  <path class="e-union-o" d="${rodD}"/><path class="e-union-f" d="${rodD}"/>
  <circle class="e-bolt" cx="-21" cy="8" r="3"/><circle class="e-bolt" cx="21" cy="8" r="3"/>
  ${part('bronzinas', `<path fill-rule="evenodd" d="${annulus(0, 0, 23, 18)}"/>`)}
  <circle class="e-journal" cx="0" cy="0" r="18"/><circle class="e-axis" cx="0" cy="0" r="3"/>
  ${part('buchas-de-biela', `<path fill-rule="evenodd" d="${annulus(0, -G.rod, 14, 10)}"/>`)}
  ${part('kit-de-motor', `<circle cx="0" cy="${-G.rod}" r="10"/>`)}
  <circle class="e-axis" cx="0" cy="${-G.rod}" r="3.5"/>
</g>

<!-- Guias, retentores, molas e sedes -->
${part('guias-de-valvulas', `<rect x="${vxI - 7}" y="198" width="14" height="64"/><rect x="${vxE - 7}" y="198" width="14" height="64"/>`)}
${part('sedes-de-valvulas', `<path d="${seat(vxI)}${seat(vxE)}"/>`)}
<g data-e="spring0" transform="translate(${vxI} ${G.springSeat}) scale(1 ${f((springH - p.lifts[0]) / springH)})"><path class="e-spring" d="${springPath(springH, 4, 13)}"/></g>
<g data-e="spring1" transform="translate(${vxE} ${G.springSeat}) scale(1 ${f((springH - p.lifts[1]) / springH)})"><path class="e-spring" d="${springPath(springH, 4, 13)}"/></g>
${part('retentores', `<rect x="${vxI - 9}" y="189" width="18" height="10" rx="3"/><rect x="${vxE - 9}" y="189" width="18" height="10" rx="3"/>`)}

<!-- Válvulas + tuchos -->
<g data-e="valve0" transform="translate(0 ${f(p.lifts[0])})">
  ${part('valvulas', `<path d="${valve(vxI)}"/>`)}
  ${part('tuchos', `<rect x="${vxI - 17}" y="${G.tappetTop}" width="34" height="${G.tappetH}" rx="3"/>`)}
</g>
<g data-e="valve1" transform="translate(0 ${f(p.lifts[1])})">
  ${part('valvulas', `<path d="${valve(vxE)}"/>`)}
  ${part('tuchos', `<rect x="${vxE - 17}" y="${G.tappetTop}" width="34" height="${G.tappetH}" rx="3"/>`)}
</g>

<!-- Comando -->
${part('buchas-de-comando', `<path fill-rule="evenodd" d="${annulus(vxI, G.cam.y, 24, 20)}${annulus(vxE, G.cam.y, 24, 20)}"/>`)}
<g data-e="cam0" transform="translate(${vxI} ${G.cam.y}) rotate(${f(p.cams[0])})">${part('comando-de-valvulas', `<path d="${cam}"/>`)}<circle class="e-axis" r="5"/></g>
<g data-e="cam1" transform="translate(${vxE} ${G.cam.y}) rotate(${f(p.cams[1])})">${part('comando-de-valvulas', `<path d="${cam}"/>`)}<circle class="e-axis" r="5"/></g>

<!-- Vela -->
<g class="e-plug"><rect x="276" y="146" width="8" height="140"/><rect x="272" y="126" width="16" height="20" rx="1"/><rect class="e-plug-ins" x="275" y="94" width="10" height="34" rx="3"/><rect x="277" y="88" width="6" height="7"/><path d="M276 286h8v5h-8z"/></g>

<!-- Juntas -->
${part('juntas-de-motor', `<rect x="150" y="300" width="260" height="6"/><rect x="150" y="139" width="260" height="4"/><rect x="118" y="689" width="324" height="4"/>`)}

<!-- Bomba de óleo e pescador -->
${part('bomba-de-oleo', `<path class="e-pipe" d="M384 676V716Q384 734 366 734H344"/><rect x="300" y="728" width="44" height="12" rx="3"/><rect x="364" y="640" width="64" height="36" rx="5"/>`)}
<g data-e="gear0" transform="translate(383 658) rotate(${f(theta)})"><path class="e-gear" d="${gearPath(9, 13, 10)}"/></g>
<g data-e="gear1" transform="translate(409 658) rotate(${f(-theta)})"><path class="e-gear" d="${gearPath(9, 13, 10)}"/></g>

<!-- Filtro -->
${part('filtros', `<rect x="440" y="562" width="8" height="48"/><rect x="446" y="546" width="44" height="80" rx="7"/><path class="e-ribs" d="M452 560h32M452 572h32M452 584h32M452 596h32M452 608h32"/>`)}

<!-- Distribuição (plano frontal) -->
${part(
  'kit-de-distribuicao',
  `<path class="e-belt-hit" d="${belt.d}"/><path data-e="belt" class="e-belt" d="${belt.d}" style="stroke-dashoffset:${f((-theta * Math.PI * G.sprocket.crank) / 180)}"/>` +
    `<circle class="e-sprocket" cx="${G.cam.xs[0]}" cy="${G.cam.y}" r="${G.sprocket.cam - 3}"/>` +
    `<circle class="e-sprocket" cx="${G.cam.xs[1]}" cy="${G.cam.y}" r="${G.sprocket.cam - 3}"/>` +
    `<circle class="e-sprocket" cx="${crank.x}" cy="${crank.y}" r="${G.sprocket.crank - 3}"/>` +
    `<circle class="e-tensioner" cx="${G.tensioner.x}" cy="${G.tensioner.y}" r="${G.tensioner.r - 2}"/>`,
  ` data-belt-length="${f(belt.length)}"`,
)}
</svg>`;

  return raw(svg.replace(/\n\s*/g, '\n').replace(/<!--[^>]*-->\n?/g, ''));
};
