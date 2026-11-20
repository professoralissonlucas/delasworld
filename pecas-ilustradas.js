// Peças ilustradas: desenhos em SVG gerados aqui mesmo, sem precisar de fotos.
// Cada desenho vira uma "ficha" no mesmo formato do catalogo.js, com tipo: "ilustracao".
// O botão "Encontrar combinações" só usa uma ilustração quando não há foto boa para aquela vaga.

(function () {
  // ===== 1. Paleta de cores =====
  // masc/fem: como o nome da cor fica com "vestido" (masculino) e "blusa" (feminino).
  const PALETA = {
    "branco":           { hex: "#f7f5f2", familia: "neutro",   masc: "branco",  fem: "branca" },
    "preto":            { hex: "#2f2a33", familia: "neutro",   masc: "preto",   fem: "preta" },
    "bege":             { hex: "#e6d3b8", familia: "neutro",   masc: "bege",    fem: "bege" },
    "cinza":            { hex: "#a9a7ad", familia: "neutro",   masc: "cinza",   fem: "cinza" },
    "jeans":            { hex: "#6f8fb5", familia: "neutro",   masc: "jeans",   fem: "jeans" },
    "rosa":             { hex: "#f6a9c8", familia: "pastel",   masc: "rosa",    fem: "rosa" },
    "lilás":            { hex: "#c9b2ea", familia: "pastel",   masc: "lilás",   fem: "lilás" },
    "azul-claro":       { hex: "#a9d2ef", familia: "pastel",   masc: "azul-claro", fem: "azul-claro" },
    "verde-menta":      { hex: "#b7e4cf", familia: "pastel",   masc: "verde-menta", fem: "verde-menta" },
    "vermelho":         { hex: "#e0404f", familia: "vibrante", masc: "vermelho", fem: "vermelha" },
    "amarelo-manteiga": { hex: "#f7e3a1", familia: "pastel",   masc: "amarelo-manteiga", fem: "amarelo-manteiga" }
  };

  // ===== 2. Informações de cada categoria =====
  // nome, gênero da palavra, cores que vamos gerar e os valores padrão da ficha.
  const CATEGORIAS = {
    tops: { nome: "Blusa", genero: "fem", formalidade: 2, estilos: ["casual"], ocasioes: ["escola", "passeio"], estacao: "qualquer",
      cores: ["branco", "preto", "bege", "cinza", "rosa", "lilás", "azul-claro", "verde-menta", "vermelho", "amarelo-manteiga"] },
    pants: { nome: "Calça", genero: "fem", formalidade: 2, estilos: ["casual"], ocasioes: ["escola", "passeio"], estacao: "qualquer",
      cores: ["branco", "preto", "bege", "cinza", "jeans", "rosa", "lilás", "azul-claro", "verde-menta"] },
    shorts: { nome: "Short", genero: "masc", formalidade: 1, estilos: ["casual"], ocasioes: ["passeio", "praia"], estacao: "calor",
      cores: ["branco", "preto", "bege", "jeans", "rosa", "lilás", "verde-menta", "amarelo-manteiga"] },
    skirts: { nome: "Saia", genero: "fem", formalidade: 3, estilos: ["casual"], ocasioes: ["passeio", "festa"], estacao: "calor",
      cores: ["branco", "preto", "bege", "jeans", "rosa", "lilás", "verde-menta", "vermelho", "amarelo-manteiga"] },
    dresses: { nome: "Vestido", genero: "masc", formalidade: 3, estilos: ["romantico"], ocasioes: ["passeio", "festa"], estacao: "calor",
      cores: ["branco", "preto", "bege", "rosa", "lilás", "azul-claro", "verde-menta", "vermelho", "amarelo-manteiga"] },
    outerwear: { nome: "Jaqueta", genero: "fem", formalidade: 2, estilos: ["casual", "streetwear"], ocasioes: ["escola", "passeio"], estacao: "frio",
      cores: ["branco", "preto", "bege", "cinza", "jeans", "rosa", "lilás", "azul-claro"] },
    sneakers_shoes: { nome: "Tênis", genero: "masc", formalidade: 1, estilos: ["casual", "streetwear"], ocasioes: ["escola", "passeio", "academia"], estacao: "qualquer",
      cores: ["branco", "preto", "bege", "cinza", "rosa", "lilás", "azul-claro", "verde-menta"] },
    sandals: { nome: "Sandália", genero: "fem", formalidade: 3, estilos: ["casual"], ocasioes: ["passeio", "festa", "praia"], estacao: "calor",
      cores: ["branco", "preto", "bege", "rosa", "lilás", "verde-menta", "vermelho", "amarelo-manteiga"] },
    bags: { nome: "Bolsa", genero: "fem", formalidade: 3, estilos: ["elegante"], ocasioes: ["passeio", "festa"], estacao: "qualquer",
      cores: ["branco", "preto", "bege", "rosa", "lilás", "azul-claro", "vermelho", "amarelo-manteiga"] }
  };

  // ===== 3. Desenhos (SVG 200x200) =====
  // Cada função recebe a cor da peça (c) e a cor do contorno (o) e devolve o desenho.
  const DESENHOS = {
    tops: (c, o) => `
      <path d="M70 52 L88 44 Q100 56 112 44 L130 52 L156 74 L142 92 L130 84 L130 150 Q100 158 70 150 L70 84 L58 92 L44 74 Z" fill="${c}" stroke="${o}"/>
      <path d="M88 44 Q100 62 112 44" fill="none" stroke="${o}"/>
      <path d="M100 112 C94 104 86 110 92 117 L100 124 L108 117 C114 110 106 104 100 112 Z" fill="#ffffff" opacity=".75"/>`,
    pants: (c, o) => `
      <path d="M72 40 H128 L136 162 H108 L100 82 L92 162 H64 Z" fill="${c}" stroke="${o}"/>
      <path d="M72 52 H128 M100 52 V76" fill="none" stroke="${o}" opacity=".6"/>`,
    shorts: (c, o) => `
      <path d="M66 64 H134 L142 128 H107 L100 98 L93 128 H58 Z" fill="${c}" stroke="${o}"/>
      <path d="M66 76 H134" fill="none" stroke="${o}" opacity=".6"/>`,
    skirts: (c, o) => `
      <path d="M78 58 H122 L150 140 Q100 154 50 140 Z" fill="${c}" stroke="${o}"/>
      <path d="M78 70 H122 M100 72 V146 M88 72 L76 144 M112 72 L124 144" fill="none" stroke="${o}" opacity=".35"/>`,
    dresses: (c, o) => `
      <path d="M84 36 H90 Q100 50 110 36 H116 L120 76 Q112 84 116 90 L150 160 Q100 172 50 160 L84 90 Q88 84 80 76 Z" fill="${c}" stroke="${o}"/>
      <path d="M84 90 Q100 96 116 90" fill="none" stroke="${o}" opacity=".6"/>
      <path d="M100 92 L88 85 L88 99 Z M100 92 L112 85 L112 99 Z" fill="#ffffff" stroke="${o}" stroke-width="2"/>`,
    outerwear: (c, o) => `
      <path d="M66 60 L88 50 Q100 62 112 50 L134 60 L160 128 L142 134 L132 100 V156 H68 V100 L58 134 L40 128 Z" fill="${c}" stroke="${o}"/>
      <path d="M84 54 Q100 30 116 54" fill="none" stroke="${o}"/>
      <path d="M100 62 V156 M76 124 H92 M108 124 H124" fill="none" stroke="${o}" opacity=".6"/>`,
    sneakers_shoes: (c, o) => `
      <path d="M40 128 Q38 104 62 100 L88 96 Q100 80 118 92 L146 106 Q166 114 162 128 Z" fill="${c}" stroke="${o}"/>
      <rect x="36" y="124" width="130" height="16" rx="8" fill="#ffffff" stroke="${o}"/>
      <path d="M92 98 L104 108 M101 93 L113 103 M110 90 L120 99" fill="none" stroke="#ffffff" stroke-width="4"/>`,
    sandals: (c, o) => `
      <path d="M40 136 Q40 124 60 124 H150 Q166 124 164 134 Q162 144 146 144 H58 Q40 144 40 136 Z" fill="${c}" stroke="${o}"/>
      <path d="M76 126 Q90 92 112 126 M122 126 Q134 102 148 126" fill="none" stroke="${c}" stroke-width="10" stroke-linecap="round"/>
      <path d="M76 126 Q90 92 112 126 M122 126 Q134 102 148 126" fill="none" stroke="${o}" stroke-width="2" opacity=".5"/>
      <circle cx="94" cy="104" r="6" fill="#ffffff" stroke="${o}" stroke-width="2"/>`,
    bags: (c, o) => `
      <path d="M76 82 Q100 36 124 82" fill="none" stroke="${o}" stroke-width="10" stroke-linecap="round"/>
      <path d="M76 82 Q100 36 124 82" fill="none" stroke="${c}" stroke-width="6" stroke-linecap="round"/>
      <rect x="52" y="78" width="96" height="74" rx="18" fill="${c}" stroke="${o}"/>
      <path d="M52 96 Q52 78 70 78 H130 Q148 78 148 96 Q100 122 52 96 Z" fill="${o}" opacity=".12"/>
      <circle cx="100" cy="107" r="6" fill="#ffd76b" stroke="${o}" stroke-width="2"/>`
  };

  // Calçados são baixinhos: aumentamos e subimos um pouco para ficarem no centro do quadro.
  const AJUSTE = {
    sneakers_shoes: "translate(100 108) scale(1.25) translate(-100 -114)",
    sandals: "translate(100 112) scale(1.45) translate(-100 -122)"
  };

  // Escurece uma cor para virar o contorno do desenho.
  function escurecer(hex, fator) {
    const n = parseInt(hex.slice(1), 16);
    const canal = (deslocamento) => Math.round(((n >> deslocamento) & 255) * fator);
    return `rgb(${canal(16)},${canal(8)},${canal(0)})`;
  }

  // Monta o SVG completo: fundo rosinha, brilhos kawaii, sombra e a peça no meio.
  function montarSvg(categoria, hex) {
    const contorno = hex === "#2f2a33" ? "#141016" : escurecer(hex, 0.62);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
      <rect width="200" height="200" fill="#fff6fa"/>
      <circle cx="100" cy="100" r="78" fill="#ffe8f2"/>
      <path d="M30 34 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3z M168 48 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2z M160 160 l2.5 6 6 2.5 -6 2.5 -2.5 6 -2.5 -6 -6 -2.5 6 -2.5z" fill="#ffc2dc"/>
      <ellipse cx="100" cy="170" rx="56" ry="7" fill="#f3d3e2"/>
      <g stroke-width="3" stroke-linejoin="round" transform="${AJUSTE[categoria] || ""}">${DESENHOS[categoria](hex, contorno)}</g>
    </svg>`;
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg.replace(/\s+/g, " "));
  }

  // Estilos extras de acordo com a cor (uma peça rosa ganha "patricinha", uma preta ganha "minimalista"...).
  function estilosDaPeca(categoria, corNome, info) {
    const estilos = [...info.estilos];
    const familia = PALETA[corNome].familia;
    if (corNome === "jeans") estilos.push("streetwear");
    else if (familia === "neutro") estilos.push("minimalista");
    if (familia === "pastel") estilos.push("romantico");
    if (["rosa", "lilás", "amarelo-manteiga"].includes(corNome)) estilos.push("patricinha");
    if (["preto", "vermelho"].includes(corNome) && ["skirts", "dresses", "sandals", "bags"].includes(categoria)) estilos.push("elegante");
    return [...new Set(estilos)].slice(0, 3);
  }

  // ===== 4. Gera as fichas =====
  const fichas = [];
  Object.entries(CATEGORIAS).forEach(([categoria, info]) => {
    info.cores.forEach((corNome) => {
      const cor = PALETA[corNome];
      const corNoNome = info.genero === "masc" ? cor.masc : cor.fem;
      // Peças pretas ou vermelhas de festa ficam um pouco mais arrumadas; jeans fica mais casual.
      let formalidade = info.formalidade;
      if (["preto", "vermelho"].includes(corNome) && ["dresses", "bags", "sandals"].includes(categoria)) formalidade += 1;
      if (corNome === "jeans") formalidade = Math.max(1, formalidade - 1);

      fichas.push({
        id: `ilustr-${categoria}-${corNome.normalize("NFD").replace(/[̀-ͯ]/g, "")}`,
        nome: `${info.nome} ${corNoNome}`,
        arquivo: montarSvg(categoria, cor.hex), // a "foto" é o próprio desenho em data URI
        categoria,
        cor: corNome,
        corHex: cor.hex,
        estampada: false,
        estilos: estilosDaPeca(categoria, corNome, info),
        formalidade,
        familiaCor: cor.familia,
        ocasioes: info.ocasioes,
        estacao: info.estacao,
        tipo: "ilustracao"
      });
    });
  });

  window.PECAS_ILUSTRADAS = fichas;
})();
