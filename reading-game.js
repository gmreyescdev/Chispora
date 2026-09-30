(function () {
  "use strict";

  const brand = window.__BRAND__ || {};
  const engine = brand.readingEngine;
  const storageKey = brand.storageKey || "chispora.mvp.v1";
  const $ = (selector, scope) => (scope || document).querySelector(selector);
  const $$ = (selector, scope) => Array.from((scope || document).querySelectorAll(selector));
  const esc = (value) => String(value == null ? "" : value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);

  let selectedDifficulty = "explorador";
  let game = null;
  let elapsedMs = 0;
  let clockStartedAt = 0;
  let clockId = 0;
  let paused = false;
  let recorded = false;

  function safe(fn, name) {
    try { fn(); } catch (error) { console.warn("[" + name + "] failed:", error); }
  }

  function readState() {
    try {
      const parsed = JSON.parse(localStorage.getItem(storageKey) || "{}");
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch (_) { return {}; }
  }

  function saveState(state) {
    try { localStorage.setItem(storageKey, JSON.stringify(state)); return true; }
    catch (error) { console.warn("[reading-storage] No se pudo guardar:", error); return false; }
  }

  function formatTime(totalSeconds) {
    return Math.floor(totalSeconds / 60) + ":" + String(totalSeconds % 60).padStart(2, "0");
  }

  function elapsedSeconds() {
    return Math.max(0, Math.floor((elapsedMs + (clockStartedAt ? Date.now() - clockStartedAt : 0)) / 1000));
  }

  function updateClock() {
    const element = $("[data-reading-time]");
    if (element) element.textContent = formatTime(elapsedSeconds());
  }

  function startClock() {
    if (clockStartedAt || !game || game.status === "complete" || paused) return;
    clockStartedAt = Date.now();
    window.clearInterval(clockId);
    clockId = window.setInterval(updateClock, 250);
    updateClock();
  }

  function stopClock() {
    if (clockStartedAt) { elapsedMs += Date.now() - clockStartedAt; clockStartedAt = 0; }
    window.clearInterval(clockId); clockId = 0; updateClock();
  }

  function playTone(kind) {
    const state = readState();
    const soundEnabled = !state.settings || state.settings.soundEnabled !== false;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!soundEnabled || !AudioContextClass) return;
    const context = playTone.context || new AudioContextClass(); playTone.context = context;
    const oscillator = context.createOscillator(); const gain = context.createGain();
    oscillator.frequency.value = kind === "complete" ? 880 : kind === "correct" ? 660 : 350;
    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.07, context.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.17);
    oscillator.connect(gain); gain.connect(context.destination); oscillator.start(); oscillator.stop(context.currentTime + 0.18);
  }

  function setMessage(text) {
    const element = $("[data-reading-message]");
    if (element) element.textContent = text;
  }

  function render() {
    if (!game) return;
    const round = game.rounds[game.currentRound];
    const hinted = game.hintedRounds.includes(game.currentRound);
    const feedback = game.status === "feedback";
    const correctFeedback = feedback && game.lastCorrect;
    const card = $("[data-reading-card]");
    card.classList.toggle("is-paused", paused);
    $("[data-reading-round]").textContent = String(game.currentRound + 1);
    $("[data-reading-total]").textContent = String(game.roundCount);
    $("[data-reading-score]").textContent = String(game.correctAnswers);
    $("[data-reading-title]").textContent = round.title;
    $("[data-reading-question]").textContent = round.question;
    $("[data-reading-paragraphs]").innerHTML = round.paragraphs.map((paragraph, index) => (
      '<p class="' + (hinted && index === round.hint.paragraphIndex ? "is-hinted" : "") + '">' + esc(paragraph) + "</p>"
    )).join("");
    $("[data-reading-options]").innerHTML = round.options.map((option) => {
      const rejected = game.rejectedOptionIds.includes(option.id);
      const correct = correctFeedback && option.id === round.answerId;
      const disabled = paused || game.status !== "playing" || rejected;
      return '<button class="reading-option' + (rejected ? " is-rejected" : "") + (correct ? " is-correct" : "") + '" type="button" data-reading-answer="' + esc(option.id) + '"' + (disabled ? " disabled" : "") + ">" + esc(option.text) + "</button>";
    }).join("");

    const hintButton = $("[data-reading-hint]");
    hintButton.disabled = paused || game.status !== "playing" || hinted;
    hintButton.textContent = hinted ? "Pista utilizada" : "Ver una pista";
    const hint = $("[data-reading-hint-text]");
    hint.hidden = !hinted;
    hint.textContent = hinted ? "Pista: " + round.hint.text : "";
    const explanation = $("[data-reading-explanation]");
    explanation.hidden = !correctFeedback;
    explanation.textContent = correctFeedback ? "Cómo lo sabemos: " + round.explanation : "";
    const continueButton = $("[data-reading-continue]");
    continueButton.hidden = !feedback;
    continueButton.textContent = game.lastCorrect ? (game.currentRound === game.roundCount - 1 ? "Ver resultado" : "Siguiente texto") : "Intentar otra vez";
    updateClock();
  }

  function focusReadingTitle() {
    const title = $("[data-reading-title]");
    if (title) title.focus({ preventScroll: true });
  }

  function startGame(difficulty, navigate) {
    stopClock();
    selectedDifficulty = engine.difficulties[difficulty] ? difficulty : "explorador";
    game = engine.createGame(selectedDifficulty);
    elapsedMs = 0; clockStartedAt = 0; paused = false; recorded = false;
    render(); setMessage("Lee el relato y elige una respuesta."); startClock();
    if (navigate !== false) window.location.hash = "partida-lectura";
    window.setTimeout(focusReadingTitle, 0);
  }

  function pauseGame() {
    if (!game || paused || game.status === "complete") return;
    paused = true; stopClock(); render();
  }

  function resumeGame() {
    if (!game || !paused) return;
    paused = false; startClock(); render();
  }

  function discardGame() {
    stopClock(); game = null; paused = false;
  }

  function ensureProgress(state) {
    state.progress = state.progress && typeof state.progress === "object" ? state.progress : { completedGames: 0 };
    state.progress.reading = state.progress.reading && typeof state.progress.reading === "object" ? state.progress.reading : { completedByDifficulty: {}, bestExtraAttempts: {}, bestHints: {}, totalTextsCompleted: 0 };
    const progress = state.progress.reading;
    progress.completedByDifficulty = progress.completedByDifficulty || {};
    progress.bestExtraAttempts = progress.bestExtraAttempts || {};
    progress.bestHints = progress.bestHints || {};
    progress.totalTextsCompleted = Number(progress.totalTextsCompleted || 0);
    return progress;
  }

  function updateProgressViews() {
    const state = readState(); const progress = ensureProgress(state);
    const completed = Object.keys(progress.completedByDifficulty).filter((key) => progress.completedByDifficulty[key]).length;
    const percentage = Math.round((completed / 3) * 100);
    const bar = $("[data-reading-progress]");
    if (bar) { bar.setAttribute("aria-valuenow", String(percentage)); const fill = $("span", bar); if (fill) fill.style.width = percentage + "%"; }
    const label = $("[data-reading-progress-label]");
    if (label) label.textContent = completed ? completed + " de 3 niveles completados" : "Listo para jugar";
    const levels = $("[data-reading-levels]"); if (levels) levels.textContent = completed + "/3";
  }

  function completeGame() {
    if (!game || recorded) return;
    stopClock(); recorded = true;
    const seconds = elapsedSeconds(); const state = readState(); const progress = ensureProgress(state); const difficulty = game.difficulty;
    progress.completedByDifficulty[difficulty] = true;
    progress.totalTextsCompleted += game.correctAnswers;
    if (typeof progress.bestExtraAttempts[difficulty] !== "number" || game.extraAttempts < progress.bestExtraAttempts[difficulty]) progress.bestExtraAttempts[difficulty] = game.extraAttempts;
    if (typeof progress.bestHints[difficulty] !== "number" || game.hintsUsed < progress.bestHints[difficulty]) progress.bestHints[difficulty] = game.hintsUsed;
    state.progress.completedGames = Number(state.progress.completedGames || 0) + 1;
    saveState(state);
    window.dispatchEvent(new CustomEvent("chispora:state-updated", { detail: state }));
    updateProgressViews();
    $$('[data-completed-games]').forEach((element) => { element.textContent = String(state.progress.completedGames); });
    $("[data-reading-result-rounds]").textContent = game.roundCount + " textos";
    $("[data-reading-result-attempts]").textContent = game.extraAttempts + (game.extraAttempts === 1 ? " intento extra" : " intentos extra");
    $("[data-reading-result-level]").textContent = engine.difficulties[difficulty].name;
    $("[data-reading-result-time]").textContent = formatTime(seconds);
    $("[data-reading-result-hints]").textContent = game.hintsUsed + (game.hintsUsed === 1 ? " pista" : " pistas");
    playTone("complete"); window.location.hash = "resultado-lectura";
  }

  function continueGame() {
    if (!game) return;
    const wasCorrect = game.lastCorrect;
    const result = engine.continueGame(game);
    if (!result.continued) return;
    if (result.complete) { completeGame(); return; }
    render();
    setMessage(wasCorrect ? "Nuevo relato. Léelo con calma." : "Puedes releer y probar otra respuesta.");
    window.setTimeout(() => {
      if (wasCorrect) focusReadingTitle();
      else { const firstOption = $("[data-reading-answer]:not(:disabled)"); if (firstOption) firstOption.focus({ preventScroll: true }); }
    }, 0);
  }

  function initDifficulty() {
    const select = $("[data-reading-difficulty]"); const summary = $("[data-reading-difficulty-summary]");
    if (!select || !summary) return;
    function update() {
      const config = engine.difficulties[select.value] || engine.difficulties.explorador;
      selectedDifficulty = config.id;
      const labels = [config.roundCount + " textos", config.minWords + " a " + config.maxWords + " palabras", config.description];
      $$("strong, span", summary).forEach((element, index) => { element.textContent = labels[index]; });
    }
    select.addEventListener("change", update); update();
  }

  function initGame() {
    $("[data-reading-options]").addEventListener("click", (event) => {
      const button = event.target.closest("[data-reading-answer]");
      if (!button || !game || paused) return;
      const result = engine.submitAnswer(game, button.dataset.readingAnswer);
      if (!result.accepted) return;
      render();
      if (result.correct) { setMessage("¡Encontraste la respuesta! Revisa cómo lo sabemos."); playTone("correct"); }
      else { setMessage("Esa opción no coincide con el relato. Puedes releer y volver a intentar."); playTone("wrong"); }
      const continueButton = $("[data-reading-continue]"); if (continueButton) continueButton.focus({ preventScroll: true });
    });
    $("[data-reading-hint]").addEventListener("click", () => {
      if (!game || paused || !engine.useHint(game)) return;
      render(); setMessage("La pista señala una parte útil del relato.");
    });
    $("[data-reading-continue]").addEventListener("click", continueGame);
    document.addEventListener("click", (event) => {
      if (event.target.closest("[data-start-reading]")) startGame($("[data-reading-difficulty]").value, true);
      if (event.target.closest("[data-restart-reading], [data-replay-reading]")) startGame(selectedDifficulty, true);
    });
  }

  function initDialogs() {
    const pauseDialog = $("[data-reading-pause-dialog]"); const exitDialog = $("[data-reading-exit-dialog]");
    document.addEventListener("click", (event) => {
      if (event.target.closest("[data-reading-pause]")) { pauseGame(); pauseDialog.showModal(); }
      if (event.target.closest("[data-reading-exit]")) { pauseGame(); exitDialog.showModal(); }
    });
    pauseDialog.addEventListener("close", resumeGame);
    exitDialog.addEventListener("close", () => { if (exitDialog.returnValue !== "exit") resumeGame(); });
    $("[data-reading-confirm-exit]").addEventListener("click", () => { exitDialog.close("exit"); discardGame(); window.location.hash = "misiones"; });
  }

  function boot() {
    if (!engine) return;
    const saved = readState(); const preferred = saved.settings && saved.settings.preferredDifficulty;
    if (preferred && preferred !== "auto" && engine.difficulties[preferred]) {
      selectedDifficulty = preferred; const select = $("[data-reading-difficulty]"); if (select) select.value = preferred;
    }
    safe(initDifficulty, "readingDifficulty"); safe(initGame, "readingGame"); safe(initDialogs, "readingDialogs"); safe(updateProgressViews, "readingProgress");
    window.addEventListener("hashchange", () => {
      if (window.location.hash === "#partida-lectura" && (!game || game.status === "complete")) startGame(selectedDifficulty, false);
      else if (window.location.hash !== "#partida-lectura" && game && game.status !== "complete") discardGame();
    });
    if (window.location.hash === "#partida-lectura") startGame(selectedDifficulty, false);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
