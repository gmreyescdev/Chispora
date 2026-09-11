(function () {
  "use strict";

  const DIFFICULTIES = {
    explorador: {
      id: "explorador", name: "Explorador", roundCount: 5,
      words: [
        { word: "GATO", hint: "Animal que dice miau" }, { word: "LUNA", hint: "Brilla en el cielo de noche" },
        { word: "FLOR", hint: "Crece en muchas plantas" }, { word: "NUBE", hint: "Puede traer lluvia" },
        { word: "MAPA", hint: "Ayuda a encontrar caminos" }, { word: "SOL", hint: "Nos da luz durante el día" }
      ]
    },
    aventurero: {
      id: "aventurero", name: "Aventurero", roundCount: 6,
      words: [
        { word: "BOSQUE", hint: "Lugar con muchos árboles" }, { word: "TESORO", hint: "Algo valioso que se busca" },
        { word: "CAMINO", hint: "Sirve para llegar a un lugar" }, { word: "PLANETA", hint: "Mundo que gira alrededor de una estrella" },
        { word: "CASTILLO", hint: "Edificio donde vivían reyes y reinas" }, { word: "MARIPOSA", hint: "Insecto con alas de colores" }
      ]
    },
    maestro: {
      id: "maestro", name: "Maestro de palabras", roundCount: 7,
      words: [
        { word: "AVENTURA", hint: "Experiencia emocionante" }, { word: "BRUJULA", hint: "Instrumento que señala el norte" },
        { word: "IMAGINAR", hint: "Crear ideas en la mente" }, { word: "LABERINTO", hint: "Red de caminos con una salida" },
        { word: "DINOSAURIO", hint: "Animal que vivió hace millones de años" }, { word: "BIBLIOTECA", hint: "Lugar lleno de libros" },
        { word: "CURIOSIDAD", hint: "Deseo de aprender y descubrir" }
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

  function scrambledLetters(word, random) {
    const letters = shuffle(word.split("").map((letter, index) => ({ id: index, letter: letter })), random);
    if (letters.map((item) => item.letter).join("") === word && letters.length > 1) letters.push(letters.shift());
    return letters;
  }

  function createGame(difficulty, random) {
    const config = DIFFICULTIES[difficulty] || DIFFICULTIES.explorador;
    const randomValue = typeof random === "function" ? random : Math.random;
    const selectedWords = shuffle(config.words, randomValue).slice(0, config.roundCount);
    return {
      difficulty: config.id, roundCount: config.roundCount,
      rounds: selectedWords.map((item) => ({ word: item.word, hint: item.hint, letters: scrambledLetters(item.word, randomValue) })),
      currentRound: 0, selectedLetterIds: [], correctAnswers: 0, mistakes: 0, hintsUsed: 0,
      hintedRounds: [], lastCorrect: false, status: "playing"
    };
  }

  function selectLetter(game, letterId) {
    if (game.status !== "playing") return { accepted: false, reason: "locked" };
    const round = game.rounds[game.currentRound];
    if (!round.letters.some((item) => item.id === letterId)) return { accepted: false, reason: "invalid" };
    if (game.selectedLetterIds.includes(letterId)) return { accepted: false, reason: "used" };
    game.selectedLetterIds.push(letterId);
    if (game.selectedLetterIds.length < round.word.length) return { accepted: true, completeWord: false };
    const answer = game.selectedLetterIds.map((id) => round.letters.find((item) => item.id === id).letter).join("");
    game.lastCorrect = answer === round.word;
    game.status = "feedback";
    if (game.lastCorrect) game.correctAnswers += 1;
    else game.mistakes += 1;
    return { accepted: true, completeWord: true, correct: game.lastCorrect, answer: answer };
  }

  function removeLastLetter(game) {
    if (game.status !== "playing" || !game.selectedLetterIds.length) return false;
    game.selectedLetterIds.pop(); return true;
  }

  function clearLetters(game) {
    if (game.status !== "playing") return false;
    game.selectedLetterIds = []; return true;
  }

  function useHint(game) {
    if (game.status !== "playing") return null;
    if (!game.hintedRounds.includes(game.currentRound)) {
      game.hintedRounds.push(game.currentRound); game.hintsUsed += 1;
    }
    return game.rounds[game.currentRound].hint;
  }

  function continueGame(game) {
    if (game.status !== "feedback") return { continued: false };
    if (game.lastCorrect && game.currentRound === game.roundCount - 1) {
      game.status = "complete"; return { continued: true, complete: true };
    }
    if (game.lastCorrect) game.currentRound += 1;
    game.selectedLetterIds = [];
    game.status = "playing";
    return { continued: true, complete: false };
  }

  window.__BRAND__ = window.__BRAND__ || {};
  window.__BRAND__.wordEngine = {
    difficulties: DIFFICULTIES, createGame: createGame, selectLetter: selectLetter,
    removeLastLetter: removeLastLetter, clearLetters: clearLetters, useHint: useHint, continueGame: continueGame
  };
})();
