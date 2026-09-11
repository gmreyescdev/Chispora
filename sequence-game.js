(function () {
  "use strict";

  const brand = window.__BRAND__ || {};
  const engine = brand.sequenceEngine;
  const storageKey = brand.storageKey || "chispora.mvp.v1";
  const $ = (selector, scope) => (scope || document).querySelector(selector);
  const $$ = (selector, scope) => Array.from((scope || document).querySelectorAll(selector));
  const esc = (value) => String(value == null ? "" : value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);

  let selectedDifficulty = "explorador";
  let game = null;
  let elapsedMs = 0;
  let clockStartedAt = 0;
  let clockId = 0;
  let delayId = 0;
  let delayDueAt = 0;
  let delayRemaining = 0;
  let delayedAction = null;
  let paused = false;
  let recorded = false;

  function safe(fn, name) {
    try { fn(); } catch (error) { console.warn("[" + name + "] failed:", error); }
  }

  function formatTime(totalSeconds) {
    return Math.floor(totalSeconds / 60) + ":" + String(totalSeconds % 60).padStart(2, "0");
  }

  function elapsedSeconds() {
    return Math.max(0, Math.floor((elapsedMs + (clockStartedAt ? Date.now() - clockStartedAt : 0)) / 1000));
  }

  function updateClock() {
    const element = $("[data-sequence-time]");
    if (element) element.textContent = formatTime(elapsedSeconds());
  }

  function startClock() {
    if (clockStartedAt || !game || game.status === "complete") return;
    clockStartedAt = Date.now();
    window.clearInterval(clockId);
    clockId = window.setInterval(updateClock, 250);
    updateClock();
  }

  function stopClock() {
    if (clockStartedAt) { elapsedMs += Date.now() - clockStartedAt; clockStartedAt = 0; }
    window.clearInterval(clockId); clockId = 0; updateClock();
  }

  function clearDelay() {
    window.clearTimeout(delayId);
    delayId = 0; delayDueAt = 0; delayRemaining = 0; delayedAction = null;
  }

  function schedule(action, delay) {
    window.clearTimeout(delayId);
    delayedAction = action; delayRemaining = delay; delayDueAt = Date.now() + delay;
    delayId = window.setTimeout(() => {
      const pending = delayedAction;
      delayId = 0; delayDueAt = 0; delayRemaining = 0; delayedAction = null;
      if (pending) pending();
    }, delay);
  }

  function readState() {
    try { return JSON.parse(localStorage.getItem(storageKey) || "{}"); }
    catch (_) { return {}; }
  }

  function saveState(state) {
    try { localStorage.setItem(storageKey, JSON.stringify(state)); return true; }
    catch (error) { console.warn("[sequence-storage] No se pudo guardar:", error); return false; }
  }

  function playTone(kind) {
    const state = readState();
    const soundEnabled = !state.settings || state.settings.soundEnabled !== false;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!soundEnabled || !AudioContextClass) return;
    const context = playTone.context || new AudioContextClass(); playTone.context = context;
    const oscillator = context.createOscillator(); const gain = context.createGain();
    oscillator.frequency.value = kind === "complete" ? 880 : kind === "correct" ? 660 : 340;
    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.08, context.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.18);
    oscillator.connect(gain); gain.connect(context.destination); oscillator.start(); oscillator.stop(context.currentTime + 0.19);
  }

  function setMessage(text) {
    const element = $("[data-sequence-message]");
    if (element) element.textContent = text;
  }

  function render() {
    if (!game) return;
    const round = game.rounds[game.currentRound];
    $("[data-sequence-round]").textContent = String(game.currentRound + 1);
    $("[data-sequence-total]").textContent = String(game.roundCount);
    $("[data-sequence-score]").textContent = String(game.correctAnswers);
    $("[data-sequence-items]").innerHTML = round.sequence.map((item) => '<span>' + esc(item) + '</span>').join("") + '<span class="sequence-missing">?</span>';
    $("[data-sequence-options]").innerHTML = round.options.map((option) => {
      const rejected = game.rejectedOptions.includes(option);
      const correct = game.status === "feedback" && game.lastCorrect && option === round.answer;
      const disabled = paused || game.status !== "playing" || rejected;
      return '<button class="sequence-option' + (rejected ? ' is-rejected' : '') + (correct ? ' is-correct' : '') + '" type="button" data-sequence-answer="' + esc(option) + '"' + (disabled ? ' disabled' : '') + '>' + esc(option) + '</button>';
    }).join("");
    updateClock();
  }

  function startGame(difficulty, navigate) {
    stopClock(); clearDelay();
    selectedDifficulty = engine.difficulties[difficulty] ? difficulty : "explorador";
    game = engine.createGame(selectedDifficulty);
    elapsedMs = 0; clockStartedAt = 0; paused = false; recorded = false;
    render(); setMessage("Observa el patrón y elige qué sigue."); startClock();
    if (navigate !== false) window.location.hash = "partida-secuencia";
  }

  function pauseGame() {
    if (!game || paused || game.status === "complete") return;
    paused = true; stopClock();
    if (delayId) {
      window.clearTimeout(delayId); delayId = 0;
      delayRemaining = Math.max(0, delayDueAt - Date.now()); delayDueAt = 0;
    }
    render();
  }

  function resumeGame() {
    if (!game || !paused) return;
    paused = false;
    if (delayedAction) schedule(delayedAction, delayRemaining);
    startClock(); render();
  }

  function discardGame() {
    stopClock(); clearDelay(); game = null; paused = false;
  }

  function ensureProgress(state) {
    state.progress = state.progress || { completedGames: 0 };
    state.progress.sequence = state.progress.sequence || { completedByDifficulty: {}, bestMistakes: {}, bestSeconds: {}, totalPatterns: 0 };
    const progress = state.progress.sequence;
    progress.completedByDifficulty = progress.completedByDifficulty || {};
    progress.bestMistakes = progress.bestMistakes || {};
    progress.bestSeconds = progress.bestSeconds || {};
    progress.totalPatterns = Number(progress.totalPatterns || 0);
    return progress;
  }

  function updateProgressViews() {
    const state = readState(); const progress = ensureProgress(state);
    const completed = Object.keys(progress.completedByDifficulty).filter((key) => progress.completedByDifficulty[key]).length;
    const percentage = Math.round((completed / 3) * 100);
    const bar = $("[data-sequence-progress]");
    if (bar) { bar.setAttribute("aria-valuenow", String(percentage)); const fill = $("span", bar); if (fill) fill.style.width = percentage + "%"; }
    const label = $("[data-sequence-progress-label]");
    if (label) label.textContent = completed ? completed + " de 3 niveles completados" : "Listo para jugar";
    const levels = $("[data-sequence-levels]"); if (levels) levels.textContent = completed + "/3";
  }

  function completeGame() {
    if (!game || recorded) return;
    stopClock(); recorded = true;
    const seconds = elapsedSeconds(); const state = readState(); const progress = ensureProgress(state); const difficulty = game.difficulty;
    progress.completedByDifficulty[difficulty] = true; progress.totalPatterns += game.correctAnswers;
    if (typeof progress.bestMistakes[difficulty] !== "number" || game.mistakes < progress.bestMistakes[difficulty]) progress.bestMistakes[difficulty] = game.mistakes;
    if (typeof progress.bestSeconds[difficulty] !== "number" || seconds < progress.bestSeconds[difficulty]) progress.bestSeconds[difficulty] = seconds;
    state.progress.completedGames = Number(state.progress.completedGames || 0) + 1;
    saveState(state);
    window.dispatchEvent(new CustomEvent("chispora:state-updated", { detail: state }));
    updateProgressViews();
    $$('[data-completed-games]').forEach((element) => { element.textContent = String(state.progress.completedGames); });
    $("[data-sequence-result-rounds]").textContent = game.roundCount + " patrones";
    $("[data-sequence-result-mistakes]").textContent = game.mistakes + (game.mistakes === 1 ? " intento extra" : " intentos extra");
    $("[data-sequence-result-level]").textContent = engine.difficulties[difficulty].name;
    $("[data-sequence-result-time]").textContent = formatTime(seconds);
    playTone("complete"); window.location.hash = "resultado-secuencia";
  }

  function continueGame() {
    if (!game) return;
    const wasCorrect = game.lastCorrect; const result = engine.continueGame(game);
    if (result.complete) { completeGame(); return; }
    render(); setMessage(wasCorrect ? "Nuevo patrón. Busca la regla." : "Prueba otra opción. La anterior ya quedó descartada.");
  }

  function initDifficulty() {
    const select = $("[data-sequence-difficulty]"); const summary = $("[data-sequence-difficulty-summary]");
    if (!select || !summary) return;
    function update() {
      const config = engine.difficulties[select.value] || engine.difficulties.explorador;
      selectedDifficulty = select.value;
      const labels = [config.roundCount + " patrones", config.description, "Explicación después de acertar"];
      $$('strong, span', summary).forEach((element, index) => { element.textContent = labels[index]; });
    }
    select.addEventListener("change", update); update();
  }

  function initGame() {
    $("[data-sequence-options]").addEventListener("click", (event) => {
      const button = event.target.closest("[data-sequence-answer]");
      if (!button || !game || paused) return;
      const result = engine.submitAnswer(game, button.dataset.sequenceAnswer);
      if (!result.accepted) return;
      render();
      if (result.correct) { setMessage("¡Correcto! " + result.explanation); playTone("correct"); schedule(continueGame, result.finalRound ? 950 : 850); }
      else { setMessage("Esa opción no completa el patrón. Inténtalo otra vez."); schedule(continueGame, 700); }
    });
    document.addEventListener("click", (event) => {
      if (event.target.closest("[data-start-sequence]")) startGame($("[data-sequence-difficulty]").value, true);
      if (event.target.closest("[data-restart-sequence], [data-replay-sequence]")) startGame(selectedDifficulty, true);
    });
  }

  function initDialogs() {
    const pauseDialog = $("[data-sequence-pause-dialog]"); const exitDialog = $("[data-sequence-exit-dialog]");
    document.addEventListener("click", (event) => {
      if (event.target.closest("[data-sequence-pause]")) { pauseGame(); pauseDialog.showModal(); }
      if (event.target.closest("[data-sequence-exit]")) { pauseGame(); exitDialog.showModal(); }
    });
    pauseDialog.addEventListener("close", resumeGame);
    exitDialog.addEventListener("close", () => { if (exitDialog.returnValue !== "exit") resumeGame(); });
    $("[data-sequence-confirm-exit]").addEventListener("click", () => { exitDialog.close("exit"); discardGame(); window.location.hash = "misiones"; });
  }

  function boot() {
    if (!engine) return;
    const saved = readState();
    const preferred = saved.settings && saved.settings.preferredDifficulty;
    if (preferred && preferred !== "auto" && engine.difficulties[preferred]) {
      selectedDifficulty = preferred;
      const select = $("[data-sequence-difficulty]");
      if (select) select.value = preferred;
    }
    safe(initDifficulty, "sequenceDifficulty"); safe(initGame, "sequenceGame"); safe(initDialogs, "sequenceDialogs"); safe(updateProgressViews, "sequenceProgress");
    window.addEventListener("hashchange", () => {
      if (window.location.hash === "#partida-secuencia" && !game) startGame(selectedDifficulty, false);
      else if (window.location.hash !== "#partida-secuencia" && game && game.status !== "complete") discardGame();
    });
    if (window.location.hash === "#partida-secuencia") startGame(selectedDifficulty, false);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
