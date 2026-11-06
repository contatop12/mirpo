/**
 * Motor em corte: o virabrequim gira conforme o scroll (com inércia),
 * peças acendem no hover/toque e mostram um balão com link.
 */
import { G, pose } from '../shared/engine.ts';
import { onFrame, reducedMotion } from './util.ts';

const DEG_PER_PX = 0.62;
const SPIN_UP = 540;

interface Rig {
  root: HTMLElement;
  svg: SVGSVGElement;
  crank: SVGGElement | null;
  rod: SVGGElement | null;
  piston: SVGGElement | null;
  cams: (SVGGElement | null)[];
  valves: (SVGGElement | null)[];
  springs: (SVGGElement | null)[];
  gears: (SVGGElement | null)[];
  belt: SVGPathElement | null;
  burn: SVGElement | null;
  tip: HTMLElement | null;
  staticHl: string | null;
  current: number;
  target: number;
  base: number;
  visible: boolean;
  active: string | null;
}

const q = <T extends Element>(root: ParentNode, sel: string): T | null => root.querySelector<T>(sel);

const springH = G.springSeat - (G.tappetTop + G.tappetH);

const apply = (r: Rig, theta: number): void => {
  const p = pose(theta);
  r.crank?.setAttribute('transform', `rotate(${theta.toFixed(2)} ${G.crank.x} ${G.crank.y})`);
  r.rod?.setAttribute('transform', `translate(${p.bx.toFixed(2)} ${p.by.toFixed(2)}) rotate(${p.rodAngle.toFixed(2)})`);
  r.piston?.setAttribute('transform', `translate(0 ${p.pinY.toFixed(2)})`);
  for (let i = 0; i < 2; i++) {
    r.cams[i]?.setAttribute('transform', `translate(${G.cam.xs[i]} ${G.cam.y}) rotate(${p.cams[i]!.toFixed(2)})`);
    r.valves[i]?.setAttribute('transform', `translate(0 ${p.lifts[i]!.toFixed(2)})`);
    r.springs[i]?.setAttribute('transform', `translate(${G.valveX[i]} ${G.springSeat}) scale(1 ${((springH - p.lifts[i]!) / springH).toFixed(3)})`);
  }
  r.gears[0]?.setAttribute('transform', `translate(383 658) rotate(${theta.toFixed(1)})`);
  r.gears[1]?.setAttribute('transform', `translate(409 658) rotate(${(-theta).toFixed(1)})`);
  if (r.belt) r.belt.style.strokeDashoffset = ((-theta * Math.PI * G.sprocket.crank) / 180).toFixed(2);
  if (r.burn) r.burn.style.opacity = p.burn.toFixed(3);
};

const partsOf = (r: Rig, slug: string): SVGAElement[] =>
  Array.from(r.svg.querySelectorAll<SVGAElement>(`.e-part[data-part~="${slug}"]`));

const highlight = (r: Rig, slug: string | null): void => {
  r.svg.querySelectorAll('.e-part.is-hl').forEach((el) => el.classList.remove('is-hl'));
  const s = slug ?? r.staticHl;
  if (s) partsOf(r, s).forEach((el) => el.classList.add('is-hl'));
  r.root.classList.toggle('has-hl', Boolean(s));
};

const showTip = (r: Rig, slug: string): void => {
  const tip = r.tip;
  if (!tip) return;
  const els = partsOf(r, slug);
  const first = els.find((el) => el.dataset.part?.split(' ')[0] === slug) ?? els[0];
  if (!first) return;
  const name = first.dataset.name ?? first.getAttribute('aria-label') ?? '';
  const short = first.dataset.short ?? '';
  const href = first.getAttribute('href') ?? `/${slug}/`;
  tip.innerHTML = '';
  const strong = document.createElement('strong');
  strong.textContent = name;
  const p = document.createElement('span');
  p.textContent = short;
  const a = document.createElement('a');
  a.href = href;
  a.textContent = 'Ver peça';
  tip.append(strong, p, a);
  tip.hidden = false;

  // posiciona sobre a união das caixas das peças
  const box = r.root.getBoundingClientRect();
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  for (const el of els) {
    const b = el.getBoundingClientRect();
    if (!b.width && !b.height) continue;
    minX = Math.min(minX, b.left);
    minY = Math.min(minY, b.top);
    maxX = Math.max(maxX, b.right);
  }
  const tw = tip.offsetWidth;
  const th = tip.offsetHeight;
  let x = (minX + maxX) / 2 - box.left - tw / 2;
  let y = minY - box.top - th - 12;
  if (y < 0) y = Math.max(0, minY - box.top + 24);
  x = Math.max(0, Math.min(x, box.width - tw));
  tip.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`;
};

const hideTip = (r: Rig): void => {
  if (r.tip) r.tip.hidden = true;
};

const bindHover = (r: Rig): void => {
  let lastPointer = 'mouse';
  let hideTimer = 0;

  const activate = (slug: string): void => {
    window.clearTimeout(hideTimer);
    if (r.active === slug) return;
    r.active = slug;
    highlight(r, slug);
    showTip(r, slug);
  };
  const deactivate = (): void => {
    r.active = null;
    highlight(r, null);
    hideTip(r);
  };

  r.svg.addEventListener('pointerdown', (e) => {
    lastPointer = e.pointerType;
  });

  r.svg.addEventListener('pointerover', (e) => {
    if (e.pointerType === 'touch') return;
    const a = (e.target as Element).closest<SVGAElement>('.e-part');
    if (a?.dataset.part) activate(a.dataset.part.split(' ')[0]!);
  });

  r.root.addEventListener('pointerleave', (e) => {
    if (e.pointerType === 'touch') return;
    hideTimer = window.setTimeout(deactivate, 160);
  });

  r.tip?.addEventListener('pointerenter', () => window.clearTimeout(hideTimer));

  r.svg.addEventListener('click', (e) => {
    const a = (e.target as Element).closest<SVGAElement>('.e-part');
    if (!a?.dataset.part) return;
    const slug = a.dataset.part.split(' ')[0]!;
    // no toque, o primeiro toque mostra o balão; o segundo abre a página
    if (lastPointer !== 'mouse' && r.active !== slug) {
      e.preventDefault();
      activate(slug);
    }
  });

  document.addEventListener('pointerdown', (e) => {
    if (!r.active || e.pointerType === 'mouse') return;
    if (!r.root.contains(e.target as Node)) deactivate();
  });
};

export const initEngines = (): void => {
  const roots = document.querySelectorAll<HTMLElement>('[data-engine]');
  if (!roots.length) return;
  const still = reducedMotion();

  const rigs: Rig[] = [];
  roots.forEach((root) => {
    const svg = q<SVGSVGElement>(root, 'svg');
    if (!svg) return;
    const theta0 = Number(q(svg, '[data-e="crank"]')?.getAttribute('transform')?.match(/rotate\(([-\d.]+)/)?.[1] ?? 40);
    const rig: Rig = {
      root,
      svg,
      crank: q(svg, '[data-e="crank"]'),
      rod: q(svg, '[data-e="rod"]'),
      piston: q(svg, '[data-e="piston"]'),
      cams: [q(svg, '[data-e="cam0"]'), q(svg, '[data-e="cam1"]')],
      valves: [q(svg, '[data-e="valve0"]'), q(svg, '[data-e="valve1"]')],
      springs: [q(svg, '[data-e="spring0"]'), q(svg, '[data-e="spring1"]')],
      gears: [q(svg, '[data-e="gear0"]'), q(svg, '[data-e="gear1"]')],
      belt: q(svg, '[data-e="belt"]'),
      burn: q(svg, '[data-e="burn"]'),
      tip: q(root, '[data-engine-tip]'),
      staticHl: root.dataset.highlight ?? null,
      base: theta0,
      current: still ? theta0 : theta0 - SPIN_UP,
      target: theta0,
      visible: true,
      active: null,
    };
    rigs.push(rig);
    bindHover(rig);
    apply(rig, rig.current);
  });

  if (still) return;

  const io = new IntersectionObserver((entries) => {
    for (const en of entries) {
      const rig = rigs.find((r) => r.root === en.target);
      if (rig) rig.visible = en.isIntersecting;
    }
  });
  rigs.forEach((r) => io.observe(r.root));

  onFrame((y) => {
    let busy = false;
    for (const r of rigs) {
      r.target = r.base + y * DEG_PER_PX;
      const d = r.target - r.current;
      if (Math.abs(d) < 0.05) {
        if (r.current !== r.target) {
          r.current = r.target;
          if (r.visible) apply(r, r.current);
        }
        continue;
      }
      busy = true;
      r.current += d * 0.12;
      if (r.visible) apply(r, r.current);
    }
    return busy;
  });
};
