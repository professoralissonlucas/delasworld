// Catálogo de peças da pasta imagens/.
// É um arquivo .js (e não .json) para funcionar abrindo o index.html direto, sem servidor.
// categoria: as mesmas do Organizador de Looks.
// estilos: casual, elegante, romantico, streetwear, minimalista, patricinha.
// formalidade: 1 (bem casual) a 5 (bem arrumada).
// familiaCor: neutro, quente, frio, pastel ou vibrante (a tabela de combinações está em regras.js).
// ocasioes: escola, passeio, festa, praia, academia.
// estacao: calor, frio ou qualquer.
// Observação: imagens/look-completo-01.jpg ficou de fora (é um look inteiro, não uma peça só).

window.CATALOGO_PECAS = [
  // Blusas e camisetas (tops)
  { id: "blusa-vinho-01", nome: "Blusa ombro a ombro vinho", arquivo: "imagens/blusa-vinho-01.jpg", categoria: "tops", cor: "vinho", corHex: "#7a1f24", estampada: false, estilos: ["romantico", "streetwear"], formalidade: 3, familiaCor: "quente", ocasioes: ["passeio", "festa"], estacao: "qualquer" },
  { id: "blusa-listrada-01", nome: "Blusa cropped listrada", arquivo: "imagens/blusa-listrada-01.jpg", categoria: "tops", cor: "preto e branco", corHex: "#1e1e1e", estampada: true, estilos: ["casual", "streetwear"], formalidade: 2, familiaCor: "neutro", ocasioes: ["escola", "passeio"], estacao: "qualquer" },
  { id: "camisa-branca-01", nome: "Camisa de time branca 93", arquivo: "imagens/camisa-branca-01.jpg", categoria: "tops", cor: "branco", corHex: "#f4f4f4", estampada: true, estilos: ["streetwear"], formalidade: 1, familiaCor: "neutro", ocasioes: ["escola", "passeio"], estacao: "calor" },
  { id: "camisa-branca-02", nome: "Camisa de time branca 19", arquivo: "imagens/camisa-branca-02.jpg", categoria: "tops", cor: "branco", corHex: "#f1efe9", estampada: true, estilos: ["casual", "streetwear"], formalidade: 1, familiaCor: "neutro", ocasioes: ["escola", "passeio"], estacao: "calor" },
  { id: "camisa-preta-01", nome: "Camisa de time preta 22", arquivo: "imagens/camisa-preta-01.jpg", categoria: "tops", cor: "preto", corHex: "#161616", estampada: true, estilos: ["streetwear"], formalidade: 1, familiaCor: "neutro", ocasioes: ["escola", "passeio"], estacao: "calor" },
  { id: "camiseta-preta-01", nome: "Baby tee preta com manga branca", arquivo: "imagens/camiseta-preta-01.jpg", categoria: "tops", cor: "preto", corHex: "#1c1c1c", estampada: false, estilos: ["casual", "streetwear"], formalidade: 2, familiaCor: "neutro", ocasioes: ["escola", "passeio"], estacao: "calor" },
  { id: "camiseta-preta-02", nome: "Camiseta preta com lettering", arquivo: "imagens/camiseta-preta-02.jpg", categoria: "tops", cor: "preto", corHex: "#141414", estampada: true, estilos: ["casual", "streetwear"], formalidade: 2, familiaCor: "neutro", ocasioes: ["escola", "passeio"], estacao: "calor" },
  { id: "camiseta-preta-03", nome: "Camiseta preta com estampa de cachorros", arquivo: "imagens/camiseta-preta-03.jpg", categoria: "tops", cor: "preto", corHex: "#121212", estampada: true, estilos: ["streetwear"], formalidade: 1, familiaCor: "neutro", ocasioes: ["escola", "passeio"], estacao: "calor" },

  // Calças (pants)
  { id: "calca-cinza-01", nome: "Calça jeans baggy cinza", arquivo: "imagens/calca-cinza-01.jpg", categoria: "pants", cor: "cinza", corHex: "#6b6b6b", estampada: false, estilos: ["casual", "streetwear"], formalidade: 2, familiaCor: "neutro", ocasioes: ["escola", "passeio"], estacao: "qualquer" },
  { id: "calca-azul-01", nome: "Calça jeans rasgada vintage", arquivo: "imagens/calca-azul-01.jpg", categoria: "pants", cor: "azul vintage", corHex: "#7d8f8a", estampada: false, estilos: ["casual", "streetwear"], formalidade: 1, familiaCor: "neutro", ocasioes: ["passeio"], estacao: "qualquer" },
  { id: "calca-azul-escuro-01", nome: "Calça jeans baggy azul-escuro", arquivo: "imagens/calca-azul-escuro-01.jpg", categoria: "pants", cor: "azul-escuro", corHex: "#2f4a72", estampada: false, estilos: ["casual", "streetwear", "minimalista"], formalidade: 2, familiaCor: "neutro", ocasioes: ["escola", "passeio"], estacao: "qualquer" },
  { id: "calca-zebra-01", nome: "Calça pantalona zebra", arquivo: "imagens/calca-zebra-01.jpg", categoria: "pants", cor: "preto e branco", corHex: "#e8e2d6", estampada: true, estilos: ["casual", "streetwear"], formalidade: 2, familiaCor: "neutro", ocasioes: ["passeio", "praia"], estacao: "calor" },
  { id: "calca-preta-01", nome: "Calça jeans preta com estrelas", arquivo: "imagens/calca-preta-01.jpg", categoria: "pants", cor: "preto", corHex: "#3a3a3a", estampada: true, estilos: ["streetwear"], formalidade: 2, familiaCor: "neutro", ocasioes: ["escola", "passeio", "festa"], estacao: "qualquer" },

  // Saias (skirts)
  { id: "saia-azul-claro-01", nome: "Minissaia jeans cargo azul-claro", arquivo: "imagens/saia-azul-claro-01.jpg", categoria: "skirts", cor: "azul-claro", corHex: "#8fb0cf", estampada: false, estilos: ["casual", "streetwear"], formalidade: 2, familiaCor: "neutro", ocasioes: ["passeio", "festa"], estacao: "calor" },
  { id: "saia-cinza-01", nome: "Minissaia jeans cargo cinza", arquivo: "imagens/saia-cinza-01.jpg", categoria: "skirts", cor: "cinza", corHex: "#4f5052", estampada: false, estilos: ["casual", "streetwear"], formalidade: 2, familiaCor: "neutro", ocasioes: ["passeio", "festa"], estacao: "calor" },
  { id: "saia-verde-menta-01", nome: "Minissaia cargo verde-menta", arquivo: "imagens/saia-verde-menta-01.jpg", categoria: "skirts", cor: "verde-menta", corHex: "#b7dcc0", estampada: false, estilos: ["casual", "patricinha"], formalidade: 2, familiaCor: "pastel", ocasioes: ["passeio", "praia"], estacao: "calor" },

  // Shorts e bermudas (shorts)
  { id: "short-azul-marinho-01", nome: "Short cargo azul-marinho", arquivo: "imagens/short-azul-marinho-01.jpg", categoria: "shorts", cor: "azul-marinho", corHex: "#3f4a66", estampada: false, estilos: ["casual"], formalidade: 1, familiaCor: "frio", ocasioes: ["passeio", "praia"], estacao: "calor" },
  { id: "short-azul-claro-01", nome: "Short jeans azul-claro", arquivo: "imagens/short-azul-claro-01.jpg", categoria: "shorts", cor: "azul-claro", corHex: "#9bb4cf", estampada: false, estilos: ["casual"], formalidade: 1, familiaCor: "neutro", ocasioes: ["passeio", "praia"], estacao: "calor" },
  { id: "short-branco-01", nome: "Short branco", arquivo: "imagens/short-branco-01.jpg", categoria: "shorts", cor: "branco", corHex: "#f5f5f3", estampada: false, estilos: ["casual", "minimalista", "patricinha"], formalidade: 2, familiaCor: "neutro", ocasioes: ["passeio", "praia"], estacao: "calor" },
  { id: "bermuda-azul-01", nome: "Bermuda jeans destroyed", arquivo: "imagens/bermuda-azul-01.jpg", categoria: "shorts", cor: "azul", corHex: "#3e5a78", estampada: false, estilos: ["casual", "streetwear"], formalidade: 1, familiaCor: "neutro", ocasioes: ["escola", "passeio"], estacao: "calor" },

  // Moletons (outerwear)
  { id: "moletom-preto-01", nome: "Moletom preto com zíper", arquivo: "imagens/moletom-preto-01.jpg", categoria: "outerwear", cor: "preto", corHex: "#1b1b1b", estampada: false, estilos: ["casual", "streetwear"], formalidade: 1, familiaCor: "neutro", ocasioes: ["escola", "passeio", "academia"], estacao: "frio" },
  { id: "moletom-preto-02", nome: "Moletom preto com grafite", arquivo: "imagens/moletom-preto-02.jpg", categoria: "outerwear", cor: "preto", corHex: "#161616", estampada: true, estilos: ["streetwear"], formalidade: 1, familiaCor: "neutro", ocasioes: ["escola", "passeio"], estacao: "frio" },
  { id: "moletom-preto-03", nome: "Moletom preto com mira", arquivo: "imagens/moletom-preto-03.jpg", categoria: "outerwear", cor: "preto", corHex: "#1a1a1a", estampada: true, estilos: ["streetwear"], formalidade: 1, familiaCor: "neutro", ocasioes: ["escola", "passeio"], estacao: "frio" },

  // Tênis (sneakers_shoes)
  { id: "tenis-verde-01", nome: "Tênis camurça verde", arquivo: "imagens/tenis-verde-01.jpg", categoria: "sneakers_shoes", cor: "verde", corHex: "#1f6b45", estampada: false, estilos: ["casual", "streetwear"], formalidade: 2, familiaCor: "frio", ocasioes: ["escola", "passeio"], estacao: "qualquer" },
  { id: "tenis-vinho-01", nome: "Tênis camurça vinho", arquivo: "imagens/tenis-vinho-01.jpg", categoria: "sneakers_shoes", cor: "vinho", corHex: "#7b1e33", estampada: false, estilos: ["casual", "streetwear"], formalidade: 2, familiaCor: "quente", ocasioes: ["escola", "passeio"], estacao: "qualquer" },
  { id: "tenis-vermelho-01", nome: "Tênis camurça vermelho", arquivo: "imagens/tenis-vermelho-01.jpg", categoria: "sneakers_shoes", cor: "vermelho", corHex: "#d23a4a", estampada: false, estilos: ["casual", "streetwear"], formalidade: 2, familiaCor: "vibrante", ocasioes: ["escola", "passeio"], estacao: "qualquer" },
  { id: "tenis-xadrez-01", nome: "Tênis xadrez preto e branco", arquivo: "imagens/tenis-xadrez-01.jpg", categoria: "sneakers_shoes", cor: "preto e branco", corHex: "#1a1a1a", estampada: true, estilos: ["casual", "streetwear"], formalidade: 1, familiaCor: "neutro", ocasioes: ["escola", "passeio"], estacao: "qualquer" },
  { id: "tenis-preto-01", nome: "Tênis preto clássico", arquivo: "imagens/tenis-preto-01.jpg", categoria: "sneakers_shoes", cor: "preto", corHex: "#151515", estampada: false, estilos: ["casual", "streetwear", "minimalista"], formalidade: 2, familiaCor: "neutro", ocasioes: ["escola", "passeio"], estacao: "qualquer" },
  { id: "tenis-azul-01", nome: "Tênis azul", arquivo: "imagens/tenis-azul-01.jpg", categoria: "sneakers_shoes", cor: "azul", corHex: "#2a4c8f", estampada: false, estilos: ["casual", "streetwear"], formalidade: 1, familiaCor: "frio", ocasioes: ["escola", "passeio"], estacao: "qualquer" },
  { id: "tenis-azul-claro-01", nome: "Tênis camurça azul-claro", arquivo: "imagens/tenis-azul-claro-01.jpg", categoria: "sneakers_shoes", cor: "azul-claro", corHex: "#9dbbdc", estampada: false, estilos: ["casual", "minimalista"], formalidade: 2, familiaCor: "pastel", ocasioes: ["escola", "passeio"], estacao: "qualquer" },
  { id: "tenis-cinza-01", nome: "Tênis camurça cinza", arquivo: "imagens/tenis-cinza-01.jpg", categoria: "sneakers_shoes", cor: "cinza", corHex: "#a9a9ab", estampada: false, estilos: ["casual", "minimalista"], formalidade: 2, familiaCor: "neutro", ocasioes: ["escola", "passeio"], estacao: "qualquer" },

  // Bolsas (bags)
  { id: "bolsa-preta-01", nome: "Bolsa matelassê preta com corrente", arquivo: "imagens/bolsa-preta-01.jpg", categoria: "bags", cor: "preto", corHex: "#1d1d1d", estampada: false, estilos: ["elegante", "patricinha"], formalidade: 4, familiaCor: "neutro", ocasioes: ["passeio", "festa"], estacao: "qualquer" },
  { id: "bolsa-creme-01", nome: "Bolsa de ombro creme", arquivo: "imagens/bolsa-creme-01.jpg", categoria: "bags", cor: "creme", corHex: "#efe8dc", estampada: false, estilos: ["elegante", "minimalista", "romantico"], formalidade: 3, familiaCor: "neutro", ocasioes: ["passeio", "festa"], estacao: "qualquer" },
  { id: "bolsa-vinho-01", nome: "Bolsa de ombro vinho envernizada", arquivo: "imagens/bolsa-vinho-01.jpg", categoria: "bags", cor: "vinho", corHex: "#8a1626", estampada: false, estilos: ["elegante", "romantico", "patricinha"], formalidade: 3, familiaCor: "quente", ocasioes: ["passeio", "festa"], estacao: "qualquer" }
];
