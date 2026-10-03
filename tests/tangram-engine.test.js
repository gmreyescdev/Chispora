"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const context = { window: { __BRAND__: {} } };
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(__dirname, "../lib/tangram-engine.js"), "utf8"), context);
const e = context.window.__BRAND__.tangramEngine;

function orient(g, piece, slot) {
  assert.equal(e.selectPiece(g, piece), true);
  const target = e.orientation(e.pieces[piece], g.rounds[g.currentRound].slots[slot]);
  assert.ok(target);
  if (g.pieces[piece].flipped !== target.flipped) e.adjustPiece(g, "flip");
  for (let i = 0; i < 8 && g.pieces[piece].rotation !== target.rotation; i += 1) e.adjustPiece(g, "rotate");
}
function solve(g) {
  for (let i = 0; i < 7; i += 1) { orient(g, i, i); assert.equal(e.placePiece(g, i).correct, true); }
}
function area(p) { return Math.abs(p.reduce((sum, a, i) => { const b = p[(i + 1) % p.length]; return sum + a[0] * b[1] - a[1] * b[0]; }, 0) / 2); }
function strictlyInside(p, polygon) {
  const cross = polygon.map((a, i) => { const b = polygon[(i + 1) % polygon.length]; return (b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0]); });
  return cross.every((v) => v > 1e-8) || cross.every((v) => v < -1e-8);
}

test("crea tres dificultades deterministas con siete piezas auténticas", () => {
  for (const level of Object.keys(e.difficulties)) {
    const g = e.createGame(level, () => 0.75), other = e.createGame(level, () => 0.75);
    assert.equal(g.roundCount, e.difficulties[level].roundCount);
    assert.equal(g.pieces.length, 7);
    assert.equal(JSON.stringify(g.pieces), JSON.stringify(other.pieces));
    assert.equal(g.status, "playing");
    g.rounds.forEach((round) => {
      assert.equal(round.slots.length, 7);
      assert.ok(Math.abs(round.slots.reduce((sum, p) => sum + area(p), 0) - 16) < 1e-8);
      round.slots.forEach((slot, i) => assert.ok(e.orientation(e.pieces[i], slot)));
      // Sample the interiors on a fine grid, excluding polygon edges.
      for (let x = -4; x < 9; x += 0.19) for (let y = -1; y < 7; y += 0.17) {
        assert.ok(round.slots.filter((slot) => strictlyInside([x, y], slot)).length <= 1);
      }
    });
  }
  assert.equal(e.createGame("inexistente").difficulty, "explorador");
  assert.equal(e.createGame("toString").difficulty, "explorador");
});

test("rechaza entradas inválidas sin alterar piezas ni avance", () => {
  const g = e.createGame("explorador", () => 0);
  for (const index of [-1, 7, 1.5, "0", null, NaN]) assert.equal(e.selectPiece(g, index), false);
  assert.equal(e.selectPiece(null, 0), false);
  assert.equal(e.adjustPiece(g, "rotate"), false);
  assert.equal(e.placePiece(g, 0).accepted, false);
  assert.equal(e.useHint(g), null);
  e.selectPiece(g, 0);
  assert.equal(e.adjustPiece(g, "otro"), false);
  for (const slot of [-1, 7, "0", NaN]) assert.equal(e.placePiece(g, slot).accepted, false);
  assert.equal(g.extraAttempts, 0);
});

test("permite corregir sin perder piezas ni avanzar", () => {
  const g = e.createGame("explorador", () => 0);
  e.selectPiece(g, 5);
  assert.equal(e.placePiece(g, 0).correct, false);
  assert.equal(g.selected, 5);
  assert.equal(g.placed.filter((p) => p !== null).length, 0);
  assert.equal(g.currentRound, 0);
  assert.equal(g.extraAttempts, 1);
  assert.equal(e.placePiece(g, 5).correct, true);
  assert.equal(e.selectPiece(g, 5), false);
  e.selectPiece(g, 0);
  assert.equal(e.placePiece(g, 5).accepted, false);
});

test("girar ocho veces y voltear dos veces recupera la pieza", () => {
  const g = e.createGame("maestro", () => 0.8);
  e.selectPiece(g, 6);
  const before = JSON.stringify(g.pieces[6]);
  for (let i = 0; i < 8; i += 1) e.adjustPiece(g, "rotate");
  e.adjustPiece(g, "flip"); e.adjustPiece(g, "flip");
  assert.equal(JSON.stringify(g.pieces[6]), before);
});

test("acepta triángulos iguales intercambiados y pistas repetibles", () => {
  const g = e.createGame("aventurero", () => 0.6);
  orient(g, 1, 0); assert.equal(e.placePiece(g, 0).correct, true);
  orient(g, 0, 1); assert.equal(e.placePiece(g, 1).correct, true);
  e.selectPiece(g, 6);
  const hint = e.useHint(g); assert.ok(hint);
  assert.equal(g.hintsUsed, 1);
  e.useHint(g); assert.equal(g.hintsUsed, 1);
  assert.equal(e.placePiece(g, hint.slot).correct, true);
});

test("bloquea feedback y finaliza exactamente tras la última figura", () => {
  for (const level of Object.keys(e.difficulties)) {
    const g = e.createGame(level, () => 0.3);
    assert.equal(e.continueGame(g).continued, false);
    for (let round = 0; round < g.roundCount; round += 1) {
      solve(g);
      assert.equal(g.status, "feedback");
      assert.equal(e.selectPiece(g, 0), false);
      assert.equal(e.adjustPiece(g, "rotate"), false);
      assert.equal(e.placePiece(g, 0).reason, "locked");
      assert.equal(e.useHint(g), null);
      const result = e.continueGame(g);
      assert.equal(result.complete, round === g.roundCount - 1);
    }
    assert.equal(g.status, "complete");
    assert.equal(g.correctAnswers, g.roundCount);
    assert.equal(g.extraAttempts, 0);
    assert.equal(e.continueGame(g).continued, false);
  }
});
