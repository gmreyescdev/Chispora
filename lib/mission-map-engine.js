(function () {
  "use strict";

  const AREAS = {
    all: { id: "all", name: "todas las áreas" },
    words: { id: "words", name: "Palabras" },
    numbers: { id: "numbers", name: "Números" },
    logic: { id: "logic", name: "Lógica" },
    exploration: { id: "exploration", name: "Exploración" }
  };

  function normalizeArea(areaId) {
    return Object.prototype.hasOwnProperty.call(AREAS, areaId) ? areaId : "all";
  }

  function matches(areaId, missionArea) {
    const selectedArea = normalizeArea(areaId);
    return selectedArea === "all" || missionArea === selectedArea;
  }

  function status(count, areaId) {
    const selectedArea = normalizeArea(areaId);
    return selectedArea === "all"
      ? count + " juegos disponibles"
      : count + " juegos de " + AREAS[selectedArea].name;
  }

  window.__BRAND__ = window.__BRAND__ || {};
  window.__BRAND__.missionMapEngine = { areas: AREAS, normalizeArea: normalizeArea, matches: matches, status: status };
})();
