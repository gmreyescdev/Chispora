(function () {
  "use strict";

  window.__BRAND__ = window.__BRAND__ || {};
  // Shared lifecycle only; each controller owns its puzzle interaction and DOM.
  window.__BRAND__.createPuzzleGame = function (config) {
    const brand = window.__BRAND__, engine = config.engine, id = config.id, slug = config.slug || id;
    const key = brand.storageKey || "chispora.mvp.v1";
    const $ = (name) => document.querySelector("[data-" + id + "-" + name + "]");
    const escape = (value) => String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
    let game = null, paused = false, recorded = false, lastLevel = "explorador";
    const object = (value) => Boolean(value && typeof value === "object" && !Array.isArray(value));
    function read() {
      try { const state = JSON.parse(localStorage.getItem(key) || "{}"); return object(state) ? state : {}; }
      catch (_) { return {}; }
    }
    function message(text) { $("message").textContent = text; }
    function refreshProgress() {
      const state = read(), completed = state.progress && state.progress[id] && state.progress[id].completedByDifficulty || {};
      const count = Object.keys(engine.difficulties).filter((level) => completed[level] === true).length;
      $("progress-label").textContent = count ? count + " de 3 niveles completados" : "Listo para jugar";
      $("levels").textContent = count + "/3";
      $("progress").setAttribute("aria-valuenow", String(Math.round(count / 3 * 100)));
      $("progress").querySelector("span").style.width = count / 3 * 100 + "%";
    }
    function render() {
      if (!game) return;
      $("round").textContent = game.currentRound + 1; $("total").textContent = game.roundCount;
      $("title").textContent = game.rounds[game.currentRound].name;
      $("stage").classList.toggle("is-paused", paused);
      $("stage").inert = paused;
      const locked = paused || game.status !== "playing";
      config.render(game, locked, api);
      $("hint").disabled = locked || Boolean(config.canHint && !config.canHint(game));
      $("continue").hidden = game.status !== "feedback";
      $("continue").textContent = game.currentRound === game.roundCount - 1 ? "Ver resultado" : config.nextLabel;
    }
    const api = { $, escape, message,
      run: function (action) {
        if (!game || paused || game.status !== "playing") return null;
        const result = action(game); render();
        if (game.status === "feedback") $("continue").focus();
        return result;
      }
    };
    function start(level) {
      lastLevel = Object.prototype.hasOwnProperty.call(engine.difficulties, level) ? level : "explorador";
      game = engine.createGame(lastLevel); paused = false; recorded = false;
      render(); message(config.startMessage); location.hash = "partida-" + slug;
    }
    function finish() {
      if (!game || recorded || game.status !== "complete") return;
      recorded = true;
      const state = read();
      if (!object(state.progress)) state.progress = {};
      if (!object(state.progress[id])) state.progress[id] = {};
      const p = state.progress[id];
      if (!object(p.completedByDifficulty)) p.completedByDifficulty = {};
      p.completedByDifficulty[game.difficulty] = true;
      p.totalRounds = (Number.isFinite(p.totalRounds) ? p.totalRounds : 0) + game.roundCount;
      state.progress.completedGames = (Number.isFinite(state.progress.completedGames) ? state.progress.completedGames : 0) + 1;
      let saved = true;
      try { localStorage.setItem(key, JSON.stringify(state)); } catch (_) { saved = false; }
      $("result-rounds").textContent = game.roundCount;
      $("result-level").textContent = engine.difficulties[game.difficulty].name;
      $("save-status").textContent = saved ? "Tu progreso quedó guardado en este equipo." : "Completaste la misión. Este navegador no pudo guardar el progreso.";
      if (saved) {
        refreshProgress();
        document.querySelectorAll("[data-completed-games]").forEach((el) => { el.textContent = state.progress.completedGames; });
        window.dispatchEvent(new CustomEvent("chispora:state-updated", { detail: state }));
      }
      location.hash = "resultado-" + slug;
    }
    function init() {
      if (!engine || !$("start")) return;
      const select = $("difficulty"), state = read(), preferred = state.settings && state.settings.preferredDifficulty;
      if (Object.prototype.hasOwnProperty.call(engine.difficulties, preferred)) select.value = preferred;
      function summary() { const c = engine.difficulties[select.value]; $("summary").textContent = c.roundCount + " " + config.noun + " · " + c.description; }
      summary(); select.addEventListener("change", summary);
      config.build(api);
      $("start").addEventListener("click", () => start(select.value));
      $("replay").addEventListener("click", () => start(lastLevel));
      $("hint").addEventListener("click", () => api.run((g) => config.hint(g, api)));
      $("continue").addEventListener("click", () => {
        if (paused) return;
        const result = engine.continueGame(game);
        if (result.complete) finish();
        else if (result.continued) { render(); message(config.startMessage); config.focus(api); }
      });
      const pause = $("pause-dialog"), exit = $("exit-dialog");
      $("pause").addEventListener("click", () => { if (!game) return; paused = true; render(); pause.showModal(); });
      $("exit").addEventListener("click", () => { if (!game) return; paused = true; render(); exit.returnValue = "cancel"; exit.showModal(); });
      pause.addEventListener("close", () => { if (game) { paused = false; render(); } });
      exit.addEventListener("close", () => {
        if (exit.returnValue === "leave") { game = null; paused = false; location.hash = "misiones"; }
        else if (game) { paused = false; render(); }
      });
      window.addEventListener("hashchange", () => {
        if (location.hash !== "#partida-" + slug) {
          game = null; paused = false;
          if (pause.open) pause.close("navigation");
          if (exit.open) exit.close("navigation");
        } else if (!game) start(select.value);
      });
      window.addEventListener("storage", (event) => { if (event.key === key || event.key === null) refreshProgress(); });
      window.addEventListener("chispora:state-updated", refreshProgress);
      refreshProgress();
      if (location.hash === "#partida-" + slug) start(select.value);
    }
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
    else init();
  };
})();
