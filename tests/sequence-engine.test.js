"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const source = fs.readFileSync(path.join(__dirname, "..", "lib", "sequence-engine.js"), "utf8");
const context = { window: { __BRAND__: {} }, Math: Math };
vm.createContext(context); vm.runInContext(source, context);
const engine = context.window.__BRAND__.sequenceEngine;

function test(name, run) {
  try { run(); process.stdout.write("✓ " + name + "\n"); }
  catch (error) { process.stderr.write("✗ " + name + "\n"); throw error; }
}

test("crea los tres niveles con la cantidad esperada de patrones", () => {
  [["explorador", 6], ["aventurero", 8], ["maestro", 10]].forEach(([id, count]) => {
    const game = engine.createGame(id, () => 0.4);
    assert.equal(game.rounds.length, count);
    game.rounds.forEach((round) => assert.ok(round.options.includes(round.answer)));
  });
});

test("rechaza respuestas inválidas y elecciones durante el bloqueo", () => {
  const game = engine.createGame("explorador", () => 0.3);
  assert.equal(engine.submitAnswer(game, "no existe").reason, "invalid");
  const answer = game.rounds[0].answer;
  assert.equal(engine.submitAnswer(game, answer).accepted, true);
  assert.equal(engine.submitAnswer(game, answer).reason, "locked");
});

test("un error queda descartado y no avanza el patrón", () => {
  const game = engine.createGame("explorador", () => 0.2);
  const round = game.rounds[0];
  const wrong = round.options.find((option) => option !== round.answer);
  assert.equal(engine.submitAnswer(game, wrong).correct, false);
  assert.equal(game.mistakes, 1);
  engine.continueGame(game);
  assert.equal(game.currentRound, 0);
  assert.ok(game.rejectedOptions.includes(wrong));
  assert.equal(engine.submitAnswer(game, wrong).reason, "rejected");
});

test("una respuesta correcta avanza y limpia descartes", () => {
  const game = engine.createGame("aventurero", () => 0.5);
  const round = game.rounds[0];
  const wrong = round.options.find((option) => option !== round.answer);
  engine.submitAnswer(game, wrong); engine.continueGame(game);
  engine.submitAnswer(game, round.answer); engine.continueGame(game);
  assert.equal(game.currentRound, 1);
  assert.equal(game.rejectedOptions.length, 0);
  assert.equal(game.correctAnswers, 1);
});

test("completa la partida exactamente después del último patrón", () => {
  const game = engine.createGame("explorador", () => 0.6);
  for (let index = 0; index < game.roundCount; index += 1) {
    engine.submitAnswer(game, game.rounds[game.currentRound].answer);
    const result = engine.continueGame(game);
    assert.equal(result.complete, index === game.roundCount - 1);
  }
  assert.equal(game.status, "complete");
  assert.equal(game.correctAnswers, game.roundCount);
});

process.stdout.write("\nTodas las pruebas del motor de Secuencia lógica pasaron.\n");
