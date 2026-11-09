# Mirpo — site institucional

Site estático da Mirpo Distribuidora de Peças para Motores (mirpo.com.br), reconstruído em **HTML, CSS e TypeScript**, sem framework e sem WordPress.

## Comandos

```bash
npm install        # uma vez
npm run build      # gera dist/ (páginas, imagens, sitemap, robots, llms)
npm run preview    # serve dist/ em http://localhost:4321
npm run dev        # rebuild automático ao salvar + servidor local
npm run typecheck  # checagem de tipos (tsc)
npm run video      # recorta e comprime o vídeo da hero (precisa do ffmpeg; só quando o vídeo mudar)
npm run cf:dev     # build + servidor local do Cloudflare Workers (http://localhost:8787)
npm run cf:check   # build + deploy simulado (valida config, _headers e _redirects)
npm run deploy     # build + publica no Cloudflare Workers (pede login)
```

Requer Node 22.18+ (os scripts `.ts` rodam direto no Node, sem transpilar). `.node-version` fixa o Node 24.

## Onde editar

| O quê | Arquivo |
| --- | --- |
| Telefone, WhatsApp, e-mail, endereço, horário, redes, marcas, vídeos, depoimentos | `src/data/site.ts` |
| As 18 linhas de peças (texto, FAQ, título e descrição de SEO) | `src/data/parts.ts` |
| FAQ da home, checklist antifalsificação, história, galerias | `src/data/content.ts` |
| Layout de cada página | `src/build/pages/*.ts` |
| Cabeçalho, rodapé, `<head>` e SEO por página | `src/build/layout.ts` |
| Estilos | `src/styles/site.css` |
| Interações (motor, menu, formulário, vídeos, mapa) | `src/client/*.ts` |
| Desenho do motor em corte | `src/build/engine-svg.ts` + `src/shared/engine.ts` |
| Imagens originais | `assets-src/images/` (o build gera AVIF e WebP) |
| Vídeo de fundo da hero | `scripts/video.ts` → `assets-src/video/` (ver abaixo) |
| Logo | `assets-src/brand/logo.svg` (fundos claros: azul `#1003A7` + cinza), `logo-branco.svg` (fundos escuros), `icon.svg` (o "M" dos favicons). Vetorizadas da logo oficial `logo-original.png` |

As URLs são as mesmas do site antigo (`/pistoes/`, `/a-empresa/` etc.), então o histórico de SEO é preservado.

## Formulário de orçamento

Ao enviar, o formulário faz duas coisas: registra o pedido e abre o **WhatsApp** (ou o e-mail) com a mensagem pronta.

```text
navegador ──POST /api/orcamento──▶ Worker (src/worker/index.ts) ──X-Mirpo-Token──▶ n8n ──▶ Pulseboard
```

- **Worker** (`/api/orcamento`): aceita só JSON do próprio site, descarta robôs (campo escondido `empresa_site`), limita 5 envios/min por IP, filtra os campos e repassa ao n8n.
- **n8n**: fluxo "P12 Mirpo — Formulário de Orçamento (Site)" (`/webhook/mirpo-orcamento`, protegido pela credencial Header Auth "Mirpo Site → n8n"). Normaliza o telefone (`5511999998888`), valida e envia ao Pulseboard (`/leads/mirpo`). Erros vão por e-mail para `danilo@p12digital.com.br`.
- **Teste**: um nome começando com `TESTE P12` percorre todo o caminho, mas não chega ao Pulseboard.
- **Configuração**: `N8N_WEBHOOK_URL` fica em `vars` no `wrangler.jsonc`; o token fica no secret `N8N_WEBHOOK_TOKEN` do Worker (Settings → Variables and Secrets). Para testar localmente, o mesmo token vai em `.dev.vars` (fora do git) e roda com `npm run cf:dev`.
- Sem o secret, `/api/orcamento` responde 503 e o formulário continua abrindo o WhatsApp/e-mail normalmente.

## O que o build entrega

- 26 páginas HTML com título, descrição, canonical, Open Graph e imagem OG própria por página.
- Dados estruturados: `AutoPartsStore`, `WebSite`, `BreadcrumbList`, `FAQPage`, `VideoObject`, `DefinedTermSet` (glossário das peças), `ItemList`.
- `sitemap.xml` com imagens, `robots.txt` liberando buscadores e robôs de IA, `llms.txt` e `llms-full.txt`.
- Imagens em AVIF + WebP com `srcset`, largura/altura fixas e cor de fundo enquanto carregam.
- Fontes próprias em WOFF2 com subset (Big Shoulders e Barlow), pré-carregadas, com fallback de métricas ajustadas (sem salto de layout).
- Vídeos do YouTube e mapa do Google só carregam no clique; GTM carrega após a primeira interação.
- Speculation Rules (pré-renderiza a próxima página no hover) e View Transitions entre páginas.
- `_headers` e `_redirects` (Cloudflare Workers / Pages / Netlify) e `.htaccess` (Apache/cPanel) com cache, segurança e redirecionamentos das URLs antigas do WordPress.

## Publicação — Cloudflare Workers

O projeto é um Worker só de arquivos estáticos (sem código no servidor), configurado em `wrangler.jsonc`:
pasta `dist`, barra final automática (`/pistoes` → `/pistoes/`) e página 404 própria.

**Pelo painel (Git, recomendado)** — Workers & Pages → Create → Import a repository → `contatop12/mirpo`:

| Campo | Valor |
| --- | --- |
| Project name (nome do Worker) | `mirpo` — tem que ser igual ao `name` do `wrangler.jsonc` |
| Build command | vazio ou `npm run build` (o `wrangler deploy` já roda o build, via `build.command` do `wrangler.jsonc`) |
| Deploy command | `npx wrangler deploy` (padrão) |
| Root directory | `/` (vazio) |

Cada push na `main` gera build e publica. O primeiro build leva ~2–3 min (gera todas as imagens); os seguintes, o mesmo.

**Pelo terminal** — `npx wrangler login` uma vez, depois `npm run deploy`.

### Depois do primeiro deploy

1. Worker `mirpo` → Settings → Domains & Routes → adicionar `mirpo.com.br` e `www.mirpo.com.br` (o domínio precisa estar na Cloudflare).
2. Redirecionar `www` → sem `www`: Rules → Redirect Rules → modelo "Redirect from WWW to root".
3. O endereço `*.workers.dev` responde com `X-Robots-Tag: noindex` para não competir com o domínio no Google. Se não quiser ele público, desative em Settings → Domains & Routes.
4. Enviar `https://mirpo.com.br/sitemap.xml` no Google Search Console e no Bing Webmaster Tools.

**Outras hospedagens** — envie o conteúdo de `dist/`. Cloudflare Pages/Netlify: comando `npm run build`, pasta `dist`. Apache/cPanel usa o `.htaccess` gerado.

## Vídeo de fundo da hero

Vem do Reels da própria Mirpo ([instagram.com/p/DYp7SqQjm5K](https://www.instagram.com/p/DYp7SqQjm5K/)). O original fica em `assets-src/video/original/`, fora do git.
`npm run video` usa só os trechos sem texto (7,3–11,7 s e 14,3–18,2 s, sem a tela final do logo) e gera um loop de ~8 s, sem áudio:

- `hero-desktop.mp4` (720×400, faixa horizontal) e `hero-mobile.mp4` (432×768, vertical), cerca de 550 kB e 450 kB;
- `hero-*.webp`: poster com o 1º quadro, pré-carregado. Ele aparece na hora e é o LCP da home.

O vídeo só baixa depois que a página termina de carregar. Ele não toca para quem ativou "reduzir movimento" no sistema, nem com economia de dados ou rede 2G (aí fica o poster parado), pausa quando sai da tela e tem botão de pausar.
