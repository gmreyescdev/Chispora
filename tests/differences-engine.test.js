"use strict";

const test = require("node:test"), assert = require("node:assert/strict");
const fs = require("node:fs"), path = require("node:path"), vm = require("node:vm");
const context = { window: { __BRAND__: {} } };
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(__dirname, "../lib/differences-engine.js"), "utf8"), context);
const e = context.window.__BRAND__.differencesEngine;

test("crea escenas deterministas con cambios exactos por dificultad", () => {
  for (const level of Object.keys(e.difficulties)) {
    const g = e.createGame(level, () => 0.5);
    assert.equal(g.roundCount, e.difficulties[level].roundCount);
    assert.equal(new Set(g.rounds.map((r) => r.name)).size, g.roundCount);
    assert.equal(JSON.stringify(g), JSON.stringify(e.createGame(level, () => 0.5)));
    g.rounds.forEach((round) => {
      assert.equal(round.left.length, 9); assert.equal(round.right.length, 9);
      assert.equal(new Set(round.changes).size, e.difficulties[level].differenceCount);
      round.left.forEach((item, index) => {
        assert.equal(item.kind, round.right[index].kind);
        assert.equal(item.variant !== round.right[index].variant, round.changes.includes(index));
        assert.ok(e.descriptions[item.kind][item.variant]); assert.ok(e.descriptions[item.kind][round.right[index].variant]);
      });
    });
  }
  assert.equal(e.createGame("desconocido").difficulty, "explorador");
  assert.equal(e.createGame("toString").difficulty, "explorador");
});

test("rechaza zonas inválidas sin modificar el juego", () => {
  const g = e.createGame("explorador", () => 0), before = JSON.stringify(g);
  for (const index of [-1, 9, 1.5, "0", null, NaN]) assert.equal(e.chooseZone(g, index).reason, "invalid");
  assert.equal(JSON.stringify(g), before); assert.equal(e.chooseZone(null, 0).reason, "locked"); assert.equal(e.useHint(null), null);
});

test("un error permite reintentar sin perder hallazgos ni avanzar", () => {
  const g = e.createGame("aventurero", () => 0.5), round = g.rounds[0], right = round.changes[0], wrong = round.left.findIndex((_, i) => !round.changes.includes(i));
  assert.equal(e.chooseZone(g, right).correct, true);
  assert.equal(e.chooseZone(g, wrong).correct, false); assert.equal(e.chooseZone(g, wrong).correct, false);
  assert.equal(round.found.length, 1); assert.equal(round.found[0], right); assert.equal(g.extraAttempts, 2); assert.equal(g.currentRound, 0);
  assert.equal(e.chooseZone(g, right).reason, "found"); assert.equal(round.found.length, 1);
});

test("una pista señala un cambio pendiente sin marcarlo", () => {
  const g = e.createGame("maestro", () => 0.2), round = g.rounds[0], hint = e.useHint(g);
  assert.ok(round.changes.includes(hint.index)); assert.equal(round.found.length, 0);
  assert.equal(e.useHint(g).index, hint.index); assert.equal(g.hintsUsed, 1);
  e.chooseZone(g, hint.index); assert.notEqual(e.useHint(g).index, hint.index); assert.equal(g.hintsUsed, 2);
});

test("mantiene partidas y escenas independientes", () => {
  const first = e.createGame("maestro", () => 0), second = e.createGame("maestro", () => 0);
  const index = first.rounds[0].changes[0]; e.chooseZone(first, index);
  assert.equal(second.rounds[0].found.length, 0); assert.equal(first.rounds[1].found.length, 0);
  first.rounds[0].left[0].variant = 8; assert.notEqual(second.rounds[0].left[0].variant, 8);
});

test("bloquea feedback y finaliza exactamente tras la última escena", () => {
  for (const level of Object.keys(e.difficulties)) {
    const g = e.createGame(level, () => 0.6);
    assert.equal(e.continueGame(g).continued, false);
    for (let i = 0; i < g.roundCount; i += 1) {
      const round = g.rounds[g.currentRound];
      round.changes.forEach((index, n) => { const answer = e.chooseZone(g, index); assert.equal(answer.correct, true); assert.equal(answer.solved, n === round.changes.length - 1); });
      assert.equal(g.status, "feedback"); assert.equal(e.chooseZone(g, 0).reason, "locked"); assert.equal(e.useHint(g), null);
      assert.equal(e.continueGame(g).complete, i === g.roundCount - 1);
    }
    assert.equal(g.status, "complete"); assert.equal(g.correctAnswers, g.roundCount); assert.equal(g.extraAttempts, 0); assert.equal(e.continueGame(g).continued, false);
  }
});
