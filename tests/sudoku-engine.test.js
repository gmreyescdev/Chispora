"use strict";

const test = require("node:test"), assert = require("node:assert/strict");
const fs = require("node:fs"), path = require("node:path"), vm = require("node:vm");
const context = { window: { __BRAND__: {} } };
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(__dirname, "../lib/sudoku-engine.js"), "utf8"), context);
const e = context.window.__BRAND__.sudokuEngine;
function random(seed) { let n = seed; return () => { n = (n * 1664525 + 1013904223) >>> 0; return n / 4294967296; }; }
function solve(g) {
  const round = g.rounds[g.currentRound];
  round.values.forEach((value, index) => { if (!value) { assert.equal(e.selectCell(g, index), true); assert.equal(e.submitSymbol(g, round.solution[index]).correct, true); } });
}

test("genera tableros únicos y válidos en las tres dificultades", () => {
  for (const level of Object.keys(e.difficulties)) {
    for (let seed = 0; seed < 30; seed += 1) {
      const g = e.createGame(level, random(seed));
      assert.equal(g.roundCount, e.difficulties[level].roundCount);
      g.rounds.forEach((round) => {
        assert.equal(round.values.filter((v) => v === 0).length, e.difficulties[level].blanks);
        assert.equal(e.countSolutions(round.givens), 1);
        assert.equal(e.countSolutions(round.solution), 1);
        for (let row = 0; row < 4; row += 1) assert.equal(round.solution.slice(row * 4, row * 4 + 4).sort().join(""), "1234");
        for (let col = 0; col < 4; col += 1) assert.equal([0, 1, 2, 3].map((row) => round.solution[row * 4 + col]).sort().join(""), "1234");
        for (const row of [0, 2]) for (const col of [0, 2]) {
          assert.equal([row * 4 + col, row * 4 + col + 1, (row + 1) * 4 + col, (row + 1) * 4 + col + 1].map((i) => round.solution[i]).sort().join(""), "1234");
        }
        assert.equal(JSON.stringify(round.givens), JSON.stringify(round.values));
        for (let i = 0; i < 16; i += 1) if (round.givens[i]) assert.equal(round.givens[i], round.solution[i]);
      });
      assert.equal(JSON.stringify(g), JSON.stringify(e.createGame(level, random(seed))));
    }
    assert.equal(e.countSolutions(e.createGame(level, () => 0).rounds[0].givens), 1);
  }
  assert.equal(e.createGame("toString").difficulty, "explorador");
  assert.equal(e.createGame(null).difficulty, "explorador");
});

test("comprueba reglas de fila, columna y cuadro sin mutar entradas", () => {
  assert.equal(e.peers(0, 3), true); assert.equal(e.peers(0, 12), true); assert.equal(e.peers(0, 5), true); assert.equal(e.peers(0, 6), false);
  const empty = Array(16).fill(0); assert.equal(e.countSolutions(empty), 2); assert.deepEqual(empty, Array(16).fill(0));
  const conflict = Array(16).fill(0); conflict[0] = conflict[1] = 1; assert.equal(e.countSolutions(conflict), 0);
  assert.equal(e.countSolutions(null), 0); assert.equal(e.countSolutions([1]), 0);
  const invalid = Array(16).fill(0); invalid[0] = 5; assert.equal(e.countSolutions(invalid), 0);
});

test("rechaza entradas inválidas y no permite modificar pistas iniciales", () => {
  const g = e.createGame("explorador", () => 0);
  for (const index of [-1, 16, 1.5, "0", null, NaN]) assert.equal(e.selectCell(g, index), false);
  assert.equal(e.selectCell(null, 0), false);
  assert.equal(e.submitSymbol(g, 1).accepted, false);
  assert.equal(e.useHint(g), null);
  const round = g.rounds[0], given = round.givens.findIndex(Boolean), blank = round.values.indexOf(0);
  assert.equal(e.selectCell(g, given), false); assert.equal(e.selectCell(g, blank), true);
  for (const value of [0, 5, 1.5, "1", null, NaN]) assert.equal(e.submitSymbol(g, value).accepted, false);
  assert.equal(g.extraAttempts, 0);
});

test("un error conserva la selección y no cambia casillas ni avance", () => {
  const g = e.createGame("aventurero", () => 0.5), round = g.rounds[0], index = round.values.indexOf(0), before = JSON.stringify(round);
  e.selectCell(g, index);
  const result = e.submitSymbol(g, round.solution[index] % 4 + 1);
  assert.equal(result.accepted, true); assert.equal(result.correct, false);
  assert.equal(JSON.stringify(round), before); assert.equal(g.selected, index); assert.equal(g.currentRound, 0); assert.equal(g.extraAttempts, 1);
  assert.equal(e.submitSymbol(g, round.solution[index]).correct, true);
  assert.equal(e.selectCell(g, index), false);
});

test("las pistas se repiten sin colocar una respuesta ni penalizar", () => {
  const g = e.createGame("maestro", () => 0.2), round = g.rounds[0], index = round.values.indexOf(0);
  e.selectCell(g, index);
  assert.equal(e.useHint(g).value, round.solution[index]);
  assert.equal(e.useHint(g).index, index); assert.equal(g.hintsUsed, 1); assert.equal(round.values[index], 0);
});

test("bloquea feedback y completa exactamente después del último tablero", () => {
  for (const level of Object.keys(e.difficulties)) {
    const g = e.createGame(level, random(7));
    assert.equal(e.continueGame(g).continued, false);
    for (let round = 0; round < g.roundCount; round += 1) {
      solve(g); assert.equal(g.status, "feedback");
      assert.equal(e.selectCell(g, 0), false); assert.equal(e.submitSymbol(g, 1).reason, "locked"); assert.equal(e.useHint(g), null);
      const result = e.continueGame(g); assert.equal(result.complete, round === g.roundCount - 1);
      if (!result.complete) assert.equal(g.selected, null);
    }
    assert.equal(g.status, "complete"); assert.equal(g.correctAnswers, g.roundCount); assert.equal(g.extraAttempts, 0);
    assert.equal(e.continueGame(g).continued, false);
  }
});
