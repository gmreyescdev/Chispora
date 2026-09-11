(function () {
  "use strict";

  const brand = window.__BRAND__ || {};
  const memoryEngine = brand.memoryEngine;
  const operationEngine = brand.operationEngine;
  const wordEngine = brand.wordEngine;
  const STORAGE_KEY = brand.storageKey || "chispora.mvp.v1";
  const $ = (selector, scope) => (scope || document).querySelector(selector);
  const $$ = (selector, scope) => Array.from((scope || document).querySelectorAll(selector));
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fineHover = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const escHTML = (value) => String(value == null ? "" : value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);

  const avatarEmoji = {
    zorro: "🦊",
    gato: "🐱",
    robot: "🤖",
    luna: "🌙"
  };

  let selectedAvatar = "zorro";
  let appState = loadState();
  let selectedMemoryDifficulty = appState.settings.preferredDifficulty && appState.settings.preferredDifficulty !== "auto" ? appState.settings.preferredDifficulty : "explorador";
  let memoryGame = null;
  let memoryDelayId = 0;
  let memoryDelayDueAt = 0;
  let memoryDelayRemaining = 0;
  let memoryDelayedAction = null;
  let memoryClockId = 0;
  let memoryElapsedMs = 0;
  let memoryClockStartedAt = 0;
  let memoryPaused = false;
  let memoryResultRecorded = false;
  let selectedOperationDifficulty = appState.settings.preferredDifficulty && appState.settings.preferredDifficulty !== "auto" ? appState.settings.preferredDifficulty : "explorador";
  let operationGame = null;
  let operationClockId = 0;
  let operationElapsedMs = 0;
  let operationClockStartedAt = 0;
  let operationDelayId = 0;
  let operationDelayDueAt = 0;
  let operationDelayRemaining = 0;
  let operationDelayedAction = null;
  let operationPaused = false;
  let operationResultRecorded = false;
  let dialogGameType = "";
  let selectedWordDifficulty = appState.settings.preferredDifficulty && appState.settings.preferredDifficulty !== "auto" ? appState.settings.preferredDifficulty : "explorador";
  let wordGame = null;
  let wordClockId = 0;
  let wordElapsedMs = 0;
  let wordClockStartedAt = 0;
  let wordDelayId = 0;
  let wordDelayDueAt = 0;
  let wordDelayRemaining = 0;
  let wordDelayedAction = null;
  let wordPaused = false;
  let wordResultRecorded = false;

  window.addEventListener("chispora:state-updated", () => {
    appState = loadState();
  });

  function safe(fn, name) {
    try {
      fn();
    } catch (error) {
      console.warn("[" + name + "] failed:", error);
    }
  }

  function loadState() {
    const fallback = {
      profile: Object.assign({}, brand.defaultProfile || { nickname: "", avatarId: "zorro" }),
      settings: Object.assign({}, brand.defaultSettings || { sessionMinutes: 20, soundEnabled: true, preferredDifficulty: "auto" }),
      progress: { completedGames: 0 }
    };

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return fallback;
      const parsed = JSON.parse(saved);
      return {
        profile: Object.assign({}, fallback.profile, parsed.profile || {}),
        settings: Object.assign({}, fallback.settings, parsed.settings || {}),
        progress: Object.assign({}, fallback.progress, parsed.progress || {})
      };
    } catch (error) {
      console.warn("[storage] No se pudo leer el progreso local:", error);
      return fallback;
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
      return true;
    } catch (error) {
      console.warn("[storage] No se pudo guardar el progreso local:", error);
      return false;
    }
  }

  function validScreenId(screenId) {
    const screen = screenId ? document.getElementById(screenId) : null;
    return Boolean(screen && screen.matches("[data-screen]"));
  }

  function currentScreenFromHash() {
    const screenId = window.location.hash.replace(/^#/, "");
    return validScreenId(screenId) ? screenId : "bienvenida";
  }

  function setScreen(screenId, moveFocus) {
    const targetId = validScreenId(screenId) ? screenId : "bienvenida";
    const target = document.getElementById(targetId);
    const appHeader = $("[data-app-header]");

    if (targetId === "partida-memoria" && (!memoryGame || memoryGame.status === "complete") && memoryEngine) {
      startMemoryGame(selectedMemoryDifficulty, false);
    } else if (targetId !== "partida-memoria" && memoryGame && memoryGame.status !== "complete") {
      discardMemoryGame();
    }
    if (targetId === "partida-operacion" && (!operationGame || operationGame.status === "complete") && operationEngine) {
      startOperationGame(selectedOperationDifficulty, false);
    } else if (targetId !== "partida-operacion" && operationGame && operationGame.status !== "complete") {
      discardOperationGame();
    }
    if (targetId === "partida-palabras" && (!wordGame || wordGame.status === "complete") && wordEngine) {
      startWordGame(selectedWordDifficulty, false);
    } else if (targetId !== "partida-palabras" && wordGame && wordGame.status !== "complete") {
      discardWordGame();
    }

    $$('[data-screen]').forEach((screen) => {
      screen.hidden = screen !== target;
      screen.setAttribute("aria-hidden", String(screen !== target));
    });
    if (appHeader) appHeader.hidden = ["partida-memoria", "partida-operacion", "partida-palabras", "partida-secuencia", "partida-laberinto"].includes(targetId);

    if (window.gsap) {
      window.gsap.fromTo(target, { opacity: 0, y: reduced ? 0 : 14 }, { opacity: 1, y: 0, duration: 0.45, ease: "power3.out", clearProps: "opacity,transform" });
    }

    if (moveFocus) {
      const heading = $("h1, h2", target);
      if (heading) {
        heading.setAttribute("tabindex", "-1");
        heading.focus({ preventScroll: true });
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function navigateTo(screenId) {
    if (!validScreenId(screenId)) return;
    if (window.location.hash === "#" + screenId) {
      setScreen(screenId, true);
      return;
    }
    window.location.hash = screenId;
  }

  function updateProfileViews() {
    const nickname = (appState.profile.nickname || "").trim();
    const avatarId = appState.profile.avatarId || "zorro";
    const profileChip = $("[data-profile-chip]");
    const nicknameInput = $("#nickname");

    if (profileChip) profileChip.hidden = !nickname;
    $$('[data-profile-name]').forEach((element) => { element.textContent = nickname || "Explorador"; });
    $$('[data-greeting-name]').forEach((element) => { element.textContent = nickname || "explorador"; });
    $$('[data-profile-avatar]').forEach((element) => { element.textContent = avatarEmoji[avatarId] || avatarEmoji.zorro; });
    if (nicknameInput) nicknameInput.value = nickname;

    selectedAvatar = avatarId;
    $$('[data-avatar]').forEach((button) => {
      const selected = button.dataset.avatar === selectedAvatar;
      button.classList.toggle("is-selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
  }

  function initNavigation() {
    if (document.documentElement.classList.contains("js-enabled")) return;
    document.documentElement.classList.add("js-enabled");

    document.addEventListener("click", (event) => {
      const trigger = event.target.closest("[data-go]");
      if (!trigger) return;
      event.preventDefault();
      navigateTo(trigger.dataset.go);
    });

    window.addEventListener("hashchange", () => setScreen(currentScreenFromHash(), true));
    setScreen(currentScreenFromHash(), false);
  }

  function initProfile() {
    const form = $("[data-profile-form]");
    const error = $("[data-nickname-error]");
    if (!form || form.dataset.bound) return;
    form.dataset.bound = "1";

    updateProfileViews();

    $("[data-avatar-grid]", form).addEventListener("click", (event) => {
      const button = event.target.closest("[data-avatar]");
      if (!button) return;
      selectedAvatar = button.dataset.avatar;
      $$('[data-avatar]', form).forEach((option) => {
        const selected = option === button;
        option.classList.toggle("is-selected", selected);
        option.setAttribute("aria-pressed", String(selected));
      });
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const nickname = String(new FormData(form).get("nickname") || "").trim();
      const validNickname = /^[\p{L}\p{N} _-]{2,12}$/u.test(nickname);

      if (!validNickname) {
        error.textContent = "Escribe un apodo de 2 a 12 caracteres, sin símbolos especiales.";
        $("#nickname").focus();
        return;
      }

      error.textContent = "";
      appState.profile = { nickname: nickname, avatarId: selectedAvatar };
      saveState();
      updateProfileViews();
      navigateTo("misiones");
    });
  }

  function initDifficulty() {
    const select = $("[data-difficulty]");
    const summary = $("[data-difficulty-summary]");
    if (!select || !summary || select.dataset.bound) return;
    select.dataset.bound = "1";

    const preferred = appState.settings.preferredDifficulty;
    if (preferred && preferred !== "auto" && select.querySelector('option[value="' + preferred + '"]')) select.value = preferred;

    function renderDifficulty() {
      const config = memoryEngine ? memoryEngine.difficulties[select.value] : null;
      const details = config ? [
        config.pairCount * 2 + " cartas",
        config.pairCount + " parejas",
        config.previewSeconds ? "Vista previa de " + config.previewSeconds + " segundos" : "Sin vista previa automática"
      ] : ["12 cartas", "6 parejas", "Vista previa de 3 segundos"];
      const elements = $$('strong, span', summary);
      elements.forEach((element, index) => { element.textContent = details[index] || ""; });
      selectedMemoryDifficulty = select.value;
    }

    select.addEventListener("change", renderDifficulty);
    renderDifficulty();
  }

  function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return minutes + ":" + String(seconds).padStart(2, "0");
  }

  function currentElapsedSeconds() {
    const runningMs = memoryClockStartedAt ? Date.now() - memoryClockStartedAt : 0;
    return Math.max(0, Math.floor((memoryElapsedMs + runningMs) / 1000));
  }

  function updateMemoryClock() {
    const counter = $("[data-time-count]");
    if (counter) counter.textContent = formatTime(currentElapsedSeconds());
  }

  function startMemoryClock() {
    if (memoryClockStartedAt || !memoryGame || memoryGame.status === "complete") return;
    memoryClockStartedAt = Date.now();
    window.clearInterval(memoryClockId);
    memoryClockId = window.setInterval(updateMemoryClock, 250);
    updateMemoryClock();
  }

  function stopMemoryClock() {
    if (memoryClockStartedAt) {
      memoryElapsedMs += Date.now() - memoryClockStartedAt;
      memoryClockStartedAt = 0;
    }
    window.clearInterval(memoryClockId);
    memoryClockId = 0;
    updateMemoryClock();
  }

  function clearMemoryDelay() {
    window.clearTimeout(memoryDelayId);
    memoryDelayId = 0;
    memoryDelayDueAt = 0;
    memoryDelayRemaining = 0;
    memoryDelayedAction = null;
  }

  function scheduleMemoryAction(action, delay) {
    window.clearTimeout(memoryDelayId);
    memoryDelayedAction = action;
    memoryDelayRemaining = delay;
    memoryDelayDueAt = Date.now() + delay;
    memoryDelayId = window.setTimeout(() => {
      const pendingAction = memoryDelayedAction;
      memoryDelayId = 0;
      memoryDelayDueAt = 0;
      memoryDelayRemaining = 0;
      memoryDelayedAction = null;
      if (pendingAction) pendingAction();
    }, delay);
  }

  function pauseMemorySession() {
    if (!memoryGame || memoryGame.status === "complete" || memoryPaused) return;
    memoryPaused = true;
    stopMemoryClock();
    if (memoryDelayId) {
      window.clearTimeout(memoryDelayId);
      memoryDelayId = 0;
      memoryDelayRemaining = Math.max(0, memoryDelayDueAt - Date.now());
      memoryDelayDueAt = 0;
    }
  }

  function resumeMemorySession() {
    if (!memoryGame || !memoryPaused) return;
    memoryPaused = false;
    if (memoryDelayedAction) scheduleMemoryAction(memoryDelayedAction, memoryDelayRemaining);
    if (memoryGame.status !== "preview" && memoryGame.status !== "complete") startMemoryClock();
  }

  function discardMemoryGame() {
    stopMemoryClock();
    clearMemoryDelay();
    memoryGame = null;
    memoryPaused = false;
  }

  function playMemoryTone(kind) {
    if (!appState.settings.soundEnabled) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const context = playMemoryTone.context || new AudioContextClass();
    playMemoryTone.context = context;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = kind === "match" ? 660 : kind === "complete" ? 880 : 360;
    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.09, context.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + (kind === "complete" ? 0.35 : 0.16));
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + (kind === "complete" ? 0.36 : 0.17));
  }

  function mountMemoryBoard() {
    const board = $("[data-memory-board]");
    if (!board || !memoryGame) return;
    board.dataset.pairCount = String(memoryGame.pairCount);
    board.innerHTML = memoryGame.cards.map((card, index) => (
      '<button class="memory-card" type="button" data-card-index="' + index + '" data-symbol="' + escHTML(card.symbol) + '" aria-label="Carta oculta ' + (index + 1) + '">' +
        '<span class="card-back" aria-hidden="true">?</span><span class="card-front" aria-hidden="true">' + escHTML(card.symbol) + '</span>' +
      '</button>'
    )).join("");
  }

  function renderMemoryGame() {
    if (!memoryGame) return;
    const board = $("[data-memory-board]");
    if (!board) return;
    const previewing = memoryGame.status === "preview";
    const locked = memoryPaused || previewing || memoryGame.status === "resolving" || memoryGame.status === "complete";

    $$('[data-card-index]', board).forEach((button) => {
      const index = Number(button.dataset.cardIndex);
      const card = memoryGame.cards[index];
      const found = memoryGame.foundIndexes.includes(index);
      const open = previewing || memoryGame.openIndexes.includes(index);
      button.classList.toggle("is-open", open && !found);
      button.classList.toggle("is-found", found);
      button.disabled = locked || found || memoryGame.openIndexes.includes(index);
      if (found) button.setAttribute("aria-label", "Pareja encontrada: " + card.label);
      else if (open) button.setAttribute("aria-label", (previewing ? "Vista previa: " : "Carta descubierta: ") + card.label);
      else button.setAttribute("aria-label", "Carta oculta " + (index + 1));
    });

    const foundPairs = memoryGame.foundIndexes.length / 2;
    const pairs = $("[data-pairs-count]");
    const total = $("[data-pairs-total]");
    const moves = $("[data-moves-count]");
    if (pairs) pairs.textContent = String(foundPairs);
    if (total) total.textContent = String(memoryGame.pairCount);
    if (moves) moves.textContent = String(memoryGame.moves);
    updateMemoryClock();
  }

  function setGameMessage(text) {
    const message = $("[data-game-message]");
    if (message) message.textContent = text;
  }

  function finishMemoryPreview() {
    if (!memoryGame || !memoryEngine.finishPreview(memoryGame)) return;
    renderMemoryGame();
    setGameMessage("Elige dos cartas para buscar una pareja.");
    startMemoryClock();
    const firstCard = $("[data-card-index='0']");
    if (firstCard) firstCard.focus({ preventScroll: true });
  }

  function startMemoryGame(difficulty, shouldNavigate) {
    if (!memoryEngine) return;
    stopMemoryClock();
    clearMemoryDelay();
    selectedMemoryDifficulty = memoryEngine.difficulties[difficulty] ? difficulty : "explorador";
    memoryGame = memoryEngine.createGame(selectedMemoryDifficulty);
    memoryElapsedMs = 0;
    memoryClockStartedAt = 0;
    memoryPaused = false;
    memoryResultRecorded = false;
    mountMemoryBoard();
    renderMemoryGame();

    if (memoryGame.previewSeconds) {
      setGameMessage("Memoriza las figuras. Se ocultarán en " + memoryGame.previewSeconds + " segundos.");
      scheduleMemoryAction(finishMemoryPreview, memoryGame.previewSeconds * 1000);
    } else {
      setGameMessage("Elige dos cartas para buscar una pareja.");
      startMemoryClock();
    }

    if (shouldNavigate !== false) navigateTo("partida-memoria");
  }

  function ensureMemoryProgress() {
    if (!appState.progress.memory || typeof appState.progress.memory !== "object") {
      appState.progress.memory = { completedByDifficulty: {}, bestMoves: {}, bestSeconds: {}, totalPairsFound: 0 };
    }
    appState.progress.memory.completedByDifficulty = appState.progress.memory.completedByDifficulty || {};
    appState.progress.memory.bestMoves = appState.progress.memory.bestMoves || {};
    appState.progress.memory.bestSeconds = appState.progress.memory.bestSeconds || {};
    appState.progress.memory.totalPairsFound = Number(appState.progress.memory.totalPairsFound || 0);
    return appState.progress.memory;
  }

  function updateProgressViews() {
    const memoryProgress = ensureMemoryProgress();
    const completedLevels = Object.keys(memoryProgress.completedByDifficulty || {}).filter((key) => memoryProgress.completedByDifficulty[key]).length;
    const percentage = Math.round((completedLevels / 3) * 100);
    const progress = $("[data-memory-progress]");
    const label = $("[data-memory-progress-label]");
    if (progress) {
      progress.setAttribute("aria-valuenow", String(percentage));
      const fill = $("span", progress);
      if (fill) fill.style.width = percentage + "%";
    }
    if (label) label.textContent = completedLevels ? completedLevels + " de 3 niveles completados" : "Listo para jugar";
    $$('[data-completed-games]').forEach((element) => { element.textContent = String(appState.progress.completedGames || 0); });
    const memoryLevels = $("[data-memory-levels]");
    if (memoryLevels) memoryLevels.textContent = completedLevels + "/3";
    const reached = $("[data-level-reached]");
    if (reached) {
      const order = ["maestro", "aventurero", "explorador"];
      const highest = order.find((id) => memoryProgress.completedByDifficulty[id]);
      reached.textContent = highest && memoryEngine ? memoryEngine.difficulties[highest].name : "Sin completar";
    }
  }

  function completeMemoryGame() {
    if (!memoryGame || memoryResultRecorded) return;
    stopMemoryClock();
    memoryResultRecorded = true;
    const seconds = currentElapsedSeconds();
    const progress = ensureMemoryProgress();
    const difficulty = memoryGame.difficulty;
    progress.completedByDifficulty[difficulty] = true;
    progress.totalPairsFound = Number(progress.totalPairsFound || 0) + memoryGame.pairCount;
    if (typeof progress.bestMoves[difficulty] !== "number" || memoryGame.moves < progress.bestMoves[difficulty]) progress.bestMoves[difficulty] = memoryGame.moves;
    if (typeof progress.bestSeconds[difficulty] !== "number" || seconds < progress.bestSeconds[difficulty]) progress.bestSeconds[difficulty] = seconds;
    appState.progress.completedGames = Number(appState.progress.completedGames || 0) + 1;
    saveState();
    updateProgressViews();

    $("[data-result-pairs]").textContent = memoryGame.pairCount + " parejas";
    $("[data-result-moves]").textContent = memoryGame.moves + (memoryGame.moves === 1 ? " movimiento" : " movimientos");
    $("[data-result-level]").textContent = memoryEngine.difficulties[difficulty].name;
    $("[data-result-time]").textContent = formatTime(seconds);
    playMemoryTone("complete");
    navigateTo("resultado");
  }

  function resolveMemoryTurn() {
    if (!memoryGame) return;
    const result = memoryEngine.resolveTurn(memoryGame);
    if (!result.resolved) return;
    renderMemoryGame();
    if (result.complete) {
      setGameMessage("¡Encontraste todas las parejas!");
      scheduleMemoryAction(completeMemoryGame, 500);
    } else if (result.matched) {
      setGameMessage("¡Pareja encontrada! Sigue buscando.");
      playMemoryTone("match");
    } else {
      setGameMessage("No eran iguales. Ya sabes dónde están.");
    }
  }

  function initMemoryGame() {
    const board = $("[data-memory-board]");
    if (!board || board.dataset.bound || !memoryEngine) return;
    board.dataset.bound = "1";

    board.addEventListener("click", (event) => {
      const card = event.target.closest("[data-card-index]");
      if (!card || !memoryGame || memoryPaused) return;
      const selection = memoryEngine.selectCard(memoryGame, Number(card.dataset.cardIndex));
      if (!selection.accepted) return;
      renderMemoryGame();
      playMemoryTone("turn");

      if (selection.outcome === "first") {
        setGameMessage("Primera carta descubierta. Busca su pareja.");
      } else if (selection.outcome === "match") {
        setGameMessage("¡Coinciden!");
        scheduleMemoryAction(resolveMemoryTurn, 550);
      } else {
        setGameMessage("Mira bien las dos cartas antes de que se oculten.");
        scheduleMemoryAction(resolveMemoryTurn, 950);
      }
    });

    document.addEventListener("click", (event) => {
      const start = event.target.closest("[data-start-memory]");
      const restart = event.target.closest("[data-restart-memory], [data-replay-memory]");
      if (start) startMemoryGame($("[data-difficulty]").value, true);
      if (restart) startMemoryGame(selectedMemoryDifficulty, true);
    });

    const soundButton = $("[data-sound-toggle]");
    if (soundButton) {
      soundButton.addEventListener("click", () => {
        appState.settings.soundEnabled = !appState.settings.soundEnabled;
        saveState();
        renderSoundButton();
        if (appState.settings.soundEnabled) playMemoryTone("match");
      });
      renderSoundButton();
    }
  }

  function renderSoundButton() {
    const button = $("[data-sound-toggle]");
    if (!button) return;
    const enabled = Boolean(appState.settings.soundEnabled);
    button.setAttribute("aria-pressed", String(enabled));
    button.setAttribute("aria-label", enabled ? "Silenciar sonidos" : "Activar sonidos");
    button.textContent = enabled ? "Sonido" : "Sin sonido";
  }

  function initOperationDifficulty() {
    const select = $("[data-operation-difficulty]");
    const summary = $("[data-operation-difficulty-summary]");
    if (!select || !summary || select.dataset.bound || !operationEngine) return;
    select.dataset.bound = "1";
    if (operationEngine.difficulties[selectedOperationDifficulty]) select.value = selectedOperationDifficulty;

    function render() {
      const config = operationEngine.difficulties[select.value] || operationEngine.difficulties.explorador;
      const labels = [
        config.roundCount + " desafíos",
        config.operators.length === 2 ? "Sumas y restas" : "Sumas, restas y multiplicaciones",
        config.id === "maestro" ? "Productos hasta 12 × 12" : "Números hasta " + config.max
      ];
      $$('strong, span', summary).forEach((element, index) => { element.textContent = labels[index]; });
      selectedOperationDifficulty = select.value;
    }

    select.addEventListener("change", render);
    render();
  }

  function operationElapsedSeconds() {
    return Math.max(0, Math.floor((operationElapsedMs + (operationClockStartedAt ? Date.now() - operationClockStartedAt : 0)) / 1000));
  }

  function updateOperationClock() {
    const element = $("[data-operation-time]");
    if (element) element.textContent = formatTime(operationElapsedSeconds());
  }

  function startOperationClock() {
    if (operationClockStartedAt || !operationGame || operationGame.status === "complete") return;
    operationClockStartedAt = Date.now();
    window.clearInterval(operationClockId);
    operationClockId = window.setInterval(updateOperationClock, 250);
    updateOperationClock();
  }

  function stopOperationClock() {
    if (operationClockStartedAt) {
      operationElapsedMs += Date.now() - operationClockStartedAt;
      operationClockStartedAt = 0;
    }
    window.clearInterval(operationClockId);
    operationClockId = 0;
    updateOperationClock();
  }

  function clearOperationDelay() {
    window.clearTimeout(operationDelayId);
    operationDelayId = 0;
    operationDelayDueAt = 0;
    operationDelayRemaining = 0;
    operationDelayedAction = null;
  }

  function scheduleOperationAction(action, delay) {
    window.clearTimeout(operationDelayId);
    operationDelayedAction = action;
    operationDelayRemaining = delay;
    operationDelayDueAt = Date.now() + delay;
    operationDelayId = window.setTimeout(() => {
      const pending = operationDelayedAction;
      operationDelayId = 0;
      operationDelayDueAt = 0;
      operationDelayRemaining = 0;
      operationDelayedAction = null;
      if (pending) pending();
    }, delay);
  }

  function pauseOperationSession() {
    if (!operationGame || operationGame.status === "complete" || operationPaused) return;
    operationPaused = true;
    stopOperationClock();
    if (operationDelayId) {
      window.clearTimeout(operationDelayId);
      operationDelayId = 0;
      operationDelayRemaining = Math.max(0, operationDelayDueAt - Date.now());
      operationDelayDueAt = 0;
    }
    renderOperationGame();
  }

  function resumeOperationSession() {
    if (!operationGame || !operationPaused) return;
    operationPaused = false;
    if (operationDelayedAction) scheduleOperationAction(operationDelayedAction, operationDelayRemaining);
    startOperationClock();
    renderOperationGame();
  }

  function discardOperationGame() {
    stopOperationClock();
    clearOperationDelay();
    operationGame = null;
    operationPaused = false;
  }

  function setOperationMessage(text) {
    const element = $("[data-operation-message]");
    if (element) element.textContent = text;
  }

  function renderOperationGame() {
    if (!operationGame) return;
    const problem = operationGame.rounds[operationGame.currentRound];
    $("[data-operation-left]").textContent = String(problem.left);
    $("[data-operation-right]").textContent = String(problem.right);
    $("[data-operation-result]").textContent = String(problem.result);
    $("[data-operation-mystery]").textContent = operationGame.status === "feedback" && operationGame.lastCorrect ? problem.operator : "?";
    $("[data-operation-round]").textContent = String(operationGame.currentRound + 1);
    $("[data-operation-total]").textContent = String(operationGame.roundCount);
    $("[data-operation-score]").textContent = String(operationGame.correctAnswers);
    updateOperationClock();

    const options = $("[data-operation-options]");
    options.innerHTML = operationGame.operators.map((operator) => {
      const rejected = operationGame.rejectedOperators.includes(operator);
      const correct = operationGame.status === "feedback" && operationGame.lastCorrect && operator === problem.operator;
      const disabled = operationPaused || operationGame.status !== "playing" || rejected;
      return '<button class="operation-option' + (rejected ? ' is-rejected' : '') + (correct ? ' is-correct' : '') + '" type="button" data-operator="' + operator + '"' + (disabled ? ' disabled' : '') + ' aria-label="Operador ' + (operator === "+" ? "suma" : operator === "−" ? "resta" : "multiplicación") + '">' + operator + '</button>';
    }).join("");
  }

  function startOperationGame(difficulty, shouldNavigate) {
    if (!operationEngine) return;
    stopOperationClock();
    clearOperationDelay();
    selectedOperationDifficulty = operationEngine.difficulties[difficulty] ? difficulty : "explorador";
    operationGame = operationEngine.createGame(selectedOperationDifficulty);
    operationElapsedMs = 0;
    operationClockStartedAt = 0;
    operationPaused = false;
    operationResultRecorded = false;
    renderOperationGame();
    setOperationMessage("Piensa qué operación produce el resultado.");
    startOperationClock();
    if (shouldNavigate !== false) navigateTo("partida-operacion");
  }

  function ensureOperationProgress() {
    if (!appState.progress.operation || typeof appState.progress.operation !== "object") {
      appState.progress.operation = { completedByDifficulty: {}, bestMistakes: {}, bestSeconds: {}, totalCorrect: 0 };
    }
    const progress = appState.progress.operation;
    progress.completedByDifficulty = progress.completedByDifficulty || {};
    progress.bestMistakes = progress.bestMistakes || {};
    progress.bestSeconds = progress.bestSeconds || {};
    progress.totalCorrect = Number(progress.totalCorrect || 0);
    return progress;
  }

  function updateOperationProgressViews() {
    const progressData = ensureOperationProgress();
    const completed = Object.keys(progressData.completedByDifficulty).filter((key) => progressData.completedByDifficulty[key]).length;
    const percentage = Math.round((completed / 3) * 100);
    const progress = $("[data-operation-progress]");
    if (progress) {
      progress.setAttribute("aria-valuenow", String(percentage));
      const fill = $("span", progress);
      if (fill) fill.style.width = percentage + "%";
    }
    const label = $("[data-operation-progress-label]");
    if (label) label.textContent = completed ? completed + " de 3 niveles completados" : "Listo para jugar";
    const operationLevels = $("[data-operation-levels]");
    if (operationLevels) operationLevels.textContent = completed + "/3";
  }

  function completeOperationGame() {
    if (!operationGame || operationResultRecorded) return;
    stopOperationClock();
    operationResultRecorded = true;
    const seconds = operationElapsedSeconds();
    const progress = ensureOperationProgress();
    const difficulty = operationGame.difficulty;
    progress.completedByDifficulty[difficulty] = true;
    progress.totalCorrect += operationGame.correctAnswers;
    if (typeof progress.bestMistakes[difficulty] !== "number" || operationGame.mistakes < progress.bestMistakes[difficulty]) progress.bestMistakes[difficulty] = operationGame.mistakes;
    if (typeof progress.bestSeconds[difficulty] !== "number" || seconds < progress.bestSeconds[difficulty]) progress.bestSeconds[difficulty] = seconds;
    appState.progress.completedGames = Number(appState.progress.completedGames || 0) + 1;
    saveState();
    updateProgressViews();
    updateOperationProgressViews();
    $("[data-operation-result-rounds]").textContent = operationGame.roundCount + " desafíos";
    $("[data-operation-result-mistakes]").textContent = operationGame.mistakes + (operationGame.mistakes === 1 ? " error" : " errores");
    $("[data-operation-result-level]").textContent = operationEngine.difficulties[difficulty].name;
    $("[data-operation-result-time]").textContent = formatTime(seconds);
    playMemoryTone("complete");
    navigateTo("resultado-operacion");
  }

  function continueOperationGame() {
    if (!operationGame) return;
    const result = operationEngine.continueGame(operationGame);
    if (result.complete) {
      completeOperationGame();
      return;
    }
    renderOperationGame();
    setOperationMessage(operationGame.lastCorrect ? "Nuevo desafío. ¿Qué signo falta?" : "Prueba con otro signo. Puedes resolverlo.");
  }

  function initOperationGame() {
    const options = $("[data-operation-options]");
    if (!options || options.dataset.bound || !operationEngine) return;
    options.dataset.bound = "1";
    options.addEventListener("click", (event) => {
      const button = event.target.closest("[data-operator]");
      if (!button || !operationGame || operationPaused) return;
      const answer = operationEngine.submitAnswer(operationGame, button.dataset.operator);
      if (!answer.accepted) return;
      renderOperationGame();
      if (answer.correct) {
        setOperationMessage(answer.finalRound ? "¡Resolviste el último misterio!" : "¡Correcto! Ese era el signo.");
        playMemoryTone("match");
        scheduleOperationAction(continueOperationGame, answer.finalRound ? 700 : 600);
      } else {
        setOperationMessage("Ese signo no funciona. Mira los números e inténtalo otra vez.");
        scheduleOperationAction(continueOperationGame, 650);
      }
    });

    document.addEventListener("click", (event) => {
      const start = event.target.closest("[data-start-operation]");
      const restart = event.target.closest("[data-restart-operation], [data-replay-operation]");
      if (start) startOperationGame($("[data-operation-difficulty]").value, true);
      if (restart) startOperationGame(selectedOperationDifficulty, true);
    });
  }

  function initWordDifficulty() {
    const select = $("[data-word-difficulty]");
    const summary = $("[data-word-difficulty-summary]");
    if (!select || !summary || select.dataset.bound || !wordEngine) return;
    select.dataset.bound = "1";
    if (wordEngine.difficulties[selectedWordDifficulty]) select.value = selectedWordDifficulty;
    function render() {
      const config = wordEngine.difficulties[select.value] || wordEngine.difficulties.explorador;
      const lengths = config.words.map((item) => item.word.length);
      const labels = [config.roundCount + " palabras", "Entre " + Math.min(...lengths) + " y " + Math.max(...lengths) + " letras", "Pistas disponibles"];
      $$('strong, span', summary).forEach((element, index) => { element.textContent = labels[index]; });
      selectedWordDifficulty = select.value;
    }
    select.addEventListener("change", render);
    render();
  }

  function wordElapsedSeconds() {
    return Math.max(0, Math.floor((wordElapsedMs + (wordClockStartedAt ? Date.now() - wordClockStartedAt : 0)) / 1000));
  }

  function updateWordClock() {
    const element = $("[data-word-time]");
    if (element) element.textContent = formatTime(wordElapsedSeconds());
  }

  function startWordClock() {
    if (wordClockStartedAt || !wordGame || wordGame.status === "complete") return;
    wordClockStartedAt = Date.now();
    window.clearInterval(wordClockId);
    wordClockId = window.setInterval(updateWordClock, 250);
    updateWordClock();
  }

  function stopWordClock() {
    if (wordClockStartedAt) { wordElapsedMs += Date.now() - wordClockStartedAt; wordClockStartedAt = 0; }
    window.clearInterval(wordClockId); wordClockId = 0; updateWordClock();
  }

  function clearWordDelay() {
    window.clearTimeout(wordDelayId);
    wordDelayId = 0; wordDelayDueAt = 0; wordDelayRemaining = 0; wordDelayedAction = null;
  }

  function scheduleWordAction(action, delay) {
    window.clearTimeout(wordDelayId);
    wordDelayedAction = action; wordDelayRemaining = delay; wordDelayDueAt = Date.now() + delay;
    wordDelayId = window.setTimeout(() => {
      const pending = wordDelayedAction;
      wordDelayId = 0; wordDelayDueAt = 0; wordDelayRemaining = 0; wordDelayedAction = null;
      if (pending) pending();
    }, delay);
  }

  function pauseWordSession() {
    if (!wordGame || wordGame.status === "complete" || wordPaused) return;
    wordPaused = true; stopWordClock();
    if (wordDelayId) {
      window.clearTimeout(wordDelayId); wordDelayId = 0;
      wordDelayRemaining = Math.max(0, wordDelayDueAt - Date.now()); wordDelayDueAt = 0;
    }
    renderWordGame();
  }

  function resumeWordSession() {
    if (!wordGame || !wordPaused) return;
    wordPaused = false;
    if (wordDelayedAction) scheduleWordAction(wordDelayedAction, wordDelayRemaining);
    startWordClock(); renderWordGame();
  }

  function discardWordGame() {
    stopWordClock(); clearWordDelay(); wordGame = null; wordPaused = false;
  }

  function setWordMessage(text) {
    const element = $("[data-word-message]");
    if (element) element.textContent = text;
  }

  function selectedWordLetters(round) {
    return wordGame.selectedLetterIds.map((id) => round.letters.find((item) => item.id === id).letter);
  }

  function renderWordGame() {
    if (!wordGame) return;
    const round = wordGame.rounds[wordGame.currentRound];
    const selected = selectedWordLetters(round);
    $("[data-word-round]").textContent = String(wordGame.currentRound + 1);
    $("[data-word-total]").textContent = String(wordGame.roundCount);
    $("[data-word-score]").textContent = String(wordGame.correctAnswers);
    updateWordClock();

    const answer = $("[data-word-answer]");
    answer.classList.toggle("is-correct", wordGame.status === "feedback" && wordGame.lastCorrect);
    answer.classList.toggle("is-wrong", wordGame.status === "feedback" && !wordGame.lastCorrect);
    answer.innerHTML = Array.from({ length: round.word.length }, (_, index) => '<span>' + escHTML(selected[index] || "") + '</span>').join("");

    const letters = $("[data-word-letters]");
    letters.innerHTML = round.letters.map((item) => {
      const used = wordGame.selectedLetterIds.includes(item.id);
      const disabled = used || wordPaused || wordGame.status !== "playing";
      return '<button class="word-letter" type="button" data-letter-id="' + item.id + '"' + (disabled ? ' disabled' : '') + ' aria-label="Letra ' + escHTML(item.letter) + '">' + escHTML(item.letter) + '</button>';
    }).join("");

    const hint = $("[data-word-hint-text]");
    const hinted = wordGame.hintedRounds.includes(wordGame.currentRound);
    hint.hidden = !hinted;
    hint.textContent = hinted ? "Pista: " + round.hint : "";
    $("[data-word-undo]").disabled = wordPaused || wordGame.status !== "playing" || !selected.length;
    $("[data-word-clear]").disabled = wordPaused || wordGame.status !== "playing" || !selected.length;
    $("[data-word-hint]").disabled = wordPaused || wordGame.status !== "playing";
  }

  function startWordGame(difficulty, shouldNavigate) {
    if (!wordEngine) return;
    stopWordClock(); clearWordDelay();
    selectedWordDifficulty = wordEngine.difficulties[difficulty] ? difficulty : "explorador";
    wordGame = wordEngine.createGame(selectedWordDifficulty);
    wordElapsedMs = 0; wordClockStartedAt = 0; wordPaused = false; wordResultRecorded = false;
    renderWordGame(); setWordMessage("Toca las letras en el orden correcto."); startWordClock();
    if (shouldNavigate !== false) navigateTo("partida-palabras");
  }

  function ensureWordProgress() {
    if (!appState.progress.word || typeof appState.progress.word !== "object") {
      appState.progress.word = { completedByDifficulty: {}, bestMistakes: {}, bestHints: {}, bestSeconds: {}, totalWords: 0 };
    }
    const progress = appState.progress.word;
    progress.completedByDifficulty = progress.completedByDifficulty || {};
    progress.bestMistakes = progress.bestMistakes || {};
    progress.bestHints = progress.bestHints || {};
    progress.bestSeconds = progress.bestSeconds || {};
    progress.totalWords = Number(progress.totalWords || 0);
    return progress;
  }

  function updateWordProgressViews() {
    const data = ensureWordProgress();
    const completed = Object.keys(data.completedByDifficulty).filter((key) => data.completedByDifficulty[key]).length;
    const percentage = Math.round((completed / 3) * 100);
    const progress = $("[data-word-progress]");
    if (progress) {
      progress.setAttribute("aria-valuenow", String(percentage));
      const fill = $("span", progress); if (fill) fill.style.width = percentage + "%";
    }
    const label = $("[data-word-progress-label]");
    if (label) label.textContent = completed ? completed + " de 3 niveles completados" : "Listo para jugar";
    const levels = $("[data-word-levels]"); if (levels) levels.textContent = completed + "/3";
  }

  function completeWordGame() {
    if (!wordGame || wordResultRecorded) return;
    stopWordClock(); wordResultRecorded = true;
    const seconds = wordElapsedSeconds();
    const progress = ensureWordProgress(); const difficulty = wordGame.difficulty;
    progress.completedByDifficulty[difficulty] = true;
    progress.totalWords += wordGame.correctAnswers;
    if (typeof progress.bestMistakes[difficulty] !== "number" || wordGame.mistakes < progress.bestMistakes[difficulty]) progress.bestMistakes[difficulty] = wordGame.mistakes;
    if (typeof progress.bestHints[difficulty] !== "number" || wordGame.hintsUsed < progress.bestHints[difficulty]) progress.bestHints[difficulty] = wordGame.hintsUsed;
    if (typeof progress.bestSeconds[difficulty] !== "number" || seconds < progress.bestSeconds[difficulty]) progress.bestSeconds[difficulty] = seconds;
    appState.progress.completedGames = Number(appState.progress.completedGames || 0) + 1;
    saveState(); updateProgressViews(); updateWordProgressViews();
    $("[data-word-result-rounds]").textContent = wordGame.roundCount + " palabras";
    $("[data-word-result-mistakes]").textContent = wordGame.mistakes + (wordGame.mistakes === 1 ? " intento extra" : " intentos extra");
    $("[data-word-result-level]").textContent = wordEngine.difficulties[difficulty].name;
    $("[data-word-result-time]").textContent = formatTime(seconds);
    $("[data-word-result-hints]").textContent = wordGame.hintsUsed + (wordGame.hintsUsed === 1 ? " pista" : " pistas");
    playMemoryTone("complete"); navigateTo("resultado-palabras");
  }

  function continueWordGame() {
    if (!wordGame) return;
    const wasCorrect = wordGame.lastCorrect;
    const result = wordEngine.continueGame(wordGame);
    if (result.complete) { completeWordGame(); return; }
    renderWordGame();
    setWordMessage(wasCorrect ? "¡Nueva palabra! Ordena sus letras." : "Casi. Las letras volvieron para que pruebes otra vez.");
  }

  function initWordGame() {
    const letters = $("[data-word-letters]");
    if (!letters || letters.dataset.bound || !wordEngine) return;
    letters.dataset.bound = "1";
    letters.addEventListener("click", (event) => {
      const button = event.target.closest("[data-letter-id]");
      if (!button || !wordGame || wordPaused) return;
      const choice = wordEngine.selectLetter(wordGame, Number(button.dataset.letterId));
      if (!choice.accepted) return;
      renderWordGame(); playMemoryTone("turn");
      if (choice.completeWord) {
        setWordMessage(choice.correct ? "¡Encontraste la palabra!" : "Las letras todavía no forman la palabra.");
        if (choice.correct) playMemoryTone("match");
        scheduleWordAction(continueWordGame, choice.correct ? 700 : 950);
      }
    });
    $("[data-word-undo]").addEventListener("click", () => { if (wordEngine.removeLastLetter(wordGame)) renderWordGame(); });
    $("[data-word-clear]").addEventListener("click", () => { if (wordEngine.clearLetters(wordGame)) renderWordGame(); });
    $("[data-word-hint]").addEventListener("click", () => { const hint = wordEngine.useHint(wordGame); if (hint) { renderWordGame(); setWordMessage("Pista disponible debajo de las letras."); } });
    document.addEventListener("click", (event) => {
      const start = event.target.closest("[data-start-word]");
      const restart = event.target.closest("[data-restart-word], [data-replay-word]");
      if (start) startWordGame($("[data-word-difficulty]").value, true);
      if (restart) startWordGame(selectedWordDifficulty, true);
    });
  }

  function initDialogs() {
    const pauseDialog = $("[data-pause-dialog]");
    const exitDialog = $("[data-exit-dialog]");
    if (!pauseDialog || !exitDialog || pauseDialog.dataset.bound) return;
    pauseDialog.dataset.bound = "1";

    function currentGameType() {
      const screen = currentScreenFromHash();
      if (screen === "partida-operacion") return "operation";
      if (screen === "partida-palabras") return "word";
      return "memory";
    }

    function pauseCurrentGame() {
      if (dialogGameType === "operation") pauseOperationSession();
      else if (dialogGameType === "word") pauseWordSession();
      else pauseMemorySession();
    }

    function resumeCurrentGame() {
      if (dialogGameType === "operation") resumeOperationSession();
      else if (dialogGameType === "word") resumeWordSession();
      else resumeMemorySession();
    }

    document.addEventListener("click", (event) => {
      const action = event.target.closest("[data-action]");
      if (!action) return;
      if (action.dataset.action === "pause-game") {
        dialogGameType = currentGameType();
        pauseCurrentGame();
        pauseDialog.showModal();
      }
      if (action.dataset.action === "request-exit") {
        dialogGameType = currentGameType();
        pauseCurrentGame();
        exitDialog.showModal();
      }
    });

    pauseDialog.addEventListener("close", () => {
      resumeCurrentGame();
      dialogGameType = "";
    });
    exitDialog.addEventListener("close", () => {
      if (exitDialog.returnValue !== "exit") {
        resumeCurrentGame();
      }
      dialogGameType = "";
    });

    $("[data-confirm-exit]", exitDialog).addEventListener("click", () => {
      exitDialog.close("exit");
      if (dialogGameType === "operation") discardOperationGame();
      else if (dialogGameType === "word") discardWordGame();
      else discardMemoryGame();
      navigateTo("misiones");
    });
  }

  function initAdultGate() {
    const button = $("[data-adult-gate]");
    const status = $("[data-adult-gate-status]");
    if (!button || button.dataset.bound) return;
    button.dataset.bound = "1";
    let timer = 0;

    function startHold() {
      if (timer) return;
      button.classList.add("is-holding");
      status.textContent = "Mantén un momento más…";
      timer = window.setTimeout(() => {
        timer = 0;
        button.classList.remove("is-holding");
        status.textContent = "Acceso completado.";
        navigateTo("panel-familiar");
      }, 1100);
    }

    function cancelHold() {
      if (!timer) return;
      window.clearTimeout(timer);
      timer = 0;
      button.classList.remove("is-holding");
      status.textContent = "Mantén el botón aproximadamente un segundo.";
    }

    button.addEventListener("pointerdown", startHold);
    button.addEventListener("pointerup", cancelHold);
    button.addEventListener("pointercancel", cancelHold);
    button.addEventListener("pointerleave", cancelHold);
    button.addEventListener("keydown", (event) => {
      if ((event.key === " " || event.key === "Enter") && !event.repeat) {
        event.preventDefault();
        startHold();
      }
    });
    button.addEventListener("keyup", (event) => {
      if (event.key === " " || event.key === "Enter") cancelHold();
    });
  }

  function initSettings() {
    const form = $("[data-settings-form]");
    const status = $("[data-settings-status]");
    if (!form || form.dataset.bound) return;
    form.dataset.bound = "1";

    form.elements.sessionMinutes.value = String(appState.settings.sessionMinutes);
    form.elements.soundEnabled.value = String(appState.settings.soundEnabled);
    form.elements.preferredDifficulty.value = appState.settings.preferredDifficulty;
    updateProgressViews();

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      appState.settings = {
        sessionMinutes: Number(formData.get("sessionMinutes")) || 20,
        soundEnabled: formData.get("soundEnabled") === "true",
        preferredDifficulty: String(formData.get("preferredDifficulty") || "auto")
      };
      const saved = saveState();
      status.textContent = saved ? "Configuración guardada en este navegador." : "No se pudo guardar. Revisa la configuración del navegador.";
      renderSoundButton();
    });
  }

  function initMagneticButtons() {
    if (!fineHover) return;
    $$('.button-primary').forEach((button) => {
      if (button.dataset.magneticBound) return;
      button.dataset.magneticBound = "1";
      button.addEventListener("mousemove", (event) => {
        const rect = button.getBoundingClientRect();
        const x = (event.clientX - rect.left - rect.width / 2) * 0.08;
        const y = (event.clientY - rect.top - rect.height / 2) * 0.08;
        button.style.transform = "translate(" + x + "px," + y + "px)";
      });
      button.addEventListener("mouseout", (event) => {
        if (button.contains(event.relatedTarget)) return;
        button.style.transform = "";
      });
    });
  }

  function boot() {
    safe(initNavigation, "initNavigation");
    safe(initProfile, "initProfile");
    safe(initDifficulty, "initDifficulty");
    safe(initMemoryGame, "initMemoryGame");
    safe(initOperationDifficulty, "initOperationDifficulty");
    safe(initOperationGame, "initOperationGame");
    safe(initWordDifficulty, "initWordDifficulty");
    safe(initWordGame, "initWordGame");
    safe(initDialogs, "initDialogs");
    safe(initAdultGate, "initAdultGate");
    safe(initSettings, "initSettings");
    safe(updateProgressViews, "updateProgressViews");
    safe(updateOperationProgressViews, "updateOperationProgressViews");
    safe(updateWordProgressViews, "updateWordProgressViews");
    safe(initMagneticButtons, "initMagneticButtons");
    document.documentElement.classList.add("is-ready");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
