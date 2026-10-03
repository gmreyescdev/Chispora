(function () {
  "use strict";

  const brand = window.__BRAND__ || {}, engine = brand.tangramEngine;
  const key = brand.storageKey || "chispora.mvp.v1";
  const $ = (name) => document.querySelector("[data-tangram-" + name + "]");
  const escape = (value) => String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  let game = null, paused = false, recorded = false, lastLevel = "explorador";

  function read() {
    try { const state = JSON.parse(localStorage.getItem(key) || "{}"); return state && typeof state === "object" && !Array.isArray(state) ? state : {}; }
    catch (_) { return {}; }
  }
  function message(text) { $("message").textContent = text; }
  function polygon(points) { return points.map((p) => p.map((v) => Number(v.toFixed(4))).join(",")).join(" "); }
  function bounds(polygons) {
    const points = polygons.flat(), xs = points.map((p) => p[0]), ys = points.map((p) => p[1]);
    const x = Math.min(...xs), y = Math.min(...ys), width = Math.max(...xs) - x, height = Math.max(...ys) - y;
    return [x - 0.35, y - 0.35, width + 0.7, height + 0.7].join(" ");
  }
  function pieceSvg(index) {
    const p = game.pieces[index], points = engine.transform(engine.pieces[index].points, p.rotation, p.flipped);
    // Every piece uses the same scale, including the small triangles.
    return '<svg viewBox="-3 -3 6 6" aria-hidden="true"><polygon points="' + polygon(points) + '" /></svg>';
  }
  function refreshProgress() {
    const state = read(), p = state.progress && state.progress.tangram;
    const completed = p && p.completedByDifficulty || {};
    const count = Object.keys(engine.difficulties).filter((id) => completed[id] === true).length;
    $("progress-label").textContent = count ? count + " de 3 niveles completados" : "Listo para jugar";
    const bar = $("progress"); bar.setAttribute("aria-valuenow", count / 3 * 100);
    bar.querySelector("span").style.width = count / 3 * 100 + "%";
    $("levels").textContent = count + "/3";
  }
  function render() {
    if (!game) return;
    const round = game.rounds[game.currentRound], locked = paused || game.status !== "playing";
    $("round").textContent = game.currentRound + 1; $("total").textContent = game.roundCount;
    $("title").textContent = round.name;
    $("stage").classList.toggle("is-paused", paused);
    $("board").innerHTML = '<svg viewBox="' + bounds(round.slots) + '" role="img" aria-label="' + escape(round.name) + ': siete espacios numerados. Usa los botones de espacio para colocar las piezas.">' + round.slots.map((points, slot) => {
      const center = points.reduce((p, v) => [p[0] + v[0] / points.length, p[1] + v[1] / points.length], [0, 0]);
      const filled = game.placed[slot] !== null;
      return '<g class="tangram-slot' + (filled ? ' is-filled' : '') + '"><polygon points="' + polygon(points) + '" /><text x="' + center[0] + '" y="' + center[1] + '">' + (slot + 1) + '</text></g>';
    }).join("") + '</svg>';
    // Keep the buttons in the DOM so rotation and selection do not lose keyboard focus.
    $("pieces").querySelectorAll("button").forEach((button, index) => {
      const placed = game.placed.includes(index);
      button.innerHTML = pieceSvg(index) + '<span>' + escape(engine.pieces[index].name) + (placed ? ' · Colocada' : '') + '</span>';
      button.disabled = locked || placed;
      button.setAttribute("aria-pressed", String(game.selected === index));
    });
    $("slots").querySelectorAll("button").forEach((button, slot) => {
      const filled = game.placed[slot] !== null;
      const guide = game.difficulty === "explorador" ? ' · ' + engine.pieces[slot].name.replace(/ [AB]$/, "") : '';
      button.textContent = "Espacio " + (slot + 1) + (filled ? ' · Listo' : guide);
      button.disabled = locked || filled;
    });
    const selected = game.selected;
    $("selected").textContent = selected === null ? "Elige una pieza." : engine.pieces[selected].name + " · giro " + game.pieces[selected].rotation * 45 + "°" + (game.pieces[selected].flipped ? " · volteada" : "");
    ["rotate", "flip", "hint"].forEach((name) => { $(name).disabled = locked || selected === null; });
    $("continue").hidden = game.status !== "feedback";
    $("continue").textContent = game.currentRound === game.roundCount - 1 ? "Ver resultado" : "Siguiente figura";
  }
  function start(level) {
    lastLevel = Object.prototype.hasOwnProperty.call(engine.difficulties, level) ? level : "explorador";
    game = engine.createGame(lastLevel); paused = false; recorded = false;
    render(); message("Elige una pieza y después su espacio. Puedes girarla o pedir una pista.");
    location.hash = "partida-tangram";
  }
  function finish() {
    if (!game || recorded || game.status !== "complete") return;
    recorded = true;
    const state = read();
    if (!state.progress || typeof state.progress !== "object" || Array.isArray(state.progress)) state.progress = {};
    let p = state.progress.tangram;
    if (!p || typeof p !== "object" || Array.isArray(p)) p = state.progress.tangram = {};
    if (!p.completedByDifficulty || typeof p.completedByDifficulty !== "object" || Array.isArray(p.completedByDifficulty)) p.completedByDifficulty = {};
    p.completedByDifficulty[game.difficulty] = true;
    p.totalFigures = (Number.isFinite(p.totalFigures) ? p.totalFigures : 0) + game.roundCount;
    state.progress.completedGames = (Number.isFinite(state.progress.completedGames) ? state.progress.completedGames : 0) + 1;
    let saved = true;
    try { localStorage.setItem(key, JSON.stringify(state)); }
    catch (_) { saved = false; }
    $("result-rounds").textContent = game.roundCount;
    $("result-level").textContent = engine.difficulties[game.difficulty].name;
    $("save-status").textContent = saved ? "Tu progreso quedó guardado en este equipo." : "Completaste la misión. Este navegador no pudo guardar el progreso.";
    if (saved) {
      refreshProgress();
      document.querySelectorAll("[data-completed-games]").forEach((el) => { el.textContent = state.progress.completedGames; });
      window.dispatchEvent(new CustomEvent("chispora:state-updated", { detail: state }));
    }
    location.hash = "resultado-tangram";
  }
  function init() {
    if (!engine || !$("start")) return;
    const select = $("difficulty"), state = read(), preferred = state.settings && state.settings.preferredDifficulty;
    if (Object.prototype.hasOwnProperty.call(engine.difficulties, preferred)) select.value = preferred;
    function summary() { const c = engine.difficulties[select.value]; $("summary").textContent = c.roundCount + " figuras · " + c.description; }
    summary(); select.addEventListener("change", summary);
    engine.pieces.forEach((piece, index) => {
      const button = document.createElement("button"); button.type = "button"; button.className = "tangram-piece";
      button.addEventListener("click", () => {
        if (paused || !engine.selectPiece(game, index)) return;
        render(); message("Elegiste " + piece.name + ". Gira si hace falta y elige un espacio.");
      });
      $("pieces").append(button);
      const slot = document.createElement("button"); slot.type = "button"; slot.className = "button button-secondary";
      slot.addEventListener("click", () => {
        if (!game || paused) return;
        if (game.selected === null) { message("Primero elige una pieza."); return; }
        const result = engine.placePiece(game, index);
        if (!result.accepted) return;
        render(); message(result.solved ? "¡Figura completa! Continúa cuando quieras." : result.correct ? "¡Encajó! Elige otra pieza." : "Todavía no encaja. Prueba girarla, voltearla o elegir otro espacio.");
        if (result.solved) $("continue").focus();
        else if (result.correct) $("pieces").querySelector("button:not(:disabled)").focus();
      });
      $("slots").append(slot);
    });
    ["rotate", "flip"].forEach((action) => $(action).addEventListener("click", () => {
      if (!paused && engine.adjustPiece(game, action)) { render(); message($("selected").textContent + ". Ahora puedes elegir un espacio."); }
    }));
    $("hint").addEventListener("click", () => {
      if (paused) return;
      const hint = engine.useHint(game);
      if (hint) { render(); message("Orientamos la pieza para ayudarte. Colócala en el espacio " + (hint.slot + 1) + "."); }
    });
    $("start").addEventListener("click", () => start(select.value));
    $("replay").addEventListener("click", () => start(lastLevel));
    $("continue").addEventListener("click", () => {
      if (paused) return;
      const result = engine.continueGame(game);
      if (result.complete) finish();
      else if (result.continued) { render(); message("Nueva figura. Elige una pieza."); $("pieces").querySelector("button").focus(); }
    });
    const pause = $("pause-dialog"), exit = $("exit-dialog");
    $("pause").addEventListener("click", () => { if (!game) return; paused = true; render(); pause.showModal(); });
    $("exit").addEventListener("click", () => { if (!game) return; paused = true; render(); exit.showModal(); });
    pause.addEventListener("close", () => { if (game) { paused = false; render(); } });
    exit.addEventListener("close", () => {
      if (exit.returnValue === "leave") { game = null; paused = false; location.hash = "misiones"; }
      else if (game) { paused = false; render(); }
    });
    window.addEventListener("hashchange", () => {
      if (location.hash !== "#partida-tangram") { game = null; paused = false; if (pause.open) pause.close(); if (exit.open) exit.close("cancel"); }
      else if (!game) start(select.value);
    });
    window.addEventListener("storage", refreshProgress);
    window.addEventListener("chispora:state-updated", refreshProgress);
    refreshProgress();
    if (location.hash === "#partida-tangram") start(select.value);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
