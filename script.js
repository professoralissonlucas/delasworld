const menuView = document.getElementById("menuView");
const gameView = document.getElementById("gameView");
const gameTitle = document.getElementById("gameTitle");
const gameSymbol = document.getElementById("gameSymbol");
const backButton = document.getElementById("backButton");
const starCount = document.getElementById("starCount");
const starCounter = document.querySelector(".star-counter");
const soundButton = document.getElementById("soundButton");

const gameSymbols = {
  "Quiz: Qual é a sua Vibe?": "✨",
  "Organizador de Looks": "🧥"
};

const gameMessage = document.getElementById("gameMessage");

const vibeQuiz = document.getElementById("vibeQuiz");
const quizStepLabel = document.getElementById("quizStepLabel");
const quizProgressText = document.getElementById("quizProgressText");
const quizProgress = document.querySelector(".quiz-progress");
const quizProgressFill = document.getElementById("quizProgressFill");
const quizQuestionCard = document.getElementById("quizQuestionCard");
const quizQuestion = document.getElementById("quizQuestion");
const quizOptions = document.getElementById("quizOptions");
const vibeResult = document.getElementById("vibeResult");
const vibeResultEmoji = document.getElementById("vibeResultEmoji");
const vibeResultTitle = document.getElementById("vibeResultTitle");
const vibeResultDescription = document.getElementById("vibeResultDescription");
const quizRestartButton = document.getElementById("quizRestartButton");

const outfitOrganizer = document.getElementById("outfitOrganizer");

let stars = 0;
let soundEnabled = false;
let audioContext = null;

try {
  stars = Number.parseInt(localStorage.getItem("pinkSparkleStars") || "0", 10) || 0;
  soundEnabled = localStorage.getItem("pinkSparkleSound") === "on";
} catch (error) {
  stars = 0;
  soundEnabled = false;
}

starCount.textContent = stars;

function openSelectedGame(selectedGame) {
  gameTitle.textContent = selectedGame;
  gameSymbol.textContent = gameSymbols[selectedGame] || "✨";

  const isVibeQuiz = selectedGame === "Quiz: Qual é a sua Vibe?";
  const isLookOrganizer = selectedGame === "Organizador de Looks";
  vibeQuiz.hidden = !isVibeQuiz;
  outfitOrganizer.hidden = !isLookOrganizer;

  if (isVibeQuiz) {
    gameSymbol.hidden = true;
    gameMessage.hidden = true;
    resetQuiz();
  } else if (isLookOrganizer) {
    gameSymbol.hidden = true;
    gameMessage.hidden = true;
  } else {
    gameSymbol.hidden = false;
    gameMessage.hidden = false;
    gameMessage.textContent = "A aventura está quase pronta para começar!";
  }
}

document.querySelectorAll(".play-button").forEach((button) => {
  button.addEventListener("click", () => {
    const selectedGame = button.dataset.game;

    openSelectedGame(selectedGame);
    menuView.hidden = true;
    gameView.hidden = false;
    window.scrollTo({ top: 0, behavior: "smooth" });
    backButton.focus();
  });
});

backButton.addEventListener("click", () => {
  gameView.hidden = true;
  menuView.hidden = false;
  vibeQuiz.hidden = true;
  outfitOrganizer.hidden = true;
  switchOrganizerView("wardrobe"); // esconde também a tela "Combinar uma peça"
  resetQuiz();
  window.scrollTo({ top: 0, behavior: "smooth" });

  const firstPlayButton = document.querySelector(".play-button");
  if (firstPlayButton) firstPlayButton.focus();
});

quizRestartButton.addEventListener("click", resetQuiz);

const quizQuestions = [
  {
    question: "Como você costuma construir seu guarda-roupa ideal?",
    options: [
      { text: "Peças atemporais, tecidos leves e uma paleta neutra", profile: "clean" },
      { text: "Silhuetas autorais, designers independentes e combinações inesperadas", profile: "artsy" },
      { text: "Tecidos fluidos, detalhes delicados e um toque luminoso", profile: "soft" },
      { text: "Itens statement, acabamentos metalizados e referências futuristas", profile: "y2k" }
    ]
  },
  {
    question: "Qual ambiente combina melhor com o seu ritmo criativo?",
    options: [
      { text: "Um apartamento iluminado, organizado e cheio de design contemporâneo", profile: "clean" },
      { text: "Uma galeria urbana, um ateliê ou uma cidade em movimento", profile: "artsy" },
      { text: "Uma casa charmosa, com flores, luz suave e objetos afetivos", profile: "soft" },
      { text: "Um rooftop, uma exposição digital ou o backstage de um evento", profile: "y2k" }
    ]
  },
  {
    question: "Qual referência cultural mais conversa com você?",
    options: [
      { text: "Música ambiente, fotografia editorial e arquitetura escandinava", profile: "clean" },
      { text: "Hip-hop experimental, arte de rua e moda alternativa", profile: "artsy" },
      { text: "Indie pop delicado, cinema romântico e estética fine art", profile: "soft" },
      { text: "Pop eletrônico, videoclipes, cultura digital e nostalgia dos anos 2000", profile: "y2k" }
    ]
  },
  {
    question: "Quando precisa tomar uma decisão importante, qual é sua abordagem?",
    options: [
      { text: "Avalio prioridades, simplifico o cenário e escolho o que gera equilíbrio", profile: "clean" },
      { text: "Confio na minha visão própria e busco uma solução original", profile: "artsy" },
      { text: "Escuto minhas emoções e considero como a escolha afeta as pessoas", profile: "soft" },
      { text: "Analiso tendências, arrisco uma nova possibilidade e sigo com intensidade", profile: "y2k" }
    ]
  },
  {
    question: "Qual elemento visual você incluiria em sua assinatura estética?",
    options: [
      { text: "Linhas puras, contraste suave e branding refinado", profile: "clean" },
      { text: "Mistura de texturas, grafismos fortes e proporções experimentais", profile: "artsy" },
      { text: "Cores luminosas, brilho delicado e composição harmoniosa", profile: "soft" },
      { text: "Chrome, neons, transparências e visuais que parecem vir do futuro", profile: "y2k" }
    ]
  },
  {
    question: "Como você prefere se destacar em uma ocasião especial?",
    options: [
      { text: "Com elegância discreta: poucos detalhes, muito impacto", profile: "clean" },
      { text: "Com uma produção diferente, que revele exatamente minha personalidade", profile: "artsy" },
      { text: "Com uma presença acolhedora, luminosa e naturalmente sofisticada", profile: "soft" },
      { text: "Com uma energia magnética e um look impossível de ignorar", profile: "y2k" }
    ]
  }
];

const vibeProfiles = {
  clean: {
    title: "Minimalista Chic / Clean Girl",
    symbol: "C—01",
    description: "Sua estética nasce da clareza. Você comunica sofisticação por meio de escolhas precisas, materiais bons e um visual que permanece relevante além de tendências passageiras.",
    pieces: ["Camisa oversized em algodão premium", "Calça reta de alfaiataria", "Scarpin nude ou tênis couro branco"],
    hair: ["Bob texturizado com acabamento natural", "Coque baixo polido ou sleek bun"],
    nails: [
      { name: "Nude translúcido", color: "#d7bca9" },
      { name: "Branco-milk", color: "#f5f1e8" },
      { name: "Verniz rosado", color: "#c98f9d" }
    ],
    essence: "Palavras-chave: discrição, precisão, elegância. Acessórios: joias finas, óculos geométricos e bolsa estruturada."
  },
  artsy: {
    title: "Streetwear Criativo / Artsy",
    symbol: "A—02",
    description: "Você transforma estilo em linguagem própria. Sua presença é urbana e autoral, misturando referências culturais, proporções ousadas e uma atenção genuína à singularidade.",
    pieces: ["Jaqueta utilitária ou oversized", "Denim desconstruído em lavagem escura", "Tênis editorial ou botas de plataforma"],
    hair: ["Corte mullet suave com volume", "Coque ou trança assimétrica com textura"],
    nails: [
      { name: "Preto grafite", color: "#28242b" },
      { name: "Prata cromado", color: "#aeb2bd" },
      { name: "Azul elétrico", color: "#2f67ff" }
    ],
    essence: "Palavras-chave: autenticidade, contraste, experimentação. Acessórios: óculos esculturais, bolsa crossbody e peças de prata."
  },
  soft: {
    title: "Romântica Moderna / Soft Glam",
    symbol: "R—03",
    description: "Seu estilo equilibra suavidade e presença. Você valoriza texturas luminosas, silhuetas fluidas e detalhes que parecem delicados à primeira vista, mas carregam muita intenção.",
    pieces: ["Blusa em renda leve ou organza", "Vestido midi com corte fluido", "Sapato delicado ou ballet slipper moderno"],
    hair: ["Camadas longas com ondas soltas", "Rabo baixo acetinado ou coque romântico"],
    nails: [
      { name: "Champagne perolado", color: "#d6b986" },
      { name: "Rosa leitoso", color: "#e7b3be" },
      { name: "Amêndoa glossy", color: "#c5a58f" }
    ],
    essence: "Palavras-chave: luminosidade, charme, feminilidade contemporânea. Acessórios: pérolas modernas, dourado suave e lenços de seda."
  },
  y2k: {
    title: "Y2K / Pop Futurista",
    symbol: "Y—04",
    description: "Sua vibe é magnética, tecnológica e consciente das tendências sem depender delas. Você combina brilho, cor e atitude em produções que parecem feitas para ocupar o centro da cena.",
    pieces: ["Top metalizado ou assimétrico", "Calça low-rise com corte amplo", "Óculos fashion e tênis plataformado"],
    hair: ["Hair flip longo com pontas espelhadas", "Space buns ou cabelo curto com textura"],
    nails: [
      { name: "Pink holográfico", color: "#ff4da6" },
      { name: "Lilás chrome", color: "#9b72cf" },
      { name: "Prata espelhado", color: "#cfd0dc" }
    ],
    essence: "Palavras-chave: intensidade, futuro, visibilidade. Acessórios: corrente prateada, mini bags, pedrarias e cores líquidas."
  }
};

let quizQuestionIndex = 0;
let vibeScores = { clean: 0, artsy: 0, soft: 0, y2k: 0 };

function resetQuiz() {
  quizQuestionIndex = 0;
  vibeScores = { clean: 0, artsy: 0, soft: 0, y2k: 0 };
  vibeResult.hidden = true;
  quizQuestionCard.hidden = false;
  quizQuestionCard.classList.remove("is-leaving");
  renderQuizQuestion();
}

function renderQuizQuestion() {
  const current = quizQuestions[quizQuestionIndex];
  const progress = Math.round(((quizQuestionIndex + 1) / quizQuestions.length) * 100);

  quizStepLabel.textContent = `Pergunta ${String(quizQuestionIndex + 1).padStart(2, "0")} / ${quizQuestions.length}`;
  quizProgressText.textContent = `${progress}%`;
  quizProgressFill.style.width = `${progress}%`;
  quizProgress.setAttribute("aria-valuenow", progress);
  quizQuestion.textContent = current.question;
  quizOptions.innerHTML = "";

  current.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "quiz-option";
    button.innerHTML = `<span class="option-index">0${index + 1}</span><span>${option.text}</span>`;
    button.addEventListener("click", () => selectQuizAnswer(option.profile));
    quizOptions.appendChild(button);
  });
}

function selectQuizAnswer(profile) {
  vibeScores[profile] += 1;
  quizQuestionIndex += 1;

  quizQuestionCard.classList.add("is-leaving");
  window.setTimeout(() => {
    quizQuestionCard.classList.remove("is-leaving");
    if (quizQuestionIndex < quizQuestions.length) {
      renderQuizQuestion();
    } else {
      showVibeResult();
    }
  }, 220);
}

function showVibeResult() {
  const winner = Object.keys(vibeScores).reduce((highest, profile) =>
    vibeScores[profile] > vibeScores[highest] ? profile : highest
  );
  const result = vibeProfiles[winner];

  quizProgressText.textContent = "100%";
  quizProgressFill.style.width = "100%";
  quizProgress.setAttribute("aria-valuenow", "100");
  quizStepLabel.textContent = "Dossiê completo";
  quizQuestionCard.hidden = true;
  vibeResultEmoji.textContent = result.symbol;
  vibeResultTitle.textContent = result.title;
  vibeResultDescription.textContent = result.description;

  dossierPieces.innerHTML = result.pieces.map((item) => `<li>${item}</li>`).join("");
  dossierHair.innerHTML = result.hair.map((item) => `<li>${item}</li>`).join("");
  dossierNails.innerHTML = result.nails.map((item) =>
    `<li><span class="nail-swatch" style="--nail-color:${item.color}"></span><span>${item.name}</span></li>`
  ).join("");
  dossierEssence.textContent = result.essence;

  vibeResult.hidden = false;
  addStars(10);
}

function updateSoundButton() {
  soundButton.setAttribute("aria-pressed", String(soundEnabled));
  soundButton.setAttribute("aria-label", soundEnabled ? "Mutar som" : "Ativar som");
  soundButton.innerHTML = soundEnabled
    ? '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M11 5 6.5 9H3v6h3.5l4.5 4zm4.5 4.5a5 5 0 0 1 0 5M18 7a8 8 0 0 1 0 10" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    : '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M11 5 6.5 9H3v6h3.5l4.5 4zm5 5 5 5m0-5-5 5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
}

function playSparkleSound() {
  if (!soundEnabled) return;

  try {
    audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
    if (audioContext.state === "suspended") audioContext.resume();

    const now = audioContext.currentTime;
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(880, now);
    oscillator.frequency.exponentialRampToValueAtTime(1320, now + .12);
    gain.gain.setValueAtTime(.0001, now);
    gain.gain.exponentialRampToValueAtTime(.09, now + .015);
    gain.gain.exponentialRampToValueAtTime(.0001, now + .22);

    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start(now);
    oscillator.stop(now + .23);
  } catch (error) {
    soundEnabled = false;
    updateSoundButton();
  }
}

function addStars(amount = 10) {
  stars += amount;
  starCount.textContent = stars;

  try {
    localStorage.setItem("pinkSparkleStars", String(stars));
  } catch (error) {
    // localStorage pode estar indisponível em navegadores com restrições.
  }

  starCounter.classList.remove("gain");
  void starCounter.offsetWidth;
  starCounter.classList.add("gain");
  playSparkleSound();
}

updateSoundButton();

soundButton.addEventListener("click", () => {
  soundEnabled = !soundEnabled;
  try {
    localStorage.setItem("pinkSparkleSound", soundEnabled ? "on" : "off");
  } catch (error) {
    // Mantém o som ativo apenas nesta sessão quando o storage falhar.
  }
  updateSoundButton();
  playSparkleSound();
});

document.querySelectorAll(".play-button").forEach((button) => {
  button.addEventListener("click", () => playSparkleSound());
});

backButton.addEventListener("click", () => playSparkleSound());
quizRestartButton.addEventListener("click", () => playSparkleSound());

const dossierPieces = document.getElementById("dossierPieces");
const dossierHair = document.getElementById("dossierHair");
const dossierNails = document.getElementById("dossierNails");
const dossierEssence = document.getElementById("dossierEssence");

// Configuração opcional da API de visão: defina este endpoint em produção.
// Esperado: POST multipart/form-data com campo "images" e JSON opcional "preferences".
// Resposta: { pieces: [{ category, name, color, print, style }] }
const LOOKS_VISION_API = "";

const outfitUpload = document.getElementById("outfitUpload");
const uploadDropzone = document.getElementById("uploadDropzone");
const uploadError = document.getElementById("uploadError");
const pieceCounter = document.getElementById("pieceCounter");
const wardrobeEmpty = document.getElementById("wardrobeEmpty");
const categorySections = document.getElementById("categorySections");
const assembleLooksButton = document.getElementById("assembleLooksButton");
const newLooksButton = document.getElementById("newLooksButton");
const showSavedLooksButton = document.getElementById("showSavedLooksButton");
const wardrobeView = document.getElementById("wardrobeView");
const lookResultsView = document.getElementById("lookResultsView");
const savedLooksView = document.getElementById("savedLooksView");
const lookResultsGrid = document.getElementById("lookResultsGrid");
const savedLooksGrid = document.getElementById("savedLooksGrid");

let wardrobePieces = [];
let generatedLooks = [];
let savedLooks = [];

try {
  wardrobePieces = JSON.parse(localStorage.getItem("pinkSparkleWardrobe") || "[]");
  savedLooks = JSON.parse(localStorage.getItem("pinkSparkleSavedLooks") || "[]");
} catch (error) {
  wardrobePieces = [];
  savedLooks = [];
}

const categoryLabels = {
  tops: "Blusas e camisetas",
  pants: "Calças",
  shorts: "Shorts",
  skirts: "Saias",
  dresses: "Vestidos",
  outerwear: "Casacos e jaquetas",
  sets: "Conjuntos",
  sneakers_shoes: "Tênis e sapatos",
  sandals: "Sandálias e rasteirinhas",
  bags: "Bolsas",
  accessories: "Acessórios",
  unidentified: "Não identificadas"
};

function persistOrganizerData() {
  try {
    localStorage.setItem("pinkSparkleWardrobe", JSON.stringify(wardrobePieces));
    localStorage.setItem("pinkSparkleSavedLooks", JSON.stringify(savedLooks));
  } catch (error) {
    showUploadError("Seu navegador limitou o armazenamento. Fotos já adicionadas podem não permanecer após recarregar.");
  }
}

function showUploadError(message) {
  uploadError.textContent = message;
  uploadError.hidden = false;
}

function normalizeCategory(category) {
  const normalized = String(category || "").toLowerCase();
  const aliases = {
    top: "tops", blouse: "tops", shirt: "tops", blusa: "tops", camiseta: "tops", tops: "tops",
    pants: "pants", calca: "pants", calças: "pants", calça: "pants", jeans: "pants", bottom: "pants", bottoms: "pants",
    shorts: "shorts", bermuda: "shorts",
    skirt: "skirts", saia: "skirts", skirts: "skirts",
    dress: "dresses", vestido: "dresses", dresses: "dresses",
    outerwear: "outerwear", jacket: "outerwear", casaco: "outerwear", jaqueta: "outerwear", coat: "outerwear",
    set: "sets", conjunto: "sets", sets: "sets",
    shoe: "sneakers_shoes", shoes: "sneakers_shoes", sneaker: "sneakers_shoes", tenis: "sneakers_shoes", tênis: "sneakers_shoes", sapato: "sneakers_shoes", sneakers_shoes: "sneakers_shoes",
    sandal: "sandals", sandalias: "sandals", sandália: "sandals", rasteirinha: "sandals", sandals: "sandals",
    bag: "bags", bolsa: "bags", bags: "bags", bolsa: "bags",
    accessory: "accessories", accessories: "accessories", acessorio: "accessories", acessórios: "accessories",
    unidentified: "unidentified", unknown: "unidentified", não_identificada: "unidentified"
  };
  return aliases[normalized] || (categoryLabels[normalized] ? normalized : "unidentified");
}

function inferCategory(fileName) {
  const name = String(fileName || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  if (/vestid|dress/.test(name)) return "dresses";
  if (/saia|skirt/.test(name)) return "skirts";
  if (/jaqueta|casaco|coat|jacket|blazer/.test(name)) return "outerwear";
  if (/conjunto|set/.test(name)) return "sets";
  if (/short|bermuda/.test(name)) return "shorts";
  if (/calca|pants|jeans|leggin/.test(name)) return "pants";
  if (/sandalia|rasteirinha|slide|flat/.test(name)) return "sandals";
  if (/sapato|tenis|sneaker|bota|shoe|heel/.test(name)) return "sneakers_shoes";
  if (/bolsa|bag|mochila|clutch/.test(name)) return "bags";
  if (/acessor|cinto|colar|pulseira|brinco|anel|oculos|gorro|bone/.test(name)) return "accessories";
  if (/blusa|camiseta|top|cropped|camisa|body|cardigan/.test(name)) return "tops";
  return "unidentified";
}

function readDominantColor(imageDataUrl) {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const size = 24;
      canvas.width = size;
      canvas.height = size;
      const context = canvas.getContext("2d", { willReadFrequently: true });
      context.drawImage(image, 0, 0, size, size);
      const data = context.getImageData(0, 0, size, size).data;
      const buckets = {};
      for (let index = 0; index < data.length; index += 16) {
        const r = data[index], g = data[index + 1], b = data[index + 2];
        if (r > 248 && g > 248 && b > 248) continue;
        const key = `${Math.round(r / 32) * 32},${Math.round(g / 32) * 32},${Math.round(b / 32) * 32}`;
        buckets[key] = (buckets[key] || 0) + 1;
      }
      const dominant = Object.entries(buckets).sort((a, b) => b[1] - a[1])[0]?.[0] || "180,180,180";
      resolve(`rgb(${dominant})`);
    };
    image.onerror = () => resolve("rgb(180,180,180)");
    image.src = imageDataUrl;
  });
}

// Lê a foto enviada e já devolve a versão reduzida (é ela que vai para o localStorage).
function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resizeImage(reader.result).then(resolve, reject);
    reader.onerror = () => reject(new Error("Não foi possível ler esta imagem."));
    reader.readAsDataURL(file);
  });
}

// Reduz a foto para no máximo 800px no lado maior e salva como JPEG qualidade 0.7,
// para o closet não estourar o limite do localStorage (uns 5 MB).
function resizeImage(dataUrl, maxSize = 800, quality = 0.7) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(image.width * scale);
      canvas.height = Math.round(image.height * scale);
      const context = canvas.getContext("2d");
      context.fillStyle = "#ffffff"; // fundo branco para PNG/WEBP com transparência
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    image.onerror = () => reject(new Error("Não foi possível ler esta imagem."));
    image.src = dataUrl;
  });
}

async function sendImagesToVisionApi(files) {
  if (!LOOKS_VISION_API) return null;
  const formData = new FormData();
  files.forEach((file) => formData.append("images", file));
  formData.append("preferences", JSON.stringify({
    style: document.getElementById("stylePreference").value,
    occasion: document.getElementById("occasionPreference").value,
    mood: document.getElementById("moodPreference").value
  }));
  const response = await fetch(LOOKS_VISION_API, { method: "POST", body: formData });
  if (!response.ok) throw new Error(`A API de visão respondeu com erro ${response.status}.`);
  return response.json();
}

function createImageSignature(dataUrl) {
  if (!dataUrl) return "";
  return dataUrl.slice(0, 128) + dataUrl.length + dataUrl.slice(-128);
}

function migrateAndClassifyStoredPieces() {
  let changed = false;
  wardrobePieces = wardrobePieces.filter((piece, index, pieces) => {
    if (!piece || !piece.image) return false;
    const signature = piece.signature || createImageSignature(piece.image);
    const duplicateIndex = pieces.findIndex((other) => other && (other.signature || createImageSignature(other.image)) === signature);
    if (duplicateIndex !== index) return false;
    return true;
  });

  wardrobePieces.forEach((piece) => {
    if (!piece.signature) {
      piece.signature = createImageSignature(piece.image);
      changed = true;
    }

    const oldCategory = piece.category;
    let category;

    if (piece.categoryConfirmed) {
      category = normalizeCategory(oldCategory);
    } else {
      const visualCategory = inferCategory(piece.name);
      if (visualCategory !== "unidentified") {
        category = visualCategory;
      } else if (["pants", "bottoms", "shorts", "skirts", "dresses", "outerwear", "sets", "sneakers_shoes", "sandals", "bags", "accessories"].includes(oldCategory)) {
        category = normalizeCategory(oldCategory);
        if (oldCategory === "bottoms") category = "pants";
        if (oldCategory === "shoes") category = "sneakers_shoes";
      } else {
        category = "unidentified";
      }
    }

    if (!categoryLabels[category]) category = "unidentified";
    if (piece.category !== category) {
      piece.category = category;
      changed = true;
    }
  });

  if (changed) persistOrganizerData();
}

migrateAndClassifyStoredPieces();

if (outfitUpload) {
  outfitUpload.addEventListener("change", async (event) => {
    uploadError.hidden = true;
    const files = [...event.target.files];
    if (!files.length) return;
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    const invalid = files.find((file) => !validTypes.includes(file.type));
    if (invalid) {
      showUploadError("Formato inválido. Use imagens JPG, PNG ou WEBP.");
      outfitUpload.value = "";
      return;
    }

    try {
      const dataUrls = await Promise.all(files.map(fileToDataUrl));
      const localColors = await Promise.all(dataUrls.map(readDominantColor));
      let apiPieces = null;
      try { apiPieces = await sendImagesToVisionApi(files); } catch (error) { showUploadError(`${error.message} Será usada a análise local.`); }

      files.forEach((file, index) => {
        const apiPiece = apiPieces?.pieces?.[index];
        const signature = createImageSignature(dataUrls[index]);
        if (wardrobePieces.some((piece) => piece.signature === signature || piece.image === dataUrls[index])) return;
        const apiCategory = normalizeCategory(apiPiece?.category);
        const inferredCategory = inferCategory(file.name);
        const category = apiPiece?.category ? apiCategory : inferredCategory;
        wardrobePieces.push({
          id: `${Date.now()}-${index}-${Math.random().toString(16).slice(2)}`,
          signature,
          name: apiPiece?.name || file.name.replace(/\.[^.]+$/, ""),
          category,
          categoryConfirmed: Boolean(apiPiece?.category),
          color: apiPiece?.color || localColors[index],
          print: apiPiece?.print || "liso ou neutro",
          style: apiPiece?.style || "versátil",
          image: dataUrls[index],
          uses: 0
        });
      });
      persistOrganizerData();
      renderWardrobe();
      outfitUpload.value = "";
    } catch (error) {
      showUploadError(error.message || "Não foi possível processar as imagens.");
    }
  });

  ["dragenter", "dragover"].forEach((eventName) => uploadDropzone.addEventListener(eventName, (event) => {
    event.preventDefault(); uploadDropzone.classList.add("is-dragging");
  }));
  ["dragleave", "drop"].forEach((eventName) => uploadDropzone.addEventListener(eventName, (event) => {
    event.preventDefault(); uploadDropzone.classList.remove("is-dragging");
  }));
  uploadDropzone.addEventListener("drop", (event) => {
    if (event.dataTransfer.files.length) {
      const transfer = new DataTransfer();
      [...event.dataTransfer.files].forEach((file) => transfer.items.add(file));
      outfitUpload.files = transfer.files;
      outfitUpload.dispatchEvent(new Event("change", { bubbles: true }));
    }
  });
}

function renderWardrobe() {
  pieceCounter.textContent = `${wardrobePieces.length} ${wardrobePieces.length === 1 ? "peça" : "peças"}`;
  assembleLooksButton.disabled = wardrobePieces.length < 2;
  wardrobeEmpty.hidden = wardrobePieces.length > 0;
  categorySections.innerHTML = "";

  const categoryOptions = Object.entries(categoryLabels).map(([value, label]) => `<option value="${value}">${label}</option>`).join("");

  Object.entries(categoryLabels).forEach(([category, label]) => {
    const pieces = wardrobePieces.filter((piece) => piece.category === category);
    if (!pieces.length) return;
    const section = document.createElement("section");
    section.className = "wardrobe-category";
    section.innerHTML = `<div class="wardrobe-category-heading"><h4>${label}</h4><span>${pieces.length}</span></div><div class="wardrobe-piece-grid"></div>`;
    const grid = section.querySelector(".wardrobe-piece-grid");

    pieces.forEach((piece) => {
      const card = document.createElement("article");
      card.className = "wardrobe-piece";
      card.innerHTML = `<button class="piece-remove" type="button" aria-label="Excluir ${piece.name}">×</button>
        <img src="${piece.image}" alt="${piece.name}">
        <div><input class="wardrobe-name-edit" value="${String(piece.name).replace(/"/g, '&quot;')}" aria-label="Nome da peça"><small>${piece.print}</small>
          <select class="wardrobe-category-edit" aria-label="Categoria da peça">${categoryOptions}</select>
        </div>
        <button class="combine-piece" type="button" data-id="${piece.id}">Combinar peça</button>`;

      const nameEdit = card.querySelector(".wardrobe-name-edit");
      const categoryEdit = card.querySelector(".wardrobe-category-edit");
      categoryEdit.value = category;

      nameEdit.addEventListener("change", () => {
        piece.name = nameEdit.value.trim() || piece.name;
        persistOrganizerData();
      });
      categoryEdit.addEventListener("change", () => {
        piece.category = normalizeCategory(categoryEdit.value);
        piece.categoryConfirmed = true;
        persistOrganizerData();
        renderWardrobe();
      });

      card.querySelector(".piece-remove").addEventListener("click", () => {
        wardrobePieces = wardrobePieces.filter((item) => item.id !== piece.id);
        persistOrganizerData();
        renderWardrobe();
      });
      card.querySelector(".combine-piece").addEventListener("click", () => {
        selectBasePiece(piece.id);
        switchOrganizerView("piece");
      });
      grid.appendChild(card);
    });
    categorySections.appendChild(section);
  });
}

function makeLookName(index, style) {
  const names = {
    casual: ["Casual Chic", "Passeio do Domingo", "Relax & Elegante"],
    elegante: ["Elegante Atemporal", "Noite Refinada", "Executive Glow"],
    romantico: ["Romance em Paris", "Soft & Feminina", "Sonho Leve"],
    streetwear: ["Street Muse", "Urbana Criativa", "Off Duty Cool"],
    minimalista: ["Clean Girl", "Essência Minimal", "Pure Lines"],
    patricinha: ["Pinterest Girl", "Pink Social Club", "Glam da Moda"]
  };
  const options = names[style] || names.casual;
  return options[index % options.length];
}

function categoryMatches(pieceCategory, wantedCategory) {
  if (wantedCategory === "bottoms") return ["pants", "bottoms", "skirts", "shorts"].includes(pieceCategory);
  if (wantedCategory === "shoes") return ["shoes", "sneakers_shoes", "sandals"].includes(pieceCategory);
  if (wantedCategory === "tops") return ["tops"].includes(pieceCategory);
  if (wantedCategory === "skirts") return pieceCategory === "skirts";
  if (wantedCategory === "pants") return ["pants", "bottoms"].includes(pieceCategory);
  if (wantedCategory === "shorts") return pieceCategory === "shorts";
  if (wantedCategory === "accessories") return ["accessories", "bags"].includes(pieceCategory);
  return pieceCategory === wantedCategory;
}

function getCompatiblePiece(category, excludedIds = [], offset = 0) {
  const available = wardrobePieces.filter((piece) => categoryMatches(piece.category, category) && !excludedIds.includes(piece.id));
  return available.length ? available[(offset % available.length + available.length) % available.length] : null;
}

function generateLooks(requiredPieceId = null) {
  if (wardrobePieces.length < 2) {
    showUploadError("Adicione pelo menos duas peças para montar combinações.");
    return;
  }

  const style = document.getElementById("stylePreference").value;
  const occasion = document.getElementById("occasionPreference").value;
  const mood = document.getElementById("moodPreference").value;
  const required = wardrobePieces.find((piece) => piece.id === requiredPieceId);
  const looks = [];

  for (let index = 0; index < 3; index += 1) {
    let top, bottom, dress, outer, shoes, accessory;
    if (required) {
      if (["tops", "dresses", "outerwear"].includes(required.category)) top = required;
      else if (["bottoms", "skirts"].includes(required.category)) bottom = required;
      else if (required.category === "shoes") shoes = required;
      else accessory = required;
    }

    top ||= getCompatiblePiece("tops", top ? [top.id] : [], index);
    bottom ||= getCompatiblePiece("bottoms", [], index) || getCompatiblePiece("skirts", [], index);
    dress = getCompatiblePiece("dresses", [], index) || dress;
    outer = getCompatiblePiece("outerwear", [], index);
    shoes ||= getCompatiblePiece("shoes", [], index);
    accessory ||= getCompatiblePiece("accessories", [], index);

    if (!top && dress) top = null;
    if (!top && !dress) top = wardrobePieces.find((piece) => piece.category === "tops") || wardrobePieces[index % wardrobePieces.length];

    const selected = [];
    if (dress) selected.push(dress); else { if (top) selected.push(top); if (bottom) selected.push(bottom); }
    if (outer) selected.push(outer); if (shoes) selected.push(shoes); if (accessory) selected.push(accessory);
    const unique = [...new Map(selected.map((piece) => [piece.id, piece])).values()].slice(0, index === 2 ? 5 : 4);

    looks.push({
      id: `${Date.now()}-${index}-${Math.random().toString(16).slice(2)}`,
      name: makeLookName(index, style),
      pieces: unique,
      reason: `Uma combinação ${mood} com equilíbrio de volumes e cores para ${occasion}, seguindo o estilo ${style}.`,
      accessories: accessory ? `Complemente com ${accessory.name.toLowerCase()} e joias discretas.` : "Adicione joias delicadas e uma bolsa estruturada.",
      occasions: `${occasion} · passeio · encontro`,
      favorite: false
    });
  }

  generatedLooks = looks;
  renderLooks(lookResultsGrid, generatedLooks, false);
  switchOrganizerView("results");
  addStars(5);
}

function renderLooks(container, looks, areSaved) {
  container.innerHTML = "";
  if (!looks.length) {
    container.innerHTML = '<div class="saved-empty"><span>♡</span><h3>Nenhum look salvo ainda</h3><p>Favorite suas combinações preferidas.</p></div>';
    return;
  }

  looks.forEach((look) => {
    const card = document.createElement("article");
    card.className = "look-card";
    const isFavorite = savedLooks.some((saved) => saved.id === look.id);
    card.innerHTML = `<div class="look-preview">${look.pieces.slice(0, 4).map((piece, index) => `<img src="${piece.image}" alt="${piece.name}" style="--piece-index:${index};${illustrationStyle(piece)}">`).join("")}</div>
      <div class="look-card-body"><div class="look-card-heading"><div><p class="section-kicker">Sua sugestão</p><h3>${look.name}</h3></div><button class="favorite-look ${isFavorite ? "active" : ""}" type="button" aria-label="Favoritar look">${isFavorite ? "♥" : "♡"}</button></div>
      <div class="look-piece-list"><strong>Peças:</strong> ${look.pieces.map((piece) => piece.name).join(" · ")}</div>
      <p class="look-reason">${look.reason}</p><p><strong>Acompanhe com:</strong> ${look.accessories}</p><div class="look-occasion">◷ ${look.occasions}</div>
      ${areSaved ? '<button class="remove-saved-look" type="button">Remover dos favoritos</button>' : ""}</div>`;

    card.querySelector(".favorite-look").addEventListener("click", (event) => {
      const existing = savedLooks.findIndex((saved) => saved.id === look.id);
      if (existing >= 0) {
        savedLooks.splice(existing, 1); event.currentTarget.textContent = "♡"; event.currentTarget.classList.remove("active");
      } else {
        savedLooks.push({ ...look, favorite: true }); event.currentTarget.textContent = "♥"; event.currentTarget.classList.add("active");
      }
      persistOrganizerData(); renderSavedLooks();
    });
    const removeButton = card.querySelector(".remove-saved-look");
    if (removeButton) removeButton.addEventListener("click", () => {
      savedLooks = savedLooks.filter((saved) => saved.id !== look.id); persistOrganizerData(); renderSavedLooks();
    });
    container.appendChild(card);
  });
}

function renderSavedLooks() {
  renderLooks(savedLooksGrid, savedLooks, true);
}

function switchOrganizerView(view) {
  wardrobeView.hidden = view !== "wardrobe";
  pieceMatchView.hidden = view !== "piece";
  lookResultsView.hidden = view !== "results";
  savedLooksView.hidden = view !== "saved";
  document.querySelectorAll(".organizer-tab").forEach((tab) => tab.classList.toggle("active", tab.dataset.tab === view));
  if (view === "piece") {
    renderPiecePicker();
    renderPieceHistory();
  }
}

if (assembleLooksButton) assembleLooksButton.addEventListener("click", () => generateLooks());
if (newLooksButton) newLooksButton.addEventListener("click", () => generateLooks());
if (showSavedLooksButton) showSavedLooksButton.addEventListener("click", () => { renderSavedLooks(); switchOrganizerView("saved"); });

document.querySelectorAll(".organizer-tab").forEach((tab) => tab.addEventListener("click", () => {
  if (tab.dataset.tab === "wardrobe") switchOrganizerView("wardrobe");
  else if (tab.dataset.tab === "piece") switchOrganizerView("piece");
  else if (tab.dataset.tab === "results") { renderLooks(lookResultsGrid, generatedLooks, false); switchOrganizerView("results"); }
}));

const pieceMatchView = document.getElementById("pieceMatchView");
const pieceMatchPicker = document.getElementById("pieceMatchPicker");
const selectedPieceStage = document.getElementById("selectedPieceStage");
const pieceGenerateButton = document.getElementById("pieceGenerateButton");
const pieceLookResults = document.getElementById("pieceLookResults");
const pieceLookGrid = document.getElementById("pieceLookGrid");
const pieceMoreLooksButton = document.getElementById("pieceMoreLooksButton");
const pieceMatchUpload = document.getElementById("pieceMatchUpload");
const pieceHistoryButton = document.getElementById("pieceHistoryButton");
const pieceHistoryPanel = document.getElementById("pieceHistoryPanel");
const pieceHistoryGrid = document.getElementById("pieceHistoryGrid");

let selectedBasePiece = null;
let pieceFilterCategory = "all";
let pieceGeneratedLooks = [];
let pieceHistory = [];

try {
  pieceHistory = JSON.parse(localStorage.getItem("pinkSparklePieceHistory") || "[]");
} catch (error) {
  pieceHistory = [];
}

// Transforma uma ficha (do catalogo.js ou do pecas-ilustradas.js) no formato das peças do upload.
const fichaToPiece = (peca) => ({
  id: `catalogo-${peca.id}`,
  name: peca.nome,
  category: peca.categoria,
  color: peca.cor,
  colorHex: peca.corHex,
  print: peca.estampada ? "estampada" : "liso ou neutro",
  style: peca.estilos.join(", "),
  styles: peca.estilos,
  image: peca.arquivo,
  formality: peca.formalidade,
  colorFamily: peca.familiaCor,
  occasions: peca.ocasioes,
  season: peca.estacao,
  fromCatalog: true,
  isIllustration: peca.tipo === "ilustracao"
});

// Fotos reais do catálogo e desenhos gerados pelo pecas-ilustradas.js.
const catalogPieces = (window.CATALOGO_PECAS || []).map(fichaToPiece);
const illustratedPieces = (window.PECAS_ILUSTRADAS || []).map(fichaToPiece);

// Peças com FOTO: catálogo + peças que a pessoa enviou.
function getAllPieces() {
  return [...catalogPieces, ...wardrobePieces];
}

// Desenhos aparecem inteiros no card (sem cortar as pontas), com o mesmo rosinha do fundo do desenho.
// Fotos continuam como antes. O tamanho do card não muda.
function illustrationStyle(piece) {
  return piece.isIllustration ? "object-fit:contain;background:#fff6fa;" : "";
}

// Procura uma peça pelo id em todas as listas (fotos e ilustrações).
function findPieceById(pieceId) {
  return [...getAllPieces(), ...illustratedPieces].find((piece) => piece.id === pieceId) || null;
}

function persistPieceHistory() {
  try { localStorage.setItem("pinkSparklePieceHistory", JSON.stringify(pieceHistory)); }
  catch (error) { showUploadError("Não foi possível salvar o histórico neste navegador."); }
}

function renderPiecePicker() {
  if (!pieceMatchPicker) return;
  let pieces = pieceFilterCategory === "all"
    ? getAllPieces()
    : getAllPieces().filter((piece) => piece.category === pieceFilterCategory);

  // Categoria sem nenhuma foto (ex.: vestidos)? Mostra as ilustrações dela.
  if (!pieces.length && pieceFilterCategory !== "all") {
    pieces = illustratedPieces.filter((piece) => piece.category === pieceFilterCategory);
  }

  if (!pieces.length) {
    pieceMatchPicker.innerHTML = '<p class="piece-alternative-note">Ainda não tenho peças desta categoria no catálogo. Use “Adicionar peça”.</p>';
    return;
  }

  pieceMatchPicker.innerHTML = "";
  pieces.forEach((piece) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `piece-picker-card ${selectedBasePiece?.id === piece.id ? "selected" : ""}`;
    button.innerHTML = `<img src="${piece.image}" alt="${piece.name}" style="${illustrationStyle(piece)}"><span>${piece.name}</span>`;
    button.addEventListener("click", () => selectBasePiece(piece.id));
    pieceMatchPicker.appendChild(button);
  });
}

function selectBasePiece(pieceId) {
  selectedBasePiece = findPieceById(pieceId);
  pieceLookResults.hidden = true;

  if (!selectedBasePiece) {
    selectedPieceStage.innerHTML = '<div class="selected-piece-placeholder"><span>✦</span><p>Escolha uma peça abaixo para começar</p></div>';
  } else {
    const secondary = selectedBasePiece.print !== "liso ou neutro" ? selectedBasePiece.print : (selectedBasePiece.color || "cor identificada");
    selectedPieceStage.innerHTML = `<div class="selected-piece-feature"><img src="${selectedBasePiece.image}" alt="${selectedBasePiece.name}" style="${illustrationStyle(selectedBasePiece)}"><div class="selected-piece-details"><p class="section-kicker">Peça principal</p><h4>${selectedBasePiece.name}</h4><p><strong>Categoria:</strong> ${categoryLabels[selectedBasePiece.category]}</p><p><strong>Visual:</strong> ${secondary}</p><p><strong>Estilo:</strong> ${selectedBasePiece.style || "versátil"}</p></div></div>`;
  }
  renderPiecePicker();
}

if (pieceFilterRow) {
  pieceFilterRow.querySelectorAll(".piece-filter").forEach((button) => {
    button.addEventListener("click", () => {
      pieceFilterRow.querySelectorAll(".piece-filter").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      pieceFilterCategory = button.dataset.category;
      renderPiecePicker();
    });
  });
}

const pieceElegantButton = document.getElementById("pieceElegantButton");
const pieceCasualButton = document.getElementById("pieceCasualButton");

if (pieceMatchUpload) {
  pieceMatchUpload.addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      showUploadError("Formato inválido. Use JPG, PNG ou WEBP.");
      return;
    }
    try {
      const image = await fileToDataUrl(file);
      const color = await readDominantColor(image);
      let analyzed = null;
      try {
        const apiResult = await sendImagesToVisionApi([file]);
        analyzed = apiResult?.pieces?.[0] || null;
      } catch (analysisError) {
        showUploadError("A análise visual avançada ficou indisponível. Foi usada uma análise segura da imagem.");
      }
      const addedCategory = analyzed?.category ? normalizeCategory(analyzed.category) : inferCategory(file.name);
      const added = {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        name: file.name.replace(/\.[^.]+$/, ""),
        category: addedCategory,
        color,
        print: "liso ou neutro",
        style: "versátil",
        image,
        uses: 0
      };
      wardrobePieces.push(added);
      persistOrganizerData();
      renderWardrobe();
      selectBasePiece(added.id);
      renderPiecePicker();
      pieceMatchUpload.value = "";
    } catch (error) {
      showUploadError(error.message || "Não foi possível adicionar a peça.");
    }
  });
}

// ===== Combinar uma peça: regras simples, sem IA =====

// "Vagas" que completam um look. reference = categoria das fotos do Unsplash usada se faltar peça.
const PIECE_SLOTS = {
  top: { label: "blusa", categories: ["tops"], reference: "tops" },
  bottom: { label: "parte de baixo", categories: ["pants", "shorts", "skirts"], reference: "pants" },
  shoe: { label: "sapato", categories: ["sneakers_shoes", "sandals", "shoes"], reference: "shoes" },
  bag: { label: "bolsa", categories: ["bags", "accessories"], reference: "accessories" },
  outerwear: { label: "casaco", categories: ["outerwear"], reference: null }
};

// Quais vagas preencher, de acordo com a categoria da peça escolhida.
function getSlotsForPiece(category) {
  if (category === "tops") return ["bottom", "shoe", "bag"];
  if (["pants", "shorts", "skirts"].includes(category)) return ["top", "shoe", "bag"];
  if (["dresses", "sets"].includes(category)) return ["shoe", "bag", "outerwear"]; // casaco é opcional
  if (["sneakers_shoes", "sandals"].includes(category)) return ["top", "bottom", "bag"];
  return ["top", "bottom", "shoe"]; // bolsa, acessório, casaco ou peça não identificada
}

// Alguns estilos da lista não existem no catálogo; usamos o mais parecido.
const STYLE_ALIASES = { clean: "minimalista", pinterest: "patricinha", aesthetic: "romantico", sofisticado: "elegante" };

function getWantedStyle() {
  const value = document.getElementById("pieceStylePreference").value;
  return STYLE_ALIASES[value] || value;
}

function getPieceStyles(piece) {
  return Array.isArray(piece.styles) ? piece.styles : [];
}

function isPrinted(piece) {
  return Boolean(piece.print) && piece.print !== "liso ou neutro";
}

// Família de cor da peça: neutro, quente, frio, pastel ou vibrante.
// - peças do catálogo já têm o campo familiaCor;
// - fotos enviadas: descobrimos pela cor dominante (função familiaPorRgb, em regras.js);
// - fotos de referência do Unsplash: olhamos o nome ("Tênis branco" = neutro).
function getColorFamily(piece) {
  if (piece.colorFamily) return piece.colorFamily;
  const fromRgb = window.familiaPorRgb ? window.familiaPorRgb(piece.color) : null;
  if (fromRgb) return fromRgb;
  if (/preto|branco|bege|cinza|creme|nude|jeans/.test(`${piece.color || ""} ${piece.name || ""}`.toLowerCase())) return "neutro";
  return null; // não sabemos: a cor não ajuda nem atrapalha
}

// Formalidade parecida = diferença de no máximo 1 ponto (escala de 1 a 5).
function formalityIsClose(pieceA, pieceB) {
  if (!pieceA.formality || !pieceB.formality) return false;
  return Math.abs(pieceA.formality - pieceB.formality) <= 1;
}

// Ocasiões que as duas peças têm em comum (ex.: as duas servem para "passeio").
function sharedOccasions(pieceA, pieceB) {
  const occasionsB = pieceB.occasions || [];
  return (pieceA.occasions || []).filter((occasion) => occasionsB.includes(occasion));
}

// Estação: calor e frio não combinam (ex.: moletom com short).
// Exceção: blusa + casaco, porque dá para usar a camiseta por baixo do moletom.
function seasonsMatch(pieceA, pieceB) {
  const categories = [pieceA.category, pieceB.category];
  if (categories.includes("tops") && categories.includes("outerwear")) return true;
  return window.estacoesCombinam(pieceA.season, pieceB.season);
}

// ===== PONTUAÇÃO: quanto mais pontos, mais a peça combina com o look =====
// Cada peça candidata começa com 0 pontos e ganha ou perde pontos assim:
//   +1 para cada estilo em comum com a peça escolhida (ex.: as duas são "streetwear")
//   +1 se a peça tem o estilo marcado em "Estilo desejado"
//   +2 se a cor combina com TODAS as peças que já estão no look (tabela em regras.js)
//   -3 se a cor "briga" com alguma peça do look
//   +2 se a formalidade é parecida com a da peça escolhida (diferença de no máximo 1)
//   +1 se as duas servem para pelo menos uma mesma ocasião (escola, passeio, festa...)
//   +1 se a estação combina com todas as peças do look; -3 se não combina (ex.: moletom com short)
//   -5 se for estampada e o look já tiver uma estampa
// No final, sorteamos entre as peças com mais pontos.
function scoreCandidate(candidate, base, look, wantedStyle) {
  let score = 0;

  // Estilo
  const baseStyles = getPieceStyles(base);
  score += getPieceStyles(candidate).filter((style) => baseStyles.includes(style)).length;
  if (getPieceStyles(candidate).includes(wantedStyle)) score += 1;

  // Cor: comparamos com cada peça que já está no look
  const candidateFamily = getColorFamily(candidate);
  const colorsMatch = look.every((piece) => window.coresCombinam(candidateFamily, getColorFamily(piece)));
  score += colorsMatch ? 2 : -3;

  // Formalidade
  if (formalityIsClose(candidate, base)) score += 2;

  // Ocasião
  if (sharedOccasions(candidate, base).length) score += 1;

  // Estação
  const seasonOk = look.every((piece) => seasonsMatch(candidate, piece));
  score += seasonOk ? 1 : -3;

  // Estampa: duas estampas no mesmo look ficam pesadas
  if (isPrinted(candidate) && look.some(isPrinted)) score -= 5;

  return score;
}

// Uma peça "tem conflito" com o look quando:
// a cor briga com alguma peça, a estação não combina, ou ela cria duas estampas.
// Foto BOA = foto sem conflito.
function hasConflict(candidate, look) {
  const family = getColorFamily(candidate);
  if (!look.every((piece) => window.coresCombinam(family, getColorFamily(piece)))) return true;
  if (!look.every((piece) => seasonsMatch(candidate, piece))) return true;
  if (isPrinted(candidate) && look.some(isPrinted)) return true;
  return false;
}

// Escolhe, por sorteio, uma das peças mais bem pontuadas para a vaga.
function pickBestPiece(slotName, base, look, wantedStyle, usedIds) {
  const slot = PIECE_SLOTS[slotName];
  const lookIds = look.map((piece) => piece.id);
  const fits = (piece) => slot.categories.includes(piece.category) && !lookIds.includes(piece.id);

  // Peça que já apareceu em outra combinação perde 2 pontos (assim os 3 looks variam).
  const withScore = (piece) => ({
    piece,
    score: scoreCandidate(piece, base, look, wantedStyle) - (usedIds.includes(piece.id) ? 2 : 0)
  });

  // 1º passo: só as FOTOS (catálogo + upload).
  let scored = getAllPieces().filter(fits).map(withScore);
  const hasGoodPhoto = scored.some((item) => !hasConflict(item.piece, look));

  // 2º passo: se nenhuma foto serve sem conflito, as ilustrações entram — mas com 1 ponto a menos,
  // para a foto real ganhar sempre que estiver empatada.
  if (!hasGoodPhoto) {
    const drawings = illustratedPieces.filter(fits).map(withScore).map((item) => ({ ...item, score: item.score - 1 }));
    scored = [...scored, ...drawings];
  }
  if (!scored.length) return null;

  const bestScore = Math.max(...scored.map((item) => item.score));
  const finalists = scored.filter((item) => item.score >= bestScore - 1);
  return finalists[Math.floor(Math.random() * finalists.length)].piece;
}

// ===== FRASE "por que combina" =====
// Olha o look pronto e junta até 3 motivos verdadeiros, por exemplo:
// "Combina por: tons pastel com neutros + nível de formalidade parecido + todas servem para passeio."
function explainLook(base, extras, wantedStyle) {
  const all = [base, ...extras];
  const reasons = [];

  // 1. Cores: cada peça combina com todas as OUTRAS peças, pela tabela de regras.js?
  const families = all.map(getColorFamily).filter(Boolean);
  const colorsMatch = families.every((a, i) => families.every((b, j) => i === j || window.coresCombinam(a, b)));
  if (colorsMatch && families.length) {
    const plural = { quente: "quentes", frio: "frios", pastel: "pastel", vibrante: "vibrantes" };
    const colorful = [...new Set(families.filter((family) => family !== "neutro"))].map((family) => plural[family]);
    if (!colorful.length) reasons.push("tons neutros");
    else reasons.push(`tons ${colorful.join(" e ")}${families.includes("neutro") ? " com neutros" : ""}`);
  }

  // 2. Formalidade: todas as peças têm nível parecido com a peça escolhida?
  if (base.formality && extras.every((piece) => !piece.formality || formalityIsClose(piece, base))) {
    reasons.push("nível de formalidade parecido");
  }

  // 3. Ocasião: existe uma ocasião que serve para todas as peças?
  const withOccasions = all.filter((piece) => piece.occasions && piece.occasions.length);
  if (withOccasions.length >= 2) {
    const common = withOccasions.reduce((list, piece) => list.filter((occasion) => piece.occasions.includes(occasion)), withOccasions[0].occasions);
    if (common.length) reasons.push(`todas servem para ${common[0]}`);
  }

  // 4. Estação: nenhuma peça de calor junto com peça de frio.
  // (se tem casaco, a blusa vai por baixo, então não entra nessa conta)
  const hasOuterwear = all.some((piece) => piece.category === "outerwear");
  const seasons = all
    .filter((piece) => !(hasOuterwear && piece.category === "tops"))
    .map((piece) => piece.season)
    .filter((season) => season && season !== "qualquer");
  if (seasons.length && seasons.every((season) => season === seasons[0])) {
    reasons.push(`peças para dias de ${seasons[0]}`);
  }

  // 5. Estilo em comum e estampa (motivos extras, se ainda couber).
  const labels = { romantico: "romântico" };
  const baseStyles = getPieceStyles(base);
  const shared = [...new Set(extras.flatMap(getPieceStyles).filter((style) => baseStyles.includes(style)))];
  if (shared.length) reasons.push(`estilo ${labels[shared[0]] || shared[0]} em comum`);
  if (all.filter(isPrinted).length === 1) reasons.push("só uma estampa");

  if (!reasons.length) reasons.push(`cores equilibradas num look ${labels[wantedStyle] || wantedStyle}`);
  return `Combina por: ${reasons.slice(0, 3).join(" + ")}.`;
}

let pieceMissingLabels = [];

function showPieceMessage(icon, title, text) {
  pieceLookResults.hidden = false;
  pieceLookGrid.innerHTML = `<div class="saved-empty"><span>${icon}</span><h3>${title}</h3><p>${text}</p></div>`;
}

function generatePieceLooks() {
  if (!selectedBasePiece) {
    showPieceMessage("💖", "Escolha uma peça primeiro 💖", "Toque em uma peça da lista e depois em “Encontrar combinações”.");
    return;
  }

  const base = selectedBasePiece;
  const wantedStyle = getWantedStyle();
  const occasion = document.getElementById("pieceOccasionPreference").value;
  const slots = getSlotsForPiece(base.category);
  const usedIds = [];
  const missing = new Set();
  const looks = [];

  for (let index = 0; index < 3; index += 1) {
    const pieces = [base];
    slots.forEach((slotName) => {
      if (slotName === "outerwear" && Math.random() < 0.5) return; // casaco opcional
      let chosen = pickBestPiece(slotName, base, pieces, wantedStyle, usedIds);
      // Casaco é opcional: só entra se combinar bem (ex.: jaqueta de frio não vai com vestido de calor).
      if (slotName === "outerwear" && chosen && hasConflict(chosen, pieces)) return;
      const label = PIECE_SLOTS[slotName].label;
      const hasPhoto = getAllPieces().some((piece) => PIECE_SLOTS[slotName].categories.includes(piece.category));
      if (chosen && chosen.isIllustration && !hasPhoto) {
        // Não existe nenhuma foto dessa vaga: avisa que usamos um desenho.
        missing.add(`Ainda não tenho foto de ${label} no catálogo, então usei uma ilustração.`);
      }
      if (!chosen && slotName !== "outerwear") {
        // Nem foto nem ilustração: avisa e usa uma foto de referência da internet.
        missing.add(`Ainda não tenho ${label} no catálogo, então usei uma foto de referência.`);
        chosen = getComplementaryReference(PIECE_SLOTS[slotName].reference, index, wantedStyle);
      }
      if (chosen) {
        pieces.push(chosen);
        usedIds.push(chosen.id);
      }
    });

    if (pieces.length < 2) continue;
    const extras = pieces.slice(1);
    const bag = extras.find((piece) => PIECE_SLOTS.bag.categories.includes(piece.category));
    looks.push({
      id: `piece-${Date.now()}-${index}-${Math.random().toString(16).slice(2)}`,
      baseId: base.id,
      name: makeLookName(index, wantedStyle),
      pieces,
      style: wantedStyle,
      occasion,
      reason: explainLook(base, extras, wantedStyle),
      accessories: bag ? `Complete com ${bag.name.toLowerCase()}.` : "Complete com uma bolsa do seu estilo.",
      occasions: occasion,
      favorite: false
    });
  }

  if (!looks.length) {
    showPieceMessage("＋", "Ainda não tenho peças para combinar", "Adicione mais peças pelo botão “Adicionar peça”.");
    return;
  }

  pieceMissingLabels = [...missing];
  pieceGeneratedLooks = looks;
  pieceHistory.unshift({ baseId: base.id, baseName: base.name, createdAt: Date.now(), looks, missing: pieceMissingLabels });
  pieceHistory = pieceHistory.slice(0, 12);
  persistPieceHistory();
  renderPieceLooks();
  renderPieceHistory();
  pieceLookResults.hidden = false;
  addStars(5);
}

function renderPieceLooks() {
  pieceLookGrid.innerHTML = "";
  pieceMissingLabels.forEach((label) => {
    const note = document.createElement("p");
    note.className = "piece-alternative-note";
    note.style.gridColumn = "1 / -1";
    // Histórico antigo guardava só a palavra ("bolsa"); o novo guarda a frase inteira.
    note.textContent = label.startsWith("Ainda") ? label : `Ainda não tenho ${label} no catálogo, então usei uma foto de referência.`;
    pieceLookGrid.appendChild(note);
  });

  pieceGeneratedLooks.forEach((look) => {
    const card = document.createElement("article");
    card.className = "piece-look-card";
    const isFavorite = savedLooks.some((saved) => saved.id === look.id);

    // Fotos lado a lado: uma coluna para cada peça do look.
    card.innerHTML = `<div class="piece-look-preview" style="grid-template-columns: repeat(${look.pieces.length}, 1fr)">${look.pieces.map((piece) => `<img src="${piece.image}" alt="${piece.name}" style="${illustrationStyle(piece)}">`).join("")}</div>
      <div class="piece-look-body">
        <div class="piece-look-heading"><div><p class="section-kicker">Com sua peça</p><h4>${look.name}</h4></div><button class="favorite-look ${isFavorite ? "active" : ""}" type="button" aria-label="Favoritar combinação">${isFavorite ? "♥" : "♡"}</button></div>
        <div class="piece-tags"><span>${look.style}</span><span>${look.occasion}</span></div>
        <p class="piece-look-pieces"><strong>Peças:</strong> ${look.pieces.map((piece) => piece.name).join(" · ")}</p>
        <p>${look.reason}</p>
        <div class="piece-card-actions">
          <button type="button" data-action="swap">↻ Trocar uma peça</button>
          <button type="button" data-action="alternatives">Ver outras opções</button>
          <button type="button" data-action="favorite">Salvar look</button>
        </div>
        <div class="piece-alternative-note" hidden></div>
      </div>`;

    const favoriteButtons = [card.querySelector(".favorite-look"), card.querySelector('[data-action="favorite"]')];
    favoriteButtons.forEach((button) => button.addEventListener("click", () => togglePieceFavorite(look, button)));

    const base = look.pieces.find((piece) => piece.id === look.baseId) || look.pieces[0];
    const note = card.querySelector(".piece-alternative-note");

    card.querySelector('[data-action="swap"]').addEventListener("click", () => {
      const extras = look.pieces.filter((piece) => piece.id !== base.id);
      const swappable = extras[Math.floor(Math.random() * extras.length)];
      const slotName = swappable && Object.keys(PIECE_SLOTS).find((name) => PIECE_SLOTS[name].categories.includes(swappable.category));
      const others = look.pieces.filter((piece) => piece !== swappable);
      const replacement = slotName ? pickBestPiece(slotName, base, others, look.style, [swappable.id]) : null;
      if (!replacement || replacement.id === swappable.id) {
        note.textContent = "Ainda não tenho outra peça desse tipo no catálogo.";
        note.hidden = false;
        return;
      }
      look.pieces = look.pieces.map((piece) => piece === swappable ? replacement : piece);
      look.reason = explainLook(base, look.pieces.filter((piece) => piece.id !== base.id), look.style);
      renderPieceLooks();
    });

    card.querySelector('[data-action="alternatives"]').addEventListener("click", () => {
      const lookIds = look.pieces.map((piece) => piece.id);
      const alternatives = getSlotsForPiece(base.category)
        .flatMap((slotName) => getAllPieces()
          .filter((piece) => PIECE_SLOTS[slotName].categories.includes(piece.category) && !lookIds.includes(piece.id))
          .slice(0, 2))
        .map((piece) => piece.name);
      note.textContent = alternatives.length ? `Outras opções: ${alternatives.join(" · ")}` : "Ainda não tenho outras opções no catálogo.";
      note.hidden = false;
    });
    pieceLookGrid.appendChild(card);
  });
}

function generatePieceLooksWithStyle(style) {
  document.getElementById("pieceStylePreference").value = style;
  generatePieceLooks();
}

if (pieceGenerateButton) pieceGenerateButton.addEventListener("click", () => generatePieceLooks());
if (pieceMoreLooksButton) pieceMoreLooksButton.addEventListener("click", () => generatePieceLooks());
if (pieceElegantButton) pieceElegantButton.addEventListener("click", () => generatePieceLooksWithStyle("elegante"));
if (pieceCasualButton) pieceCasualButton.addEventListener("click", () => generatePieceLooksWithStyle("casual"));
if (pieceHistoryButton) pieceHistoryButton.addEventListener("click", () => {
  renderPieceHistory();
  pieceHistoryPanel.hidden = !pieceHistoryPanel.hidden;
});

function togglePieceFavorite(look, clickedButton) {
  const existing = savedLooks.findIndex((saved) => saved.id === look.id);
  if (existing >= 0) {
    savedLooks.splice(existing, 1);
  } else {
    savedLooks.push({ ...look, favorite: true, source: "piece-match" });
  }
  persistOrganizerData();
  renderSavedLooks();
  renderPieceLooks();
}

function renderPieceHistory() {
  if (!pieceHistoryGrid) return;
  pieceHistoryGrid.innerHTML = "";
  if (!pieceHistory.length) {
    pieceHistoryGrid.innerHTML = '<p class="piece-alternative-note">Nenhuma combinação gerada ainda.</p>';
    return;
  }
  pieceHistory.forEach((entry) => {
    const card = document.createElement("article");
    card.className = "piece-look-card";
    card.innerHTML = `<div class="piece-look-body"><p class="section-kicker">${new Date(entry.createdAt).toLocaleDateString("pt-BR")}</p><h4>${entry.baseName}</h4><p>${entry.looks.length} combinações geradas</p><button class="new-looks-button piece-history-reopen" type="button">Ver combinações</button></div>`;
    card.querySelector(".piece-history-reopen").addEventListener("click", () => {
      const base = findPieceById(entry.baseId);
      if (base) selectBasePiece(base.id);
      pieceGeneratedLooks = entry.looks;
      pieceMissingLabels = entry.missing || [];
      pieceLookResults.hidden = false;
      pieceHistoryPanel.hidden = true;
      renderPieceLooks();
    });
    pieceHistoryGrid.appendChild(card);
  });
}

const COMPLEMENTARY_REFERENCES = {
  pants: [
    {name:"Calça jeans azul",image:"https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=700&q=80"},
    {name:"Calça preta",image:"https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=700&q=80"},
    {name:"Calça bege",image:"https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=700&q=80"}
  ],
  skirts: [{name:"Saia preta",image:"https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=700&q=80"},{name:"Saia clara",image:"https://images.unsplash.com/photo-1591369822096-ffd140ec948f?auto=format&fit=crop&w=700&q=80"}],
  shorts: [{name:"Short bege",image:"https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=700&q=80"},{name:"Short jeans",image:"https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=700&q=80"}],
  tops: [{name:"Blusa branca",image:"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=80"},{name:"Camiseta preta",image:"https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=700&q=80"},{name:"Camisa oversized",image:"https://images.unsplash.com/photo-1605763240000-7e93b172d754?auto=format&fit=crop&w=700&q=80"}],
  shoes: [{name:"Tênis branco",image:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80"},{name:"Sapato nude",image:"https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=700&q=80"},{name:"Sandália delicada",image:"https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=700&q=80"}],
  accessories: [{name:"Bolsa estruturada",image:"https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=700&q=80"}]
};

// Devolve uma peça de referência (foto do Unsplash) quando falta essa categoria no closet.
function getComplementaryReference(category, offset, style) {
  const references = (COMPLEMENTARY_REFERENCES[category] || []).map((ref, index) => ({
    ...ref,
    id: `ref-${category}-${index}`,
    category,
    style: "referência"
  }));
  const filtered = references.filter((ref) => {
    if (style === "streetwear") return !ref.name.toLowerCase().includes("saia") && !ref.name.toLowerCase().includes("vestido");
    if (style === "minimalista") return !ref.name.toLowerCase().includes("estampado") && !ref.name.toLowerCase().includes("brilho");
    return true;
  });
  return filtered[(offset % filtered.length + filtered.length) % filtered.length] || null;
}
