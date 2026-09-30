(function () {
  "use strict";

  const DIFFICULTIES = {
    explorador: { id: "explorador", name: "Explorador", roundCount: 5, description: "Reconocer partes de un entero", pool: [
      { id: "e1", type: "identify", prompt: "¿Qué fracción está coloreada?", left: [1, 2], options: ["1/2", "1/3", "2/2"], answer: "1/2", explanation: "Una de dos partes iguales está coloreada." },
      { id: "e2", type: "identify", prompt: "¿Qué fracción está coloreada?", left: [1, 3], options: ["1/2", "1/3", "2/3"], answer: "1/3", explanation: "Una de tres partes iguales está coloreada." },
      { id: "e3", type: "identify", prompt: "¿Qué fracción está coloreada?", left: [2, 3], options: ["1/3", "2/3", "3/2"], answer: "2/3", explanation: "Dos de tres partes iguales están coloreadas." },
      { id: "e4", type: "identify", prompt: "¿Qué fracción está coloreada?", left: [1, 4], options: ["1/4", "2/4", "1/3"], answer: "1/4", explanation: "Una de cuatro partes iguales está coloreada." },
      { id: "e5", type: "identify", prompt: "¿Qué fracción está coloreada?", left: [3, 4], options: ["2/4", "3/4", "4/3"], answer: "3/4", explanation: "Tres de cuatro partes iguales están coloreadas." },
      { id: "e6", type: "identify", prompt: "¿Qué fracción representa el entero completo?", left: [4, 4], options: ["1/4", "3/4", "4/4"], answer: "4/4", explanation: "Las cuatro partes de cuatro están coloreadas: es un entero." }
    ] },
    aventurero: { id: "aventurero", name: "Aventurero", roundCount: 6, description: "Comparar fracciones visualmente", pool: [
      { id: "a1", type: "compare", prompt: "¿Qué relación hay entre las fracciones?", left: [1, 2], right: [1, 4], options: [">", "<", "="], answer: ">", explanation: "Un medio ocupa más espacio que un cuarto." },
      { id: "a2", type: "compare", prompt: "¿Qué relación hay entre las fracciones?", left: [2, 4], right: [1, 2], options: [">", "<", "="], answer: "=", explanation: "Dos cuartos y un medio representan la misma cantidad." },
      { id: "a3", type: "compare", prompt: "¿Qué relación hay entre las fracciones?", left: [1, 3], right: [2, 3], options: [">", "<", "="], answer: "<", explanation: "Con partes del mismo tamaño, una parte es menor que dos." },
      { id: "a4", type: "compare", prompt: "¿Qué relación hay entre las fracciones?", left: [3, 4], right: [2, 4], options: [">", "<", "="], answer: ">", explanation: "Tres cuartos ocupan más que dos cuartos." },
      { id: "a5", type: "compare", prompt: "¿Qué relación hay entre las fracciones?", left: [2, 3], right: [3, 4], options: [">", "<", "="], answer: "<", explanation: "Dos tercios ocupan menos espacio que tres cuartos." },
      { id: "a6", type: "compare", prompt: "¿Qué relación hay entre las fracciones?", left: [3, 6], right: [1, 2], options: [">", "<", "="], answer: "=", explanation: "Tres sextos cubren la mitad, igual que un medio." },
      { id: "a7", type: "compare", prompt: "¿Qué relación hay entre las fracciones?", left: [5, 6], right: [4, 6], options: [">", "<", "="], answer: ">", explanation: "Cinco partes de seis son más que cuatro partes de seis." }
    ] },
    maestro: { id: "maestro", name: "Maestro de fracciones", roundCount: 7, description: "Encontrar fracciones equivalentes", pool: [
      { id: "m1", type: "equivalent", prompt: "¿Qué fracción representa la misma cantidad?", left: [1, 2], options: ["2/4", "1/4", "3/4"], answer: "2/4", explanation: "Dos cuartos cubren la misma mitad que un medio." },
      { id: "m2", type: "equivalent", prompt: "¿Qué fracción representa la misma cantidad?", left: [1, 3], options: ["2/6", "3/6", "1/6"], answer: "2/6", explanation: "Al dividir cada tercio en dos, un tercio se convierte en dos sextos." },
      { id: "m3", type: "equivalent", prompt: "¿Qué fracción representa la misma cantidad?", left: [2, 3], options: ["4/6", "3/6", "5/6"], answer: "4/6", explanation: "Dos tercios y cuatro sextos ocupan el mismo espacio." },
      { id: "m4", type: "equivalent", prompt: "¿Qué fracción representa la misma cantidad?", left: [3, 4], options: ["6/8", "4/8", "7/8"], answer: "6/8", explanation: "Tres cuartos equivalen a seis octavos." },
      { id: "m5", type: "equivalent", prompt: "¿Qué fracción representa la misma cantidad?", left: [2, 4], options: ["1/2", "1/3", "2/3"], answer: "1/2", explanation: "Dos de cuatro partes forman la mitad." },
      { id: "m6", type: "equivalent", prompt: "¿Qué fracción representa la misma cantidad?", left: [4, 8], options: ["1/2", "3/4", "1/4"], answer: "1/2", explanation: "Cuatro octavos cubren exactamente la mitad." },
      { id: "m7", type: "equivalent", prompt: "¿Qué fracción representa la misma cantidad?", left: [2, 6], options: ["1/3", "1/2", "2/3"], answer: "1/3", explanation: "Dos sextos se simplifican a un tercio." },
      { id: "m8", type: "equivalent", prompt: "¿Qué fracción representa la misma cantidad?", left: [6, 8], options: ["3/4", "2/4", "7/8"], answer: "3/4", explanation: "Seis octavos y tres cuartos cubren la misma cantidad." }
    ] }
  };

  function shuffle(items, random) {
    const result = items.slice();
    for (let index = result.length - 1; index > 0; index -= 1) { const target = Math.floor(random() * (index + 1)); const value = result[index]; result[index] = result[target]; result[target] = value; }
    return result;
  }

  function createGame(difficulty, random) {
    const config = DIFFICULTIES[difficulty] || DIFFICULTIES.explorador; const randomValue = typeof random === "function" ? random : Math.random;
    return { difficulty: config.id, roundCount: config.roundCount, rounds: shuffle(config.pool, randomValue).slice(0, config.roundCount).map((round) => Object.assign({}, round, { left: round.left.slice(), right: round.right ? round.right.slice() : null, options: shuffle(round.options, randomValue) })), currentRound: 0, correctAnswers: 0, extraAttempts: 0, rejectedOptions: [], lastCorrect: false, status: "playing" };
  }

  function submitAnswer(game, answer) {
    if (game.status !== "playing") return { accepted: false, reason: "locked" };
    const round = game.rounds[game.currentRound];
    if (!round.options.includes(answer)) return { accepted: false, reason: "invalid" };
    if (game.rejectedOptions.includes(answer)) return { accepted: false, reason: "rejected" };
    game.lastCorrect = answer === round.answer; game.status = "feedback";
    if (game.lastCorrect) game.correctAnswers += 1; else { game.extraAttempts += 1; game.rejectedOptions.push(answer); }
    return { accepted: true, correct: game.lastCorrect, explanation: game.lastCorrect ? round.explanation : "", finalRound: game.lastCorrect && game.currentRound === game.roundCount - 1 };
  }

  function continueGame(game) {
    if (game.status !== "feedback") return { continued: false };
    if (game.lastCorrect && game.currentRound === game.roundCount - 1) { game.status = "complete"; return { continued: true, complete: true }; }
    if (game.lastCorrect) { game.currentRound += 1; game.rejectedOptions = []; }
    game.status = "playing"; return { continued: true, complete: false };
  }

  window.__BRAND__ = window.__BRAND__ || {};
  window.__BRAND__.fractionEngine = { difficulties: DIFFICULTIES, createGame: createGame, submitAnswer: submitAnswer, continueGame: continueGame };
})();
