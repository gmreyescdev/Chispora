(function () {
  "use strict";

  const symbols = [
    { value: 1, name: "Círculo", glyph: "○" },
    { value: 2, name: "Triángulo", glyph: "△" },
    { value: 3, name: "Cuadrado", glyph: "□" },
    { value: 4, name: "Estrella", glyph: "☆" }
  ];
  const difficulties = {
    explorador: { id: "explorador", name: "Explorador", roundCount: 2, blanks: 4, description: "Cuatro casillas por completar" },
    aventurero: { id: "aventurero", name: "Aventurero", roundCount: 2, blanks: 7, description: "Siete casillas por completar" },
    maestro: { id: "maestro", name: "Maestro de las figuras", roundCount: 3, blanks: 9, description: "Nueve casillas por completar" }
  };
  function shuffle(values, random) {
    const copy = values.slice();
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }
  function peers(a, b) {
    const ar = Math.floor(a / 4), br = Math.floor(b / 4), ac = a % 4, bc = b % 4;
    return ar === br || ac === bc || (Math.floor(ar / 2) === Math.floor(br / 2) && Math.floor(ac / 2) === Math.floor(bc / 2));
  }
  function possible(values, index, value) { return !values.some((v, i) => i !== index && v === value && peers(index, i)); }
  function countSolutions(values, limit) {
    if (!Array.isArray(values) || values.length !== 16 || values.some((v, i) => !Number.isInteger(v) || v < 0 || v > 4 || (v && !possible(values, i, v)))) return 0;
    const board = values.slice(), maximum = Number.isInteger(limit) && limit > 0 ? limit : 2;
    let count = 0;
    function search() {
      if (count >= maximum) return;
      let index = -1, options = [];
      for (let i = 0; i < 16; i += 1) {
        if (board[i]) continue;
        const candidates = [1, 2, 3, 4].filter((v) => possible(board, i, v));
        if (!candidates.length) return;
        if (index === -1 || candidates.length < options.length) { index = i; options = candidates; }
      }
      if (index === -1) { count += 1; return; }
      for (const value of options) { board[index] = value; search(); board[index] = 0; }
    }
    search(); return count;
  }
  function createRound(config, random, roundIndex) {
    const mapping = shuffle([1, 2, 3, 4], random);
    const bands = shuffle([0, 1], random), stacks = shuffle([0, 1], random);
    const rows = bands.flatMap((band) => shuffle([band * 2, band * 2 + 1], random));
    const cols = stacks.flatMap((stack) => shuffle([stack * 2, stack * 2 + 1], random));
    const solution = rows.flatMap((row) => cols.map((col) => mapping[(row * 2 + Math.floor(row / 2) + col) % 4]));
    // This nested mask is uniquely solvable even with nine blanks. Permute the
    // mask with the same row/column transformations as the solution.
    const removable = [0, 1, 2, 3, 4, 5, 8, 9, 10].slice(0, config.blanks);
    const values = solution.map((value, i) => removable.includes(rows[Math.floor(i / 4)] * 4 + cols[i % 4]) ? 0 : value);
    return { name: "Tablero " + (roundIndex + 1), solution, givens: values.slice(), values };
  }
  function createGame(level, random) {
    const config = Object.prototype.hasOwnProperty.call(difficulties, level) ? difficulties[level] : difficulties.explorador;
    const rng = typeof random === "function" ? random : Math.random;
    return { difficulty: config.id, roundCount: config.roundCount, rounds: Array.from({ length: config.roundCount }, (_, i) => createRound(config, rng, i)), currentRound: 0, selected: null, status: "playing", correctAnswers: 0, extraAttempts: 0, hintsUsed: 0, hinted: [] };
  }
  function selectCell(game, index) {
    if (!game || game.status !== "playing" || !Number.isInteger(index) || index < 0 || index > 15 || game.rounds[game.currentRound].values[index]) return false;
    game.selected = index; return true;
  }
  function submitSymbol(game, value) {
    if (!game || game.status !== "playing") return { accepted: false, reason: "locked" };
    if (game.selected === null || !Number.isInteger(value) || value < 1 || value > 4) return { accepted: false, reason: "invalid" };
    const round = game.rounds[game.currentRound], index = game.selected;
    if (round.values[index]) return { accepted: false, reason: "filled" };
    if (value !== round.solution[index]) {
      game.extraAttempts += 1;
      return { accepted: true, correct: false, conflict: !possible(round.values, index, value) };
    }
    round.values[index] = value; game.selected = null;
    const solved = round.values.every((v) => v !== 0);
    if (solved) { game.status = "feedback"; game.correctAnswers += 1; }
    return { accepted: true, correct: true, solved };
  }
  function useHint(game) {
    if (!game || game.status !== "playing" || game.selected === null) return null;
    const id = game.currentRound * 16 + game.selected;
    if (!game.hinted.includes(id)) { game.hinted.push(id); game.hintsUsed += 1; }
    return { index: game.selected, value: game.rounds[game.currentRound].solution[game.selected] };
  }
  function continueGame(game) {
    if (!game || game.status !== "feedback") return { continued: false };
    if (game.currentRound === game.roundCount - 1) { game.status = "complete"; return { continued: true, complete: true }; }
    game.currentRound += 1; game.selected = null; game.status = "playing";
    return { continued: true, complete: false };
  }
  window.__BRAND__ = window.__BRAND__ || {};
  window.__BRAND__.sudokuEngine = { symbols, difficulties, peers, countSolutions, createGame, selectCell, submitSymbol, useHint, continueGame };
})();
