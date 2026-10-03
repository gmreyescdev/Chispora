(function () {
  "use strict";

  const PIECES = [
    { name: "Triángulo grande A", points: [[0, 0], [4, 0], [2, 2]] },
    { name: "Triángulo grande B", points: [[0, 0], [2, 2], [0, 4]] },
    { name: "Triángulo mediano", points: [[4, 2], [4, 4], [2, 4]] },
    { name: "Triángulo pequeño A", points: [[4, 0], [4, 2], [3, 1]] },
    { name: "Triángulo pequeño B", points: [[2, 2], [3, 3], [1, 3]] },
    { name: "Cuadrado", points: [[2, 2], [3, 1], [4, 2], [3, 3]] },
    { name: "Paralelogramo", points: [[0, 4], [1, 3], [3, 3], [2, 4]] }
  ];
  const TRIANGLE = [
    [[4, 0], [8, 0], [6, 2]], [[4, 0], [6, 2], [4, 4]],
    [[2, 0], [4, 0], [4, 2]], [[3, 1], [3, 3], [2, 2]],
    [[1, 1], [0, 0], [2, 0]], [[1, 1], [2, 0], [3, 1], [2, 2]],
    [[3, 1], [4, 2], [4, 4], [3, 3]]
  ];
  const difficulties = {
    explorador: { id: "explorador", name: "Explorador", roundCount: 2, description: "Piezas orientadas y guías de formas" },
    aventurero: { id: "aventurero", name: "Aventurero", roundCount: 3, description: "Gira las piezas para encajarlas" },
    maestro: { id: "maestro", name: "Maestro de las figuras", roundCount: 3, description: "Gira y voltea las piezas" }
  };

  function centered(points) {
    const x = points.reduce((sum, p) => sum + p[0], 0) / points.length;
    const y = points.reduce((sum, p) => sum + p[1], 0) / points.length;
    return points.map((p) => [p[0] - x, p[1] - y]);
  }

  function transform(points, rotation, flipped) {
    const angle = rotation * Math.PI / 4, cos = Math.cos(angle), sin = Math.sin(angle);
    return centered(points).map((p) => {
      const x = flipped ? -p[0] : p[0];
      return [x * cos - p[1] * sin, x * sin + p[1] * cos];
    });
  }

  function signature(points) {
    return centered(points).map((p) => p.map((v) => Math.round(v * 10000)).join(",")).sort().join(";");
  }

  function orientation(piece, target) {
    for (const flipped of [false, true]) {
      for (let rotation = 0; rotation < 8; rotation += 1) {
        if (signature(transform(piece.points, rotation, flipped)) === signature(target)) return { rotation, flipped };
      }
    }
    return null;
  }

  function createGame(level, random) {
    const config = Object.prototype.hasOwnProperty.call(difficulties, level) ? difficulties[level] : difficulties.explorador;
    const rng = typeof random === "function" ? random : Math.random;
    const square = PIECES.map((p) => p.points.map((v) => v.slice()));
    const diamond = square.map((polygon) => polygon.map((p) => [(p[0] - p[1]) / Math.SQRT2, (p[0] + p[1]) / Math.SQRT2]));
    const rounds = [{ name: "Cuadrado", slots: square }, { name: "Triángulo", slots: TRIANGLE }, { name: "Rombo", slots: diamond }].slice(0, config.roundCount);
    const game = { difficulty: config.id, rounds, roundCount: rounds.length, currentRound: 0, status: "playing", correctAnswers: 0, extraAttempts: 0, hintsUsed: 0, selected: null, pieces: [], placed: [], hinted: [], random: rng };
    prepareRound(game);
    return game;
  }

  function prepareRound(game) {
    game.selected = null; game.placed = Array(7).fill(null); game.hinted = [];
    game.pieces = PIECES.map((p, index) => {
      const target = orientation(p, game.rounds[game.currentRound].slots[index]);
      const offset = game.difficulty === "explorador" ? 0 : Math.floor(game.random() * 8);
      return { rotation: (target.rotation + offset) % 8, flipped: game.difficulty === "maestro" ? game.random() < 0.5 : target.flipped };
    });
  }

  function active(game) { return Boolean(game && game.status === "playing"); }
  function selectPiece(game, index) {
    if (!active(game) || !Number.isInteger(index) || !PIECES[index] || game.placed.includes(index)) return false;
    game.selected = index; return true;
  }
  function adjustPiece(game, action) {
    if (!active(game) || game.selected === null || !["rotate", "flip"].includes(action)) return false;
    const piece = game.pieces[game.selected];
    if (action === "rotate") piece.rotation = (piece.rotation + 1) % 8;
    else piece.flipped = !piece.flipped;
    return true;
  }
  function placePiece(game, slot) {
    if (!active(game)) return { accepted: false, reason: "locked" };
    if (!Number.isInteger(slot) || slot < 0 || slot > 6 || game.selected === null || game.placed[slot] !== null) return { accepted: false, reason: "invalid" };
    const index = game.selected, piece = game.pieces[index];
    const correct = signature(transform(PIECES[index].points, piece.rotation, piece.flipped)) === signature(game.rounds[game.currentRound].slots[slot]);
    if (!correct) { game.extraAttempts += 1; return { accepted: true, correct: false }; }
    game.placed[slot] = index; game.selected = null;
    if (game.placed.every((p) => p !== null)) { game.status = "feedback"; game.correctAnswers += 1; }
    return { accepted: true, correct: true, solved: game.status === "feedback" };
  }
  function useHint(game) {
    if (!active(game) || game.selected === null) return null;
    const index = game.selected;
    const slot = game.rounds[game.currentRound].slots.findIndex((points, i) => game.placed[i] === null && orientation(PIECES[index], points));
    if (slot < 0) return null;
    const target = orientation(PIECES[index], game.rounds[game.currentRound].slots[slot]);
    game.pieces[index] = target;
    if (!game.hinted.includes(index)) { game.hinted.push(index); game.hintsUsed += 1; }
    return { slot };
  }
  function continueGame(game) {
    if (!game || game.status !== "feedback") return { continued: false };
    if (game.currentRound === game.roundCount - 1) { game.status = "complete"; return { continued: true, complete: true }; }
    game.currentRound += 1; game.status = "playing"; prepareRound(game);
    return { continued: true, complete: false };
  }

  window.__BRAND__ = window.__BRAND__ || {};
  window.__BRAND__.tangramEngine = { difficulties, pieces: PIECES, createGame, transform, orientation, selectPiece, adjustPiece, placePiece, useHint, continueGame };
})();
