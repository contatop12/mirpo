import { SITE_URL, business, brands, quotes, testimonialVideos, vehicleLines, yearsActive } from '../data/site.ts';
import { parts, partGroups, partsInGroup } from '../data/parts.ts';
import { homeFaq, counterfeitTips, howWeWork, mvv } from '../data/content.ts';
import { esc } from '../shared/html.ts';
import type { Page } from './layout.ts';

export const sitemapXml = (pages: Page[], lastmod: string, imageUrl: (src: string) => string): string => {
  const urls = pages
    .filter((p) => !p.noindex && p.sitemap)
    .map((p) => {
      const imgs = (p.images ?? [])
        .map((src) => `\n    <image:image><image:loc>${esc(SITE_URL + imageUrl(src))}</image:loc></image:image>`)
        .join('');
      return `  <url>\n    <loc>${SITE_URL}${p.path}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${p.sitemap!.changefreq}</changefreq>\n    <priority>${p.sitemap!.priority.toFixed(1)}</priority>${imgs}\n  </url>`;
    })
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${urls}\n</urlset>\n`;
};

export const robotsTxt = (): string => `# Mirpo Distribuidora — ${SITE_URL}
# Conteúdo público: buscadores e assistentes de IA são bem-vindos.

User-agent: *
Allow: /
Disallow: /404.html

# Buscadores
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

# Assistentes e buscadores de IA (GEO/AEO)
User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: Claude-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Perplexity-User
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: CCBot
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;

const a = business.address;
const addressLine = `${a.street}, ${a.district}, ${a.city} – ${a.region}, CEP ${a.postalCode}`;

export const llmsTxt = (): string => {
  const years = yearsActive();
  return `# Mirpo Distribuidora

> Distribuidora de peças para motores em geral, linha leve e pesada, fundada em 25 de abril de 1968 em São Paulo (SP). Vende peças originais das principais fabricantes do mercado de reposição, à pronta entrega, para retíficas de motores, oficinas mecânicas, autopeças, concessionárias, seguradoras, locadoras e pessoas físicas com indicação de profissional do ramo.

Fatos principais:

- Nome: ${business.name} (também conhecida como Mirpo ou Auto Peças Mirpo)
- Fundação: 25/04/1968 — ${years} anos de mercado
- Endereço: ${addressLine}
- Horário: ${business.hours.label}
- Telefone: ${business.phone.display}
- WhatsApp: ${business.whatsapp.display} (https://wa.me/${business.whatsapp.number})
- E-mail: ${business.email}
- Linhas atendidas: ${vehicleLines.map((l) => l.name.toLowerCase()).join(', ')}
- Fabricantes distribuídas: ${brands.map((b) => b.name).join(', ')}
- Orçamento: pelo WhatsApp, telefone, e-mail ou formulário em ${SITE_URL}/orcamento/

## Peças para motores

${partGroups
  .map(
    (g) => `### ${g.name}\n\n${partsInGroup(g.slug)
      .map((p) => `- [${p.name}](${SITE_URL}/${p.slug}/): ${p.short}`)
      .join('\n')}`,
  )
  .join('\n\n')}

## Institucional

- [A empresa](${SITE_URL}/a-empresa/): história desde 1968, missão, visão, valores e estrutura
- [Fabricantes parceiros](${SITE_URL}/fornecedores/): marcas distribuídas e reconhecimentos
- [Catálogo completo](${SITE_URL}/pecas-de-motores/): todas as linhas de peças por sistema do motor
- [Orçamento](${SITE_URL}/orcamento/): como pedir cotação
- [Contato](${SITE_URL}/contato/): endereço, mapa e canais de atendimento

## Optional

- [Conteúdo completo em texto](${SITE_URL}/llms-full.txt): definições técnicas, perguntas frequentes e detalhes de cada peça
- [Política de privacidade](${SITE_URL}/politica-de-privacidade/)
`;
};

export const llmsFullTxt = (): string => {
  const years = yearsActive();
  const partsBlock = parts
    .map(
      (p) => `## ${p.name}

URL: ${SITE_URL}/${p.slug}/
Grupo: ${partGroups.find((g) => g.slug === p.group)!.name}

${p.lede}

### ${p.question}

${p.definition}

### Pontos de atenção

${p.facts.map((f) => `- ${f}`).join('\n')}

### Perguntas frequentes

${p.faq.map((x) => `**${x.q}**\n\n${x.a}`).join('\n\n')}`,
    )
    .join('\n\n---\n\n');

  return `# Mirpo Distribuidora — conteúdo completo

> ${business.description}

Última atualização: ${new Date().toISOString().slice(0, 10)}. Fonte oficial: ${SITE_URL}/

## Dados da empresa

- Nome completo: ${business.legalName}
- Fundação: 25 de abril de 1968, em São Paulo — ${years} anos
- Endereço: ${addressLine}
- Coordenadas: ${business.geo.lat}, ${business.geo.lng}
- Horário: ${business.hours.label}
- Telefone: ${business.phone.display}
- WhatsApp: ${business.whatsapp.display}
- E-mail: ${business.email}
- Redes: ${Object.values(business.social).join(' · ')}

## Para quem vende

${business.audiences.map((x) => `- ${x}`).join('\n')}

## Linhas de veículos

${vehicleLines.map((l) => `- **${l.name}:** ${l.text}`).join('\n')}

## Fabricantes distribuídas

${brands.map((b) => `- ${b.name} — ${b.url}`).join('\n')}

## Como a Mirpo trabalha

${howWeWork.map((h) => `- **${h.title}:** ${h.text}`).join('\n')}

${mvv.map((m) => `**${m.title}:** ${m.text}`).join('\n\n')}

## Como identificar peça de motor falsificada

${counterfeitTips.map((t) => `- **${t.title}:** ${t.text}`).join('\n')}

Segundo a Associação Brasileira de Combate à Falsificação (ABCF), o Brasil perde cerca de R$ 130 bilhões por ano com contrabando e falsificação; autopeças ficam atrás apenas de cigarros.

## Perguntas frequentes

${homeFaq.map((x) => `**${x.q}**\n\n${x.a}`).join('\n\n')}

## Depoimentos de clientes

${testimonialVideos.map((v) => `- Vídeo: ${v.person}, ${v.company} (${v.city}) — https://www.youtube.com/watch?v=${v.id}`).join('\n')}
${quotes.map((q) => `- "${q.text}" — ${q.author}${'role' in q ? `, ${q.role}` : ''}`).join('\n')}

---

${partsBlock}
`;
};

export const manifest = (): string =>
  JSON.stringify(
    {
      name: 'Mirpo Distribuidora de Peças para Motores',
      short_name: 'Mirpo',
      description: business.description,
      lang: 'pt-BR',
      start_url: '/',
      scope: '/',
      display: 'standalone',
      background_color: '#F1F3F7',
      theme_color: '#283378',
      icons: [
        { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
        { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      ],
    },
    null,
    2,
  );

/** Cabeçalhos para Cloudflare Workers (Static Assets) / Pages / Netlify. */
export const headersFile = (): string => `/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: SAMEORIGIN
  Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()
  Strict-Transport-Security: max-age=31536000; includeSubDomains

# Cópias em *.workers.dev (produção e Preview URLs) não entram no Google
https://:worker.:subdomain.workers.dev/*
  X-Robots-Tag: noindex

/video/*
  Cache-Control: public, max-age=31536000, immutable

/assets/*
  Cache-Control: public, max-age=31536000, immutable

/img/*
  Cache-Control: public, max-age=31536000, immutable

/fonts/*
  Cache-Control: public, max-age=31536000, immutable
  Access-Control-Allow-Origin: *

/og/*
  Cache-Control: public, max-age=604800

/llms.txt
  Content-Type: text/plain; charset=utf-8

/llms-full.txt
  Content-Type: text/plain; charset=utf-8
`;

/** Redirecionamentos das URLs antigas do WordPress. */
export const redirectsFile = (): string => `/home/                 /                 301
/feed/                 /                 301
/comments/feed/        /                 301
/2020/06/08/ola-mundo/ /                 301
/category/*            /                 301
/xmlrpc.php            /                 301
/fabricantes/          /fornecedores/    301
`;

/** .htaccess equivalente para hospedagem Apache (cPanel). */
export const htaccess = (): string => `# Mirpo — site estático
Options -Indexes
DirectoryIndex index.html
ErrorDocument 404 /404.html

<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteCond %{HTTPS} off
  RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
  RewriteCond %{HTTP_HOST} ^www\\.(.+)$ [NC]
  RewriteRule ^ https://%1%{REQUEST_URI} [L,R=301]
  RewriteRule ^home/?$ / [L,R=301]
  RewriteRule ^(comments/)?feed/?$ / [L,R=301]
  RewriteRule ^2020/06/08/ola-mundo/?$ / [L,R=301]
  RewriteRule ^category/ / [L,R=301]
  RewriteRule ^fabricantes/?$ /fornecedores/ [L,R=301]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^(.*[^/])$ /$1/ [L,R=301]
</IfModule>

<IfModule mod_headers.c>
  Header always set X-Content-Type-Options "nosniff"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
  Header always set X-Frame-Options "SAMEORIGIN"
  Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
  <FilesMatch "\\.(css|js|woff2|avif|webp)$">
    Header set Cache-Control "public, max-age=31536000, immutable"
  </FilesMatch>
  <FilesMatch "\\.(html|xml|txt|webmanifest)$">
    Header set Cache-Control "public, max-age=0, must-revalidate"
  </FilesMatch>
</IfModule>

<IfModule mod_mime.c>
  AddType image/avif .avif
  AddType image/webp .webp
  AddType font/woff2 .woff2
  AddType application/manifest+json .webmanifest
  AddCharset utf-8 .html .css .js .txt .xml .webmanifest
</IfModule>

<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css text/plain text/xml application/javascript application/json application/xml image/svg+xml application/manifest+json
</IfModule>
`;
