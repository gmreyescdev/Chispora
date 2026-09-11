(function () {
  "use strict";

  const DIFFICULTIES = {
    explorador: { id: "explorador", name: "Explorador", roundCount: 6, operators: ["+", "−"], max: 12 },
    aventurero: { id: "aventurero", name: "Aventurero", roundCount: 8, operators: ["+", "−", "×"], max: 20 },
    maestro: { id: "maestro", name: "Maestro del cálculo", roundCount: 10, operators: ["+", "−", "×"], max: 50 }
  };

  function configFor(difficulty) {
    return DIFFICULTIES[difficulty] || DIFFICULTIES.explorador;
  }

  function randomInteger(min, max, random) {
    return min + Math.floor(random() * (max - min + 1));
  }

  function calculate(left, operator, right) {
    if (operator === "+") return left + right;
    if (operator === "−") return left - right;
    if (operator === "×") return left * right;
    return NaN;
  }

  function createProblem(config, random) {
    const operator = config.operators[randomInteger(0, config.operators.length - 1, random)];
    let left;
    let right;

    if (operator === "×") {
      const multiplicationMax = config.id === "maestro" ? 12 : 9;
      left = randomInteger(2, multiplicationMax, random);
      right = randomInteger(2, multiplicationMax, random);
    } else {
      left = randomInteger(2, config.max, random);
      right = randomInteger(1, config.max, random);
      if (operator === "−" && right > left) {
        const temporary = left;
        left = right;
        right = temporary;
      }
    }

    return { left: left, right: right, result: calculate(left, operator, right), operator: operator };
  }

  function createGame(difficulty, random) {
    const config = configFor(difficulty);
    const randomValue = typeof random === "function" ? random : Math.random;
    return {
      difficulty: config.id,
      roundCount: config.roundCount,
      operators: config.operators.slice(),
      rounds: Array.from({ length: config.roundCount }, () => createProblem(config, randomValue)),
      currentRound: 0,
      correctAnswers: 0,
      mistakes: 0,
      attempts: 0,
      streak: 0,
      bestStreak: 0,
      rejectedOperators: [],
      lastCorrect: false,
      status: "playing"
    };
  }

  function submitAnswer(game, operator) {
    if (game.status !== "playing") return { accepted: false, reason: "locked" };
    if (!game.operators.includes(operator)) return { accepted: false, reason: "invalid" };
    if (game.rejectedOperators.includes(operator)) return { accepted: false, reason: "rejected" };

    const problem = game.rounds[game.currentRound];
    const correct = operator === problem.operator;
    game.attempts += 1;
    game.lastCorrect = correct;
    game.status = "feedback";

    if (correct) {
      game.correctAnswers += 1;
      game.streak += 1;
      game.bestStreak = Math.max(game.bestStreak, game.streak);
    } else {
      game.mistakes += 1;
      game.streak = 0;
      game.rejectedOperators.push(operator);
    }

    return { accepted: true, correct: correct, finalRound: correct && game.currentRound === game.roundCount - 1 };
  }

  function continueGame(game) {
    if (game.status !== "feedback") return { continued: false };
    if (game.lastCorrect && game.currentRound === game.roundCount - 1) {
      game.status = "complete";
      return { continued: true, complete: true };
    }
    if (game.lastCorrect) {
      game.currentRound += 1;
      game.rejectedOperators = [];
    }
    game.status = "playing";
    return { continued: true, complete: false };
  }

  window.__BRAND__ = window.__BRAND__ || {};
  window.__BRAND__.operationEngine = {
    difficulties: DIFFICULTIES,
    calculate: calculate,
    createGame: createGame,
    submitAnswer: submitAnswer,
    continueGame: continueGame
  };
})();
