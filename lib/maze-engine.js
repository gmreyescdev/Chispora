(function () {
  "use strict";

  const DIFFICULTIES = {
    explorador: { id: "explorador", name: "Explorador", size: 5, roundCount: 2, description: "Caminos cortos y claros" },
    aventurero: { id: "aventurero", name: "Aventurero", size: 7, roundCount: 2, description: "Más cruces y decisiones" },
    maestro: { id: "maestro", name: "Maestro del laberinto", size: 9, roundCount: 2, description: "Rutas largas con más desvíos" }
  };

  const DIRECTIONS = {
    up: { row: -1, column: 0, wall: "top", opposite: "bottom" },
    right: { row: 0, column: 1, wall: "right", opposite: "left" },
    down: { row: 1, column: 0, wall: "bottom", opposite: "top" },
    left: { row: 0, column: -1, wall: "left", opposite: "right" }
  };

  function cellIndex(size, row, column) {
    return row * size + column;
  }

  function createMaze(size, random) {
    const cells = Array.from({ length: size * size }, (_, index) => ({
      row: Math.floor(index / size), column: index % size,
      walls: { top: true, right: true, bottom: true, left: true }
    }));
    const visited = new Set([0]);
    const stack = [0];

    while (stack.length) {
      const currentIndex = stack[stack.length - 1];
      const current = cells[currentIndex];
      const choices = Object.keys(DIRECTIONS).map((name) => {
        const direction = DIRECTIONS[name];
        const row = current.row + direction.row;
        const column = current.column + direction.column;
        const index = cellIndex(size, row, column);
        return { name: name, row: row, column: column, index: index };
      }).filter((choice) => choice.row >= 0 && choice.row < size && choice.column >= 0 && choice.column < size && !visited.has(choice.index));

      if (!choices.length) {
        stack.pop();
        continue;
      }

      const choice = choices[Math.floor(random() * choices.length)];
      const direction = DIRECTIONS[choice.name];
      current.walls[direction.wall] = false;
      cells[choice.index].walls[direction.opposite] = false;
      visited.add(choice.index);
      stack.push(choice.index);
    }

    return { size: size, cells: cells, start: 0, goal: cells.length - 1 };
  }

  function createGame(difficulty, random) {
    const config = DIFFICULTIES[difficulty] || DIFFICULTIES.explorador;
    const randomValue = typeof random === "function" ? random : Math.random;
    return {
      difficulty: config.id,
      roundCount: config.roundCount,
      rounds: Array.from({ length: config.roundCount }, () => createMaze(config.size, randomValue)),
      currentRound: 0,
      position: 0,
      moves: 0,
      totalMoves: 0,
      blockedMoves: 0,
      completedMazes: 0,
      status: "playing"
    };
  }

  function move(game, directionName) {
    if (game.status !== "playing") return { accepted: false, reason: "locked" };
    const direction = DIRECTIONS[directionName];
    if (!direction) return { accepted: false, reason: "invalid" };
    const round = game.rounds[game.currentRound];
    const current = round.cells[game.position];
    if (current.walls[direction.wall]) {
      game.blockedMoves += 1;
      return { accepted: false, reason: "wall" };
    }

    const row = current.row + direction.row;
    const column = current.column + direction.column;
    game.position = cellIndex(round.size, row, column);
    game.moves += 1;
    game.totalMoves += 1;
    const reachedGoal = game.position === round.goal;
    if (reachedGoal) {
      game.completedMazes += 1;
      game.status = "feedback";
    }
    return { accepted: true, reachedGoal: reachedGoal, finalRound: reachedGoal && game.currentRound === game.roundCount - 1 };
  }

  function continueGame(game) {
    if (game.status !== "feedback") return { continued: false };
    if (game.currentRound === game.roundCount - 1) {
      game.status = "complete";
      return { continued: true, complete: true };
    }
    game.currentRound += 1;
    game.position = game.rounds[game.currentRound].start;
    game.moves = 0;
    game.status = "playing";
    return { continued: true, complete: false };
  }

  window.__BRAND__ = window.__BRAND__ || {};
  window.__BRAND__.mazeEngine = {
    difficulties: DIFFICULTIES,
    directions: DIRECTIONS,
    createMaze: createMaze,
    createGame: createGame,
    move: move,
    continueGame: continueGame
  };
})();
