"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const source = fs.readFileSync(path.join(__dirname, "..", "lib", "reading-engine.js"), "utf8");
const context = { window: { __BRAND__: {} }, Math: Math };
vm.createContext(context); vm.runInContext(source, context);
const engine = context.window.__BRAND__.readingEngine;

function test(name, run) {
  try { run(); process.stdout.write("✓ " + name + "\n"); }
  catch (error) { process.stderr.write("✗ " + name + "\n"); throw error; }
}

function wordCount(round) {
  return round.paragraphs.join(" ").trim().split(/\s+/u).length;
}

test("crea cada nivel con textos únicos, extensión adecuada y respuestas completas", () => {
  [["explorador", 4], ["aventurero", 5], ["maestro", 6]].forEach(([id, count]) => {
    const game = engine.createGame(id, () => 0.4);
    const config = engine.difficulties[id];
    assert.equal(game.rounds.length, count);
    assert.equal(new Set(game.rounds.map((round) => round.id)).size, count);
    assert.ok(config.exercises.length > config.roundCount);
    config.exercises.forEach((round) => {
      assert.ok(wordCount(round) >= config.minWords, round.id + " tiene pocas palabras");
      assert.ok(wordCount(round) <= config.maxWords, round.id + " tiene demasiadas palabras");
      assert.equal(round.options.length, 3);
      assert.equal(new Set(round.options.map((option) => option.id)).size, 3);
      assert.ok(round.options.some((option) => option.id === round.answerId));
      assert.ok(round.hint.paragraphIndex >= 0 && round.hint.paragraphIndex < round.paragraphs.length);
    });
  });
});

test("usa el nivel explorador como recuperación segura", () => {
  const game = engine.createGame("no-existe", () => 0.3);
  assert.equal(game.difficulty, "explorador");
  assert.equal(game.roundCount, 4);
});

test("rechaza respuestas inválidas y elecciones durante el bloqueo", () => {
  const game = engine.createGame("explorador", () => 0.2);
  assert.equal(engine.submitAnswer(game, "no-existe").reason, "invalid");
  const answerId = game.rounds[0].answerId;
  assert.equal(engine.submitAnswer(game, answerId).accepted, true);
  assert.equal(engine.submitAnswer(game, answerId).reason, "locked");
});

test("descarta un error sin avanzar ni penalizar la respuesta correcta", () => {
  const game = engine.createGame("aventurero", () => 0.5);
  const round = game.rounds[0];
  const wrongId = round.options.find((option) => option.id !== round.answerId).id;
  const answer = engine.submitAnswer(game, wrongId);
  assert.equal(answer.correct, false);
  assert.equal(game.extraAttempts, 1);
  assert.ok(game.rejectedOptionIds.includes(wrongId));
  assert.equal(engine.continueGame(game).complete, false);
  assert.equal(game.currentRound, 0);
  assert.equal(engine.submitAnswer(game, wrongId).reason, "rejected");
  assert.equal(engine.submitAnswer(game, round.answerId).correct, true);
});

test("permite usar la pista una sola vez por ejercicio", () => {
  const game = engine.createGame("explorador", () => 0.1);
  const firstHint = engine.useHint(game);
  const secondHint = engine.useHint(game);
  assert.equal(firstHint.text, secondHint.text);
  assert.equal(game.hintsUsed, 1);
  engine.submitAnswer(game, game.rounds[0].answerId);
  assert.equal(engine.useHint(game), null);
  engine.continueGame(game);
  assert.ok(engine.useHint(game));
  assert.equal(game.hintsUsed, 2);
});

test("avanza con una respuesta correcta y limpia las opciones descartadas", () => {
  const game = engine.createGame("explorador", () => 0.6);
  const round = game.rounds[0];
  const wrongId = round.options.find((option) => option.id !== round.answerId).id;
  engine.submitAnswer(game, wrongId); engine.continueGame(game);
  const answer = engine.submitAnswer(game, round.answerId);
  assert.equal(answer.explanation, round.explanation);
  engine.continueGame(game);
  assert.equal(game.currentRound, 1);
  assert.equal(game.rejectedOptionIds.length, 0);
  assert.equal(game.correctAnswers, 1);
});

test("completa la partida exactamente después del último texto", () => {
  const game = engine.createGame("explorador", () => 0.7);
  for (let index = 0; index < game.roundCount; index += 1) {
    const round = game.rounds[game.currentRound];
    const answer = engine.submitAnswer(game, round.answerId);
    assert.equal(answer.finalRound, index === game.roundCount - 1);
    const result = engine.continueGame(game);
    assert.equal(result.complete, index === game.roundCount - 1);
  }
  assert.equal(game.status, "complete");
  assert.equal(game.correctAnswers, game.roundCount);
});

process.stdout.write("\nTodas las pruebas del motor de Comprensión lectora pasaron.\n");
