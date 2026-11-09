import { html, raw, jsonScript, attrs, type Safe } from '../shared/html.ts';
import { SITE_URL, business, integrations, whatsappLink } from '../data/site.ts';
import { parts, partGroups, partsInGroup } from '../data/parts.ts';
import { icon } from './icons.ts';
import { breadcrumb, type Crumb } from './schema.ts';

export interface Assets {
  css: string;
  js: string;
  fonts: string[];
  logo: string;
  logoWhite: string;
}

export interface Page {
  path: string;
  title: string;
  description: string;
  body: Safe;
  ogImage: string;
  ogImageAlt?: string;
  ogType?: 'website' | 'article';
  crumbs?: Crumb[];
  schema?: Record<string, unknown>[];
  preload?: Safe[];
  noindex?: boolean;
  sitemap?: { priority: number; changefreq: 'daily' | 'weekly' | 'monthly' | 'yearly' };
  images?: string[];
  nav?: string;
  bodyClass?: string;
}

const NAV = [
  { key: 'pecas', label: 'Peças', href: '/pecas-de-motores/' },
  { key: 'empresa', label: 'A empresa', href: '/a-empresa/' },
  { key: 'fabricantes', label: 'Fabricantes', href: '/fornecedores/' },
  { key: 'orcamento', label: 'Orçamento', href: '/orcamento/' },
  { key: 'contato', label: 'Contato', href: '/contato/' },
];

const head = (p: Page, a: Assets): Safe => {
  const url = SITE_URL + p.path;
  const robots = p.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
  const og = SITE_URL + p.ogImage;
  const schema = [...(p.schema ?? []), ...(p.crumbs && p.crumbs.length > 1 ? [breadcrumb(p.crumbs)] : [])];
  return html`<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
${raw('<script>document.documentElement.classList.add("js")</script>')}
<title>${p.title}</title>
<meta name="description" content="${p.description}">
<link rel="canonical" href="${url}">
<meta name="robots" content="${robots}">
<meta name="theme-color" content="#283378">
<meta name="color-scheme" content="light">
<meta name="format-detection" content="telephone=no">
<meta name="google-site-verification" content="${integrations.googleSiteVerification}">
<meta name="geo.region" content="BR-SP">
<meta name="geo.placename" content="São Paulo">
<meta name="geo.position" content="${business.geo.lat};${business.geo.lng}">
<meta name="ICBM" content="${business.geo.lat}, ${business.geo.lng}">
<meta property="og:locale" content="pt_BR">
<meta property="og:type" content="${p.ogType ?? 'website'}">
<meta property="og:site_name" content="Mirpo Distribuidora">
<meta property="og:title" content="${p.title}">
<meta property="og:description" content="${p.description}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${og}">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${p.ogImageAlt ?? p.title}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${p.title}">
<meta name="twitter:description" content="${p.description}">
<meta name="twitter:image" content="${og}">
${a.fonts.map((f) => html`<link rel="preload" href="${f}" as="font" type="font/woff2" crossorigin>`)}
${p.preload ?? []}
<link rel="stylesheet" href="${a.css}">
<script type="module" src="${a.js}"></script>
<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/manifest.webmanifest">
<link rel="alternate" type="text/plain" href="/llms.txt" title="Resumo do site para modelos de linguagem">
<link rel="dns-prefetch" href="https://www.googletagmanager.com">
<script type="speculationrules">${jsonScript({
    prerender: [{ where: { and: [{ href_matches: '/*' }, { not: { selector_matches: '[data-no-prerender], [href^="#"]' } }] }, eagerness: 'moderate' }],
    prefetch: [{ where: { href_matches: '/*' }, eagerness: 'conservative' }],
  })}</script>
${schema.map((s) => html`<script type="application/ld+json">${jsonScript(s)}</script>`)}
</head>`;
};

const megaMenu = (): Safe => html`<div class="mega" id="mega-pecas" data-mega>
  <div class="mega__inner wrap">
    ${partGroups.map(
      (g) => html`<div class="mega__group">
        <p class="mega__title">${g.name}</p>
        <ul>
          ${partsInGroup(g.slug).map((p) => html`<li><a href="/${p.slug}/">${p.name}</a></li>`)}
        </ul>
      </div>`,
    )}
    <div class="mega__cta">
      <p>Não achou a peça? Mande o veículo, o ano e o motor que a gente procura no estoque.</p>
      <a class="btn btn--signal btn--sm" href="${whatsappLink()}" data-track="whatsapp-mega">${icon('whatsapp')}Falar no WhatsApp</a>
      <a class="mega__all" href="/pecas-de-motores/">Ver todas as linhas de peças</a>
    </div>
  </div>
</div>`;

const topbar = (): Safe => html`<div class="topbar">
  <div class="wrap topbar__inner">
    <p class="status" data-status>${icon('clock')}<span data-status-text>${business.hours.label}</span></p>
    <ul class="topbar__contacts">
      <li><a href="tel:${business.phone.e164}" data-track="tel-topbar">${icon('phone')}${business.phone.display}</a></li>
      <li><a href="${whatsappLink()}" data-track="whatsapp-topbar">${icon('whatsapp')}${business.whatsapp.display}</a></li>
      <li class="hide-sm"><a href="mailto:${business.email}" data-track="email-topbar">${icon('mail')}${business.email}</a></li>
    </ul>
  </div>
</div>`;

const header = (active?: string, logo = ''): Safe => html`<header class="header" data-header>
  <div class="wrap header__inner">
    <a class="header__logo" href="/" aria-label="Mirpo, página inicial">
      <img src="${logo}" alt="Mirpo — distribuidor de peças para motores em geral" width="180" height="78">
    </a>
    <nav class="nav" aria-label="Principal">
      <ul class="nav__list">
        ${NAV.map((n) =>
          n.key === 'pecas'
            ? html`<li class="nav__item nav__item--mega" data-mega-root>
                <a class="nav__link" href="${n.href}"${attrs({ 'aria-current': active === n.key ? 'page' : undefined })}>${n.label}</a>
                <button class="nav__toggle" type="button" aria-expanded="false" aria-controls="mega-pecas" data-mega-toggle>
                  ${icon('chevron')}<span class="sr-only">Abrir lista de peças</span>
                </button>
                ${megaMenu()}
              </li>`
            : html`<li class="nav__item"><a class="nav__link" href="${n.href}"${attrs({ 'aria-current': active === n.key ? 'page' : undefined })}>${n.label}</a></li>`,
        )}
      </ul>
    </nav>
    <a class="btn btn--ink header__cta" href="/orcamento/">Pedir orçamento</a>
    <button class="burger" type="button" aria-expanded="false" aria-controls="drawer" data-drawer-toggle>
      ${icon('menu')}<span class="sr-only">Abrir menu</span>
    </button>
  </div>
</header>
<div class="drawer" id="drawer" data-drawer hidden>
  <div class="drawer__panel" role="dialog" aria-modal="true" aria-label="Menu">
    <div class="drawer__head">
      <span class="drawer__title">Menu</span>
      <button class="drawer__close" type="button" data-drawer-close>${icon('close')}<span class="sr-only">Fechar menu</span></button>
    </div>
    <ul class="drawer__nav">
      ${NAV.filter((n) => n.key !== 'pecas').map((n) => html`<li><a href="${n.href}">${n.label}</a></li>`)}
    </ul>
    ${partGroups.map(
      (g) => html`<details class="drawer__group">
        <summary>${g.name}</summary>
        <ul>${partsInGroup(g.slug).map((p) => html`<li><a href="/${p.slug}/">${p.name}</a></li>`)}</ul>
      </details>`,
    )}
    <div class="drawer__contact">
      <a class="btn btn--signal" href="${whatsappLink()}" data-track="whatsapp-drawer">${icon('whatsapp')}WhatsApp ${business.whatsapp.display}</a>
      <a class="btn btn--ghost" href="tel:${business.phone.e164}" data-track="tel-drawer">${icon('phone')}${business.phone.display}</a>
    </div>
  </div>
</div>`;

const footer = (logoWhite: string): Safe => {
  const year = new Date().getFullYear();
  return html`<footer class="footer">
  <div class="wrap footer__grid">
    <div class="footer__brand">
      <img src="${logoWhite}" alt="Mirpo" width="200" height="87" loading="lazy">
      <p>Distribuidora de peças para motores em geral, linha leve e pesada. Em São Paulo desde 1968.</p>
      <ul class="social">
        <li><a href="${business.social.instagram}" rel="noopener" target="_blank">${icon('instagram')}<span class="sr-only">Instagram da Mirpo</span></a></li>
        <li><a href="${business.social.facebook}" rel="noopener" target="_blank">${icon('facebook')}<span class="sr-only">Facebook da Mirpo</span></a></li>
        <li><a href="${business.social.linkedin}" rel="noopener" target="_blank">${icon('linkedin')}<span class="sr-only">LinkedIn da Mirpo</span></a></li>
      </ul>
    </div>
    <nav class="footer__parts" aria-label="Linhas de peças">
      <p class="footer__title">Peças para motores</p>
      <ul>${parts.map((p) => html`<li><a href="/${p.slug}/">${p.name}</a></li>`)}</ul>
    </nav>
    <nav class="footer__links" aria-label="Institucional">
      <p class="footer__title">Mirpo</p>
      <ul>
        <li><a href="/a-empresa/">A empresa</a></li>
        <li><a href="/fornecedores/">Fabricantes parceiros</a></li>
        <li><a href="/pecas-de-motores/">Catálogo de peças</a></li>
        <li><a href="/orcamento/">Pedir orçamento</a></li>
        <li><a href="/contato/">Contato e endereço</a></li>
        <li><a href="/politica-de-privacidade/">Política de privacidade</a></li>
      </ul>
    </nav>
    <address class="footer__contact">
      <p class="footer__title">Atendimento</p>
      <a href="${business.mapsUrl}" rel="noopener" target="_blank">${icon('pin')}<span>${business.address.street}<br>${business.address.district}, ${business.address.city} – ${business.address.region}<br>CEP ${business.address.postalCode}</span></a>
      <p>${icon('clock')}<span>${business.hours.label}</span></p>
      <a href="tel:${business.phone.e164}" data-track="tel-footer">${icon('phone')}<span>${business.phone.display}</span></a>
      <a href="${whatsappLink()}" data-track="whatsapp-footer">${icon('whatsapp')}<span>${business.whatsapp.display}</span></a>
      <a href="mailto:${business.email}" data-track="email-footer">${icon('mail')}<span>${business.email}</span></a>
    </address>
  </div>
  <div class="wrap footer__bottom">
    <p>© ${year} ${business.legalName}. Todos os direitos reservados.</p>
    <p>Desenvolvido por <a href="https://p12digital.com.br" rel="noopener" target="_blank">P12 Digital</a></p>
  </div>
</footer>`;
};

const floating = (): Safe => html`<a class="fab" href="${whatsappLink()}" data-fab data-track="whatsapp-fab">${icon('whatsapp')}<span class="fab__label">Orçamento no WhatsApp</span></a>
<nav class="actionbar" aria-label="Contato rápido">
  <a href="tel:${business.phone.e164}" data-track="tel-actionbar">${icon('phone')}Ligar</a>
  <a href="${whatsappLink()}" data-track="whatsapp-actionbar">${icon('whatsapp')}WhatsApp</a>
  <a href="/orcamento/">${icon('receipt')}Orçamento</a>
</nav>
<div class="toast" role="status" aria-live="polite" data-toast></div>`;

export const breadcrumbs = (crumbs: Crumb[]): Safe =>
  html`<nav class="crumbs" aria-label="Você está em"><ol>${crumbs.map((c, i) =>
    i === crumbs.length - 1 ? html`<li aria-current="page">${c.name}</li>` : html`<li><a href="${c.path}">${c.name}</a></li>`,
  )}</ol></nav>`;

export const renderPage = (p: Page, a: Assets): string =>
  '<!doctype html>\n' +
  html`<html lang="pt-BR">
${head(p, a)}
<body${attrs({ class: p.bodyClass })}>
<a class="skip" href="#conteudo">Pular para o conteúdo</a>
${topbar()}
${header(p.nav, a.logo)}
<main id="conteudo" tabindex="-1">
${p.body}
</main>
${footer(a.logoWhite)}
${floating()}
<noscript><style>.reveal{opacity:1!important;transform:none!important}</style></noscript>
${raw(`<script>window.MIRPO=${JSON.stringify({ gtm: integrations.gtmId, endpoint: integrations.formEndpoint, wa: business.whatsapp.number, email: business.email, hours: business.hours })}</script>`)}
</body>
</html>`.value;
