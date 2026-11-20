// Regras de moda usadas pelo botão "Encontrar combinações".
// É um arquivo separado para ficar fácil de ler, explicar e mudar.

// ===== 1. Quais famílias de cor combinam entre si =====
// Leia assim: "uma peça [família] combina com peças destas famílias".
// - neutro (preto, branco, cinza, bege, jeans) combina com tudo;
// - quente (vinho, vermelho escuro, marrom) combina com quente e neutro;
// - frio (azul, verde escuro) combina com frio, pastel e neutro;
// - pastel (cores clarinhas) combina com pastel, frio e neutro;
// - vibrante (cor forte) fica melhor só com neutro, para não "brigar".
window.REGRAS_CORES = {
  neutro: ["neutro", "quente", "frio", "pastel", "vibrante"],
  quente: ["neutro", "quente"],
  frio: ["neutro", "frio", "pastel"],
  pastel: ["neutro", "pastel", "frio"],
  vibrante: ["neutro"]
};

// Devolve true se as duas famílias de cor combinam.
// Se não soubermos a família de uma das peças, não atrapalhamos o look.
window.coresCombinam = function (familiaA, familiaB) {
  if (!familiaA || !familiaB) return true;
  return (window.REGRAS_CORES[familiaA] || []).includes(familiaB);
};

// ===== 2. Descobrir a família de cor de uma foto enviada =====
// As peças do upload só têm a cor dominante em "rgb(r,g,b)".
// Aqui transformamos essa cor numa das 5 famílias.
window.familiaPorRgb = function (textoRgb) {
  const numeros = String(textoRgb || "").match(/\d+/g);
  if (!numeros || numeros.length < 3) return null;
  const [r, g, b] = numeros.map((n) => Number(n) / 255);
  const maior = Math.max(r, g, b);
  const menor = Math.min(r, g, b);
  const saturacao = maior - menor;   // 0 = cinza; perto de 1 = cor bem forte
  const claridade = (maior + menor) / 2;

  if (saturacao < 0.16) return "neutro";                     // quase sem cor: preto, branco, cinza
  if (claridade > 0.72) return "pastel";                     // cor bem clarinha
  if (saturacao > 0.65 && claridade > 0.35) return "vibrante"; // cor forte e viva

  // Matiz (o "lado" da roda de cores): vermelho/laranja/amarelo = quente, verde/azul/roxo = frio.
  let matiz;
  if (maior === r) matiz = ((g - b) / saturacao) * 60;
  else if (maior === g) matiz = ((b - r) / saturacao + 2) * 60;
  else matiz = ((r - g) / saturacao + 4) * 60;
  if (matiz < 0) matiz += 360;
  return matiz < 70 || matiz > 320 ? "quente" : "frio";
};

// ===== 3. Estações =====
// "qualquer" combina com tudo; calor e frio não combinam entre si (ex.: moletom + short).
window.estacoesCombinam = function (estacaoA, estacaoB) {
  if (!estacaoA || !estacaoB || estacaoA === "qualquer" || estacaoB === "qualquer") return true;
  return estacaoA === estacaoB;
};
