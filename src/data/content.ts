import { business, yearsActive } from './site.ts';
import type { QA } from './parts.ts';

const years = yearsActive();

export const homeFaq: QA[] = [
  {
    q: 'O que a Mirpo vende?',
    a: `A Mirpo é uma distribuidora de peças para motores em geral, linha leve e pesada. Trabalhamos com pistões, anéis de segmento, camisas de cilindro, bronzinas, buchas, arruelas de encosto, válvulas, guias e sedes de válvulas, comando de válvulas, tuchos, juntas, retentores, bombas de óleo, filtros, kits de motor e kits de distribuição.`,
  },
  {
    q: 'As peças da Mirpo são originais?',
    a: 'Sim. Trabalhamos somente com fabricantes reconhecidos do mercado de reposição, como MAHLE Metal Leve, KS Kolbenschmidt, Riosulense, Sabó, Eaton, Corteco, Schadek, Taranto, JS Bronzinas e Aplic Resolit, com nota fiscal e garantia de procedência.',
  },
  {
    q: 'A Mirpo vende para pessoa física?',
    a: 'Sim. Atendemos retíficas de motores, oficinas mecânicas, autopeças, concessionárias, seguradoras e locadoras, e também pessoas físicas com a indicação de um profissional do ramo, para garantir que a peça certa seja aplicada.',
  },
  {
    q: 'Quais linhas de veículos a Mirpo atende?',
    a: 'Linha leve (automóveis e utilitários), linha pesada e diesel (caminhões, ônibus, tratores e motores como MWM, Perkins, Scania, Mercedes-Benz e Cummins), carros antigos como os VW a ar, importados e motores de competição.',
  },
  {
    q: 'Como peço um orçamento?',
    a: `Pelo WhatsApp ${business.whatsapp.display}, pelo telefone ${business.phone.display}, pelo e-mail ${business.email} ou pelo formulário do site. Informe o veículo, o ano e o modelo do motor para agilizar a cotação.`,
  },
  {
    q: 'Onde fica a Mirpo e qual o horário de atendimento?',
    a: `Na ${business.address.street}, ${business.address.district}, ${business.address.city} – ${business.address.region}, CEP ${business.address.postalCode}. Atendemos de segunda a sexta, das 8h às 18h.`,
  },
  {
    q: 'Há quanto tempo a Mirpo existe?',
    a: `A Mirpo foi fundada em 25 de abril de 1968 e está há ${years} anos no mercado de reposição de peças para motores em São Paulo.`,
  },
];

export const counterfeitTips = [
  { icon: 'factory', title: 'Procedência', text: 'Verifique se a peça informa o fabricante e a origem de fabricação.' },
  { icon: 'tag', title: 'Preço', text: 'Desconfie de preços muito abaixo da média do mercado.' },
  { icon: 'store', title: 'Distribuidor', text: 'Compre de um distribuidor com referências e de confiança.' },
  { icon: 'box', title: 'Embalagem', text: 'Confira se a embalagem está lacrada e sem sinais de violação.' },
  { icon: 'receipt', title: 'Nota fiscal', text: 'Exija a nota fiscal da compra.' },
  { icon: 'barcode', title: 'Número de série', text: 'Procure o número de série ou o código de rastreio do fabricante.' },
] as const;

export const howWeWork = [
  {
    icon: 'shield',
    title: 'Peças originais',
    text: 'Somos conhecidos por atender com garantia, certificado de procedência e segurança para quem compra.',
  },
  {
    icon: 'box',
    title: 'Pronta entrega',
    text: 'O estoque é abastecido com frequência com as melhores marcas do mercado, para a entrega imediata das peças.',
  },
  {
    icon: 'tag',
    title: 'Transparência e preço justo',
    text: 'Soluções rápidas, preços competitivos e clareza sobre a procedência e a originalidade de cada peça.',
  },
  {
    icon: 'heart',
    title: 'Atendimento humano',
    text: 'Trocar uma peça do motor é um momento de transtorno. Nosso trabalho é transformá-lo em um processo rápido e tranquilo.',
  },
  {
    icon: 'grid',
    title: 'Variedade em um só lugar',
    text: 'Diversas opções para as linhas leve e diesel, para o cliente não precisar procurar a peça em várias lojas.',
  },
  {
    icon: 'users',
    title: 'Equipe especializada',
    text: 'Equipe capacitada e em constante atualização, com empatia e foco em resolver cada pedido. Sua segurança vem em primeiro lugar.',
  },
] as const;

export const mvv = [
  {
    title: 'Missão',
    text: 'Continuar sendo referência no ramo de motor com o profissionalismo e os princípios que seguimos desde 1968, evoluindo com a tecnologia e as novidades do mercado.',
  },
  {
    title: 'Visão',
    text: 'Oferecer peças para motores com segurança e garantia de procedência, e reduzir o desconforto do cliente na troca da peça com agilidade, empatia e conhecimento.',
  },
  {
    title: 'Valores',
    text: 'Transparência, integridade e respeito ao meio ambiente, à equipe, aos clientes e à sociedade. Ética, empatia e princípios estão presentes em tudo o que fazemos.',
  },
] as const;

export const timeline = [
  {
    year: '1968',
    title: 'Fundação',
    text: 'Em 25 de abril de 1968, a Mirpo começa a distribuir peças para motores em geral, linha leve e pesada, em São Paulo.',
    image: 'empresa/fachada-antiga.jpg',
    alt: 'Fachada antiga da Mirpo com o letreiro Auto Peças p/ Motores em Geral',
  },
  {
    year: '2018',
    title: '50 anos',
    text: 'Meio século de tradição comemorado com a equipe, os fundadores e os parceiros que construíram a história da empresa.',
    image: 'empresa/50-anos.jpg',
    alt: 'Fundadores da Mirpo cortando o bolo de 50 anos da empresa',
  },
  {
    year: 'Hoje',
    title: 'Referência em São Paulo',
    text: 'Reconhecida como uma das distribuidoras de autopeças mais tradicionais de São Paulo, com estoque à pronta entrega e as principais fabricantes do mercado.',
    image: 'banners/fachada-loja.jpg',
    alt: 'Fachada atual da loja Mirpo Peças para Motores em Geral na Alameda Barão de Limeira',
  },
] as const;

export const gallery = [
  { image: 'empresa/balcao-desde-1968.jpg', alt: 'Balcão de atendimento da Mirpo com o logotipo e a inscrição Desde 1968' },
  { image: 'empresa/memorial.jpg', alt: 'Parede com quadros e o uniforme histórico da Mirpo' },
  { image: 'empresa/estoque-1.jpg', alt: 'Corredor do estoque da Mirpo com prateleiras de peças' },
  { image: 'empresa/estoque-2.jpg', alt: 'Estoque de peças para motores organizado em prateleiras' },
  { image: 'empresa/estoque-3.jpg', alt: 'Prateleiras com caixas de peças originais' },
  { image: 'empresa/estoque-5.jpg', alt: 'Estoque de peças à pronta entrega' },
  { image: 'empresa/estoque-6.jpg', alt: 'Caixas de peças de motor no estoque da Mirpo' },
  { image: 'empresa/estoque-7.jpg', alt: 'Área de estoque da distribuidora Mirpo' },
] as const;

export const supplierGallery = [
  { image: 'fornecedores/curso-mahle-2019.jpg', caption: 'Treinamento MAHLE, 2019', alt: 'Equipe da Mirpo em treinamento técnico da MAHLE em 2019' },
  { image: 'fornecedores/visita-eaton-2019.jpg', caption: 'Visita à Eaton, novembro de 2019', alt: 'Equipe da Mirpo em visita à fábrica da Eaton em novembro de 2019' },
  { image: 'fornecedores/visita-riosulense-2019.jpg', caption: 'Visita à Riosulense, 2019', alt: 'Equipe da Mirpo em visita à fábrica da Riosulense em janeiro de 2019' },
  { image: 'fornecedores/visita-mahle-2019.jpg', caption: 'Visita à MAHLE, 2019', alt: 'Equipe da Mirpo em visita à MAHLE em 2019' },
  { image: 'fornecedores/riosulense-joao-stramosk.webp', caption: 'Com João Stramosk, da Riosulense', alt: 'Diretoria da Mirpo com João Stramosk, da Riosulense' },
  { image: 'fornecedores/mirpo-riosulense.jpg', caption: 'Mirpo e Riosulense', alt: 'Encontro entre a equipe da Mirpo e a Riosulense' },
  { image: 'fornecedores/cofap-historico.jpg', caption: 'Encontro com a Cofap', alt: 'Foto histórica de encontro da diretoria da Mirpo com a Cofap' },
] as const;

/** Reconhecimentos públicos de fabricantes (transcritos das imagens do site original). */
export const endorsements = [
  {
    source: 'MAHLE Aftermarket Brasil',
    image: 'fornecedores/post-mahle-visita-limeira.jpg',
    text: 'Esta semana recebemos no nosso Centro de Distribuição em Limeira a visita da Mirpo, uma das mais tradicionais distribuidoras de autopeças de São Paulo. Nosso parceiro é especializado em distribuição de peças para as linhas leve e pesada, e conta com os produtos da MAHLE para deixar o portfólio completo.',
  },
  {
    source: 'Eaton',
    image: 'fornecedores/post-eaton-day.jpg',
    text: "Eaton's Day na planta de São José dos Campos com nosso distribuidor autorizado, Auto Peças Mirpo, de São Paulo. Muito obrigado pela parceria!",
  },
] as const;
