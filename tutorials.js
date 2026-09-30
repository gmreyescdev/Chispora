(function () {
  "use strict";

  const brand = window.__BRAND__ || {};
  const engine = brand.tutorialEngine;
  const storageKey = brand.storageKey || "chispora.mvp.v1";
  const games = {
    memory: "[data-start-memory]",
    operation: "[data-start-operation]",
    word: "[data-start-word]",
    sequence: "[data-start-sequence]",
    maze: "[data-start-maze]",
    reading: "[data-start-reading]",
    fraction: "[data-start-fraction]",
    robot: "[data-start-robot]",
    clock: "[data-clock-start]",
    science: "[data-science-start]"
  };
  let tutorial = null;

  function readState() {
    try {
      const value = JSON.parse(localStorage.getItem(storageKey) || "{}");
      return value && typeof value === "object" ? value : {};
    } catch (_) { return {}; }
  }

  function markSeen(gameId) {
    const state = readState();
    state.tutorialsSeen = state.tutorialsSeen && typeof state.tutorialsSeen === "object" ? state.tutorialsSeen : {};
    state.tutorialsSeen[gameId] = true;
    try { localStorage.setItem(storageKey, JSON.stringify(state)); }
    catch (error) { console.warn("[tutorial-storage] No se pudo guardar:", error); }
  }

  function init() {
    if (!engine) return;
    const dialog = document.querySelector("[data-tutorial-dialog]");
    const stepLabel = document.querySelector("[data-tutorial-step]");
    const title = document.querySelector("[data-tutorial-title]");
    const text = document.querySelector("[data-tutorial-text]");
    const visual = document.querySelector("[data-tutorial-visual]");
    const dots = document.querySelector("[data-tutorial-dots]");
    const previous = document.querySelector("[data-tutorial-previous]");
    const next = document.querySelector("[data-tutorial-next]");
    const close = document.querySelector("[data-tutorial-close]");
    if (!dialog || !stepLabel || !title || !text || !visual || !dots || !previous || !next || !close) return;

    Object.keys(games).forEach((gameId) => {
      const playButton = document.querySelector(games[gameId]);
      if (!playButton || playButton.parentElement.classList.contains("intro-actions")) return;
      const actions = document.createElement("div");
      const guideButton = document.createElement("button");
      guideButton.type = "button";
      guideButton.className = "button button-secondary tutorial-button";
      guideButton.dataset.tutorialGame = gameId;
      guideButton.textContent = "Cómo se juega";
      playButton.parentElement.insertBefore(actions, playButton);
      actions.className = "intro-actions";
      actions.append(guideButton, playButton);
      playButton.classList.remove("button-full");
    });

    function render() {
      const content = engine.current(tutorial);
      if (!content) return;
      stepLabel.textContent = "Paso " + content.position + " de " + content.total + " · " + content.name;
      title.textContent = content.step.title;
      text.textContent = content.step.text;
      visual.textContent = content.step.visual;
      dots.replaceChildren();
      for (let index = 0; index < content.total; index += 1) {
        const dot = document.createElement("span");
        dot.className = "tutorial-dot" + (index === content.position - 1 ? " is-active" : "");
        dot.setAttribute("aria-hidden", "true");
        dots.appendChild(dot);
      }
      dots.setAttribute("aria-label", "Paso " + content.position + " de " + content.total);
      previous.disabled = content.position === 1;
      next.textContent = content.position === content.total ? "Entendido" : "Siguiente";
    }

    function open(gameId) {
      tutorial = engine.createTutorial(gameId);
      if (!tutorial) return;
      render();
      dialog.showModal();
      title.focus({ preventScroll: true });
    }

    document.addEventListener("click", (event) => {
      const trigger = event.target.closest("[data-tutorial-game]");
      if (trigger) open(trigger.dataset.tutorialGame);
    });

    previous.addEventListener("click", () => {
      if (engine.previous(tutorial)) render();
    });

    next.addEventListener("click", () => {
      const result = engine.next(tutorial);
      if (result.complete) {
        markSeen(tutorial.gameId);
        dialog.close("complete");
        return;
      }
      if (result.moved) render();
    });

    close.addEventListener("click", () => dialog.close("dismissed"));
    dialog.addEventListener("close", () => { tutorial = null; });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
