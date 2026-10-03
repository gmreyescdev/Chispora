(function () {
  "use strict";

  const difficulties = {
    explorador: { id: "explorador", name: "Explorador", roundCount: 2, differenceCount: 3, description: "Tres cambios por escena" },
    aventurero: { id: "aventurero", name: "Aventurero", roundCount: 2, differenceCount: 4, description: "Cuatro cambios por escena" },
    maestro: { id: "maestro", name: "Maestro de la observación", roundCount: 3, differenceCount: 5, description: "Cinco cambios por escena" }
  };
  const zones = ["Arriba a la izquierda", "Arriba en el centro", "Arriba a la derecha", "En medio a la izquierda", "En medio en el centro", "En medio a la derecha", "Abajo a la izquierda", "Abajo en el centro", "Abajo a la derecha"];
  const scenes = [
    { name: "El jardín", items: ["sky", "cloud", "kite", "tree", "house", "bird", "flower", "pond", "fence"] },
    { name: "La playa", items: ["cloud", "sky", "bird", "boat", "umbrella", "kite", "shell", "fish", "bucket"] },
    { name: "El campamento", items: ["sky", "bird", "cloud", "tree", "tent", "kite", "flower", "backpack", "fence"] }
  ];
  const descriptions = {
    sky: ["Un sol con rayos", "Una luna creciente"], cloud: ["Una nube", "Dos nubes"], kite: ["Cometa de rombo", "Cometa triangular"],
    tree: ["Árbol de copa redonda", "Árbol de copa triangular"], house: ["Casa con ventana cuadrada", "Casa con ventana redonda"], bird: ["Un pájaro", "Dos pájaros"],
    flower: ["Flor con cuatro pétalos", "Flor con seis pétalos"], pond: ["Estanque con un pez", "Estanque con dos peces"], fence: ["Valla con tres postes", "Valla con cuatro postes"],
    boat: ["Barco con vela triangular", "Barco con vela cuadrada"], umbrella: ["Sombrilla con un panel", "Sombrilla con dos paneles"], shell: ["Concha con tres líneas", "Concha con cinco líneas"],
    fish: ["Un pez", "Dos peces"], bucket: ["Cubo con asa", "Cubo sin asa"], tent: ["Tienda con entrada triangular", "Tienda con entrada rectangular"], backpack: ["Mochila con un bolsillo", "Mochila con dos bolsillos"]
  };
  function shuffle(values, random) {
    const copy = values.slice();
    for (let i = copy.length - 1; i > 0; i -= 1) { const j = Math.floor(random() * (i + 1)); [copy[i], copy[j]] = [copy[j], copy[i]]; }
    return copy;
  }
  function createGame(level, random) {
    const config = Object.prototype.hasOwnProperty.call(difficulties, level) ? difficulties[level] : difficulties.explorador;
    const rng = typeof random === "function" ? random : Math.random;
    const rounds = shuffle(scenes, rng).slice(0, config.roundCount).map((scene) => {
      const changes = shuffle(Array.from({ length: 9 }, (_, i) => i), rng).slice(0, config.differenceCount);
      const left = scene.items.map((kind) => ({ kind, variant: rng() < 0.5 ? 0 : 1 }));
      const right = left.map((item, i) => ({ kind: item.kind, variant: changes.includes(i) ? 1 - item.variant : item.variant }));
      return { name: scene.name, left, right, changes, found: [] };
    });
    return { difficulty: config.id, rounds, roundCount: rounds.length, currentRound: 0, status: "playing", correctAnswers: 0, extraAttempts: 0, hintsUsed: 0, hinted: [] };
  }
  function chooseZone(game, index) {
    if (!game || game.status !== "playing") return { accepted: false, reason: "locked" };
    if (!Number.isInteger(index) || index < 0 || index > 8) return { accepted: false, reason: "invalid" };
    const round = game.rounds[game.currentRound];
    if (round.found.includes(index)) return { accepted: false, reason: "found" };
    if (!round.changes.includes(index)) { game.extraAttempts += 1; return { accepted: true, correct: false }; }
    round.found.push(index);
    const solved = round.found.length === round.changes.length;
    if (solved) { game.status = "feedback"; game.correctAnswers += 1; }
    return { accepted: true, correct: true, solved };
  }
  function useHint(game) {
    if (!game || game.status !== "playing") return null;
    const round = game.rounds[game.currentRound], index = round.changes.find((i) => !round.found.includes(i));
    if (index === undefined) return null;
    const id = game.currentRound * 9 + index;
    if (!game.hinted.includes(id)) { game.hinted.push(id); game.hintsUsed += 1; }
    return { index };
  }
  function continueGame(game) {
    if (!game || game.status !== "feedback") return { continued: false };
    if (game.currentRound === game.roundCount - 1) { game.status = "complete"; return { continued: true, complete: true }; }
    game.currentRound += 1; game.status = "playing";
    return { continued: true, complete: false };
  }
  window.__BRAND__ = window.__BRAND__ || {};
  window.__BRAND__.differencesEngine = { difficulties, zones, descriptions, createGame, chooseZone, useHint, continueGame };
})();
