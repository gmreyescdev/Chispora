(function () {
  "use strict";

  const DIFFICULTIES = {
    explorador: { id: "explorador", name: "Explorador", pairCount: 6, previewSeconds: 3 },
    aventurero: { id: "aventurero", name: "Aventurero", pairCount: 8, previewSeconds: 2 },
    maestro: { id: "maestro", name: "Maestro del mapa", pairCount: 10, previewSeconds: 0 }
  };

  const SYMBOLS = [
    { symbol: "★", label: "estrella" },
    { symbol: "●", label: "círculo" },
    { symbol: "◆", label: "diamante" },
    { symbol: "▲", label: "triángulo" },
    { symbol: "☀", label: "sol" },
    { symbol: "■", label: "cuadrado" },
    { symbol: "♥", label: "corazón" },
    { symbol: "☂", label: "paraguas" },
    { symbol: "♫", label: "nota musical" },
    { symbol: "✿", label: "flor" }
  ];

  function configFor(difficulty) {
    return DIFFICULTIES[difficulty] || DIFFICULTIES.explorador;
  }

  function shuffle(items, random) {
    const result = items.slice();
    const randomValue = typeof random === "function" ? random : Math.random;
    for (let index = result.length - 1; index > 0; index -= 1) {
      const target = Math.floor(randomValue() * (index + 1));
      const temporary = result[index];
      result[index] = result[target];
      result[target] = temporary;
    }
    return result;
  }

  function createGame(difficulty, random) {
    const config = configFor(difficulty);
    const cards = [];

    SYMBOLS.slice(0, config.pairCount).forEach((item, pairIndex) => {
      cards.push({ id: pairIndex + "-a", pairId: pairIndex, symbol: item.symbol, label: item.label });
      cards.push({ id: pairIndex + "-b", pairId: pairIndex, symbol: item.symbol, label: item.label });
    });

    return {
      difficulty: config.id,
      pairCount: config.pairCount,
      previewSeconds: config.previewSeconds,
      cards: shuffle(cards, random),
      openIndexes: [],
      foundIndexes: [],
      moves: 0,
      status: config.previewSeconds > 0 ? "preview" : "playing"
    };
  }

  function finishPreview(game) {
    if (game.status !== "preview") return false;
    game.status = "playing";
    return true;
  }

  function selectCard(game, index) {
    if (game.status !== "playing") return { accepted: false, reason: "locked" };
    if (!Number.isInteger(index) || index < 0 || index >= game.cards.length) return { accepted: false, reason: "invalid" };
    if (game.foundIndexes.includes(index) || game.openIndexes.includes(index)) return { accepted: false, reason: "unavailable" };

    game.openIndexes.push(index);
    if (game.openIndexes.length === 1) return { accepted: true, outcome: "first" };

    game.moves += 1;
    game.status = "resolving";
    const first = game.cards[game.openIndexes[0]];
    const second = game.cards[game.openIndexes[1]];
    return { accepted: true, outcome: first.pairId === second.pairId ? "match" : "mismatch" };
  }

  function resolveTurn(game) {
    if (game.status !== "resolving" || game.openIndexes.length !== 2) return { resolved: false };
    const matched = game.cards[game.openIndexes[0]].pairId === game.cards[game.openIndexes[1]].pairId;

    if (matched) game.foundIndexes.push(game.openIndexes[0], game.openIndexes[1]);
    game.openIndexes = [];

    const complete = game.foundIndexes.length === game.cards.length;
    game.status = complete ? "complete" : "playing";
    return { resolved: true, matched: matched, complete: complete };
  }

  window.__BRAND__ = window.__BRAND__ || {};
  window.__BRAND__.memoryEngine = {
    difficulties: DIFFICULTIES,
    createGame: createGame,
    finishPreview: finishPreview,
    selectCard: selectCard,
    resolveTurn: resolveTurn
  };
})();
