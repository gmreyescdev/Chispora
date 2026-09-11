(function () {
  "use strict";

  const BANKS = {
    explorador: {
      id: "explorador", name: "Explorador", roundCount: 6, description: "Patrones de uno y dos pasos",
      rounds: [
        { sequence: ["2", "4", "6", "8"], answer: "10", options: ["9", "10", "12"], explanation: "Aumenta de 2 en 2." },
        { sequence: ["1", "2", "3", "4"], answer: "5", options: ["5", "6", "8"], explanation: "Aumenta de 1 en 1." },
        { sequence: ["5", "10", "15"], answer: "20", options: ["18", "20", "25"], explanation: "Aumenta de 5 en 5." },
        { sequence: ["▲", "●", "▲", "●"], answer: "▲", options: ["▲", "●", "■"], explanation: "Triángulo y círculo se alternan." },
        { sequence: ["★", "★", "●", "★", "★", "●"], answer: "★", options: ["●", "★", "▲"], explanation: "Se repiten dos estrellas y un círculo." },
        { sequence: ["3", "6", "9", "12"], answer: "15", options: ["14", "15", "18"], explanation: "Aumenta de 3 en 3." }
      ]
    },
    aventurero: {
      id: "aventurero", name: "Aventurero", roundCount: 8, description: "Saltos, dobles y repeticiones",
      rounds: [
        { sequence: ["2", "4", "8", "16"], answer: "32", options: ["24", "30", "32"], explanation: "Cada número es el doble del anterior." },
        { sequence: ["1", "3", "5", "7"], answer: "9", options: ["8", "9", "10"], explanation: "Aumenta de 2 en 2." },
        { sequence: ["10", "8", "6", "4"], answer: "2", options: ["0", "2", "3"], explanation: "Disminuye de 2 en 2." },
        { sequence: ["2", "5", "8", "11"], answer: "14", options: ["13", "14", "16"], explanation: "Aumenta de 3 en 3." },
        { sequence: ["1", "1", "2", "3", "5"], answer: "8", options: ["6", "7", "8"], explanation: "Se suman los dos números anteriores." },
        { sequence: ["■", "▲", "●", "■", "▲"], answer: "●", options: ["■", "▲", "●"], explanation: "Se repite cuadrado, triángulo y círculo." },
        { sequence: ["3", "6", "12", "24"], answer: "48", options: ["36", "42", "48"], explanation: "Cada número es el doble del anterior." },
        { sequence: ["20", "17", "14", "11"], answer: "8", options: ["7", "8", "9"], explanation: "Disminuye de 3 en 3." }
      ]
    },
    maestro: {
      id: "maestro", name: "Maestro de patrones", roundCount: 10, description: "Reglas que cambian y patrones combinados",
      rounds: [
        { sequence: ["3", "5", "9", "15"], answer: "23", options: ["21", "22", "23"], explanation: "Los saltos son +2, +4, +6 y +8." },
        { sequence: ["1", "4", "9", "16"], answer: "25", options: ["20", "24", "25"], explanation: "Son 1×1, 2×2, 3×3, 4×4 y 5×5." },
        { sequence: ["2", "3", "5", "8", "13"], answer: "21", options: ["18", "20", "21"], explanation: "Se suman los dos números anteriores." },
        { sequence: ["64", "32", "16", "8"], answer: "4", options: ["2", "4", "6"], explanation: "Cada número es la mitad del anterior." },
        { sequence: ["2", "6", "12", "20"], answer: "30", options: ["28", "30", "32"], explanation: "Los saltos son +4, +6, +8 y +10." },
        { sequence: ["1", "2", "4", "7", "11"], answer: "16", options: ["15", "16", "17"], explanation: "Los saltos aumentan: +1, +2, +3, +4 y +5." },
        { sequence: ["30", "27", "23", "18"], answer: "12", options: ["11", "12", "13"], explanation: "Se resta 3, luego 4, 5 y 6." },
        { sequence: ["5", "11", "23", "47"], answer: "95", options: ["93", "94", "95"], explanation: "Se duplica el número y se suma 1." },
        { sequence: ["2", "3", "6", "11", "18"], answer: "27", options: ["25", "26", "27"], explanation: "Los saltos son +1, +3, +5, +7 y +9." },
        { sequence: ["▲", "▲", "●", "▲", "▲", "●"], answer: "▲", options: ["▲", "●", "■"], explanation: "Se repiten dos triángulos y un círculo." }
      ]
    }
  };

  function shuffle(items, random) {
    const result = items.slice();
    for (let index = result.length - 1; index > 0; index -= 1) {
      const target = Math.floor(random() * (index + 1));
      const temporary = result[index]; result[index] = result[target]; result[target] = temporary;
    }
    return result;
  }

  function createGame(difficulty, random) {
    const config = BANKS[difficulty] || BANKS.explorador;
    const randomValue = typeof random === "function" ? random : Math.random;
    return {
      difficulty: config.id, roundCount: config.roundCount,
      rounds: shuffle(config.rounds, randomValue).map((round) => Object.assign({}, round, { options: shuffle(round.options, randomValue) })),
      currentRound: 0, correctAnswers: 0, mistakes: 0, rejectedOptions: [], lastCorrect: false, status: "playing"
    };
  }

  function submitAnswer(game, answer) {
    if (game.status !== "playing") return { accepted: false, reason: "locked" };
    const round = game.rounds[game.currentRound];
    if (!round.options.includes(answer)) return { accepted: false, reason: "invalid" };
    if (game.rejectedOptions.includes(answer)) return { accepted: false, reason: "rejected" };
    game.lastCorrect = answer === round.answer;
    game.status = "feedback";
    if (game.lastCorrect) game.correctAnswers += 1;
    else { game.mistakes += 1; game.rejectedOptions.push(answer); }
    return { accepted: true, correct: game.lastCorrect, finalRound: game.lastCorrect && game.currentRound === game.roundCount - 1, explanation: round.explanation };
  }

  function continueGame(game) {
    if (game.status !== "feedback") return { continued: false };
    if (game.lastCorrect && game.currentRound === game.roundCount - 1) { game.status = "complete"; return { continued: true, complete: true }; }
    if (game.lastCorrect) { game.currentRound += 1; game.rejectedOptions = []; }
    game.status = "playing";
    return { continued: true, complete: false };
  }

  window.__BRAND__ = window.__BRAND__ || {};
  window.__BRAND__.sequenceEngine = { difficulties: BANKS, createGame: createGame, submitAnswer: submitAnswer, continueGame: continueGame };
})();
