(function () {
  "use strict";

  const DIRECTIONS = { up: [-1, 0], right: [0, 1], down: [1, 0], left: [0, -1] };
  const DIFFICULTIES = {
    explorador: { id: "explorador", name: "Explorador", roundCount: 4, size: 4, description: "Rutas directas y comandos básicos", puzzles: [
      { id: "e1", start: 0, goal: 2, obstacles: [], maxCommands: 3, solution: ["right", "right"], hint: "La meta está a la derecha." },
      { id: "e2", start: 12, goal: 0, obstacles: [], maxCommands: 4, solution: ["up", "up", "up"], hint: "Sube por la primera columna." },
      { id: "e3", start: 5, goal: 10, obstacles: [], maxCommands: 3, solution: ["down", "right"], hint: "Necesitas cambiar de fila y de columna." },
      { id: "e4", start: 3, goal: 15, obstacles: [], maxCommands: 4, solution: ["down", "down", "down"], hint: "La meta está debajo del robot." },
      { id: "e5", start: 8, goal: 11, obstacles: [], maxCommands: 4, solution: ["right", "right", "right"], hint: "Avanza por la misma fila." }
    ] },
    aventurero: { id: "aventurero", name: "Aventurero", roundCount: 5, size: 5, description: "Planear desvíos alrededor de obstáculos", puzzles: [
      { id: "a1", start: 10, goal: 14, obstacles: [12], maxCommands: 6, solution: ["up", "right", "right", "right", "right", "down"], hint: "Prueba rodear la roca por arriba." },
      { id: "a2", start: 2, goal: 22, obstacles: [7, 12, 17], maxCommands: 8, solution: ["left", "left", "down", "down", "down", "down", "right", "right"], hint: "La columna central está bloqueada; busca un borde." },
      { id: "a3", start: 20, goal: 4, obstacles: [16, 17, 18], maxCommands: 8, solution: ["up", "up", "up", "up", "right", "right", "right", "right"], hint: "Sube primero y cruza por la fila superior." },
      { id: "a4", start: 0, goal: 24, obstacles: [5, 6, 7, 8], maxCommands: 8, solution: ["right", "right", "right", "right", "down", "down", "down", "down"], hint: "La primera bajada está cerrada; avanza hasta el otro lado." },
      { id: "a5", start: 4, goal: 20, obstacles: [8, 13, 18], maxCommands: 8, solution: ["left", "left", "left", "left", "down", "down", "down", "down"], hint: "Baja por la columna izquierda." },
      { id: "a6", start: 6, goal: 18, obstacles: [7, 12, 17], maxCommands: 6, solution: ["down", "down", "down", "right", "right", "up"], hint: "Baja hasta la última fila antes de cruzar." }
    ] },
    maestro: { id: "maestro", name: "Maestro del código", roundCount: 6, size: 6, description: "Programas más largos y rutas con varios giros", puzzles: [
      { id: "m1", start: 0, goal: 35, obstacles: [6, 7, 8, 9, 10], maxCommands: 10, solution: ["right", "right", "right", "right", "right", "down", "down", "down", "down", "down"], hint: "Cruza por arriba antes de bajar." },
      { id: "m2", start: 30, goal: 5, obstacles: [25, 26, 27, 28], maxCommands: 10, solution: ["right", "right", "right", "right", "right", "up", "up", "up", "up", "up"], hint: "La salida está por el extremo derecho." },
      { id: "m3", start: 12, goal: 17, obstacles: [14, 15], maxCommands: 7, solution: ["up", "right", "right", "right", "right", "right", "down"], hint: "Rodea las dos rocas por la fila superior." },
      { id: "m4", start: 2, goal: 32, obstacles: [8, 14, 20, 26], maxCommands: 9, solution: ["left", "left", "down", "down", "down", "down", "down", "right", "right"], hint: "La columna del robot está bloqueada; usa el borde izquierdo." },
      { id: "m5", start: 33, goal: 3, obstacles: [27, 21, 15, 9], maxCommands: 7, solution: ["right", "up", "up", "up", "up", "up", "left"], hint: "Sube por la columna vecina y regresa al final." },
      { id: "m6", start: 5, goal: 30, obstacles: [10, 16, 22, 28], maxCommands: 10, solution: ["left", "left", "left", "left", "left", "down", "down", "down", "down", "down"], hint: "Muévete primero hasta la columna izquierda." },
      { id: "m7", start: 18, goal: 23, obstacles: [19, 20, 21], maxCommands: 9, solution: ["up", "right", "right", "right", "right", "right", "down"], hint: "La fila directa está bloqueada; rodéala por arriba." }
    ] }
  };

  function shuffle(items, random) { const result = items.slice(); for (let index = result.length - 1; index > 0; index -= 1) { const target = Math.floor(random() * (index + 1)); const value = result[index]; result[index] = result[target]; result[target] = value; } return result; }
  function clonePuzzle(puzzle, size) { return Object.assign({}, puzzle, { size: size, obstacles: puzzle.obstacles.slice(), solution: puzzle.solution.slice() }); }
  function createGame(difficulty, random) { const config = DIFFICULTIES[difficulty] || DIFFICULTIES.explorador; const randomValue = typeof random === "function" ? random : Math.random; return { difficulty: config.id, roundCount: config.roundCount, rounds: shuffle(config.puzzles, randomValue).slice(0, config.roundCount).map((puzzle) => clonePuzzle(puzzle, config.size)), currentRound: 0, program: [], correctAnswers: 0, extraAttempts: 0, hintsUsed: 0, hintedRounds: [], lastCorrect: false, lastResult: null, status: "playing" }; }
  function addCommand(game, direction) { if (game.status !== "playing") return { accepted: false, reason: "locked" }; const round = game.rounds[game.currentRound]; if (!DIRECTIONS[direction]) return { accepted: false, reason: "invalid" }; if (game.program.length >= round.maxCommands) return { accepted: false, reason: "limit" }; game.program.push(direction); return { accepted: true }; }
  function removeCommand(game) { if (game.status !== "playing" || !game.program.length) return false; game.program.pop(); return true; }
  function clearProgram(game) { if (game.status !== "playing") return false; game.program = []; return true; }
  function runProgram(game) {
    if (game.status !== "playing") return { accepted: false, reason: "locked" }; if (!game.program.length) return { accepted: false, reason: "empty" };
    const round = game.rounds[game.currentRound]; let position = round.start; let reason = "short";
    for (let index = 0; index < game.program.length; index += 1) { const row = Math.floor(position / round.size); const column = position % round.size; const delta = DIRECTIONS[game.program[index]]; const nextRow = row + delta[0]; const nextColumn = column + delta[1]; if (nextRow < 0 || nextRow >= round.size || nextColumn < 0 || nextColumn >= round.size) { reason = "edge"; break; } const next = nextRow * round.size + nextColumn; if (round.obstacles.includes(next)) { reason = "obstacle"; break; } position = next; if (position === round.goal) { reason = "goal"; break; } }
    game.lastCorrect = reason === "goal"; game.lastResult = { reason: reason, position: position }; game.status = "feedback"; if (game.lastCorrect) game.correctAnswers += 1; else game.extraAttempts += 1;
    return { accepted: true, correct: game.lastCorrect, reason: reason, position: position, finalRound: game.lastCorrect && game.currentRound === game.roundCount - 1 };
  }
  function useHint(game) { if (game.status !== "playing") return null; if (!game.hintedRounds.includes(game.currentRound)) { game.hintedRounds.push(game.currentRound); game.hintsUsed += 1; } return game.rounds[game.currentRound].hint; }
  function continueGame(game) { if (game.status !== "feedback") return { continued: false }; if (game.lastCorrect && game.currentRound === game.roundCount - 1) { game.status = "complete"; return { continued: true, complete: true }; } if (game.lastCorrect) { game.currentRound += 1; game.program = []; } game.status = "playing"; return { continued: true, complete: false }; }
  window.__BRAND__ = window.__BRAND__ || {}; window.__BRAND__.robotEngine = { directions: DIRECTIONS, difficulties: DIFFICULTIES, createGame: createGame, addCommand: addCommand, removeCommand: removeCommand, clearProgram: clearProgram, runProgram: runProgram, useHint: useHint, continueGame: continueGame };
})();
