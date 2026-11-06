/**
 * Dados institucionais da Mirpo — fonte única para páginas, schema.org,
 * sitemap, llms.txt e scripts do cliente.
 */

export const SITE_URL = 'https://mirpo.com.br';

export const business = {
  name: 'Mirpo Distribuidora',
  legalName: 'Mirpo Distribuidora de Peças para Motores',
  alternateNames: ['Mirpo', 'Auto Peças Mirpo', 'Mirpo Peças para Motores'],
  tagline: 'Distribuidor de peças para motores em geral',
  foundingDate: '1968-04-25',
  foundingYear: 1968,
  description:
    'Distribuidora de peças para motores em geral, linha leve e pesada, fundada em 1968 em São Paulo. Peças originais das principais fabricantes, à pronta entrega para retíficas, oficinas mecânicas, autopeças, concessionárias, seguradoras, locadoras e pessoas físicas.',
  address: {
    street: 'Alameda Barão de Limeira, 365',
    district: 'Campos Elíseos',
    city: 'São Paulo',
    region: 'SP',
    regionName: 'São Paulo',
    postalCode: '01202-001',
    country: 'BR',
  },
  geo: { lat: -23.537685, lng: -46.645722 },
  phone: { display: '(11) 3335-3544', e164: '+551133353544' },
  whatsapp: { display: '(11) 99666-1687', e164: '+5511996661687', number: '5511996661687' },
  email: 'vendas@mirpo.com.br',
  /** Dias: 1 = segunda … 5 = sexta (getDay) */
  hours: { days: [1, 2, 3, 4, 5], opens: '08:00', closes: '18:00', label: 'Segunda a sexta, das 8h às 18h' },
  social: {
    facebook: 'https://www.facebook.com/mirpodistribuidora',
    instagram: 'https://www.instagram.com/mirpodistribuidora/',
    linkedin: 'https://www.linkedin.com/company/mirpo-distribuidora/',
  },
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=Alameda+Bar%C3%A3o+de+Limeira%2C+365+-+Campos+El%C3%ADseos%2C+S%C3%A3o+Paulo+-+SP%2C+01202-001',
  mapsEmbed:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d646.6236756675883!2d-46.64572284959773!3d-23.537685160034307!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce5844753c33eb%3A0x57788946fbe1a89b!2sAlameda%20Bar%C3%A3o%20de%20Limeira%2C%20365%20-%20Campos%20El%C3%ADseos%2C%20S%C3%A3o%20Paulo%20-%20SP%2C%2001202-001!5e0!3m2!1spt-BR!2sbr!4v1591941013324!5m2!1spt-BR!2sbr',
  areaServed: ['São Paulo', 'Grande São Paulo', 'Brasil'],
  audiences: [
    'Retíficas de motores',
    'Oficinas mecânicas',
    'Autopeças (varejo)',
    'Concessionárias',
    'Seguradoras',
    'Locadoras',
    'Pessoas físicas com indicação de profissional do ramo',
  ],
} as const;

export const integrations = {
  /** Google Tag Manager do site original — carregado após interação/idle. */
  gtmId: 'GTM-5KSN5SF',
  googleSiteVerification: 'lhaDFAsvK_4zKgsGCAYMhQ-t8MhbhbCwBgNJ0p2jIOQ',
  /**
   * Endpoint opcional para o formulário (ex.: webhook n8n, Formspree).
   * Vazio = o formulário monta a mensagem e abre o WhatsApp/e-mail.
   */
  formEndpoint: '',
} as const;

export const yearsActive = (now = new Date()): number => {
  const founded = new Date(`${business.foundingDate}T00:00:00-03:00`);
  let years = now.getFullYear() - founded.getFullYear();
  const beforeAnniversary =
    now.getMonth() < founded.getMonth() ||
    (now.getMonth() === founded.getMonth() && now.getDate() < founded.getDate());
  if (beforeAnniversary) years -= 1;
  return years;
};

export const whatsappLink = (text = 'Olá! Vim pelo site da Mirpo e gostaria de um orçamento.'): string =>
  `https://wa.me/${business.whatsapp.number}?text=${encodeURIComponent(text)}`;

export interface Brand {
  slug: string;
  name: string;
  url: string;
  image: string;
}

export const brands: Brand[] = [
  { slug: 'mahle-metal-leve', name: 'MAHLE Metal Leve', url: 'https://www.mahle.com/pt/', image: 'marcas/mahle-metal-leve.jpg' },
  { slug: 'riosulense', name: 'Riosulense', url: 'https://rio.expert/', image: 'marcas/riosulense.jpg' },
  { slug: 'sabo', name: 'Sabó', url: 'https://www.sabo.com.br/', image: 'marcas/sabo.jpg' },
  { slug: 'eaton', name: 'Eaton', url: 'https://www.eaton.com/br/pt-br.html', image: 'marcas/eaton.jpg' },
  { slug: 'ks-kolbenschmidt', name: 'KS Kolbenschmidt', url: 'https://www.ms-motorservice.com/br/pt_br/empresa/nossas-marcas/kolbenschmidt', image: 'marcas/ks-kolbenschmidt.jpg' },
  { slug: 'aplic-resolit', name: 'Aplic Resolit', url: 'https://www.aplicresolit.com.br/', image: 'marcas/aplic-resolit.jpg' },
  { slug: 'corteco', name: 'Corteco', url: 'https://www.corteco.com.br/', image: 'marcas/corteco.jpg' },
  { slug: 'schadek', name: 'Schadek', url: 'https://www.schadek.com.br/', image: 'marcas/schadek.jpg' },
  { slug: 'taranto', name: 'Taranto', url: 'https://www.taranto.com.br/', image: 'marcas/taranto.jpg' },
  { slug: 'js-bronzinas', name: 'JS Bronzinas', url: 'http://www.jsbronzinas.com.br/', image: 'marcas/js-bronzinas.jpg' },
];

export interface Video {
  id: string;
  title: string;
  person?: string;
  company?: string;
  city?: string;
  uploadDate: string;
  durationSeconds: number;
  thumb: string;
}

export const institutionalVideo: Video = {
  id: 'VPPGQXHBKoM',
  title: 'Vídeo de apresentação da Mirpo',
  uploadDate: '2021-02-01T12:23:58-08:00',
  durationSeconds: 140,
  thumb: 'videos/VPPGQXHBKoM.jpg',
};

export const testimonialVideos: Video[] = [
  {
    id: '7sj8198phLQ',
    title: 'Depoimento de William, da Retífica WMC Cabeçotes Especiais',
    person: 'William',
    company: 'Retífica WMC Cabeçotes Especiais',
    city: 'São Paulo',
    uploadDate: '2020-06-16T05:08:13-07:00',
    durationSeconds: 61,
    thumb: 'videos/7sj8198phLQ.jpg',
  },
  {
    id: 'C5jmri4XTGA',
    title: 'Depoimento de Marcos, da Retífica Foco',
    person: 'Marcos',
    company: 'Retífica Foco',
    city: 'Jundiaí',
    uploadDate: '2020-06-16T05:16:50-07:00',
    durationSeconds: 205,
    thumb: 'videos/C5jmri4XTGA.jpg',
  },
  {
    id: 'HQoYJCUkNlA',
    title: 'Depoimento de José Luiz, da J.A Retífica de Motores e Peças',
    person: 'José Luiz',
    company: 'J.A Retífica de Motores e Peças',
    city: 'Barueri',
    uploadDate: '2020-06-16T05:12:56-07:00',
    durationSeconds: 77,
    thumb: 'videos/HQoYJCUkNlA.jpg',
  },
];

/** Depoimentos curtos transcritos dos balões do site original. */
export const quotes = [
  { text: 'Tudo que precisa de peças para caminhão com preço justo!', author: 'José Antônio' },
  { text: 'Bom atendimento, bons preços.', author: 'Daniel' },
  { text: 'Bom atendimento, entrega super rápida.', author: 'William Soares' },
  { text: 'Bom preço e entrega como combinado. Satisfação total.', author: 'Zedequias Nascimento' },
  { text: 'Ótimo atendimento.', author: 'Carlos Eduardo', role: 'Representante Metal Leve' },
  { text: 'Peças de qualidade e atendimento impecável.', author: 'Eduardo Silva' },
] as const;

/** Linhas de veículos atendidas (página de orçamento e home). */
export const vehicleLines = [
  {
    slug: 'linha-leve',
    name: 'Linha leve',
    icon: 'car',
    text: 'Automóveis e utilitários nacionais, com motores a gasolina, etanol e flex.',
  },
  {
    slug: 'linha-pesada',
    name: 'Linha pesada',
    icon: 'truck',
    text: 'Diesel para caminhões, ônibus, tratores e motores estacionários: MWM, Perkins, Scania, Mercedes-Benz, Cummins, VW e Ford.',
  },
  {
    slug: 'carros-antigos',
    name: 'Carros antigos',
    icon: 'classic',
    text: 'VW a ar (Fusca, Gol e Kombi) com motores de 1200 a 2300, Ford CHT (Corcel, Belina) e outros clássicos nacionais.',
  },
  {
    slug: 'importados-e-competicao',
    name: 'Importados e competição',
    icon: 'wheel',
    text: 'Peças para importados, incluindo Citroën e Peugeot, e para motores preparados de competição.',
  },
] as const;
