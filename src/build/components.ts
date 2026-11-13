import { html, attrs, type Safe } from '../shared/html.ts';
import { business, brands, quotes, vehicleLines, whatsappLink, yearsActive, type Video } from '../data/site.ts';
import { parts, partGroups, partsInGroup, type Part, type QA } from '../data/parts.ts';
import { counterfeitTips } from '../data/content.ts';
import { icon } from './icons.ts';
import { picture } from './images.ts';
import { engineSvg } from './engine-svg.ts';

export const sectionHead = (o: { id?: string; title: string | Safe; lede?: string | Safe; level?: 2 | 3; align?: 'start' | 'split' }): Safe => {
  const h = o.level === 3 ? html`<h3 class="section-title"${attrs({ id: o.id })}>${o.title}</h3>` : html`<h2 class="section-title"${attrs({ id: o.id })}>${o.title}</h2>`;
  return html`<header class="section-head${o.align === 'split' ? ' section-head--split' : ''}">${h}${o.lede ? html`<p class="section-lede">${o.lede}</p>` : ''}</header>`;
};

export const engineFigure = (o: { highlight?: string; caption: string; label: string; theta?: number; size?: 'hero' | 'side' }): Safe =>
  html`<figure class="engine engine--${o.size ?? 'hero'}${o.highlight ? ' has-hl' : ''}" data-engine${attrs({ 'data-highlight': o.highlight })}>
    ${engineSvg({ highlight: o.highlight, label: o.label, theta: o.theta })}
    <div class="engine__tip" data-engine-tip hidden></div>
    <figcaption class="engine__caption">${o.caption}</figcaption>
  </figure>`;

export const partTile = (p: Part, o: { sizes?: string } = {}): Safe =>
  html`<a class="tile" href="/${p.slug}/">
    <span class="tile__img">${picture(p.image, { alt: '', sizes: o.sizes ?? '(min-width: 1100px) 220px, (min-width: 700px) 30vw, 45vw', fallbackWidth: 480 })}</span>
    <span class="tile__name">${p.name}</span>
    <span class="tile__text">${p.short}</span>
  </a>`;

export const shelves = (o: { headingLevel?: 2 | 3; compact?: boolean } = {}): Safe =>
  html`<div class="shelves${o.compact ? ' shelves--compact' : ''}">
    ${partGroups.map(
      (g) => html`<section class="shelf" aria-labelledby="shelf-${g.slug}">
        <header class="shelf__head">
          ${o.headingLevel === 2 ? html`<h2 class="shelf__title" id="shelf-${g.slug}">${g.name}</h2>` : html`<h3 class="shelf__title" id="shelf-${g.slug}">${g.name}</h3>`}
          <p class="shelf__text">${g.text}</p>
        </header>
        <ul class="shelf__items" role="list" data-count="${partsInGroup(g.slug).length}">
          ${partsInGroup(g.slug).map((p) => html`<li class="reveal">${partTile(p)}</li>`)}
        </ul>
      </section>`,
    )}
  </div>`;

export const brandGrid = (o: { heading?: boolean } = {}): Safe =>
  html`<ul class="brands" role="list">
    ${brands.map(
      (b) => html`<li><a class="brand" href="${b.url}" rel="noopener" target="_blank" title="Site da ${b.name}">
        ${picture(b.image, { alt: b.name, sizes: '160px', fallbackWidth: 160 })}
        ${o.heading ? html`<span class="brand__name">${b.name}</span>` : ''}
      </a></li>`,
    )}
  </ul>`;

const fmtDuration = (s: number): string => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

export const videoFacade = (v: Video, o: { caption?: Safe | string; sizes?: string } = {}): Safe =>
  html`<figure class="video">
    <div class="video__frame" data-yt="${v.id}" data-yt-title="${v.title}">
      <button class="video__play" type="button">
        <span class="sr-only">Assistir: ${v.title}, duração</span>
        ${picture(v.thumb, { alt: '', sizes: o.sizes ?? '(min-width: 900px) 33vw, 100vw', fallbackWidth: 640 })}
        <span class="video__btn">${icon('play')}</span>
        <span class="video__time">${fmtDuration(v.durationSeconds)}</span>
      </button>
    </div>
    ${o.caption ? html`<figcaption>${o.caption}</figcaption>` : ''}
  </figure>`;

export const quoteWall = (): Safe =>
  html`<ul class="quotes" role="list">
    ${quotes.map(
      (q) => html`<li class="saying reveal">
        <blockquote><p>${q.text}</p></blockquote>
        <p class="saying__by">${q.author}${'role' in q ? html`<span>${q.role}</span>` : ''}</p>
      </li>`,
    )}
  </ul>`;

export const faqList = (qas: QA[], name = 'faq'): Safe =>
  html`<div class="faq">
    ${qas.map(
      (x, i) => html`<details class="faq__item" name="${name}"${attrs({ open: i === 0 })}>
        <summary><span>${x.q}</span>${icon('chevron', 'icon faq__icon')}</summary>
        <div class="faq__body"><p>${x.a}</p></div>
      </details>`,
    )}
  </div>`;

export const counterfeit = (o: { id?: string } = {}): Safe =>
  html`<section class="section counterfeit"${attrs({ id: o.id })} aria-labelledby="falsificacao">
    <div class="wrap counterfeit__grid">
      <div class="counterfeit__intro">
        <p class="counterfeit__flag">${icon('alert')}Atenção à peça falsificada</p>
        <h2 class="section-title" id="falsificacao">Como saber se a peça do motor é original</h2>
        <p>Autopeças estão entre os produtos mais falsificados do Brasil. Segundo a <a href="https://abcf.org.br/" rel="noopener" target="_blank">Associação Brasileira de Combate à Falsificação</a>, o país perde cerca de R$ 130 bilhões por ano com contrabando e falsificação, e as autopeças ficam atrás apenas dos cigarros.</p>
        <p>Peças originais passam por testes rigorosos de segurança e resistência. Antes de trocar uma peça do motor, confira:</p>
      </div>
      <ul class="checklist" role="list">
        ${counterfeitTips.map(
          (t) => html`<li class="checklist__item reveal">
            <span class="checklist__icon">${icon(t.icon)}</span>
            <span><strong>${t.title}.</strong> ${t.text}</span>
          </li>`,
        )}
      </ul>
    </div>
  </section>`;

export const vehicleLineList = (): Safe =>
  html`<ul class="lines" role="list">
    ${vehicleLines.map(
      (l) => html`<li class="line reveal">
        <span class="line__icon">${icon(l.icon)}</span>
        <h3 class="line__name">${l.name}</h3>
        <p>${l.text}</p>
      </li>`,
    )}
  </ul>`;

export const audienceList = (): Safe =>
  html`<ul class="audience" role="list">${business.audiences.map((a) => html`<li>${icon('check')}${a}</li>`)}</ul>`;

export const quoteForm = (o: { id?: string; preset?: string[]; title?: string; lede?: string } = {}): Safe => {
  const id = o.id ?? 'orcamento';
  const preset = new Set(o.preset ?? []);
  return html`<section class="section quote" id="${id}" aria-labelledby="${id}-title">
    <div class="wrap quote__grid">
      <div class="quote__aside">
        <h2 class="section-title" id="${id}-title">${o.title ?? 'Peça seu orçamento'}</h2>
        <p class="section-lede">${o.lede ?? 'Conte qual é o veículo e o motor. Um especialista da Mirpo responde com disponibilidade e preço, no horário comercial.'}</p>
        <ul class="quote__channels" role="list">
          <li><a href="${whatsappLink()}" data-track="whatsapp-quote">${icon('whatsapp')}<span><strong>WhatsApp</strong>${business.whatsapp.display}</span></a></li>
          <li><a href="tel:${business.phone.e164}" data-track="tel-quote">${icon('phone')}<span><strong>Telefone</strong>${business.phone.display}</span></a></li>
          <li><a href="mailto:${business.email}" data-track="email-quote">${icon('mail')}<span><strong>E-mail</strong>${business.email}</span></a></li>
        </ul>
        ${picture('site/mascote.png', { alt: 'Mascote da Mirpo anotando um pedido na prancheta', class: 'quote__mascot', sizes: '200px', fallbackWidth: 240 })}
      </div>
      <form class="form" data-quote-form novalidate>
        <div class="form__row form__row--2">
          <label class="field"><span class="field__label">Nome completo</span><input name="nome" autocomplete="name" required maxlength="120"></label>
          <label class="field"><span class="field__label">Telefone ou WhatsApp</span><input name="telefone" type="tel" inputmode="tel" autocomplete="tel" required maxlength="20" placeholder="(11) 90000-0000"></label>
        </div>
        <div class="form__row form__row--2">
          <label class="field"><span class="field__label">E-mail <em>opcional</em></span><input name="email" type="email" autocomplete="email" maxlength="120"></label>
          <label class="field"><span class="field__label">Cidade / UF</span><input name="cidade" autocomplete="address-level2" maxlength="80" placeholder="São Paulo / SP"></label>
        </div>
        <fieldset class="field field--chips">
          <legend class="field__label">Linha</legend>
          <div class="chips">
            ${vehicleLines.map(
              (l, i) => html`<label class="chip"><input type="radio" name="linha" value="${l.name}"${attrs({ checked: i === 0 && !preset.size ? true : undefined })}><span>${l.name}</span></label>`,
            )}
          </div>
        </fieldset>
        <div class="form__row form__row--3">
          <label class="field"><span class="field__label">Veículo</span><input name="veiculo" maxlength="80" placeholder="Ex.: Kombi, Scania 113"></label>
          <label class="field"><span class="field__label">Ano</span><input name="ano" inputmode="numeric" maxlength="9" placeholder="Ex.: 1996"></label>
          <label class="field"><span class="field__label">Modelo do motor</span><input name="motor" maxlength="80" placeholder="Ex.: 1600 a ar, MWM 229"></label>
        </div>
        <fieldset class="field field--chips">
          <legend class="field__label">Peças <em>marque uma ou mais</em></legend>
          <div class="chips chips--parts">
            ${parts.map(
              (p) => html`<label class="chip chip--sm"><input type="checkbox" name="pecas" value="${p.name}"${attrs({ checked: preset.has(p.slug) })}><span>${p.name}</span></label>`,
            )}
          </div>
        </fieldset>
        <label class="field"><span class="field__label">Mensagem <em>opcional</em></span><textarea name="mensagem" rows="3" maxlength="1200" placeholder="Medida, código da peça, quantidade…"></textarea></label>
        <label class="hp" aria-hidden="true">Não preencha<input name="empresa_site" tabindex="-1" autocomplete="off"></label>
        <label class="consent"><input type="checkbox" name="consentimento" required checked><span>Autorizo a Mirpo a usar estes dados para responder ao meu pedido, conforme a <a href="/politica-de-privacidade/">política de privacidade</a>.</span></label>
        <p class="form__error" data-form-error role="alert" hidden></p>
        <div class="form__actions">
          <button class="btn btn--signal btn--lg" type="submit" data-submit>${icon('send')}<span class="btn__spin" aria-hidden="true"></span><span data-submit-label>Enviar pedido</span></button>
        </div>
        <p class="form__note">Um especialista da Mirpo responde em horário comercial, pelo telefone ou e-mail que você informar.</p>
        <div class="form-done" data-form-done hidden>
          <span class="form-done__icon">${icon('check')}</span>
          <h3 class="form-done__title" tabindex="-1" data-form-done-title>Pedido enviado com sucesso!</h3>
          <p class="form-done__text">Recebemos o seu pedido de orçamento. Um especialista da Mirpo entra em contato em horário comercial, pelo telefone ou e-mail que você informou.</p>
          <button class="btn btn--ghost" type="button" data-form-again>Enviar outro pedido</button>
        </div>
      </form>
    </div>
  </section>`;
};

export const ctaBand = (o: { title: string; text: string }): Safe =>
  html`<section class="cta-band">
    <div class="wrap cta-band__inner">
      <div>
        <h2 class="cta-band__title">${o.title}</h2>
        <p>${o.text}</p>
      </div>
      <div class="cta-band__actions">
        <a class="btn btn--signal btn--lg" href="${whatsappLink()}" data-track="whatsapp-cta">${icon('whatsapp')}Falar no WhatsApp</a>
        <a class="btn btn--on-dark" href="tel:${business.phone.e164}" data-track="tel-cta">${icon('phone')}${business.phone.display}</a>
      </div>
    </div>
  </section>`;

export const yearsBadge = (): Safe =>
  html`<span class="stamp" role="img" aria-label="Fundada em 1968, há ${yearsActive()} anos"><span class="stamp__year" aria-hidden="true">1968</span><span class="stamp__label" aria-hidden="true">${yearsActive()} anos de estrada</span></span>`;
