(function () {
  "use strict";

  const brand = window.__BRAND__ || {};
  const engine = brand.mazeEngine;
  const storageKey = brand.storageKey || "chispora.mvp.v1";
  const $ = (selector, scope) => (scope || document).querySelector(selector);
  const $$ = (selector, scope) => Array.from((scope || document).querySelectorAll(selector));

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

  function readState() {
    try { return JSON.parse(localStorage.getItem(storageKey) || "{}"); }
    catch (_) { return {}; }
  }

  function saveState(state) {
    try { localStorage.setItem(storageKey, JSON.stringify(state)); return true; }
    catch (error) { console.warn("[maze-storage] No se pudo guardar:", error); return false; }
  }

  function formatTime(totalSeconds) {
    return Math.floor(totalSeconds / 60) + ":" + String(totalSeconds % 60).padStart(2, "0");
  }

  function elapsedSeconds() {
    return Math.max(0, Math.floor((elapsedMs + (clockStartedAt ? Date.now() - clockStartedAt : 0)) / 1000));
  }

  function updateClock() {
    const element = $("[data-maze-time]");
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

  function setMessage(text) {
    const element = $("[data-maze-message]");
    if (element) element.textContent = text;
  }

  function playTone(kind) {
    const state = readState();
    const soundEnabled = !state.settings || state.settings.soundEnabled !== false;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!soundEnabled || !AudioContextClass) return;
    const context = playTone.context || new AudioContextClass(); playTone.context = context;
    const oscillator = context.createOscillator(); const gain = context.createGain();
    oscillator.frequency.value = kind === "complete" ? 880 : kind === "goal" ? 660 : 300;
    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.07, context.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.16);
    oscillator.connect(gain); gain.connect(context.destination); oscillator.start(); oscillator.stop(context.currentTime + 0.17);
  }

  function render() {
    if (!game) return;
    const round = game.rounds[game.currentRound];
    const board = $("[data-maze-board]");
    board.style.setProperty("--maze-size", round.size);
    board.setAttribute("aria-label", "Laberinto " + (game.currentRound + 1) + " de " + game.roundCount + ". Usa las flechas para llegar a la estrella.");
    board.innerHTML = round.cells.map((cell, index) => {
      const styles = [cell.walls.top ? "border-top-width:2px" : "border-top-width:0", cell.walls.right ? "border-right-width:2px" : "border-right-width:0", cell.walls.bottom ? "border-bottom-width:2px" : "border-bottom-width:0", cell.walls.left ? "border-left-width:2px" : "border-left-width:0"].join(";");
      const player = index === game.position ? '<span class="maze-player" aria-label="Tu ficha">●</span>' : "";
      const goal = index === round.goal ? '<span class="maze-goal" aria-label="Meta">★</span>' : "";
      return '<div class="maze-cell" style="' + styles + '">' + goal + player + '</div>';
    }).join("");
    $("[data-maze-round]").textContent = String(game.currentRound + 1);
    $("[data-maze-total]").textContent = String(game.roundCount);
    $("[data-maze-moves]").textContent = String(game.totalMoves);
    $$('[data-maze-direction]').forEach((button) => { button.disabled = paused || game.status !== "playing"; });
    updateClock();
  }

  function startGame(difficulty, navigate) {
    stopClock(); clearDelay();
    selectedDifficulty = engine.difficulties[difficulty] ? difficulty : "explorador";
    game = engine.createGame(selectedDifficulty);
    elapsedMs = 0; clockStartedAt = 0; paused = false; recorded = false;
    render(); setMessage("Lleva el punto azul hasta la estrella."); startClock();
    if (navigate !== false) window.location.hash = "partida-laberinto";
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
    state.progress.maze = state.progress.maze || { completedByDifficulty: {}, bestMoves: {}, bestSeconds: {}, totalMazes: 0 };
    const progress = state.progress.maze;
    progress.completedByDifficulty = progress.completedByDifficulty || {};
    progress.bestMoves = progress.bestMoves || {};
    progress.bestSeconds = progress.bestSeconds || {};
    progress.totalMazes = Number(progress.totalMazes || 0);
    return progress;
  }

  function updateProgressViews() {
    const state = readState(); const progress = ensureProgress(state);
    const completed = Object.keys(progress.completedByDifficulty).filter((key) => progress.completedByDifficulty[key]).length;
    const percentage = Math.round((completed / 3) * 100);
    const bar = $("[data-maze-progress]");
    if (bar) { bar.setAttribute("aria-valuenow", String(percentage)); const fill = $("span", bar); if (fill) fill.style.width = percentage + "%"; }
    const label = $("[data-maze-progress-label]");
    if (label) label.textContent = completed ? completed + " de 3 niveles completados" : "Listo para jugar";
    const levels = $("[data-maze-levels]"); if (levels) levels.textContent = completed + "/3";
  }

  function completeGame() {
    if (!game || recorded) return;
    stopClock(); recorded = true;
    const seconds = elapsedSeconds(); const state = readState(); const progress = ensureProgress(state); const difficulty = game.difficulty;
    progress.completedByDifficulty[difficulty] = true; progress.totalMazes += game.completedMazes;
    if (typeof progress.bestMoves[difficulty] !== "number" || game.totalMoves < progress.bestMoves[difficulty]) progress.bestMoves[difficulty] = game.totalMoves;
    if (typeof progress.bestSeconds[difficulty] !== "number" || seconds < progress.bestSeconds[difficulty]) progress.bestSeconds[difficulty] = seconds;
    state.progress.completedGames = Number(state.progress.completedGames || 0) + 1;
    saveState(state); window.dispatchEvent(new CustomEvent("chispora:state-updated", { detail: state })); updateProgressViews();
    $$('[data-completed-games]').forEach((element) => { element.textContent = String(state.progress.completedGames); });
    $("[data-maze-result-rounds]").textContent = game.roundCount + " laberintos";
    $("[data-maze-result-moves]").textContent = game.totalMoves + " movimientos";
    $("[data-maze-result-level]").textContent = engine.difficulties[difficulty].name;
    $("[data-maze-result-time]").textContent = formatTime(seconds);
    playTone("complete"); window.location.hash = "resultado-laberinto";
  }

  function continueGame() {
    if (!game) return;
    const result = engine.continueGame(game);
    if (result.complete) { completeGame(); return; }
    render(); setMessage("Nuevo laberinto. Busca otra ruta.");
  }

  function tryMove(direction) {
    if (!game || paused) return;
    const result = engine.move(game, direction);
    if (!result.accepted) {
      if (result.reason === "wall") { setMessage("Por ahí hay una pared. Prueba otra dirección."); playTone("wall"); }
      return;
    }
    render();
    if (result.reachedGoal) {
      setMessage("¡Llegaste a la estrella!"); playTone("goal"); schedule(continueGame, 850);
    } else {
      setMessage("Sigue buscando el camino hasta la estrella.");
    }
  }

  function initDifficulty() {
    const select = $("[data-maze-difficulty]"); const summary = $("[data-maze-difficulty-summary]");
    if (!select || !summary) return;
    function update() {
      const config = engine.difficulties[select.value] || engine.difficulties.explorador;
      selectedDifficulty = config.id;
      const labels = [config.roundCount + " laberintos", config.size + " × " + config.size + " casillas", config.description];
      $$("strong, span", summary).forEach((element, index) => { element.textContent = labels[index]; });
    }
    select.addEventListener("change", update); update();
  }

  function initGame() {
    $("[data-maze-controls]").addEventListener("click", (event) => {
      const button = event.target.closest("[data-maze-direction]");
      if (button) tryMove(button.dataset.mazeDirection);
    });
    document.addEventListener("keydown", (event) => {
      if (window.location.hash !== "#partida-laberinto") return;
      const direction = { ArrowUp: "up", ArrowRight: "right", ArrowDown: "down", ArrowLeft: "left" }[event.key];
      if (direction) { event.preventDefault(); tryMove(direction); }
    });
    document.addEventListener("click", (event) => {
      if (event.target.closest("[data-start-maze]")) startGame($("[data-maze-difficulty]").value, true);
      if (event.target.closest("[data-restart-maze], [data-replay-maze]")) startGame(selectedDifficulty, true);
    });
  }

  function initDialogs() {
    const pauseDialog = $("[data-maze-pause-dialog]"); const exitDialog = $("[data-maze-exit-dialog]");
    document.addEventListener("click", (event) => {
      if (event.target.closest("[data-maze-pause]")) { pauseGame(); pauseDialog.showModal(); }
      if (event.target.closest("[data-maze-exit]")) { pauseGame(); exitDialog.showModal(); }
    });
    pauseDialog.addEventListener("close", resumeGame);
    exitDialog.addEventListener("close", () => { if (exitDialog.returnValue !== "exit") resumeGame(); });
    $("[data-maze-confirm-exit]").addEventListener("click", () => { exitDialog.close("exit"); discardGame(); window.location.hash = "misiones"; });
  }

  function boot() {
    if (!engine) return;
    const saved = readState(); const preferred = saved.settings && saved.settings.preferredDifficulty;
    if (preferred && preferred !== "auto" && engine.difficulties[preferred]) {
      selectedDifficulty = preferred; const select = $("[data-maze-difficulty]"); if (select) select.value = preferred;
    }
    safe(initDifficulty, "mazeDifficulty"); safe(initGame, "mazeGame"); safe(initDialogs, "mazeDialogs"); safe(updateProgressViews, "mazeProgress");
    window.addEventListener("hashchange", () => {
      if (window.location.hash === "#partida-laberinto" && !game) startGame(selectedDifficulty, false);
      else if (window.location.hash !== "#partida-laberinto" && game && game.status !== "complete") discardGame();
    });
    if (window.location.hash === "#partida-laberinto") startGame(selectedDifficulty, false);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
