"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const source = fs.readFileSync(path.join(__dirname, "..", "lib", "operation-engine.js"), "utf8");
const context = { window: { __BRAND__: {} }, Math: Math };
vm.createContext(context);
vm.runInContext(source, context);
const engine = context.window.__BRAND__.operationEngine;

function test(name, run) {
  try { run(); process.stdout.write("✓ " + name + "\n"); }
  catch (error) { process.stderr.write("✗ " + name + "\n"); throw error; }
}

test("genera la cantidad y los operadores correctos por nivel", () => {
  [["explorador", 6, 2], ["aventurero", 8, 3], ["maestro", 10, 3]].forEach(([id, rounds, operators]) => {
    const game = engine.createGame(id, () => 0.4);
    assert.equal(game.rounds.length, rounds);
    assert.equal(game.operators.length, operators);
    game.rounds.forEach((problem) => assert.equal(engine.calculate(problem.left, problem.operator, problem.right), problem.result));
  });
});

test("rechaza operadores inválidos y respuestas durante el bloqueo", () => {
  const game = engine.createGame("explorador", () => 0.2);
  assert.equal(engine.submitAnswer(game, "÷").reason, "invalid");
  const correct = game.rounds[0].operator;
  assert.equal(engine.submitAnswer(game, correct).correct, true);
  assert.equal(engine.submitAnswer(game, correct).reason, "locked");
});

test("permite reintentar tras un error sin avanzar de desafío", () => {
  const game = engine.createGame("aventurero", () => 0.2);
  const correct = game.rounds[0].operator;
  const wrong = game.operators.find((operator) => operator !== correct);
  assert.equal(engine.submitAnswer(game, wrong).correct, false);
  assert.equal(engine.continueGame(game).complete, false);
  assert.equal(game.currentRound, 0);
  assert.equal(game.mistakes, 1);
  assert.equal(engine.submitAnswer(game, wrong).reason, "rejected");
  assert.equal(engine.submitAnswer(game, correct).correct, true);
});

test("avanza únicamente con respuestas correctas", () => {
  const game = engine.createGame("explorador", () => 0.3);
  engine.submitAnswer(game, game.rounds[0].operator);
  engine.continueGame(game);
  assert.equal(game.currentRound, 1);
  assert.equal(game.correctAnswers, 1);
  assert.equal(game.attempts, 1);
});

test("completa la partida y conserva estadísticas", () => {
  const game = engine.createGame("explorador", () => 0.6);
  game.rounds.forEach((problem, index) => {
    const answer = engine.submitAnswer(game, problem.operator);
    assert.equal(answer.finalRound, index === game.roundCount - 1);
    engine.continueGame(game);
  });
  assert.equal(game.status, "complete");
  assert.equal(game.correctAnswers, game.roundCount);
  assert.equal(game.mistakes, 0);
  assert.equal(game.bestStreak, game.roundCount);
});

process.stdout.write("\nTodas las pruebas del motor de Operación misteriosa pasaron.\n");
