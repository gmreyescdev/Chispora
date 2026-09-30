(function () {
  "use strict";

  const brand = window.__BRAND__ || {};
  const engine = brand.progressEngine;
  const storageKey = brand.storageKey || "chispora.mvp.v1";
  const $ = (selector, scope) => (scope || document).querySelector(selector);
  const $$ = (selector, scope) => Array.from((scope || document).querySelectorAll(selector));

  function readState() {
    try {
      const parsed = JSON.parse(localStorage.getItem(storageKey) || "{}");
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch (_) { return {}; }
  }

  function render() {
    if (!engine) return;
    const summary = engine.summarize(readState());
    $$('[data-skill-card]').forEach((card) => {
      const skill = summary.skills.find((item) => item.id === card.dataset.skillCard);
      if (!skill) return;
      const sparks = $("[data-skill-sparks]", card);
      if (sparks) {
        sparks.innerHTML = Array.from({ length: skill.maximumLevels }, (_, index) => '<span class="skill-spark' + (index < skill.levels ? " is-lit" : "") + '" aria-hidden="true">✦</span>').join("");
        sparks.setAttribute("aria-label", skill.levels + " de " + skill.maximumLevels + " niveles recorridos");
      }
      const label = $("[data-skill-label]", card); if (label) label.textContent = skill.label;
      const count = $("[data-skill-count]", card); if (count) count.textContent = skill.levels + "/" + skill.maximumLevels;
      card.dataset.stage = skill.stage;
    });
    $$('[data-overall-levels]').forEach((element) => { element.textContent = summary.totalLevels + "/" + summary.maximumLevels; });
    $$('[data-overall-message]').forEach((element) => { element.textContent = summary.message; });
    $$('[data-overall-progress]').forEach((bar) => {
      bar.setAttribute("aria-valuenow", String(summary.percentage));
      const fill = $("span", bar); if (fill) fill.style.width = summary.percentage + "%";
    });
  }

  function boot() {
    render();
    window.addEventListener("chispora:state-updated", render);
    window.addEventListener("storage", (event) => { if (event.key === storageKey) render(); });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
