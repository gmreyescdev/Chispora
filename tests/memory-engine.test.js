"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const source = fs.readFileSync(path.join(__dirname, "..", "lib", "memory-engine.js"), "utf8");
const context = { window: { __BRAND__: {} }, Math: Math };
vm.createContext(context);
vm.runInContext(source, context);
const engine = context.window.__BRAND__.memoryEngine;

function test(name, run) {
  try {
    run();
    process.stdout.write("✓ " + name + "\n");
  } catch (error) {
    process.stderr.write("✗ " + name + "\n");
    throw error;
  }
}

test("crea cada dificultad con la cantidad correcta de pares", () => {
  [["explorador", 6, 3], ["aventurero", 8, 2], ["maestro", 10, 0]].forEach(([id, pairs, preview]) => {
    const game = engine.createGame(id, () => 0.5);
    assert.equal(game.cards.length, pairs * 2);
    assert.equal(game.pairCount, pairs);
    assert.equal(game.previewSeconds, preview);
    assert.equal(new Set(game.cards.map((card) => card.id)).size, pairs * 2);
    for (let pairId = 0; pairId < pairs; pairId += 1) {
      assert.equal(game.cards.filter((card) => card.pairId === pairId).length, 2);
    }
  });
});

test("bloquea elecciones durante la vista previa", () => {
  const game = engine.createGame("explorador", () => 0.5);
  const selection = engine.selectCard(game, 0);
  assert.equal(selection.accepted, false);
  assert.equal(selection.reason, "locked");
  assert.equal(engine.finishPreview(game), true);
  assert.equal(game.status, "playing");
});

test("ignora índices inválidos y una carta ya abierta", () => {
  const game = engine.createGame("maestro", () => 0.5);
  assert.equal(engine.selectCard(game, -1).reason, "invalid");
  assert.equal(engine.selectCard(game, game.cards.length).reason, "invalid");
  assert.equal(engine.selectCard(game, 0).outcome, "first");
  assert.equal(engine.selectCard(game, 0).reason, "unavailable");
});

test("bloquea una tercera selección y oculta una pareja incorrecta", () => {
  const game = engine.createGame("maestro", () => 0.5);
  const first = 0;
  const second = game.cards.findIndex((card) => card.pairId !== game.cards[first].pairId);
  engine.selectCard(game, first);
  assert.equal(engine.selectCard(game, second).outcome, "mismatch");
  assert.equal(engine.selectCard(game, 2).reason, "locked");
  const result = engine.resolveTurn(game);
  assert.equal(result.matched, false);
  assert.equal(game.openIndexes.length, 0);
  assert.equal(game.moves, 1);
  assert.equal(game.status, "playing");
});

test("conserva una pareja correcta y no permite elegirla otra vez", () => {
  const game = engine.createGame("maestro", () => 0.5);
  const first = 0;
  const second = game.cards.findIndex((card, index) => index !== first && card.pairId === game.cards[first].pairId);
  engine.selectCard(game, first);
  assert.equal(engine.selectCard(game, second).outcome, "match");
  const result = engine.resolveTurn(game);
  assert.equal(result.matched, true);
  assert.equal(game.foundIndexes.length, 2);
  assert.equal(engine.selectCard(game, first).reason, "unavailable");
});

test("reconoce el final exacto de una partida", () => {
  const game = engine.createGame("maestro", () => 0.5);
  const indexesByPair = new Map();
  game.cards.forEach((card, index) => {
    const indexes = indexesByPair.get(card.pairId) || [];
    indexes.push(index);
    indexesByPair.set(card.pairId, indexes);
  });

  let lastResult;
  indexesByPair.forEach((indexes) => {
    engine.selectCard(game, indexes[0]);
    engine.selectCard(game, indexes[1]);
    lastResult = engine.resolveTurn(game);
  });

  assert.equal(lastResult.complete, true);
  assert.equal(game.status, "complete");
  assert.equal(game.moves, game.pairCount);
  assert.equal(game.foundIndexes.length, game.cards.length);
});

process.stdout.write("\nTodas las pruebas del motor de Memorama pasaron.\n");
