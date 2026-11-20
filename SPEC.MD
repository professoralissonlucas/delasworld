# SPEC — DELA'S WORLD

## 1. Visão geral

**DELA'S WORLD** ("Mini mundo de diversão") é uma aplicação web estática, sem backend nem build, que reúne minijogos e ferramentas de moda e estilo pessoal. Público-alvo: meninas e jovens interessadas em moda, estética e jogos casuais.

A interface é toda em **português (pt-BR)**, com visual "kawaii/fashion" em tons de rosa (`#ff1e8a`) e lilás (`#7b2cbf`), usando as fontes Outfit e Inter (Google Fonts).

## 2. Stack e estrutura

| Arquivo / pasta | Função |
|---|---|
| `index.html` (~440 linhas) | Toda a marcação: cabeçalho, menu de jogos e as telas de cada jogo (ficam ocultas com `hidden`). |
| `script.js` (~1500 linhas) | Toda a lógica, em JavaScript puro (vanilla, sem frameworks nem módulos). |
| `style.css` (~645 linhas) | Estilos, variáveis de cor em `:root` e responsividade (breakpoints de 980, 800, 720 e 520 px; respeita `prefers-reduced-motion`). |
| `imagens/` | 35 imagens `.jpg` de referência. **O código não as usa** em nenhum lugar. |

- **Como rodar:** abrir `index.html` no navegador (ou usar qualquer servidor estático). Não há dependências para instalar.
- **Dependências externas:** Google Fonts e imagens do Unsplash (usadas como peças de referência no organizador).
- **Persistência:** apenas `localStorage` do navegador.

## 3. Navegação

Página única com duas telas:

1. **Menu (`#menuView`)**: uma grade de cards. Cada botão `.play-button` tem um `data-game` com o nome do jogo.
2. **Tela de jogo (`#gameView`)**: `openSelectedGame(nome)` mostra o bloco do jogo escolhido e esconde os outros. O botão "← Voltar ao Menu" volta para o menu e reinicia o quiz e o Dress Up.

**Cabeçalho global:**
- **Contador de estrelas**: é a pontuação geral, somada por `addStars()`. Rende +10 ao vencer a memória, terminar o quiz ou salvar um look no Dress Up, e +5 ao gerar looks no organizador.
- **Botão de som**: liga e desliga um efeito sonoro "sparkle" gerado na hora com Web Audio API (`playSparkleSound`).

## 4. Módulos / jogos

### 4.1 Jogo da Memória Kawaii
- 8 pares de emojis (🎀 🦄 🍓 🌸 👑 🧁 💖 ✨) embaralhados num tabuleiro de 16 cartas.
- Conta as tentativas, trava o tabuleiro enquanto mostra um par errado, exibe mensagem de vitória e tem botão para reiniciar.

### 4.2 Quiz "Qual é a sua Vibe?"
- 5 perguntas (`quizQuestions`). Cada resposta soma ponto para um de 4 perfis (`vibeScores`):
  - `clean`: Minimalista Chic / Clean Girl
  - `artsy`: Streetwear Criativo / Artsy
  - `soft`: Romântica Moderna / Soft Glam
  - `y2k`: Y2K / Pop Futurista
- Mostra uma barra de progresso. No final aparece um **"Dossiê de estilo"** (`vibeProfiles`) com descrição, peças-chave, cortes de cabelo, paleta de unhas (com amostras de cor) e a essência do estilo.

### 4.3 Estúdio de Moda (Dress Up)
- Personagem desenhada em SVG inline, personalizável em 4 categorias:
  - **Cabelo**: castanho, rosa, lilás, dourado
  - **Vestido**: rosa, lilás, azul, dourado
  - **Acessório**: nenhum, coroa, laço, óculos
  - **Cenário**: quarto rosa, praia, palco
- Tem botão **Look aleatório** e botão **Salvar look**, que mostra mensagem, solta confete e dá +10 estrelas.

### 4.4 Organizador de Looks (closet digital)
É o módulo mais completo. Tem três abas: **Guarda-roupa**, **Combinar uma peça** e **Meus looks**.

**Upload de peças**
- Aceita JPG, PNG e WEBP, por galeria, câmera ou arrastando o arquivo.
- As imagens viram DataURL e ficam salvas no `localStorage`.
- **Categoria**: é deduzida do nome do arquivo (`inferCategory`, por palavras-chave em PT e EN). A pessoa pode editar o nome e a categoria de cada peça.
- **Cor dominante**: calculada num canvas de 24×24 px (`readDominantColor`).
- **Duplicatas**: removidas por uma assinatura da imagem (`createImageSignature`).
- **Categorias**: tops, pants, shorts, skirts, dresses, outerwear, sets, sneakers_shoes, sandals, bags, accessories, unidentified.
- **API de visão (opcional)**: existe o gancho `LOOKS_VISION_API`, hoje vazio, ou seja, desativado. Quando configurada, deve receber `POST multipart` com `images` e `preferences` e responder `{ pieces: [{ category, name, color, print, style }] }`.

**Montar looks (`generateLooks`)**
- Exige pelo menos 2 peças.
- Usa as preferências de estilo (casual, elegante, romântico, streetwear, minimalista, patricinha), ocasião e preferência (confortável, básico, sofisticado, ousado).
- Gera 3 looks com nome temático e justificativa. Cada look pode ser favoritado.

**Combinar uma peça (`#pieceMatchView`)**
- A pessoa escolhe uma peça principal (com filtro por categoria) e o app gera até 4 combinações com as outras peças do closet.
- Quando falta alguma categoria, completa com peças de referência do Unsplash (`COMPLEMENTARY_REFERENCES`), filtradas pelo estilo escolhido.
- Botões extras: "ver outras combinações", "mais elegante", "mais casual", trocar peças e ver alternativas.
- Guarda um histórico das últimas 12 sugestões, que podem ser reabertas.

## 5. Dados salvos no navegador (`localStorage`)

| Chave | Conteúdo |
|---|---|
| `pinkSparkleStars` | Total de estrelas |
| `pinkSparkleSound` | `"on"` / `"off"` |
| `pinkSparkleWardrobe` | Array de peças `{ id, name, category, image (DataURL), color, signature, categoryConfirmed, ... }` |
| `pinkSparkleSavedLooks` | Looks favoritados |
| `pinkSparklePieceHistory` | Histórico de "Combinar uma peça" (no máximo 12) |
| `pinkSparkleOutfits` | Usado por código legado (ver seção 6) |

Todo acesso ao `localStorage` está dentro de `try/catch`. Se o navegador limitar o armazenamento, o app mostra um aviso.

## 6. Observações técnicas

- **Código legado no começo do `script.js`**: referências a elementos que não existem no HTML (`outfitItemsContainer`, `addItemButton`, `saveOutfitButton` etc.). Os listeners são protegidos por `if (elemento)`, então esse trecho não roda.
- **Marcador no HTML**: o comentário `<!-- ORGANIZER_CARD_MARKER -->` no `index.html` parece servir de ponto de inserção para novos cards.
- **Limite de armazenamento**: as fotos ficam no `localStorage` como base64, e esse espaço costuma ser de uns 5 MB. Um closet com muitas fotos pode passar desse limite.
- **Projeto sem testes**: não há testes automatizados, linter nem controle de versão (git).
- **Sobras do nome antigo**: o prefixo `pinkSparkle` nas chaves indica que o projeto já se chamou "Pink Sparkle".
