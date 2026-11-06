import { html } from '../../shared/html.ts';
import { business, whatsappLink } from '../../data/site.ts';
import { parts, partsInGroup, partGroups, withArticle, type Part } from '../../data/parts.ts';
import { icon } from '../icons.ts';
import { picture, preloadImage, bestUrl } from '../images.ts';
import {
  engineFigure,
  sectionHead,
  shelves,
  brandGrid,
  faqList,
  quoteForm,
  partTile,
  audienceList,
  counterfeit,
} from '../components.ts';
import { breadcrumbs, type Page } from '../layout.ts';
import { webPage, faqPage, partTerm, glossary, itemList } from '../schema.ts';

const HERO_SIZES = '(min-width: 1100px) 520px, (min-width: 760px) 45vw, 92vw';

export const partPage = (p: Part, ctx: { og: string; modified: string }): Page => {
  const crumbs = [
    { name: 'Início', path: '/' },
    { name: 'Peças para motores', path: '/pecas-de-motores/' },
    { name: p.name, path: `/${p.slug}/` },
  ];
  const related = partsInGroup(p.group).filter((x) => x.slug !== p.slug);
  const group = partGroups.find((g) => g.slug === p.group)!;
  const wa = whatsappLink(`Olá! Quero um orçamento de ${p.lower}. Veículo, ano e motor: `);

  const body = html`
<section class="part-hero" aria-labelledby="part-title">
  <div class="wrap part-hero__grid">
    <div class="part-hero__copy">
      ${breadcrumbs(crumbs)}
      <h1 class="part-hero__title" id="part-title">${p.name}</h1>
      <p class="part-hero__lede">${p.lede}</p>
      <div class="hero__actions">
        <a class="btn btn--signal btn--lg" href="${wa}" data-track="whatsapp-part">${icon('whatsapp')}Orçamento no WhatsApp</a>
        <a class="btn btn--ghost btn--lg" href="#orcamento">Preencher pedido</a>
      </div>
      <ul class="hero__proof" role="list">
        <li>${icon('shield')}Procedência garantida</li>
        <li>${icon('box')}Pronta entrega</li>
        <li>${icon('truck')}Linha leve e pesada</li>
      </ul>
    </div>
    <div class="part-hero__media">
      ${picture(p.image, { alt: p.imageAlt, sizes: HERO_SIZES, priority: true, fallbackWidth: 720 })}
    </div>
  </div>
</section>

<section class="section part-answer" aria-labelledby="o-que-e">
  <div class="wrap part-answer__grid">
    <div class="part-answer__copy">
      <h2 class="section-title" id="o-que-e">${p.question}</h2>
      <p class="answer">${p.definition}</p>
      <h3 class="part-answer__sub">Pontos de atenção</h3>
      <ul class="facts" role="list">
        ${p.facts.map((f) => html`<li class="reveal">${icon('wrench')}<span>${f}</span></li>`)}
      </ul>
      <div class="part-answer__who">
        <h3 class="part-answer__sub">Para quem vendemos</h3>
        <p>Atendemos todo tipo de cliente. Vendemos ${p.lower} para a linha leve e pesada a:</p>
        ${audienceList()}
      </div>
    </div>
    ${engineFigure({
      highlight: p.slug,
      size: 'side',
      label: `Desenho em corte de um motor com ${p.lower} destacados em amarelo.`,
      caption: p.group === 'kits' ? `Em amarelo: as peças do ${p.lower}.` : `Em amarelo: onde fica${p.slug === 'comando-de-valvulas' ? '' : 'm'} ${withArticle(p)} no motor.`,
      theta: p.group === 'cabecote' ? 110 : 40,
    })}
  </div>
</section>

<section class="section part-faq" aria-labelledby="duvidas">
  <div class="wrap faq-section__grid">
    ${sectionHead({ id: 'duvidas', title: `Dúvidas sobre ${p.lower}`, lede: html`Precisa de ajuda para achar a aplicação certa? Fale com a equipe pelo <a href="${wa}">WhatsApp</a> ou pelo telefone <a href="tel:${business.phone.e164}">${business.phone.display}</a>.` })}
    ${faqList(p.faq, `faq-${p.slug}`)}
  </div>
</section>

<section class="section makers makers--tight" aria-labelledby="marcas-title">
  <div class="wrap">
    ${sectionHead({ id: 'marcas-title', title: 'Melhores marcas, com garantia de procedência', align: 'split', lede: 'Distribuímos fabricantes reconhecidas do mercado de reposição, com nota fiscal em todas as vendas.' })}
    ${brandGrid()}
  </div>
</section>

<section class="section related" aria-labelledby="relacionadas">
  <div class="wrap">
    ${sectionHead({ id: 'relacionadas', title: `Outras peças de ${group.name.toLowerCase()}`, align: 'split', lede: group.text })}
    <ul class="shelf__items shelf__items--related" role="list">${related.map((r) => html`<li class="reveal">${partTile(r)}</li>`)}</ul>
    <p class="makers__more"><a class="link" href="/pecas-de-motores/">Ver todas as linhas de peças</a></p>
  </div>
</section>

${quoteForm({ preset: [p.slug], title: `Orçamento de ${p.lower}`, lede: `Informe o veículo, o ano e o modelo do motor. Respondemos com a disponibilidade e o preço de ${p.lower} no horário comercial.` })}
`;

  return {
    path: `/${p.slug}/`,
    title: p.title,
    description: p.description,
    body,
    crumbs,
    nav: 'pecas',
    bodyClass: 'page-part',
    ogImage: ctx.og,
    ogImageAlt: p.imageAlt,
    preload: [preloadImage(p.image, HERO_SIZES)],
    images: [p.image],
    sitemap: { priority: 0.8, changefreq: 'monthly' },
    schema: [
      webPage({
        path: `/${p.slug}/`,
        title: p.title,
        description: p.description,
        modified: ctx.modified,
        image: bestUrl(p.image, 1080),
        about: partTerm(p),
      }),
      faqPage(p.faq),
    ],
  };
};

export const catalogPage = (ctx: { og: string; modified: string }): Page => {
  const title = 'Peças para motores: linha completa leve e diesel | Mirpo';
  const description =
    'Pistões, anéis, bronzinas, camisas, válvulas, comando, tuchos, juntas, retentores, bombas de óleo, filtros e kits. 18 linhas de peças originais na Mirpo.';
  const crumbs = [
    { name: 'Início', path: '/' },
    { name: 'Peças para motores', path: '/pecas-de-motores/' },
  ];
  const body = html`
<section class="hero hero--catalog" aria-labelledby="hero-title">
  <div class="wrap hero__grid">
    <div class="hero__copy">
      ${breadcrumbs(crumbs)}
      <h1 class="hero__title" id="hero-title">Linha completa de peças para motores</h1>
      <p class="hero__lede">Dezoito linhas de peças para motores a gasolina, flex e diesel, de automóveis a caminhões, tratores e carros antigos. Todas originais, das principais fabricantes do mercado de reposição.</p>
      <p class="hero__lede hero__lede--small">Clique numa peça para saber mais ou chame a equipe no WhatsApp: com o veículo, o ano e o motor, a gente confirma a aplicação.</p>
      <div class="hero__actions">
        <a class="btn btn--signal btn--lg" href="${whatsappLink()}" data-track="whatsapp-catalog">${icon('whatsapp')}Pedir orçamento no WhatsApp</a>
      </div>
    </div>
    <div class="hero__engine">
      ${engineFigure({
        label: 'Desenho em corte de um motor com todas as linhas de peças da Mirpo.',
        caption: 'Passe o mouse ou toque numa peça do motor para abrir a página dela.',
        theta: 200,
      })}
    </div>
  </div>
</section>

<section class="section catalog" aria-label="Linhas de peças por sistema do motor">
  <div class="wrap">
    ${shelves({ headingLevel: 2 })}
  </div>
</section>

${counterfeit()}

<section class="section makers" aria-labelledby="marcas-title">
  <div class="wrap">
    ${sectionHead({ id: 'marcas-title', title: 'Fabricantes', align: 'split', lede: 'Peças certificadas pelo Inmetro e com garantia de procedência.' })}
    ${brandGrid()}
  </div>
</section>

${quoteForm()}
`;
  return {
    path: '/pecas-de-motores/',
    title,
    description,
    body,
    crumbs,
    nav: 'pecas',
    bodyClass: 'page-catalog',
    ogImage: ctx.og,
    ogImageAlt: 'Peças para motores da Mirpo',
    sitemap: { priority: 0.9, changefreq: 'monthly' },
    images: parts.map((p) => p.image),
    schema: [
      webPage({ path: '/pecas-de-motores/', title, description, type: 'CollectionPage', modified: ctx.modified, image: ctx.og }),
      itemList('Linhas de peças para motores', parts.map((p) => ({ name: p.name, path: `/${p.slug}/` }))),
      glossary(),
    ],
  };
};
