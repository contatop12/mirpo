/**
 * Catálogo de linhas de peças. Cada linha gera uma página em /<slug>/
 * (mesmas URLs do site original, preservando o histórico de SEO).
 */

export interface QA {
  q: string;
  a: string;
}

export type GroupSlug = 'conjunto-movel' | 'cabecote' | 'vedacao-lubrificacao' | 'kits';

export interface Part {
  slug: string;
  name: string;
  /** Forma usada em frases: "precisa de {lower}?" */
  lower: string;
  group: GroupSlug;
  /** Função em uma linha (tooltip do motor, cartões, listas). */
  short: string;
  title: string;
  description: string;
  lede: string;
  question: string;
  definition: string;
  facts: [string, string, string];
  faq: QA[];
  image: string;
  imageAlt: string;
  keywords: string[];
}

export const partGroups: { slug: GroupSlug; name: string; text: string }[] = [
  { slug: 'conjunto-movel', name: 'Bloco e conjunto móvel', text: 'O que trabalha dentro do bloco, do pistão ao virabrequim.' },
  { slug: 'cabecote', name: 'Cabeçote e válvulas', text: 'O que controla a entrada de ar e a saída dos gases.' },
  { slug: 'vedacao-lubrificacao', name: 'Vedação, lubrificação e filtragem', text: 'O que mantém o óleo limpo, sob pressão e dentro do motor.' },
  { slug: 'kits', name: 'Kits', text: 'Conjuntos completos, na mesma medida, para retífica e manutenção.' },
];

export const parts: Part[] = [
  {
    slug: 'pistoes',
    name: 'Pistões',
    lower: 'pistões',
    group: 'conjunto-movel',
    short: 'Recebem a força da combustão e a transmitem à biela.',
    title: 'Pistões para motores linha leve e diesel | Mirpo',
    description:
      'Pistões originais para motores da linha leve e pesada, à pronta entrega em São Paulo. Peça seu orçamento na Mirpo, distribuidora de peças desde 1968.',
    lede: 'Pistões das principais fabricantes para motores a gasolina, flex e diesel, em medida standard e de reparo.',
    question: 'O que é o pistão do motor?',
    definition:
      'O pistão é a peça cilíndrica, normalmente de liga de alumínio, que se move em vaivém dentro do cilindro. Ele recebe a pressão da expansão dos gases queimados e a transmite, pelo pino e pela biela, ao virabrequim, que transforma esse movimento em rotação.',
    facts: [
      'A vedação entre o pistão e o cilindro é feita pelos anéis de segmento, montados nas canaletas do pistão.',
      'Pistão, anéis, pino e camisa trabalham como conjunto. Na retífica, a troca em kit garante as folgas de montagem.',
      'Riscos na saia, canaletas gastas ou marcas de batida na cabeça indicam que o pistão precisa ser substituído.',
    ],
    faq: [
      {
        q: 'Do que é feito um pistão de motor?',
        a: 'A maioria dos pistões automotivos é fundida ou forjada em liga de alumínio e silício, que combina baixo peso, boa condução de calor e resistência ao desgaste.',
      },
      {
        q: 'Quando trocar os pistões?',
        a: 'Na retífica do motor ou quando há consumo de óleo, perda de compressão, ruído de batida ou danos visíveis na cabeça e na saia. A medida (standard ou de reparo) depende do diâmetro do cilindro depois da usinagem.',
      },
    ],
    image: 'pecas/pistoes.jpg',
    imageAlt: 'Conjunto de pistões e bielas montados em um virabrequim',
    keywords: ['pistão de motor', 'pistões', 'pistão diesel', 'pistão sobremedida', 'pistão MAHLE', 'pistão KS'],
  },
  {
    slug: 'aneis-de-segmento',
    name: 'Anéis de segmento',
    lower: 'anéis de segmento',
    group: 'conjunto-movel',
    short: 'Vedam a compressão e controlam o óleo na parede do cilindro.',
    title: 'Anéis de segmento para pistão | Mirpo São Paulo',
    description:
      'Jogos de anéis de segmento para motores leves e diesel, das melhores marcas e com procedência garantida. Orçamento rápido na Mirpo, em São Paulo.',
    lede: 'Jogos de anéis de compressão e de óleo para motores leves e diesel, em medida standard e de reparo.',
    question: 'O que são anéis de segmento?',
    definition:
      'Os anéis de segmento são anéis metálicos abertos, montados nas canaletas do pistão. Eles fazem o contato entre o pistão e a parede do cilindro: vedam a compressão, levam o calor do pistão para o cilindro e controlam a película de óleo, impedindo que ele chegue à câmara de combustão.',
    facts: [
      'O anel de compressão veda a pressão da combustão sobre a parede do cilindro e ajuda a manter a potência do motor.',
      'Os anéis conduzem o calor do pistão para o cilindro, o que controla a temperatura e evita que o pistão funda.',
      'O anel de óleo raspa o excesso de lubrificante da parede. Quando ele falha, o motor passa a queimar óleo.',
    ],
    faq: [
      {
        q: 'Quantos anéis tem um pistão?',
        a: 'Na maioria dos motores, três: dois anéis de compressão e um anel de óleo. Cada um tem formato e função próprios e deve ser montado na posição e com a face indicadas pelo fabricante.',
      },
      {
        q: 'Quais os sintomas de anel de segmento gasto?',
        a: 'Fumaça azulada no escapamento, consumo de óleo acima do normal, perda de compressão e de potência e aumento da pressão no cárter.',
      },
    ],
    image: 'pecas/aneis-de-segmento.jpg',
    imageAlt: 'Jogo de anéis de segmento de pistão',
    keywords: ['anel de segmento', 'anéis de pistão', 'jogo de anéis', 'anel de compressão', 'anel de óleo'],
  },
  {
    slug: 'camisas-de-cilindro',
    name: 'Camisas de cilindro',
    lower: 'camisas de cilindro',
    group: 'conjunto-movel',
    short: 'Formam a parede onde o pistão desliza e recuperam o bloco.',
    title: 'Camisas de cilindro para motores | Mirpo São Paulo',
    description:
      'Camisas de cilindro secas e úmidas para motores leves e diesel, à pronta entrega. Peças originais para retífica com orçamento rápido na Mirpo.',
    lede: 'Camisas secas e úmidas para retífica de blocos leves e diesel. O principal item para recuperar o bloco do motor.',
    question: 'O que é a camisa de cilindro?',
    definition:
      'A camisa de cilindro é um tubo de ferro fundido encaixado no bloco do motor, que forma a superfície onde o pistão e os anéis deslizam. Ela resiste ao atrito e ao calor da combustão, ajuda na troca de calor com o sistema de arrefecimento e, em muitos motores, permite recuperar o bloco na retífica sem trocá-lo.',
    facts: [
      'Existem camisas secas, prensadas no bloco, e úmidas, em contato direto com o líquido de arrefecimento, comuns nos motores diesel.',
      'Trincas, riscos profundos ou ovalização são visíveis e exigem a substituição imediata da camisa.',
      'Nas camisas úmidas, a montagem errada dos anéis de vedação pode danificar a camisa e misturar água ao óleo.',
    ],
    faq: [
      {
        q: 'Qual a diferença entre camisa seca e camisa úmida?',
        a: 'A camisa seca fica envolvida pelo bloco e não tem contato com o líquido de arrefecimento. A camisa úmida forma a própria parede da galeria de água e é vedada por anéis de borracha; é mais comum em motores diesel e facilita a troca.',
      },
      {
        q: 'Quando é preciso encamisar o bloco?',
        a: 'Quando o cilindro já foi usinado até a última medida de reparo ou tem danos que a retífica não corrige. A camisa nova devolve ao cilindro a medida original.',
      },
    ],
    image: 'pecas/camisas-de-cilindro.jpg',
    imageAlt: 'Camisa de cilindro de motor em ferro fundido',
    keywords: ['camisa de cilindro', 'camisa de motor', 'camisa úmida', 'camisa seca', 'encamisar bloco'],
  },
  {
    slug: 'bronzinas',
    name: 'Bronzinas',
    lower: 'bronzinas',
    group: 'conjunto-movel',
    short: 'Mancais de deslizamento do virabrequim e das bielas.',
    title: 'Bronzinas de biela e de mancal | Mirpo São Paulo',
    description:
      'Bronzinas de biela e de mancal em medida standard e de reparo, para motores leves e diesel. Procedência garantida e orçamento rápido na Mirpo.',
    lede: 'Bronzinas de biela e de mancal, em medida standard e de reparo, para motores leves e diesel.',
    question: 'O que são bronzinas?',
    definition:
      'Bronzinas, também chamadas de casquilhos, são capas semicirculares que formam os mancais do virabrequim e das bielas. Elas reduzem o atrito entre as partes que giram, suportam a carga da combustão e, junto com a película de óleo, mantêm o virabrequim e as bielas na posição correta.',
    facts: [
      'As bronzinas de mancal apoiam o virabrequim no bloco; as de biela ligam a biela ao moente do virabrequim.',
      'Bronzina danificada não tem reparo: a solução é a troca, com a medição do virabrequim para escolher a medida certa.',
      'Peças sem procedência podem ter liga e espessura fora de especificação, o que derruba a pressão de óleo e reduz a potência do motor.',
    ],
    faq: [
      {
        q: 'O que causa desgaste nas bronzinas?',
        a: 'Falta de lubrificação, óleo contaminado ou vencido, sujeira na montagem e virabrequim fora de medida. Os sintomas mais comuns são a queda da pressão de óleo e o ruído metálico grave conhecido como batida de biela.',
      },
      {
        q: 'Bronzina tem medida?',
        a: 'Sim. Além da medida standard, existem bronzinas em medidas de reparo (0,25 mm, 0,50 mm e outras) para virabrequins retificados. A medida certa é definida depois da usinagem e da medição dos colos.',
      },
    ],
    image: 'pecas/bronzinas.jpg',
    imageAlt: 'Jogo de bronzinas de biela e de mancal',
    keywords: ['bronzina', 'bronzina de biela', 'bronzina de mancal', 'casquilho', 'bronzina 0,25'],
  },
  {
    slug: 'buchas-de-biela',
    name: 'Buchas de biela',
    lower: 'buchas de biela',
    group: 'conjunto-movel',
    short: 'Revestem o olhal da biela onde trabalha o pino do pistão.',
    title: 'Buchas de biela para motores | Mirpo São Paulo',
    description:
      'Buchas de biela para motores leves e diesel, com garantia de procedência. Protegem a biela e reduzem o atrito com o pino do pistão. Orçamento na Mirpo.',
    lede: 'Buchas para o pé da biela, que protegem a biela e reduzem o atrito com o pino do pistão.',
    question: 'O que é a bucha de biela?',
    definition:
      'A bucha de biela é um anel de bronze, ou de aço com revestimento antifricção, prensado no olhal menor da biela, o pé da biela. É nela que trabalha o pino do pistão: a bucha reduz o atrito, suporta o impacto da combustão e protege a biela contra o desgaste.',
    facts: [
      'Protege a biela e reduz o atrito com o pino do pistão.',
      'Garante resistência aos impactos gerados a cada ciclo de combustão do motor.',
      'É feita de material macio e resistente ao desgaste, que depende de boa lubrificação para durar.',
    ],
    faq: [
      {
        q: 'Quando trocar a bucha de biela?',
        a: 'Na retífica do motor ou quando há folga entre o pino e a bucha. A folga excessiva provoca ruído metálico e pode danificar o pino e o pistão. Depois de prensada, a bucha é usinada na medida do pino.',
      },
    ],
    image: 'pecas/buchas-de-biela.jpg',
    imageAlt: 'Buchas de biela de bronze',
    keywords: ['bucha de biela', 'bucha do pé de biela', 'bucha de bronze biela', 'pino do pistão'],
  },
  {
    slug: 'arruelas-de-encosto',
    name: 'Arruelas de encosto',
    lower: 'arruelas de encosto',
    group: 'conjunto-movel',
    short: 'Controlam a folga axial do virabrequim.',
    title: 'Arruelas de encosto do virabrequim | Mirpo São Paulo',
    description:
      'Arruelas de encosto em medida standard e de reparo para ajustar a folga axial do virabrequim. Linha leve e pesada à pronta entrega na Mirpo.',
    lede: 'Arruelas de encosto que ajustam o virabrequim no mancal e reduzem a folga axial do eixo.',
    question: 'O que são arruelas de encosto?',
    definition:
      'As arruelas de encosto são meias-luas metálicas com revestimento antifricção, montadas junto a um dos mancais do virabrequim. Elas limitam o deslocamento do virabrequim no sentido do próprio eixo, a folga axial, e absorvem o esforço transmitido pelo acionamento da embreagem.',
    facts: [
      'Absorvem o impacto causado no motor a cada acionamento do pedal da embreagem.',
      'Devem ser trocadas sempre que as bronzinas de mancal forem trocadas.',
      'Existem arruelas em medidas de reparo, para virabrequins retificados na face de encosto.',
    ],
    faq: [
      {
        q: 'O que acontece quando a arruela de encosto se desgasta?',
        a: 'A folga axial do virabrequim aumenta. Isso pode causar ruído ao pisar na embreagem e desgaste do bloco e do virabrequim. Em casos graves, a arruela se solta dentro do cárter.',
      },
    ],
    image: 'pecas/arruelas-de-encosto.jpg',
    imageAlt: 'Arruelas de encosto do virabrequim em formato de meia-lua',
    keywords: ['arruela de encosto', 'arruela do virabrequim', 'folga axial virabrequim', 'meia-lua virabrequim'],
  },
  {
    slug: 'valvulas',
    name: 'Válvulas',
    lower: 'válvulas',
    group: 'cabecote',
    short: 'Abrem e fecham a passagem de ar e de gases na câmara.',
    title: 'Válvulas de admissão e escape | Mirpo São Paulo',
    description:
      'Válvulas de admissão e de escape para motores leves, diesel e antigos. Peças originais à pronta entrega e orçamento rápido na Mirpo, desde 1968.',
    lede: 'Válvulas de admissão e de escape para motores atuais e antigos, leves e diesel.',
    question: 'O que são as válvulas do motor?',
    definition:
      'As válvulas ficam no cabeçote e controlam a entrada de ar ou de mistura ar-combustível (válvulas de admissão) e a saída dos gases queimados (válvulas de escape). Elas abrem acionadas pelo comando de válvulas e fecham pela força das molas, vedando a câmara de combustão contra as sedes.',
    facts: [
      'As válvulas de escape expulsam os gases do cilindro e trabalham em temperatura muito mais alta, por isso usam ligas especiais.',
      'Em motores antigos, a troca deve ser feita com mais regularidade por causa do desgaste acumulado ao longo do tempo.',
      'Válvulas não devem ser reaproveitadas nem usinadas além do limite indicado pelo fabricante.',
    ],
    faq: [
      {
        q: 'Quais os sintomas de válvula com defeito?',
        a: 'Perda de compressão em um ou mais cilindros, falhas e marcha lenta irregular, perda de potência, estouros na admissão ou no escapamento e aumento do consumo.',
      },
      {
        q: 'A Mirpo tem válvulas para carros antigos?',
        a: 'Sim. Além das aplicações atuais, temos válvulas para motores nacionais antigos. Informe o veículo, o ano e o motor no pedido de orçamento.',
      },
    ],
    image: 'pecas/valvulas.jpg',
    imageAlt: 'Válvulas de admissão e escape de motor',
    keywords: ['válvula de motor', 'válvula de admissão', 'válvula de escape', 'válvula cabeçote', 'válvula carro antigo'],
  },
  {
    slug: 'guias-de-valvulas',
    name: 'Guias de válvulas',
    lower: 'guias de válvulas',
    group: 'cabecote',
    short: 'Guiam a haste da válvula e a mantêm centrada na sede.',
    title: 'Guias de válvulas para cabeçote | Mirpo São Paulo',
    description:
      'Guias de válvulas de ferro fundido e bronze para cabeçotes de motores leves e diesel. Procedência garantida e orçamento rápido na Mirpo.',
    lede: 'Guias de ferro fundido e de bronze para cabeçotes de motores leves e diesel.',
    question: 'O que é a guia de válvula?',
    definition:
      'A guia de válvula é uma bucha cilíndrica, de ferro fundido ou bronze, instalada no cabeçote. Ela guia o movimento da haste da válvula, mantém a válvula centrada na sede e ajuda a dissipar o calor da válvula para o cabeçote.',
    facts: [
      'Geralmente é fabricada em ligas especiais de ferro fundido ou de bronze.',
      'Mantém o alinhamento do conjunto para que a válvula vede a câmara de combustão.',
      'Depois da instalação, é essencial conferir a folga entre a guia e a haste da válvula.',
    ],
    faq: [
      {
        q: 'O que acontece quando a guia de válvula está gasta?',
        a: 'A válvula perde o alinhamento com a sede e passa a vedar mal. O motor pode consumir óleo pela folga da haste, soltar fumaça na partida e perder compressão.',
      },
    ],
    image: 'pecas/guias-de-valvulas.jpg',
    imageAlt: 'Guias de válvulas para cabeçote de motor',
    keywords: ['guia de válvula', 'guia de válvula bronze', 'guia cabeçote', 'folga guia de válvula'],
  },
  {
    slug: 'sedes-de-valvulas',
    name: 'Sedes de válvulas',
    lower: 'sedes de válvulas',
    group: 'cabecote',
    short: 'Anéis do cabeçote onde a válvula assenta e veda.',
    title: 'Sedes de válvulas para cabeçote | Mirpo São Paulo',
    description:
      'Sedes de válvulas de admissão e escape para retífica de cabeçotes leves e diesel. Garanta o assentamento perfeito das válvulas. Orçamento na Mirpo.',
    lede: 'Sedes de admissão e de escape para o assentamento perfeito das válvulas no cabeçote.',
    question: 'O que é a sede de válvula?',
    definition:
      'A sede de válvula é o anel de material resistente encaixado no cabeçote, sobre o qual a válvula se apoia ao fechar. O contato entre o ângulo da válvula e o ângulo da sede veda a câmara de combustão durante a compressão e a explosão e transfere o calor da válvula para o cabeçote.',
    facts: [
      'A sede recebe o impacto da válvula a cada um dos ciclos constantes de abertura e fechamento.',
      'Sujeira e carvão entre os dois ângulos causam desgaste e podem romper a sede; por isso a revisão periódica é importante.',
      'A troca depende do estado de cada motor, do esforço e das altas temperaturas a que ele foi submetido.',
    ],
    faq: [
      {
        q: 'Quando trocar a sede de válvula?',
        a: 'Quando ela está trincada, solta, queimada ou já foi retificada além do limite. Na troca, a sede é usinada para manter a altura correta da válvula e o ângulo de vedação.',
      },
    ],
    image: 'pecas/sedes-de-valvulas.png',
    imageAlt: 'Sedes de válvulas para cabeçote',
    keywords: ['sede de válvula', 'sede de válvula cabeçote', 'retífica de cabeçote', 'assentamento de válvula'],
  },
  {
    slug: 'comando-de-valvulas',
    name: 'Comando de válvulas',
    lower: 'comando de válvulas',
    group: 'cabecote',
    short: 'Eixo de ressaltos que define quando e quanto as válvulas abrem.',
    title: 'Comando de válvulas (eixo de comando) | Mirpo SP',
    description:
      'Eixos de comando de válvulas para motores leves e diesel, com garantia de procedência. Controle total da entrada e saída de gases. Orçamento na Mirpo.',
    lede: 'Eixos de comando para motores leves e diesel. Controle preciso da entrada e da saída de gases dos cilindros.',
    question: 'O que é o comando de válvulas?',
    definition:
      'O comando de válvulas, também chamado de árvore de comando ou eixo de comando, é um eixo com ressaltos que abrem as válvulas no momento certo. Sincronizado com o virabrequim pela correia ou corrente de distribuição, ele determina por quanto tempo e com que intensidade o ar entra e os gases saem dos cilindros.',
    facts: [
      'É considerado o maestro do motor: o desenho dos ressaltos define o comportamento e o desempenho do motor.',
      'O momento de abertura e de fechamento das válvulas é vital. Qualquer desajuste provoca perda de desempenho.',
      'Em caso de desgaste, a recomendação é substituir o conjunto: eixo, tuchos e balancins.',
    ],
    faq: [
      {
        q: 'Quais os sintomas de comando de válvulas gasto?',
        a: 'Ruído de batida no cabeçote, perda de potência, marcha lenta irregular e aumento do consumo. Ressaltos gastos reduzem a abertura das válvulas.',
      },
      {
        q: 'Preciso trocar os tuchos junto com o comando?',
        a: 'É o recomendado. Comando e tuchos trabalham em contato direto e se desgastam juntos; montar um comando novo com tuchos usados reduz a vida útil das peças novas.',
      },
    ],
    image: 'pecas/comando-de-valvulas.jpg',
    imageAlt: 'Eixo de comando de válvulas com ressaltos',
    keywords: ['comando de válvulas', 'eixo de comando', 'árvore de comando', 'comando de válvula diesel'],
  },
  {
    slug: 'buchas-de-comando',
    name: 'Buchas de comando',
    lower: 'buchas de comando',
    group: 'cabecote',
    short: 'Mancais onde o eixo de comando gira.',
    title: 'Buchas de comando (bronzinas de comando) | Mirpo',
    description:
      'Buchas e bronzinas de comando de válvulas para motores leves e diesel. Reduzem o atrito e o ruído do eixo de comando. Orçamento rápido na Mirpo.',
    lede: 'Buchas, ou bronzinas, de comando que protegem o eixo de comando de válvulas e reduzem o atrito.',
    question: 'O que são as buchas de comando?',
    definition:
      'As buchas de comando, também chamadas de bronzinas de comando, são os mancais onde o eixo de comando de válvulas se apoia e gira. Elas reduzem o atrito entre o eixo e o bloco ou o cabeçote e suportam as cargas transmitidas pela abertura das válvulas.',
    facts: [
      'Reduzem o atrito entre a parte móvel do motor, o eixo de comando, e a parte fixa a que ele está ligado.',
      'Resistem a cargas altas e aos impactos transmitidos pela combustão e pelo acionamento das válvulas.',
      'Também reduzem vibração e ruído. Buchas gastas derrubam a pressão de óleo e deixam o motor mais barulhento.',
    ],
    faq: [
      {
        q: 'Bucha de comando e bronzina de comando são a mesma peça?',
        a: 'Sim. Os dois nomes são usados no mercado para o mancal de deslizamento do eixo de comando de válvulas.',
      },
    ],
    image: 'pecas/buchas-de-comando.jpg',
    imageAlt: 'Buchas de comando de válvulas',
    keywords: ['bucha de comando', 'bronzina de comando', 'mancal do comando de válvulas'],
  },
  {
    slug: 'tuchos',
    name: 'Tuchos',
    lower: 'tuchos',
    group: 'cabecote',
    short: 'Transmitem o movimento do comando para as válvulas.',
    title: 'Tuchos hidráulicos e mecânicos | Mirpo São Paulo',
    description:
      'Tuchos hidráulicos e mecânicos para motores leves e diesel. Funcionamento silencioso e preciso do cabeçote, com procedência garantida. Orçamento na Mirpo.',
    lede: 'Tuchos hidráulicos e mecânicos para o funcionamento silencioso e preciso do cabeçote.',
    question: 'O que são tuchos?',
    definition:
      'Os tuchos ficam entre o comando de válvulas e as válvulas, ou entre o comando e as varetas e balancins. Eles transformam o giro dos ressaltos do comando em movimento linear de abertura das válvulas. Os tuchos hidráulicos ajustam a folga automaticamente; os mecânicos exigem regulagem.',
    facts: [
      'Tuchos mecânicos devem ser regulados com a folga predeterminada pelo fabricante do motor.',
      'Tuchos hidráulicos têm um êmbolo interno que, com a pressão do óleo, elimina a folga e deixa o motor mais silencioso.',
      'O ruído no cabeçote costuma vir dos tuchos, mas também pode indicar desgaste do comando ou falta de lubrificação.',
    ],
    faq: [
      {
        q: 'O que é barulho de tucho?',
        a: 'É um estalo rápido e ritmado no cabeçote, mais forte com o motor frio ou em marcha lenta. Pode vir de tucho hidráulico com defeito, de óleo baixo ou inadequado ou de folga excessiva em tuchos mecânicos.',
      },
    ],
    image: 'pecas/tuchos.jpg',
    imageAlt: 'Tuchos hidráulicos de motor',
    keywords: ['tucho', 'tucho hidráulico', 'tucho mecânico', 'barulho de tucho', 'tuchos de válvula'],
  },
  {
    slug: 'juntas-de-motor',
    name: 'Juntas de motor',
    lower: 'juntas de motor',
    group: 'vedacao-lubrificacao',
    short: 'Vedam as uniões do motor contra vazamento de gases e fluidos.',
    title: 'Juntas de motor e junta do cabeçote | Mirpo SP',
    description:
      'Juntas de cabeçote, jogos de juntas e vedações para motores leves e diesel. Principal item de vedação do motor, à pronta entrega na Mirpo.',
    lede: 'Juntas de cabeçote, jogos completos e vedações para motores leves e diesel.',
    question: 'O que são juntas de motor?',
    definition:
      'As juntas de motor vedam as superfícies de contato entre as peças do motor, como cabeçote e bloco, cárter, tampa de válvulas e coletores. Elas preenchem as pequenas irregularidades entre as faces e suportam pressão, temperatura e contato com óleo, combustível e líquido de arrefecimento.',
    facts: [
      'A junta precisa de alta fixação para unir as peças e preencher as imperfeições das superfícies do motor.',
      'As juntas têm alta resistência química e à temperatura, porque trabalham em contato com substâncias corrosivas e quentes.',
      'A junta do cabeçote é a mais exigida: veda ao mesmo tempo a combustão, o líquido de arrefecimento e o óleo.',
    ],
    faq: [
      {
        q: 'Quais os sintomas de junta do cabeçote queimada?',
        a: 'Superaquecimento, perda de líquido de arrefecimento sem vazamento aparente, óleo com aspecto de maionese, fumaça branca no escapamento e bolhas no reservatório de água.',
      },
      {
        q: 'Posso reaproveitar a junta do cabeçote?',
        a: 'Não. A junta se deforma no aperto para vedar e perde essa capacidade depois de usada. Monte sempre uma junta nova, com o torque e a sequência de aperto do fabricante.',
      },
    ],
    image: 'pecas/juntas-de-motor.jpg',
    imageAlt: 'Jogo de juntas de motor e junta do cabeçote',
    keywords: ['junta de motor', 'junta do cabeçote', 'jogo de juntas', 'junta de cárter', 'junta tampa de válvula'],
  },
  {
    slug: 'retentores',
    name: 'Retentores',
    lower: 'retentores',
    group: 'vedacao-lubrificacao',
    short: 'Vedam os eixos que giram e impedem o vazamento de óleo.',
    title: 'Retentores para motores e válvulas | Mirpo São Paulo',
    description:
      'Retentores de virabrequim, de comando e de válvula para motores leves e diesel. Vedação de óleo e graxa com peças originais. Orçamento na Mirpo.',
    lede: 'Retentores de virabrequim, de comando e de válvula para vedar óleo, graxa e impurezas.',
    question: 'O que são retentores?',
    definition:
      'Retentores são vedadores de borracha com armação metálica que vedam eixos em movimento, como o virabrequim, o comando de válvulas e as hastes das válvulas. Eles mantêm o óleo e a graxa dentro do motor e impedem a entrada de poeira e de impurezas.',
    facts: [
      'Os retentores têm um lábio de vedação que impede a entrada de impurezas vindas de fora do motor.',
      'O lábio é a parte mais sensível da peça e deve ser manuseado com cautela na montagem: um corte ou dobra causa vazamento.',
      'Retentores nunca devem ser reaproveitados.',
    ],
    faq: [
      {
        q: 'Como saber se o retentor está vazando?',
        a: 'Manchas de óleo sob o veículo, sujeira oleosa ao redor da polia do virabrequim ou entre o motor e o câmbio e queda no nível de óleo entre as trocas são os sinais mais comuns.',
      },
    ],
    image: 'pecas/retentores.jpg',
    imageAlt: 'Retentores de borracha para motor',
    keywords: ['retentor', 'retentor de virabrequim', 'retentor de válvula', 'retentor de comando', 'vedador de haste'],
  },
  {
    slug: 'bomba-de-oleo',
    name: 'Bombas de óleo',
    lower: 'bombas de óleo',
    group: 'vedacao-lubrificacao',
    short: 'Fazem o óleo circular sob pressão por todo o motor.',
    title: 'Bomba de óleo para motores leves e diesel | Mirpo',
    description:
      'Bombas de óleo para motores da linha leve e pesada. Responsável pela lubrificação de todas as partes móveis do motor. Orçamento rápido na Mirpo.',
    lede: 'Bombas de óleo para a linha leve e pesada: a circulação do lubrificante por todas as partes móveis do motor.',
    question: 'O que faz a bomba de óleo?',
    definition:
      'A bomba de óleo puxa o lubrificante do cárter e o envia sob pressão para as galerias do motor, lubrificando bronzinas, comando, tuchos e as demais partes móveis. Esse sistema é chamado de lubrificação forçada e é o que mantém a película de óleo entre as peças.',
    facts: [
      'Preserva a vida útil dos componentes móveis do motor de combustão interna.',
      'É um componente essencial: sem pressão de óleo, o motor pode fundir em pouco tempo.',
      'Como as demais peças, a bomba tem vida útil e deve ser substituída na retífica ou quando a pressão cai.',
    ],
    faq: [
      {
        q: 'Quais os sintomas de bomba de óleo com defeito?',
        a: 'Luz de pressão do óleo acesa, ruído em válvulas e tuchos, aquecimento anormal e, em casos graves, batida de biela. Antes de trocar, confira o nível do óleo e o pescador.',
      },
    ],
    image: 'pecas/bomba-de-oleo.jpg',
    imageAlt: 'Bomba de óleo de motor',
    keywords: ['bomba de óleo', 'bomba de óleo motor', 'pressão de óleo', 'lubrificação forçada'],
  },
  {
    slug: 'filtros',
    name: 'Filtros',
    lower: 'filtros',
    group: 'vedacao-lubrificacao',
    short: 'Retêm as impurezas do óleo, do ar e do combustível.',
    title: 'Filtros de óleo, ar e combustível | Mirpo São Paulo',
    description:
      'Filtros de óleo, de ar, de combustível e de cabine para veículos leves e pesados. Limpeza e bom funcionamento do motor. Orçamento rápido na Mirpo.',
    lede: 'Filtros de óleo, de ar, de combustível e de cabine para o bom funcionamento e a limpeza do motor.',
    question: 'Para que servem os filtros do motor?',
    definition:
      'Os filtros automotivos retêm partículas que desgastariam o motor ou prejudicariam a combustão. Os principais são o filtro de óleo, o filtro de ar, o filtro de combustível e o filtro de cabine. Em motores diesel de caminhões e ônibus, o filtro de partículas retém a fuligem do escapamento.',
    facts: [
      'O filtro de ar protege o motor da poeira e garante a mistura correta de ar e combustível para a queima.',
      'O filtro de óleo é o mais conhecido e cuida da saúde do motor: retém as partículas que circulam com o lubrificante.',
      'O filtro de cabine cuida do ar que motorista e passageiros respiram, principalmente em veículos com ar-condicionado.',
    ],
    faq: [
      {
        q: 'De quanto em quanto tempo trocar o filtro de óleo?',
        a: 'Na maioria dos motores, a cada troca de óleo. O intervalo exato está no manual do veículo; em uso severo, a troca deve ser antecipada.',
      },
    ],
    image: 'pecas/filtros.jpg',
    imageAlt: 'Filtros automotivos de óleo, ar e combustível',
    keywords: ['filtro de óleo', 'filtro de ar', 'filtro de combustível', 'filtro de cabine', 'filtro diesel'],
  },
  {
    slug: 'kit-de-motor',
    name: 'Kit de motor',
    lower: 'kit de motor',
    group: 'kits',
    short: 'Pistões, anéis, pinos e camisas na mesma medida.',
    title: 'Kit de motor para retífica: VW a ar e diesel | Mirpo',
    description:
      'Kits de motor com pistões, anéis, pinos e camisas para VW a ar, Ford CHT e diesel (MWM, Perkins, Scania, Mercedes, Cummins). Orçamento na Mirpo.',
    lede: 'Pistões, anéis, pinos, travas e camisas na mesma caixa, prontos para montar.',
    question: 'O que é um kit de motor?',
    definition:
      'O kit de motor reúne, em uma só compra, as peças do conjunto móvel que trabalham juntas: pistões, anéis de segmento, pinos, travas, camisas de cilindro e as vedações necessárias. As peças vêm combinadas na mesma medida, o que reduz erros de montagem e retrabalho na retífica.',
    facts: [
      'Linha leve: kits para VW a ar (Fusca, Gol, Kombi) com motores 1200, 1700, 1800, 2000, 2100 e 2300, Ford CHT (Belina, Corcel), Citroën e Peugeot.',
      'Linha diesel: MWM, Ford trator, Perkins, Scania, Mercedes-Benz, caminhões VW e Ford, Cummins, entre outros.',
      'Com todas as peças necessárias para a instalação, o kit evita retrabalho e garante as folgas corretas.',
    ],
    faq: [
      {
        q: 'O que vem em um kit de motor?',
        a: 'Em geral, pistões com pinos e travas, jogo de anéis de segmento e camisas de cilindro, além das vedações das camisas nos motores com camisa úmida. A composição exata varia conforme o fabricante e o motor.',
      },
      {
        q: 'A Mirpo tem kit de motor para Fusca e Kombi?',
        a: 'Sim. Trabalhamos com kits para motores VW a ar de 1200 a 2300, além de outros motores nacionais antigos e diesel. Informe o motor no pedido de orçamento para confirmarmos a disponibilidade.',
      },
    ],
    image: 'pecas/kit-de-motor.jpg',
    imageAlt: 'Kit de motor com pistões, anéis e camisas',
    keywords: ['kit de motor', 'kit motor fusca', 'kit motor VW a ar', 'kit motor MWM', 'kit retífica motor'],
  },
  {
    slug: 'kit-de-distribuicao',
    name: 'Kit de distribuição',
    lower: 'kit de distribuição',
    group: 'kits',
    short: 'Correia ou corrente, tensores e polias que sincronizam o motor.',
    title: 'Kit de distribuição: correia, corrente e tensor | Mirpo',
    description:
      'Kits de distribuição com correia ou corrente, tensores e engrenagens para manter o sincronismo perfeito do motor. Peças originais na Mirpo, em São Paulo.',
    lede: 'Correias, correntes, tensores e engrenagens para manter o sincronismo perfeito do motor.',
    question: 'O que é um kit de distribuição?',
    definition:
      'O kit de distribuição reúne as peças que sincronizam o giro do virabrequim com o do comando de válvulas: correia ou corrente, tensor, polias e engrenagens. É esse sincronismo que faz as válvulas abrirem no momento exato em relação ao movimento dos pistões.',
    facts: [
      'Garante o controle preciso da combustão e a sincronização das diferentes partes do motor.',
      'A troca deve ser preventiva, no prazo do fabricante. Uma correia rompida pode fazer válvulas e pistões se chocarem.',
      'Na troca ou na retífica completa, substitua o conjunto inteiro: correia ou corrente, tensores, engrenagens e acessórios.',
    ],
    faq: [
      {
        q: 'Por que trocar o kit inteiro e não só a correia?',
        a: 'Tensor e polias se desgastam junto com a correia. Uma correia nova com tensor gasto pode fazer ruído, perder a tensão e romper antes do prazo.',
      },
    ],
    image: 'pecas/kit-de-distribuicao.jpg',
    imageAlt: 'Kit de distribuição com corrente, engrenagens e tensor',
    keywords: ['kit de distribuição', 'correia dentada', 'corrente de comando', 'tensor da correia', 'kit correia dentada'],
  },
];

export const partBySlug = new Map(parts.map((p) => [p.slug, p]));

export const partsInGroup = (group: GroupSlug): Part[] => parts.filter((p) => p.group === group);

const FEMININE = new Set([
  'camisas-de-cilindro',
  'bronzinas',
  'buchas-de-biela',
  'arruelas-de-encosto',
  'valvulas',
  'guias-de-valvulas',
  'sedes-de-valvulas',
  'buchas-de-comando',
  'juntas-de-motor',
  'bomba-de-oleo',
]);
const SINGULAR = new Set(['comando-de-valvulas', 'kit-de-motor', 'kit-de-distribuicao']);

/** "os pistões", "as bronzinas", "o kit de motor" */
export const withArticle = (p: Part): string =>
  `${SINGULAR.has(p.slug) ? 'o' : FEMININE.has(p.slug) ? 'as' : 'os'} ${p.lower}`;
