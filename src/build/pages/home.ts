import { html } from '../../shared/html.ts';
import { business, testimonialVideos, whatsappLink, yearsActive } from '../../data/site.ts';
import { homeFaq } from '../../data/content.ts';
import { icon } from '../icons.ts';
import { picture, bestUrl } from '../images.ts';
import {
  engineFigure,
  sectionHead,
  shelves,
  brandGrid,
  videoFacade,
  quoteWall,
  counterfeit,
  faqList,
  quoteForm,
  vehicleLineList,
  audienceList,
  yearsBadge,
} from '../components.ts';
import { organization, website, webPage, faqPage, videoObject } from '../schema.ts';
import type { Page } from '../layout.ts';

export const homePage = (ctx: { og: string; modified: string; logoPng: string; video?: Record<string, string> }): Page => {
  const years = yearsActive();

  // Vídeo de fundo da hero (Reels do estoque da Mirpo, ver scripts/video.ts). Horizontal para
  // telas deitadas, vertical para telas em pé. O poster (1º quadro) aparece na hora e é o LCP;
  // o vídeo só carrega depois, pelo JS (src/client/media.ts → initHeroVideo).
  const v = ctx.video ?? {};
  const bg =
    v['hero-desktop.mp4'] && v['hero-desktop.webp'] && v['hero-mobile.mp4'] && v['hero-mobile.webp']
      ? { desktop: v['hero-desktop.mp4'], desktopPoster: v['hero-desktop.webp'], mobile: v['hero-mobile.mp4'], mobilePoster: v['hero-mobile.webp'] }
      : null;
  const heroMedia = bg
    ? html`<div class="hero__media">
    <video class="hero__video" muted loop playsinline preload="none" disablepictureinpicture disableremoteplayback tabindex="-1" aria-hidden="true" data-desktop="${bg.desktop}" data-desktop-poster="${bg.desktopPoster}" data-mobile="${bg.mobile}" data-mobile-poster="${bg.mobilePoster}"></video>
    <script>{const v=document.currentScript.previousElementSibling;v.poster=matchMedia('(orientation: portrait)').matches?v.dataset.mobilePoster:v.dataset.desktopPoster}</script>
  </div>
  <button class="hero__toggle" type="button" aria-pressed="false" hidden>${icon('pause', 'icon icon--pause')}${icon('play', 'icon icon--play')}<span class="sr-only">Pausar o vídeo de fundo</span></button>`
    : '';
  const title = 'Mirpo | Peças para motores linha leve e pesada em SP';
  const description = `Distribuidora de peças para motores em São Paulo desde 1968. Pistões, bronzinas, válvulas, juntas e kits originais à pronta entrega. Peça orçamento.`;

  const body = html`
<section class="hero${bg ? ' hero--video' : ''}" aria-labelledby="hero-title">
  ${heroMedia}
  <div class="wrap hero__grid">
    <div class="hero__copy">
      <h1 class="hero__title" id="hero-title">Peças para motores em geral, linha leve e pesada</h1>
      <p class="hero__lede">Pistões, bronzinas, válvulas, juntas e tudo o que vai dentro do motor, das principais fabricantes e à pronta entrega. Atendemos retíficas, oficinas e autopeças em São Paulo desde 1968.</p>
      <div class="hero__actions">
        <a class="btn btn--signal btn--lg" href="${whatsappLink()}" data-track="whatsapp-hero">${icon('whatsapp')}Pedir orçamento no WhatsApp</a>
        <a class="btn ${bg ? 'btn--on-dark' : 'btn--ghost'} btn--lg" href="#catalogo">Ver as peças</a>
      </div>
      <ul class="hero__proof" role="list">
        <li>${icon('shield')}Peças originais, com nota fiscal</li>
        <li>${icon('box')}Estoque à pronta entrega</li>
        <li>${icon('truck')}Leve, diesel, antigos e competição</li>
      </ul>
    </div>
    <div class="hero__engine">
      ${engineFigure({
        label: 'Desenho em corte de um motor de combustão com as peças vendidas pela Mirpo: pistão, anéis, camisa, biela, bronzinas, virabrequim, válvulas, comando, tuchos, juntas, bomba de óleo, filtro e correia de distribuição.',
        caption: 'Passe o mouse ou toque numa peça para ver o que temos. Role a página e o motor gira.',
        theta: 40,
      })}
    </div>
  </div>
</section>

<section class="section catalog" id="catalogo" aria-labelledby="catalogo-title">
  <div class="wrap">
    ${sectionHead({
      id: 'catalogo-title',
      title: 'Linha completa de peças para motores',
      lede: 'Dezoito linhas de peças, organizadas pelo lugar onde ficam no motor. Escolha uma para ver o que é, para que serve e pedir o orçamento.',
      align: 'split',
    })}
    ${shelves()}
  </div>
</section>

<section class="section who" aria-labelledby="quem-title">
  <div class="wrap who__grid">
    <div class="who__intro">
      ${sectionHead({ id: 'quem-title', title: 'Do balcão da retífica ao colecionador', lede: 'Vendemos para quem trabalha com motor todos os dias e para quem cuida do próprio carro com a orientação de um profissional.' })}
      ${audienceList()}
    </div>
    ${vehicleLineList()}
  </div>
</section>

<section class="section classics" aria-labelledby="antigos-title">
  <div class="classics__media">
    ${picture('banners/carros-antigos.png', { alt: 'Colagem de carros clássicos: Opala, Impala e Fusca', sizes: '(min-width: 900px) 55vw, 100vw', fallbackWidth: 1200 })}
  </div>
  <div class="wrap classics__inner">
    <div class="classics__copy">
      <h2 class="section-title" id="antigos-title">Peças para carros antigos e de competição</h2>
      <p>Além da linha atual, mantemos estoque para motores que já saíram de linha. VW a ar de 1200 a 2300, Ford CHT, Citroën, Peugeot e motores preparados para pista.</p>
      <p>Diga o motor e o ano. Se a peça existe, a gente sabe onde encontrar.</p>
      <a class="btn btn--signal" href="${whatsappLink('Olá! Procuro peça para motor de carro antigo/competição. Veículo, ano e motor: ')}" data-track="whatsapp-antigos">${icon('whatsapp')}Consultar peça para antigo</a>
    </div>
  </div>
</section>

<section class="section makers" aria-labelledby="marcas-title">
  <div class="wrap">
    ${sectionHead({
      id: 'marcas-title',
      title: 'As fabricantes que distribuímos',
      lede: 'Trabalhamos só com marcas reconhecidas do mercado de reposição, certificadas pelo Inmetro e com garantia de procedência.',
      align: 'split',
    })}
    ${brandGrid()}
    <p class="makers__more"><a class="link" href="/fornecedores/">Conheça a parceria com os fabricantes</a></p>
  </div>
</section>

<section class="section story" aria-labelledby="historia-title">
  <div class="wrap story__grid">
    <div class="story__photos">
      ${picture('empresa/fachada-antiga.jpg', { alt: 'Fachada antiga da Mirpo, com o letreiro Peças para Motores em Geral', class: 'story__old', sizes: '(min-width: 900px) 34vw, 80vw' })}
      ${picture('banners/fachada-loja.jpg', { alt: 'Fachada atual da loja Mirpo na Alameda Barão de Limeira, 365', class: 'story__new', sizes: '(min-width: 900px) 30vw, 70vw' })}
      ${yearsBadge()}
    </div>
    <div class="story__copy">
      <h2 class="section-title" id="historia-title">${years} anos de tradição em peças para motores</h2>
      <p>A Mirpo começou em 25 de abril de 1968, distribuindo peças para motores em geral na linha leve e pesada. Virou referência em São Paulo pela integridade, pelo portfólio amplo e pela garantia de originalidade de cada peça.</p>
      <p>Trocar uma peça do motor quase sempre é um momento de transtorno. A nossa equipe existe para transformar esse momento em uma compra rápida, com preço transparente e procedência garantida.</p>
      <a class="link" href="/a-empresa/">Conheça a história da Mirpo</a>
    </div>
  </div>
</section>

<section class="section voices" aria-labelledby="depoimentos-title">
  <div class="wrap">
    ${sectionHead({ id: 'depoimentos-title', title: 'Quem compra na Mirpo recomenda', lede: 'Retíficas de São Paulo, Jundiaí e Barueri contam como é comprar com a gente.', align: 'split' })}
    <div class="voices__videos">
      ${testimonialVideos.map((v) => videoFacade(v, { caption: html`<strong>${v.person}</strong>${v.company}, ${v.city}` }))}
    </div>
    ${quoteWall()}
  </div>
</section>

${counterfeit()}

<section class="section faq-section" aria-labelledby="faq-title">
  <div class="wrap faq-section__grid">
    ${sectionHead({ id: 'faq-title', title: 'Perguntas frequentes', lede: html`Não encontrou sua dúvida? Chame no <a href="${whatsappLink()}">WhatsApp ${business.whatsapp.display}</a>.` })}
    ${faqList(homeFaq)}
  </div>
</section>

${quoteForm()}
`;

  return {
    path: '/',
    title,
    description,
    body,
    ogImage: ctx.og,
    ogImageAlt: 'Mecânico montando pistões em um bloco de motor — Mirpo, peças para motores desde 1968',
    nav: 'home',
    bodyClass: 'page-home',
    preload: bg
      ? [
          html`<link rel="preload" as="image" type="image/webp" href="${bg.desktopPoster}" media="(orientation: landscape)" fetchpriority="high">`,
          html`<link rel="preload" as="image" type="image/webp" href="${bg.mobilePoster}" media="(orientation: portrait)" fetchpriority="high">`,
        ]
      : [],
    sitemap: { priority: 1, changefreq: 'weekly' },
    images: ['banners/hero-mecanico.jpg', 'banners/fachada-loja.jpg', 'empresa/fachada-antiga.jpg', 'banners/carros-antigos.png'],
    schema: [
      organization({ logo: ctx.logoPng, photo: bestUrl('banners/fachada-loja.jpg') }),
      website(),
      webPage({ path: '/', title, description, modified: ctx.modified, image: ctx.og }),
      faqPage(homeFaq),
      ...testimonialVideos.map((v) =>
        videoObject(v, bestUrl(v.thumb, 640), `${v.person}, da ${v.company} (${v.city}), conta como é comprar peças para motores na Mirpo.`),
      ),
    ],
  };
};
