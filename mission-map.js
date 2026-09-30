(function () {
  "use strict";

  const engine = (window.__BRAND__ || {}).missionMapEngine;

  function init() {
    const buttons = Array.from(document.querySelectorAll("[data-mission-filter]"));
    const cards = Array.from(document.querySelectorAll("[data-mission-area]"));
    const status = document.querySelector("[data-mission-filter-status]");
    if (!engine || !buttons.length || !cards.length || !status) return;

    function selectArea(areaId) {
      const selectedArea = engine.normalizeArea(areaId);
      let visibleCount = 0;

      buttons.forEach((button) => {
        const active = button.dataset.missionFilter === selectedArea;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-pressed", String(active));
      });

      cards.forEach((card) => {
        const visible = engine.matches(selectedArea, card.dataset.missionArea);
        card.hidden = !visible;
        if (visible) visibleCount += 1;
      });

      status.textContent = engine.status(visibleCount, selectedArea);
    }

    buttons.forEach((button) => {
      button.addEventListener("click", () => selectArea(button.dataset.missionFilter));
    });

    selectArea("all");
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
