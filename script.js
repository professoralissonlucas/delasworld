const menuView = document.getElementById("menuView");
const gameView = document.getElementById("gameView");
const gameTitle = document.getElementById("gameTitle");
const gameSymbol = document.getElementById("gameSymbol");
const backButton = document.getElementById("backButton");
const starCount = document.getElementById("starCount");
const starCounter = document.querySelector(".star-counter");
const soundButton = document.getElementById("soundButton");

const gameSymbols = {
  "Jogo da Memória Kawaii": "🌸",
  "Quiz: Qual é a sua Vibe?": "✨",
  "Estúdio de Moda (Dress Up)": "👗",
  "Organizador de Looks": "🧥"
};

const memoryGame = document.getElementById("memoryGame");
const memoryBoard = document.getElementById("memoryBoard");
const attemptCount = document.getElementById("attemptCount");
const resetButton = document.getElementById("resetButton");
const victoryMessage = document.getElementById("victoryMessage");
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

const dressupGame = document.getElementById("dressupGame");
const dressupStage = document.getElementById("dressupStage");
const hairBack = document.getElementById("hairBack");
const hairTop = document.getElementById("hairTop");
const hairLeft = document.getElementById("hairLeft");
const hairRight = document.getElementById("hairRight");
const dressModel = document.getElementById("dressModel");
const dressDetails = document.getElementById("dressDetails");
const accessoryCrown = document.getElementById("accessoryCrown");
const accessoryBow = document.getElementById("accessoryBow");
const accessoryGlasses = document.getElementById("accessoryGlasses");
const randomLookButton = document.getElementById("randomLookButton");
const saveLookButton = document.getElementById("saveLookButton");
const savedLookMessage = document.getElementById("savedLookMessage");

const outfitOrganizer = document.getElementById("outfitOrganizer");
const outfitItemsContainer = document.getElementById("outfitItemsContainer");
const addItemButton = document.getElementById("addItemButton");
const removeItemButton = document.getElementById("removeItemButton");
const itemNameInput = document.getElementById("itemNameInput");
const itemColorInput = document.getElementById("itemColorInput");
const itemTypeSelect = document.getElementById("itemTypeSelect");
const saveOutfitButton = document.getElementById("saveOutfitButton");
const clearOutfitButton = document.getElementById("clearOutfitButton");
const outfitNameInput = document.getElementById("outfitNameInput");
const outfitList = document.getElementById("outfitList");

const kawaiiEmojis = ["🎀", "🦄", "🍓", "🌸", "👑", "🧁", "💖", "✨"];
let firstCard = null;
let secondCard = null;
let boardLocked = false;
let movements = 0;
let matchedPairs = 0;
let mismatchTimeout = null;
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

function shuffle(items) {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }
  return shuffled;
}

function resetTurn() {
  firstCard = null;
  secondCard = null;
  boardLocked = false;
}

function updateAttempts() {
  movements += 1;
  attemptCount.textContent = movements;
}

function showVictory() {
  victoryMessage.innerHTML = `🎉 Parabéns, estrela! Você encontrou todos os pares em <strong>${movements}</strong> tentativas! 💖`;
  victoryMessage.hidden = false;
  addStars(10);
}

function checkForMatch() {
  const isMatch = firstCard.dataset.emoji === secondCard.dataset.emoji;

  if (isMatch) {
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");
    firstCard.disabled = true;
    secondCard.disabled = true;
    matchedPairs += 1;
    resetTurn();

    if (matchedPairs === kawaiiEmojis.length) {
      showVictory();
    }
    return;
  }

  boardLocked = true;
  mismatchTimeout = window.setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    resetTurn();
  }, 850);
}

function handleCardSelection(card) {
  if (boardLocked || card === firstCard || card.classList.contains("matched")) return;

  card.classList.add("flipped");

  if (!firstCard) {
    firstCard = card;
    return;
  }

  secondCard = card;
  updateAttempts();
  checkForMatch();
}

function createMemoryBoard() {
  memoryBoard.innerHTML = "";
  victoryMessage.hidden = true;
  firstCard = null;
  secondCard = null;
  boardLocked = false;
  movements = 0;
  matchedPairs = 0;
  attemptCount.textContent = "0";

  const cards = shuffle([...kawaiiEmojis, ...kawaiiEmojis]);

  cards.forEach((emoji) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "memory-card";
    card.dataset.emoji = emoji;
    card.setAttribute("aria-label", "Carta fechada");
    card.innerHTML = `
      <span class="memory-card-inner">
        <span class="card-face card-back" aria-hidden="true"></span>
        <span class="card-face card-front" aria-hidden="true">${emoji}</span>
      </span>
    `;

    card.addEventListener("click", () => {
      handleCardSelection(card);
      card.setAttribute("aria-label", card.classList.contains("flipped") ? `Carta ${emoji}` : "Carta fechada");
    });

    memoryBoard.appendChild(card);
  });
}

function resetDressup() {
  ["hair", "dress", "accessory", "background"].forEach((category) => {
    const firstButton = document.querySelector(`.style-options[data-category="${category}"] .style-option`);
    if (firstButton) {
      markActiveOption(firstButton);
      applyDressupOption(category, firstButton.dataset.value);
    }
  });
  savedLookMessage.hidden = true;
}

function openSelectedGame(selectedGame) {
  gameTitle.textContent = selectedGame;
  gameSymbol.textContent = gameSymbols[selectedGame] || "✨";

  const isMemoryGame = selectedGame === "Jogo da Memória Kawaii";
  const isVibeQuiz = selectedGame === "Quiz: Qual é a sua Vibe?";
  const isDressup = selectedGame === "Estúdio de Moda (Dress Up)";
  const isLookOrganizer = selectedGame === "Organizador de Looks";
  memoryGame.hidden = !isMemoryGame;
  vibeQuiz.hidden = !isVibeQuiz;
  dressupGame.hidden = !isDressup;
  outfitOrganizer.hidden = !isLookOrganizer;

  if (isMemoryGame) {
    gameSymbol.hidden = true;
    gameMessage.hidden = true;
    createMemoryBoard();
  } else if (isVibeQuiz) {
    gameSymbol.hidden = true;
    gameMessage.hidden = true;
    resetQuiz();
  } else if (isDressup) {
    gameSymbol.hidden = true;
    gameMessage.hidden = true;
    resetDressup();
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
  memoryGame.hidden = true;
  vibeQuiz.hidden = true;
  dressupGame.hidden = true;
  outfitOrganizer.hidden = true;
  resetQuiz();
  resetDressup();
  window.scrollTo({ top: 0, behavior: "smooth" });

  const firstPlayButton = document.querySelector(".play-button");
  if (firstPlayButton) firstPlayButton.focus();
});

resetButton.addEventListener("click", createMemoryBoard);
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

const hairColors = {
  chocolate: "#5a385d",
  pink: "#d95e98",
  lilac: "#9a78c7",
  gold: "#d5a64d"
};

const dressColors = {
  pink: { main: "#ef70a4", light: "#ff9fc2", border: "#b94f82" },
  lilac: { main: "#9b82d1", light: "#c3b2ec", border: "#735ba7" },
  blue: { main: "#63b8d8", light: "#9cd8e9", border: "#438da9" },
  gold: { main: "#ddb85d", light: "#f2d38a", border: "#ad8938" }
};

function setHairColor(value) {
  const color = hairColors[value] || hairColors.chocolate;
  [hairBack, hairTop, hairLeft, hairRight].forEach((part) => {
    if (part) part.setAttribute("fill", color);
  });
}

function setDressColor(value) {
  const colors = dressColors[value] || dressColors.pink;
  const dressPaths = dressModel.querySelectorAll("path");
  if (dressPaths[0]) {
    dressPaths[0].setAttribute("fill", colors.main);
    dressPaths[0].setAttribute("stroke", colors.border);
  }
  if (dressPaths[1]) dressPaths[1].setAttribute("fill", colors.light);

  const details = dressDetails.querySelectorAll("path");
  if (details[0]) details[0].setAttribute("stroke", value === "gold" ? "#fff2b5" : "#ffd66b");
}

function setAccessory(value) {
  const accessories = [accessoryCrown, accessoryBow, accessoryGlasses];
  accessories.forEach((item) => {
    if (item) {
      item.style.display = "none";
      item.setAttribute("hidden", "");
    }
  });

  const selected = value === "crown" ? accessoryCrown : value === "bow" ? accessoryBow : value === "glasses" ? accessoryGlasses : null;
  if (selected) {
    selected.removeAttribute("hidden");
    selected.style.display = "block";
  }
}

function setBackground(value) {
  dressupStage.dataset.background = value;
}

function getRandomOption(category) {
  const buttons = [...document.querySelectorAll(`.style-options[data-category="${category}"] .style-option`)];
  return buttons[Math.floor(Math.random() * buttons.length)].dataset.value;
}

function applyDressupOption(category, value) {
  if (category === "hair") setHairColor(value);
  if (category === "dress") setDressColor(value);
  if (category === "accessory") setAccessory(value);
  if (category === "background") setBackground(value);
}

function markActiveOption(button) {
  const siblings = button.parentElement.querySelectorAll(".style-option");
  siblings.forEach((sibling) => sibling.classList.remove("active"));
  button.classList.add("active");
}

function activateRandomCategory(category, value) {
  const button = document.querySelector(`.style-options[data-category="${category}"] .style-option[data-value="${value}"]`);
  if (button) {
    markActiveOption(button);
    applyDressupOption(category, value);
  }
}

function createConfetti() {
  const colors = ["#ff69a7", "#ffd66b", "#b48be5", "#ffffff", "#63b8d8"];
  for (let index = 0; index < 38; index += 1) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.top = `${-20 - Math.random() * 120}px`;
    piece.style.background = colors[index % colors.length];
    piece.style.animationDelay = `${Math.random() * .45}s`;
    piece.style.transform = `rotate(${Math.random() * 180}deg)`;
    document.body.appendChild(piece);
    window.setTimeout(() => piece.remove(), 2300);
  }
}

randomLookButton.addEventListener("click", () => {
  ["hair", "dress", "accessory", "background"].forEach((category) => {
    activateRandomCategory(category, getRandomOption(category));
  });
  savedLookMessage.hidden = true;
});

saveLookButton.addEventListener("click", () => {
  savedLookMessage.hidden = false;
  createConfetti();
  addStars(10);
});

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
resetButton.addEventListener("click", () => playSparkleSound());
quizRestartButton.addEventListener("click", () => playSparkleSound());
randomLookButton.addEventListener("click", () => playSparkleSound());

const dossierPieces = document.getElementById("dossierPieces");
const dossierHair = document.getElementById("dossierHair");
const dossierNails = document.getElementById("dossierNails");
const dossierEssence = document.getElementById("dossierEssence");

const outfitItems = [];
let outfitIdCounter = 0;

function updateOutfitList() {
  if (outfitList) outfitList.innerHTML = "";
  outfitItems.forEach((item) => {
    if (!outfitList) return;
    const listItem = document.createElement("li");
    listItem.textContent = item.name;
    outfitList.appendChild(listItem);
  });
}

function addItemToOutfit() {
  if (!itemNameInput || !itemColorInput || !itemTypeSelect) return;
  const name = itemNameInput.value.trim();
  const color = itemColorInput.value.trim();
  const type = itemTypeSelect.value;

  if (!name || !color) {
    alert("Por favor, preencha todos os campos.");
    return;
  }

  outfitItems.push({ id: outfitIdCounter++, name, color, type });
  updateOutfitList();
  itemNameInput.value = "";
  itemColorInput.value = "";
}

function removeItemFromOutfit() {
  if (!itemNameInput) return;
  const name = itemNameInput.value.trim();
  const itemIndex = outfitItems.findIndex((item) => item.name === name);
  if (itemIndex !== -1) outfitItems.splice(itemIndex, 1);
  else alert("Item não encontrado no seu guarda-roupa.");
  updateOutfitList();
  itemNameInput.value = "";
}

function saveOutfit() {
  if (!outfitNameInput) return;
  const outfitName = outfitNameInput.value.trim();
  if (!outfitName || outfitItems.length === 0) {
    alert("Por favor, dê um nome ao seu conjunto e adicione itens.");
    return;
  }
  const savedOutfits = JSON.parse(localStorage.getItem("pinkSparkleOutfits") || "[]");
  savedOutfits.push({ name: outfitName, items: outfitItems });
  localStorage.setItem("pinkSparkleOutfits", JSON.stringify(savedOutfits));
  outfitNameInput.value = "";
  outfitItems.length = 0;
  updateOutfitList();
  alert("Conjunto salvo com sucesso!");
}

function clearOutfit() {
  outfitItems.length = 0;
  updateOutfitList();
  alert("Guarda-roupa limpo!");
}

if (addItemButton) addItemButton.addEventListener("click", addItemToOutfit);
if (removeItemButton) removeItemButton.addEventListener("click", removeItemFromOutfit);
if (saveOutfitButton) saveOutfitButton.addEventListener("click", saveOutfit);
if (clearOutfitButton) clearOutfitButton.addEventListener("click", clearOutfit);

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

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Não foi possível ler esta imagem."));
    reader.readAsDataURL(file);
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
    card.innerHTML = `<div class="look-preview">${look.pieces.slice(0, 4).map((piece, index) => `<img src="${piece.image}" alt="${piece.name}" style="--piece-index:${index}">`).join("")}</div>
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

function persistPieceHistory() {
  try { localStorage.setItem("pinkSparklePieceHistory", JSON.stringify(pieceHistory)); }
  catch (error) { showUploadError("Não foi possível salvar o histórico neste navegador."); }
}

function renderPiecePicker() {
  if (!pieceMatchPicker) return;
  const pieces = pieceFilterCategory === "all"
    ? wardrobePieces
    : wardrobePieces.filter((piece) => piece.category === pieceFilterCategory);

  if (!pieces.length) {
    pieceMatchPicker.innerHTML = '<p class="piece-alternative-note">Nenhuma peça desta categoria no guarda-roupa. Use “Adicionar peça”.</p>';
    return;
  }

  pieceMatchPicker.innerHTML = "";
  pieces.forEach((piece) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `piece-picker-card ${selectedBasePiece?.id === piece.id ? "selected" : ""}`;
    button.innerHTML = `<img src="${piece.image}" alt="${piece.name}"><span>${piece.name}</span>`;
    button.addEventListener("click", () => selectBasePiece(piece.id));
    pieceMatchPicker.appendChild(button);
  });
}

function selectBasePiece(pieceId) {
  selectedBasePiece = wardrobePieces.find((piece) => piece.id === pieceId) || null;
  pieceGenerateButton.disabled = !selectedBasePiece;
  pieceLookResults.hidden = true;

  if (!selectedBasePiece) {
    selectedPieceStage.innerHTML = '<div class="selected-piece-placeholder"><span>✦</span><p>Escolha uma peça abaixo para começar</p></div>';
  } else {
    const secondary = selectedBasePiece.print !== "liso ou neutro" ? selectedBasePiece.print : (selectedBasePiece.color || "cor identificada");
    selectedPieceStage.innerHTML = `<div class="selected-piece-feature"><img src="${selectedBasePiece.image}" alt="${selectedBasePiece.name}"><div class="selected-piece-details"><p class="section-kicker">Peça principal</p><h4>${selectedBasePiece.name}</h4><p><strong>Categoria:</strong> ${categoryLabels[selectedBasePiece.category]}</p><p><strong>Visual:</strong> ${secondary}</p><p><strong>Estilo:</strong> ${selectedBasePiece.style || "versátil"}</p></div></div>`;
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

function pieceCanComplement(base, candidate) {
  if (!candidate || candidate.id === base.id) return false;
  if (candidate.category === base.category) return false;
  if (["tops", "bottoms", "skirts", "dresses", "outerwear", "shoes", "accessories"].includes(candidate.category)) return true;
  return false;
}

function getPieceAlternatives(category, baseId, lookIndex, excludedIds = []) {
  const options = wardrobePieces.filter((piece) => {
    if (piece.id === baseId || excludedIds.includes(piece.id)) return false;
    if (category === "bottoms") return ["pants", "bottoms", "skirts", "shorts"].includes(piece.category);
    if (category === "shoes") return ["shoes", "sneakers_shoes", "sandals"].includes(piece.category);
    if (category === "tops") return ["tops"].includes(piece.category);
    if (category === "skirts") return piece.category === "skirts";
    if (category === "pants") return ["pants", "bottoms"].includes(piece.category);
    if (category === "shorts") return piece.category === "shorts";
    if (category === "accessories") return ["accessories", "bags"].includes(piece.category);
    return piece.category === category;
  });
  if (!options.length) return null;
  return options[(lookIndex + pieceHistory.length) % options.length];
}

function findComplement(category, baseId, offset, excludedIds, style) {
  const wardrobePiece = getPieceAlternatives(category, baseId, offset, excludedIds);
  if (wardrobePiece) return wardrobePiece;
  if (category === "bottoms" || category === "pants") return getComplementaryReference("pants", offset, style);
  if (category === "skirts") return getComplementaryReference("skirts", offset, style);
  if (category === "shorts") return getComplementaryReference("shorts", offset, style);
  if (category === "tops") return getComplementaryReference("tops", offset, style);
  if (category === "shoes") return getComplementaryReference("shoes", offset, style);
  if (category === "accessories") return getComplementaryReference("accessories", offset, style);
  return null;
}

function generatePieceLooks(more = false) {
  if (!selectedBasePiece) {
    showUploadError("Selecione uma peça principal primeiro.");
    return;
  }

  const style = document.getElementById("pieceStylePreference").value;
  const occasion = document.getElementById("pieceOccasionPreference").value;
  const base = selectedBasePiece;
  const candidates = wardrobePieces.filter((piece) => pieceCanComplement(base, piece));

  if (candidates.length === 0) {
    pieceLookResults.hidden = false;
    pieceLookGrid.innerHTML = '<div class="saved-empty"><span>＋</span><h3>Vamos completar seu guarda-roupa</h3><p>Adicione outras roupas, calçados ou acessórios para combinar com esta peça.</p></div>';
    return;
  }

  const looks = [];
  const neededCategories = base.category === "tops" || base.category === "bottoms" || base.category === "skirts" || base.category === "dresses"
    ? ["tops", "bottoms", "skirts", "dresses", "outerwear", "shoes", "accessories"]
    : ["tops", "bottoms", "skirts", "dresses", "outerwear", "shoes", "accessories"];

  for (let index = 0; index < 4; index += 1) {
    const offset = more ? index + pieceHistory.length : index;
    const pieces = [base];

    const pushAlternative = (category) => {
      const chosen = findComplement(category, base.id, offset, pieces.filter(Boolean).map((item) => item.id), style);
      if (chosen) pieces.push(chosen);
    };

    if (base.category === "tops") {
      pushAlternative("bottoms");
      if (pieces.length === 1) pushAlternative("skirts");
    } else if (base.category === "bottoms" || base.category === "skirts") {
      pushAlternative("tops");
    } else if (base.category === "dresses") {
      pushAlternative("outerwear");
    } else if (["shoes", "outerwear", "accessories"].includes(base.category)) {
      pushAlternative("tops");
      pushAlternative("bottoms");
    } else {
      pushAlternative("tops");
      pushAlternative("bottoms");
    }

    pushAlternative("shoes");
    pushAlternative("accessories");

    const unique = [...new Map(pieces.filter(Boolean).map((piece) => [piece.id, piece])).values()];
    if (unique.length < 2) continue;

    const look = {
      id: `piece-${Date.now()}-${index}-${Math.random().toString(16).slice(2)}`,
      baseId: base.id,
      name: makePieceLookNames(index, style),
      pieces: unique,
      style,
      occasion,
      reason: `${base.name} ganha equilíbrio quando combinado com peças cadastradas no seu closet que dialogam com sua cor, estampa e estilo ${style} para ${occasion}.`,
      favorite: false
    };
    looks.push(look);
  }

  if (!looks.length) {
    pieceLookResults.hidden = false;
    pieceLookGrid.innerHTML = '<div class="saved-empty"><span>＋</span><h3>Peças insuficientes</h3><p>Adicione uma blusa ou calça e um calçado para formar combinações completas.</p></div>';
    return;
  }

  pieceGeneratedLooks = looks;
  pieceHistory.unshift({ baseId: base.id, baseName: base.name, createdAt: Date.now(), looks });
  pieceHistory = pieceHistory.slice(0, 12);
  persistPieceHistory();
  renderPieceLooks();
  renderPieceHistory();
  pieceLookResults.hidden = false;
  addStars(5);
}

function renderPieceLooks() {
  pieceLookGrid.innerHTML = "";
  pieceGeneratedLooks.forEach((look) => {
    const card = document.createElement("article");
    card.className = "piece-look-card";
    const previewPieces = look.pieces.slice(0, 3);
    const isFavorite = savedLooks.some((saved) => saved.id === look.id);

    card.innerHTML = `<div class="piece-look-preview">${previewPieces.map((piece) => `<img src="${piece.image}" alt="${piece.name}">`).join("")}</div>
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

    card.querySelector('[data-action="swap"]').addEventListener("click", () => {
      const swappable = look.pieces.find((piece) => piece.id !== selectedBasePiece.id);
      if (!swappable) return;
      const replacement = getPieceAlternatives(swappable.category, selectedBasePiece.id, Math.floor(Math.random() * 20), look.pieces.map((piece) => piece.id));
      if (!replacement) {
        card.querySelector(".piece-alternative-note").textContent = "Não há outra peça dessa categoria no seu guarda-roupa.";
      } else {
        look.pieces = look.pieces.map((piece) => piece.id === swappable.id ? replacement : piece);
        renderPieceLooks();
      }
      card.querySelector(".piece-alternative-note").hidden = false;
    });

    card.querySelector('[data-action="alternatives"]').addEventListener("click", () => {
      const note = card.querySelector(".piece-alternative-note");
      const alternatives = ["tops", "bottoms", "skirts", "shoes", "accessories"]
        .map((category) => wardrobePieces.filter((piece) => piece.category === category).slice(0, 2).map((piece) => piece.name))
        .flat().filter((name, index, names) => names.indexOf(name) === index).slice(0, 6);
      note.textContent = alternatives.length ? `Opções já cadastradas: ${alternatives.join(" · ")}` : "Adicione mais peças ao guarda-roupa para ver alternativas.";
      note.hidden = false;
    });
    pieceLookGrid.appendChild(card);
  });
}

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
      const base = wardrobePieces.find((piece) => piece.id === entry.baseId);
      if (base) selectBasePiece(base.id);
      pieceGeneratedLooks = entry.looks;
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
  accessories: [{name:"Bolsa estruturada",image:"https://images.unsplash.com/photo-1584917865442-de89df
    if (style === "streetwear") return !ref.name.toLowerCase().includes("saia") && !ref.name.toLowerCase().includes("vestido");
    if (style === "minimalista") return !ref.name.toLowerCase().includes("estampado") && !ref.name.toLowerCase().includes("brilho");
    return true;
  });
  return filtered[(offset % filtered.length + filtered.length) % filtered.length] || null;
}