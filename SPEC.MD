# SPEC — DELA'S WORLD

## 1. Visão geral

**DELA'S WORLD** ("Mini mundo de diversão") é um site estático, sem backend nem build, com um quiz de estilo e um organizador de looks. Público-alvo: meninas e jovens interessadas em moda, estética e jogos casuais.

A interface é toda em **português (pt-BR)**, com visual "kawaii/fashion" em tons de rosa (`#ff1e8a`) e lilás (`#7b2cbf`), usando as fontes Outfit e Inter (Google Fonts).

Publicado no GitHub Pages: https://professoralissonlucas.github.io/delasworld/

## 2. Stack e estrutura

HTML + CSS + JavaScript puro. Sem frameworks, sem npm, sem build.

| Arquivo / pasta | Função |
|---|---|
| `index.html` (~305 linhas) | Toda a marcação: cabeçalho, menu com 2 cards e as telas do Quiz e do Organizador (ocultas com `hidden`). |
| `catalogo.js` (~55 linhas) | Define `window.CATALOGO_PECAS`: 34 peças de `imagens/` com `id, nome, arquivo, categoria, cor, corHex, estampada, estilos`. É `.js` (e não `.json`) para funcionar abrindo o `index.html` direto, sem servidor. Carregado antes do `script.js`. |
| `script.js` (~1280 linhas) | Toda a lógica, em JavaScript puro (sem módulos). |
| `style.css` (~580 linhas) | Estilos, variáveis de cor em `:root` e responsividade (breakpoints de 980, 800, 720 e 520 px; respeita `prefers-reduced-motion`). |
| `imagens/` | 35 fotos `.jpg` de roupas, no padrão `tipo-cor-numero.jpg` (ex.: `tenis-verde-01.jpg`). `look-completo-01.jpg` é um look inteiro e não está no catálogo. |
| `README.md` | Apresentação curta do projeto. |

- **Como rodar:** abrir `index.html` no navegador ou usar qualquer servidor estático. Não há nada para instalar.
- **Dependências externas:** Google Fonts e algumas fotos do Unsplash, usadas só quando falta uma categoria no catálogo.
- **Persistência:** apenas `localStorage` do navegador.

## 3. Navegação

Página única com duas telas:

1. **Menu (`#menuView`)**: dois cards, "Qual é a sua Vibe?" e "Organizador de Looks". Cada botão `.play-button` tem um `data-game` com o nome do jogo.
2. **Tela de jogo (`#gameView`)**: `openSelectedGame(nome)` mostra o bloco escolhido e esconde o outro. O botão "← Voltar ao Menu" volta ao menu, reinicia o quiz e devolve o Organizador para a aba Guarda-roupa.

**Cabeçalho global:**
- **Contador de estrelas**: pontuação geral, somada por `addStars()`. Rende +10 ao terminar o quiz e +5 a cada geração de looks no Organizador (tanto "Montar meus looks" quanto "Combinar uma peça").
- **Botão de som**: liga e desliga um efeito sonoro "sparkle" gerado na hora com Web Audio API (`playSparkleSound`).

## 4. Módulos

### 4.1 Quiz "Qual é a sua Vibe?"
- 5 perguntas (`quizQuestions`). Cada resposta soma ponto para um de 4 perfis (`vibeScores`):
  - `clean`: Minimalista Chic / Clean Girl
  - `artsy`: Streetwear Criativo / Artsy
  - `soft`: Romântica Moderna / Soft Glam
  - `y2k`: Y2K / Pop Futurista
- Mostra uma barra de progresso. No final aparece um **"Dossiê de estilo"** (`vibeProfiles`) com descrição, peças-chave, cortes de cabelo, paleta de unhas (com amostras de cor) e a essência do estilo.

### 4.2 Organizador de Looks (closet digital)
Tem três abas: **Guarda-roupa**, **Combinar uma peça** e **Meus looks**.

**Upload de peças**
- Aceita JPG, PNG e WEBP, por galeria, câmera ou arrastando o arquivo.
- Antes de salvar, a foto é reduzida (`resizeImage`): no máximo 800 px no lado maior, convertida para JPEG com qualidade 0.7. Uma foto de 3000×2000 vira 800×533 e ocupa cerca de 140 KB.
- **Categoria**: deduzida do nome do arquivo (`inferCategory`, por palavras-chave em PT e EN). A pessoa pode editar o nome e a categoria de cada peça.
- **Cor dominante**: calculada num canvas de 24×24 px (`readDominantColor`).
- **Duplicatas**: removidas por uma assinatura da imagem (`createImageSignature`).
- **Categorias**: tops, pants, shorts, skirts, dresses, outerwear, sets, sneakers_shoes, sandals, bags, accessories, unidentified.
- **API de visão (opcional)**: existe o gancho `LOOKS_VISION_API`, hoje vazio, ou seja, desativado. Quando configurada, deve receber `POST multipart` com `images` e `preferences` e responder `{ pieces: [{ category, name, color, print, style }] }`.

**Montar looks (`generateLooks`)**
- Usa só as peças enviadas pelo upload e exige pelo menos 2.
- Usa as preferências de estilo (casual, elegante, romântico, streetwear, minimalista, patricinha), ocasião e preferência (confortável, básico, sofisticado, ousado).
- Gera 3 looks com nome temático e justificativa. Cada look pode ser favoritado.

**Combinar uma peça (`#pieceMatchView`)**
- A lista mostra as peças do `catalogo.js` + as enviadas pelo upload (`getAllPieces`). A peça clicada fica com borda rosa.
- "Encontrar combinações" gera 3 looks (`generatePieceLooks`). As peças que completam o look dependem da categoria da escolhida (`getSlotsForPiece`):
  - top → parte de baixo + calçado + bolsa
  - parte de baixo → top + calçado + bolsa
  - vestido/conjunto → calçado + bolsa (+ casaco opcional)
  - calçado → top + parte de baixo + bolsa
  - bolsa, acessório ou casaco → top + parte de baixo + calçado
- Pontuação simples (`scoreCandidate`): +1 por estilo em comum, +1 se tem o estilo escolhido na lista, +1 se for neutra (preto, branco, bege, cinza, jeans), −5 se criar duas estampas no look, −2 se a peça já apareceu em outro look. Sorteia entre as mais bem pontuadas, então "ver outras combinações" traz opções diferentes.
- Cada look tem nome e uma frase explicando por que combina (`explainLook`).
- Sem peça escolhida, aparece "Escolha uma peça primeiro 💖". Se faltar uma categoria, aparece "Ainda não tenho [sapato] no catálogo" e o look usa uma foto de referência do Unsplash (`COMPLEMENTARY_REFERENCES`).
- "Mais elegante" e "mais casual" trocam o estilo da lista e geram de novo. Cada card tem trocar peça, ver outras opções e salvar nos favoritos.
- Guarda um histórico das últimas 12 sugestões, que podem ser reabertas.

## 5. Dados salvos no navegador (`localStorage`)

| Chave | Conteúdo |
|---|---|
| `pinkSparkleStars` | Total de estrelas |
| `pinkSparkleSound` | `"on"` / `"off"` |
| `pinkSparkleWardrobe` | Array de peças do upload `{ id, name, category, image (DataURL JPEG reduzido), color, signature, categoryConfirmed, ... }` |
| `pinkSparkleSavedLooks` | Looks favoritados |
| `pinkSparklePieceHistory` | Histórico de "Combinar uma peça" (no máximo 12) |

As peças do catálogo **não** vão para o `localStorage`: ficam em `catalogo.js` e `imagens/`.
Todo acesso ao `localStorage` está dentro de `try/catch`. Se o navegador limitar o armazenamento, o app mostra um aviso.

## 6. Publicação (GitHub Pages)

- Todos os caminhos são relativos (`style.css`, `catalogo.js`, `script.js`, `imagens/...`). Nada de `C:\` nem caminhos começando com `/`.
- O GitHub Pages diferencia maiúsculas e minúsculas, então os nomes no código precisam bater exatamente com os arquivos. Hoje todos batem.
- O `index.html` declara um ícone vazio (`<link rel="icon" href="data:,">`) para não aparecer erro 404 do `favicon.ico` no console.

## 7. Observações técnicas

- **Marcador no HTML**: o comentário `<!-- ORGANIZER_CARD_MARKER -->` no `index.html` parece servir de ponto de inserção para novos cards.
- **Limite de armazenamento**: o `localStorage` costuma ter uns 5 MB. Com as fotos reduzidas, cabem dezenas de peças. Fotos enviadas antes da redução continuam no tamanho original até serem apagadas e enviadas de novo.
- **Imagem pesada**: `imagens/bermuda-azul-01.jpg` tem cerca de 1 MB (1.000.962 bytes). As outras têm menos de 40 KB.
- **Sem testes automatizados**: não há testes nem linter. O controle de versão é feito com git (repositório `professoralissonlucas/delasworld`).
- **Sobras do nome antigo**: o prefixo `pinkSparkle` nas chaves indica que o projeto já se chamou "Pink Sparkle".
