/** Builders de dados estruturados (schema.org, JSON-LD). */
import { SITE_URL, business, brands, type Video } from '../data/site.ts';
import { parts, partGroups, partsInGroup, type QA, type Part } from '../data/parts.ts';

export const ORG_ID = `${SITE_URL}/#empresa`;
export const SITE_ID = `${SITE_URL}/#site`;

const abs = (path: string): string => (path.startsWith('http') ? path : SITE_URL + path);

const isoDuration = (s: number): string => `PT${Math.floor(s / 60) ? `${Math.floor(s / 60)}M` : ''}${s % 60}S`;

export const organization = (images: { logo: string; photo: string }): Record<string, unknown> => ({
  '@context': 'https://schema.org',
  '@type': ['AutoPartsStore', 'Organization'],
  '@id': ORG_ID,
  name: business.name,
  legalName: business.legalName,
  alternateName: business.alternateNames,
  slogan: 'Peças para motores em geral, linha leve e pesada, desde 1968',
  description: business.description,
  url: `${SITE_URL}/`,
  logo: { '@type': 'ImageObject', url: abs(images.logo), width: 512, height: 512 },
  image: abs(images.photo),
  foundingDate: business.foundingDate,
  foundingLocation: { '@type': 'Place', name: 'São Paulo, SP, Brasil' },
  telephone: business.phone.e164,
  email: business.email,
  address: {
    '@type': 'PostalAddress',
    streetAddress: business.address.street,
    addressLocality: business.address.city,
    addressRegion: business.address.region,
    postalCode: business.address.postalCode,
    addressCountry: business.address.country,
  },
  geo: { '@type': 'GeoCoordinates', latitude: business.geo.lat, longitude: business.geo.lng },
  hasMap: business.mapsUrl,
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: business.hours.opens,
      closes: business.hours.closes,
    },
  ],
  contactPoint: [
    {
      '@type': 'ContactPoint',
      contactType: 'sales',
      telephone: business.phone.e164,
      email: business.email,
      areaServed: 'BR',
      availableLanguage: 'pt-BR',
      hoursAvailable: { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: business.hours.opens, closes: business.hours.closes },
    },
    {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      name: 'WhatsApp',
      telephone: business.whatsapp.e164,
      url: `https://wa.me/${business.whatsapp.number}`,
      areaServed: 'BR',
      availableLanguage: 'pt-BR',
    },
  ],
  areaServed: business.areaServed.map((name) => ({ '@type': name === 'Brasil' ? 'Country' : 'AdministrativeArea', name })),
  sameAs: Object.values(business.social),
  knowsAbout: [
    'Peças para motores',
    'Retífica de motores',
    'Motores diesel',
    'Motores VW a ar',
    ...parts.map((p) => p.name),
  ],
  brand: brands.map((b) => ({ '@type': 'Brand', name: b.name, url: b.url })),
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Peças para motores',
    url: `${SITE_URL}/pecas-de-motores/`,
    itemListElement: partGroups.map((g) => ({
      '@type': 'OfferCatalog',
      name: g.name,
      itemListElement: partsInGroup(g.slug).map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: p.name,
        url: `${SITE_URL}/${p.slug}/`,
      })),
    })),
  },
  audience: { '@type': 'BusinessAudience', audienceType: business.audiences.join(', ') },
});

export const website = (): Record<string, unknown> => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': SITE_ID,
  url: `${SITE_URL}/`,
  name: 'Mirpo',
  alternateName: business.name,
  inLanguage: 'pt-BR',
  publisher: { '@id': ORG_ID },
});

export interface Crumb {
  name: string;
  path: string;
}

export const breadcrumb = (crumbs: Crumb[]): Record<string, unknown> => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: abs(c.path) })),
});

export const webPage = (o: {
  path: string;
  title: string;
  description: string;
  type?: string;
  image?: string;
  about?: Record<string, unknown>;
  modified: string;
}): Record<string, unknown> => ({
  '@context': 'https://schema.org',
  '@type': o.type ?? 'WebPage',
  '@id': `${abs(o.path)}#pagina`,
  url: abs(o.path),
  name: o.title,
  description: o.description,
  inLanguage: 'pt-BR',
  isPartOf: { '@id': SITE_ID },
  publisher: { '@id': ORG_ID },
  about: o.about ?? { '@id': ORG_ID },
  primaryImageOfPage: o.image ? { '@type': 'ImageObject', url: abs(o.image) } : undefined,
  dateModified: o.modified,
});

export const faqPage = (qas: QA[]): Record<string, unknown> => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: qas.map((x) => ({
    '@type': 'Question',
    name: x.q,
    acceptedAnswer: { '@type': 'Answer', text: x.a },
  })),
});

export const videoObject = (v: Video, thumb: string, description: string): Record<string, unknown> => ({
  '@context': 'https://schema.org',
  '@type': 'VideoObject',
  name: v.title,
  description,
  thumbnailUrl: [abs(thumb), `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`],
  uploadDate: v.uploadDate,
  duration: isoDuration(v.durationSeconds),
  embedUrl: `https://www.youtube-nocookie.com/embed/${v.id}`,
  url: `https://www.youtube.com/watch?v=${v.id}`,
  inLanguage: 'pt-BR',
  publisher: { '@id': ORG_ID },
});

export const partTerm = (p: Part): Record<string, unknown> => ({
  '@type': 'DefinedTerm',
  '@id': `${SITE_URL}/${p.slug}/#termo`,
  name: p.name,
  description: p.definition,
  url: `${SITE_URL}/${p.slug}/`,
  inDefinedTermSet: `${SITE_URL}/pecas-de-motores/#glossario`,
});

export const glossary = (): Record<string, unknown> => ({
  '@context': 'https://schema.org',
  '@type': 'DefinedTermSet',
  '@id': `${SITE_URL}/pecas-de-motores/#glossario`,
  name: 'Glossário de peças para motores',
  inLanguage: 'pt-BR',
  hasDefinedTerm: parts.map(partTerm),
});

export const itemList = (name: string, items: { name: string; path: string }[]): Record<string, unknown> => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name,
  numberOfItems: items.length,
  itemListElement: items.map((x, i) => ({ '@type': 'ListItem', position: i + 1, name: x.name, url: abs(x.path) })),
});
