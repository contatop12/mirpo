import { html, type Safe } from '../../shared/html.ts';
import { business, brands, institutionalVideo, whatsappLink, yearsActive } from '../../data/site.ts';
import { homeFaq, howWeWork, mvv, timeline, gallery, supplierGallery, endorsements } from '../../data/content.ts';
import { parts } from '../../data/parts.ts';
import { icon } from '../icons.ts';
import { picture, preloadImage, bestUrl } from '../images.ts';
import {
  sectionHead,
  brandGrid,
  videoFacade,
  counterfeit,
  faqList,
  quoteForm,
  vehicleLineList,
  ctaBand,
  yearsBadge,
} from '../components.ts';
import { breadcrumbs, type Page } from '../layout.ts';
import { webPage, videoObject, faqPage, itemList } from '../schema.ts';

interface Ctx {
  og: string;
  modified: string;
}

const pageHero = (o: { crumbs: { name: string; path: string }[]; title: string; lede: string | Safe; media?: Safe; extra?: Safe; mod?: string }): Safe =>
  html`<section class="page-hero${o.mod ? ` page-hero--${o.mod}` : ''}" aria-labelledby="page-title">
    <div class="wrap page-hero__grid">
      <div class="page-hero__copy">
        ${breadcrumbs(o.crumbs)}
        <h1 class="page-hero__title" id="page-title">${o.title}</h1>
        <p class="page-hero__lede">${o.lede}</p>
        ${o.extra ?? ''}
      </div>
      ${o.media ? html`<div class="page-hero__media">${o.media}</div>` : ''}
    </div>
  </section>`;

/* ------------------------------------------------------------------ A empresa */

export const aboutPage = (ctx: Ctx): Page => {
  const years = yearsActive();
  const title = `A empresa: ${years} anos em peças para motores | Mirpo`;
  const description = `Fundada em 1968, a Mirpo é uma das distribuidoras de peças para motores mais tradicionais de São Paulo. Conheça nossa história, equipe e estoque.`;
  const crumbs = [
    { name: 'Início', path: '/' },
    { name: 'A empresa', path: '/a-empresa/' },
  ];
  const sizes = '(min-width: 1000px) 46vw, 92vw';
  const body = html`
${pageHero({
  crumbs,
  title: `${years} anos de tradição em peças para motores`,
  lede: 'Conhecimento, profissionalismo e ética. Em um mercado em que qualidade precisa andar junto com agilidade, a Mirpo convida você a conhecer a nossa história.',
  media: videoFacade(institutionalVideo, { caption: 'Vídeo de apresentação da Mirpo', sizes }),
  extra: html`<p class="page-hero__text">São mais de cinco décadas no mercado de reposição de peças para motores em geral, sempre com as marcas mais conceituadas e uma equipe pronta para atender bem.</p>`,
})}

<section class="section about-intro" aria-labelledby="quem-somos">
  <div class="wrap about-intro__grid">
    <div class="about-intro__stamp">${yearsBadge()}</div>
    <div class="about-intro__copy prose">
      <h2 class="section-title" id="quem-somos">Quem somos</h2>
      <p>Fundada em <strong>25 de abril de 1968</strong>, a Mirpo começou distribuindo peças para motores em geral, na <strong>linha leve e pesada</strong>.</p>
      <p>Nos tornamos referência como uma das mais importantes distribuidoras de autopeças de <strong>São Paulo</strong>, pela integridade, pela tradição, pelo portfólio amplo, pela garantia de originalidade das peças e pela satisfação no atendimento.</p>
      <p>Nossa equipe é capacitada e focada em resolver o problema do cliente: compra rápida, preço transparente e <strong>garantia de procedência</strong>.</p>
      <p>O estoque é abastecido com frequência para atender à pronta entrega retíficas de motores, oficinas mecânicas, autopeças, concessionárias, seguradoras, locadoras e pessoas físicas com indicação de profissionais do ramo.</p>
    </div>
  </div>
</section>

<section class="section timeline-section" aria-labelledby="linha-do-tempo">
  <div class="wrap">
    ${sectionHead({ id: 'linha-do-tempo', title: 'Linha do tempo', align: 'split', lede: 'Da primeira fachada ao balcão de hoje, na Alameda Barão de Limeira.' })}
    <ol class="timeline" data-timeline>
      ${timeline.map(
        (t) => html`<li class="timeline__item reveal">
          <p class="timeline__year">${t.year}</p>
          <div class="timeline__body">
            <h3>${t.title}</h3>
            <p>${t.text}</p>
          </div>
          ${picture(t.image, { alt: t.alt, class: 'timeline__img', sizes: '(min-width: 900px) 360px, 90vw' })}
        </li>`,
      )}
    </ol>
  </div>
</section>

<section class="section how" aria-labelledby="como-atendemos">
  <div class="wrap">
    ${sectionHead({ id: 'como-atendemos', title: 'Como atendemos as demandas do mercado', align: 'split', lede: 'Seis compromissos que guiam cada pedido, do balcão ao WhatsApp.' })}
    <ul class="how__grid" role="list">
      ${howWeWork.map(
        (h) => html`<li class="how__item reveal">
          <span class="how__icon">${icon(h.icon)}</span>
          <h3>${h.title}</h3>
          <p>${h.text}</p>
        </li>`,
      )}
    </ul>
  </div>
</section>

<section class="section gallery-section" aria-labelledby="por-dentro">
  <div class="wrap">
    ${sectionHead({ id: 'por-dentro', title: 'Por dentro da Mirpo', align: 'split', lede: 'Balcão, memória e estoque. Clique numa foto para ampliar.' })}
    <ul class="gallery" role="list" data-gallery>
      ${gallery.map(
        (g) => html`<li class="reveal"><button class="gallery__btn" type="button" data-full="${bestUrl(g.image, 1080)}" data-alt="${g.alt}">${picture(g.image, { alt: g.alt, sizes: '(min-width: 900px) 25vw, 50vw', fallbackWidth: 640 })}</button></li>`,
      )}
    </ul>
  </div>
</section>

<section class="section mvv" aria-labelledby="mvv-title">
  <div class="wrap">
    <h2 class="sr-only" id="mvv-title">Missão, visão e valores</h2>
    <dl class="mvv__grid">
      ${mvv.map((m) => html`<div class="mvv__item reveal"><dt>${m.title}</dt><dd>${m.text}</dd></div>`)}
    </dl>
  </div>
</section>

${counterfeit()}
${quoteForm()}
`;
  return {
    path: '/a-empresa/',
    title,
    description,
    body,
    crumbs,
    nav: 'empresa',
    bodyClass: 'page-about',
    ogImage: ctx.og,
    ogImageAlt: 'Fachada da loja Mirpo Peças para Motores em Geral',
    sitemap: { priority: 0.7, changefreq: 'yearly' },
    images: [...timeline.map((t) => t.image), ...gallery.map((g) => g.image)],
    schema: [
      webPage({ path: '/a-empresa/', title, description, type: 'AboutPage', modified: ctx.modified, image: ctx.og }),
      videoObject(institutionalVideo, bestUrl(institutionalVideo.thumb, 640), 'Apresentação da Mirpo Distribuidora, distribuidora de peças para motores em São Paulo desde 1968.'),
    ],
  };
};

/* --------------------------------------------------------------- Fornecedores */

export const suppliersPage = (ctx: Ctx): Page => {
  const title = 'Fabricantes parceiros: MAHLE, KS, Sabó, Eaton e mais | Mirpo';
  const description =
    'A Mirpo distribui MAHLE Metal Leve, KS Kolbenschmidt, Riosulense, Sabó, Eaton, Corteco, Schadek, Taranto, JS Bronzinas e Aplic Resolit, certificadas pelo Inmetro.';
  const crumbs = [
    { name: 'Início', path: '/' },
    { name: 'Fabricantes', path: '/fornecedores/' },
  ];
  const body = html`
${pageHero({
  crumbs,
  title: 'Parceria com as maiores fabricantes de peças para motores',
  lede: 'Selecionamos as marcas mais conceituadas do mercado automotivo, certificadas pelo Inmetro. É essa parceria que garante a segurança de quem compra, a variedade de peças à pronta entrega e respostas rápidas da nossa equipe.',
  media: picture('banners/motor-render.jpg', { alt: 'Motor automotivo completo em fundo claro', sizes: '(min-width: 1000px) 46vw, 92vw', priority: true }),
})}

<section class="section makers" aria-labelledby="marcas-title">
  <div class="wrap">
    ${sectionHead({ id: 'marcas-title', title: 'Marcas que distribuímos', align: 'split', lede: 'Clique no logotipo para visitar o site da fabricante.' })}
    ${brandGrid({ heading: true })}
  </div>
</section>

<section class="section endorse" aria-labelledby="reconhecimento">
  <div class="wrap">
    ${sectionHead({ id: 'reconhecimento', title: 'O que as fabricantes dizem da Mirpo', align: 'split', lede: 'Publicações das próprias fabricantes sobre visitas e parcerias.' })}
    <div class="endorse__grid">
      ${endorsements.map(
        (e) => html`<figure class="endorse__item reveal">
          <blockquote><p>${e.text}</p></blockquote>
          <figcaption>${e.source}</figcaption>
          ${picture(e.image, { alt: `Publicação da ${e.source} sobre a Mirpo`, class: 'endorse__img', sizes: '(min-width: 900px) 260px, 60vw', fallbackWidth: 640 })}
        </figure>`,
      )}
    </div>
  </div>
</section>

<section class="section gallery-section" aria-labelledby="visitas">
  <div class="wrap">
    ${sectionHead({ id: 'visitas', title: 'Visitas e treinamentos', align: 'split', lede: 'A equipe da Mirpo nas fábricas e nos cursos técnicos dos parceiros.' })}
    <ul class="gallery gallery--captions" role="list" data-gallery>
      ${supplierGallery.map(
        (g) => html`<li class="reveal"><figure><button class="gallery__btn" type="button" data-full="${bestUrl(g.image, 1080)}" data-alt="${g.alt}">${picture(g.image, { alt: g.alt, sizes: '(min-width: 900px) 30vw, 50vw', fallbackWidth: 640 })}</button><figcaption>${g.caption}</figcaption></figure></li>`,
      )}
    </ul>
  </div>
</section>

${ctaBand({ title: 'Procurando uma marca específica?', text: 'Diga a peça e a fabricante de preferência. Se não tivermos em estoque, indicamos a equivalente com a mesma garantia.' })}
${quoteForm()}
`;
  return {
    path: '/fornecedores/',
    title,
    description,
    body,
    crumbs,
    nav: 'fabricantes',
    bodyClass: 'page-suppliers',
    ogImage: ctx.og,
    preload: [preloadImage('banners/motor-render.jpg', '(min-width: 1000px) 46vw, 92vw')],
    sitemap: { priority: 0.7, changefreq: 'yearly' },
    images: ['banners/motor-render.jpg', ...supplierGallery.map((g) => g.image), ...brands.map((b) => b.image)],
    schema: [
      webPage({ path: '/fornecedores/', title, description, modified: ctx.modified, image: ctx.og }),
      itemList('Fabricantes distribuídos pela Mirpo', brands.map((b) => ({ name: b.name, path: b.url }))),
    ],
  };
};

/* ------------------------------------------------------------------ Orçamento */

export const quotePage = (ctx: Ctx): Page => {
  const title = 'Orçamento de peças para motores | Mirpo São Paulo';
  const description =
    'Peça orçamento de peças para motores linha leve, diesel, antigos e importados. Resposta pelo WhatsApp (11) 99666-1687 ou telefone (11) 3335-3544.';
  const crumbs = [
    { name: 'Início', path: '/' },
    { name: 'Orçamento', path: '/orcamento/' },
  ];
  const faq = [homeFaq[4]!, homeFaq[2]!, homeFaq[3]!];
  const body = html`
${pageHero({
  crumbs,
  title: 'Solicite seu orçamento',
  lede: 'Preços justos, atendimento personalizado e peças à pronta entrega.',
  extra: html`<p class="page-hero__text">Para orçamentos e pedidos, ligue para <a href="tel:${business.phone.e164}">${business.phone.display}</a> ou chame no <a href="${whatsappLink()}">WhatsApp ${business.whatsapp.display}</a>. Se preferir, preencha o formulário abaixo e um especialista entra em contato.</p>
    <div class="hero__actions"><a class="btn btn--signal btn--lg" href="${whatsappLink()}" data-track="whatsapp-quote-hero">${icon('whatsapp')}Abrir o WhatsApp</a><a class="btn btn--ghost btn--lg" href="#orcamento">Preencher o formulário</a></div>`,
  media: picture('banners/prancheta-maos.webp', { alt: 'Mecânico anotando um pedido de peças na prancheta', sizes: '(min-width: 1000px) 46vw, 92vw', priority: true }),
})}

<section class="section lines-section" aria-labelledby="linhas">
  <div class="wrap">
    ${sectionHead({ id: 'linhas', title: 'Escolha a linha de peças', align: 'split', lede: 'Atendemos quatro linhas. Marque a sua no formulário para agilizar a cotação.' })}
    ${vehicleLineList()}
  </div>
</section>

${quoteForm({ title: 'Quero fazer um orçamento', lede: 'Preencha o que souber. Com o veículo, o ano e o modelo do motor, a cotação fica mais rápida.' })}

<section class="section faq-section" aria-labelledby="faq-title">
  <div class="wrap faq-section__grid">
    ${sectionHead({ id: 'faq-title', title: 'Antes de pedir' })}
    ${faqList(faq)}
  </div>
</section>
`;
  return {
    path: '/orcamento/',
    title,
    description,
    body,
    crumbs,
    nav: 'orcamento',
    bodyClass: 'page-quote',
    ogImage: ctx.og,
    preload: [preloadImage('banners/prancheta-maos.webp', '(min-width: 1000px) 46vw, 92vw')],
    sitemap: { priority: 0.8, changefreq: 'yearly' },
    schema: [webPage({ path: '/orcamento/', title, description, type: 'ContactPage', modified: ctx.modified, image: ctx.og }), faqPage(faq)],
  };
};

/* -------------------------------------------------------------------- Contato */

export const contactPage = (ctx: Ctx): Page => {
  const title = 'Contato e endereço | Mirpo, Campos Elíseos, São Paulo';
  const description =
    'Alameda Barão de Limeira, 365, Campos Elíseos, São Paulo. Segunda a sexta, 8h às 18h. Telefone (11) 3335-3544, WhatsApp (11) 99666-1687.';
  const crumbs = [
    { name: 'Início', path: '/' },
    { name: 'Contato', path: '/contato/' },
  ];
  const a = business.address;
  const fullAddress = `${a.street}, ${a.district}, ${a.city} – ${a.region}, ${a.postalCode}`;
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${a.street}, ${a.district}, ${a.city} - ${a.region}, ${a.postalCode}`)}`;
  const body = html`
${pageHero({
  crumbs,
  title: 'Fale com a Mirpo',
  lede: 'A distribuidora de peças para motores em geral à sua disposição, pelo canal que for mais prático para você.',
  mod: 'compact',
})}

<section class="section contact" aria-label="Canais de atendimento">
  <div class="wrap contact__grid">
    <ul class="contact__cards" role="list">
      <li class="ccard ccard--wa"><a href="${whatsappLink()}" data-track="whatsapp-contact">${icon('whatsapp')}<span class="ccard__label">WhatsApp</span><span class="ccard__value">${business.whatsapp.display}</span><span class="ccard__hint">Resposta mais rápida</span></a></li>
      <li class="ccard"><a href="tel:${business.phone.e164}" data-track="tel-contact">${icon('phone')}<span class="ccard__label">Telefone</span><span class="ccard__value">${business.phone.display}</span><span class="ccard__hint">${business.hours.label}</span></a></li>
      <li class="ccard"><a href="mailto:${business.email}" data-track="email-contact">${icon('mail')}<span class="ccard__label">E-mail</span><span class="ccard__value">${business.email}</span><span class="ccard__hint">Para pedidos com lista de peças</span></a></li>
      <li class="ccard ccard--status"><div>${icon('clock')}<span class="ccard__label">Horário</span><span class="ccard__value" data-status-text>${business.hours.label}</span><span class="ccard__hint">Sábado e domingo: fechado</span></div></li>
    </ul>
    <div class="map" data-map="${business.mapsEmbed}">
      <div class="map__poster">
        <svg class="map__art" viewBox="0 0 400 260" aria-hidden="true" focusable="false">
          <path d="M-10 70 L410 40 M-10 150 L410 120 M-10 230 L410 200 M60 -10 L110 270 M190 -10 L230 270 M320 -10 L350 270" />
          <path class="map__main" d="M-10 140 L410 110" />
          <circle class="map__dot" cx="214" cy="126" r="9" />
        </svg>
        <address class="map__addr">
          <strong>Mirpo Distribuidora</strong>
          ${a.street}<br>${a.district}, ${a.city} – ${a.region}<br>CEP ${a.postalCode}
        </address>
        <div class="map__actions">
          <button class="btn btn--signal btn--sm" type="button" data-map-load>${icon('map')}Mostrar mapa</button>
          <a class="btn btn--on-dark btn--sm" href="${directions}" rel="noopener" target="_blank">${icon('pin')}Como chegar</a>
          <button class="btn btn--on-dark btn--sm" type="button" data-copy="${fullAddress}" data-copy-done="Endereço copiado">${icon('copy')}Copiar endereço</button>
        </div>
      </div>
    </div>
  </div>
</section>

${quoteForm({ title: 'Envie uma mensagem', lede: 'Preencha o formulário e envie. Um especialista da Mirpo responde em horário comercial, pelo telefone ou e-mail que você informar.' })}
`;
  return {
    path: '/contato/',
    title,
    description,
    body,
    crumbs,
    nav: 'contato',
    bodyClass: 'page-contact',
    ogImage: ctx.og,
    sitemap: { priority: 0.8, changefreq: 'yearly' },
    schema: [webPage({ path: '/contato/', title, description, type: 'ContactPage', modified: ctx.modified, image: ctx.og })],
  };
};

/* --------------------------------------------------------------- Privacidade */

export const privacyPage = (ctx: Ctx): Page => {
  const title = 'Política de privacidade | Mirpo';
  const description = 'Como a Mirpo Distribuidora coleta, usa e protege os dados enviados pelo site, conforme a LGPD.';
  const crumbs = [
    { name: 'Início', path: '/' },
    { name: 'Política de privacidade', path: '/politica-de-privacidade/' },
  ];
  const body = html`
${pageHero({ crumbs, title: 'Política de privacidade', lede: 'Como tratamos os dados que você envia pelo site, de acordo com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018).', mod: 'compact' })}
<section class="section">
  <div class="wrap prose prose--doc">
    <h2>Quais dados coletamos</h2>
    <p>Pelo formulário de orçamento, coletamos apenas o que você informa: nome, telefone ou WhatsApp, e-mail, cidade, dados do veículo e a mensagem. Não pedimos documentos nem dados de pagamento pelo site.</p>
    <h2>Para que usamos</h2>
    <p>Os dados servem exclusivamente para responder ao seu pedido de orçamento ou contato. Não vendemos nem compartilhamos seus dados com terceiros para fins comerciais.</p>
    <h2>Como o envio funciona</h2>
    <p>Ao enviar, os dados do formulário são registrados no sistema de atendimento da Mirpo, operado por fornecedores contratados para isso, para que a equipe comercial acompanhe o seu pedido. A resposta chega pelo telefone ou pelo e-mail que você informar. Para agilizar pedidos futuros, nome, telefone, e-mail e cidade podem ficar salvos apenas no seu navegador; você pode apagá-los limpando os dados do site.</p>
    <h2>Cookies e medição</h2>
    <p>Usamos o Google Tag Manager para medir visitas e cliques em botões de contato, de forma agregada. Os vídeos do YouTube e o mapa do Google só carregam quando você clica neles.</p>
    <h2>Seus direitos</h2>
    <p>Você pode pedir acesso, correção ou exclusão dos seus dados a qualquer momento pelo e-mail <a href="mailto:${business.email}">${business.email}</a>.</p>
    <h2>Contato</h2>
    <p>${business.legalName}<br>${business.address.street}, ${business.address.district}, ${business.address.city} – ${business.address.region}, CEP ${business.address.postalCode}<br>Telefone ${business.phone.display}</p>
  </div>
</section>
`;
  return {
    path: '/politica-de-privacidade/',
    title,
    description,
    body,
    crumbs,
    bodyClass: 'page-doc',
    ogImage: ctx.og,
    sitemap: { priority: 0.2, changefreq: 'yearly' },
    schema: [webPage({ path: '/politica-de-privacidade/', title, description, modified: ctx.modified })],
  };
};

/* ------------------------------------------------------------------------ 404 */

export const notFoundPage = (ctx: Ctx): Page => ({
  path: '/404.html',
  title: 'Página não encontrada | Mirpo',
  description: 'A página que você procurou não existe. Veja as linhas de peças para motores da Mirpo.',
  noindex: true,
  ogImage: ctx.og,
  bodyClass: 'page-404',
  body: html`
${pageHero({
  crumbs: [{ name: 'Início', path: '/' }, { name: 'Página não encontrada', path: '/404.html' }],
  title: 'Essa peça não está nesta prateleira',
  lede: 'A página que você procurou mudou de lugar ou não existe. Escolha uma linha de peças abaixo ou fale com a equipe.',
  mod: 'compact',
  extra: html`<div class="hero__actions"><a class="btn btn--ink btn--lg" href="/pecas-de-motores/">Ver o catálogo</a><a class="btn btn--ghost btn--lg" href="${whatsappLink()}">${icon('whatsapp')}WhatsApp</a></div>`,
})}
<section class="section">
  <div class="wrap">
    <ul class="pill-list" role="list">${parts.map((p) => html`<li><a class="pill" href="/${p.slug}/">${p.name}</a></li>`)}</ul>
  </div>
</section>`,
});
