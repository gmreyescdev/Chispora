"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const source = fs.readFileSync(path.join(__dirname, "..", "lib", "word-engine.js"), "utf8");
const context = { window: { __BRAND__: {} }, Math: Math };
vm.createContext(context); vm.runInContext(source, context);
const engine = context.window.__BRAND__.wordEngine;

function test(name, run) {
  try { run(); process.stdout.write("✓ " + name + "\n"); }
  catch (error) { process.stderr.write("✗ " + name + "\n"); throw error; }
}

function chooseWord(game, word) {
  const round = game.rounds[game.currentRound];
  word.split("").forEach((letter) => {
    const item = round.letters.find((candidate) => candidate.letter === letter && !game.selectedLetterIds.includes(candidate.id));
    engine.selectLetter(game, item.id);
  });
}

test("crea niveles con palabras desordenadas y fichas únicas", () => {
  [["explorador", 5], ["aventurero", 6], ["maestro", 7]].forEach(([id, count]) => {
    const game = engine.createGame(id, () => 0.4);
    assert.equal(game.rounds.length, count);
    game.rounds.forEach((round) => {
      assert.equal(round.letters.length, round.word.length);
      assert.equal(new Set(round.letters.map((item) => item.id)).size, round.word.length);
      assert.equal(round.letters.map((item) => item.letter).sort().join(""), round.word.split("").sort().join(""));
    });
  });
});

test("rechaza fichas inválidas y repetidas", () => {
  const game = engine.createGame("explorador", () => 0.3);
  assert.equal(engine.selectLetter(game, 99).reason, "invalid");
  const id = game.rounds[0].letters[0].id;
  assert.equal(engine.selectLetter(game, id).accepted, true);
  assert.equal(engine.selectLetter(game, id).reason, "used");
});

test("permite quitar, limpiar y usar una pista una sola vez por ronda", () => {
  const game = engine.createGame("explorador", () => 0.2);
  engine.selectLetter(game, game.rounds[0].letters[0].id);
  assert.equal(engine.removeLastLetter(game), true);
  engine.selectLetter(game, game.rounds[0].letters[0].id);
  assert.equal(engine.clearLetters(game), true);
  assert.equal(game.selectedLetterIds.length, 0);
  assert.ok(engine.useHint(game)); engine.useHint(game);
  assert.equal(game.hintsUsed, 1);
});

test("un intento incorrecto no avanza la palabra", () => {
  const game = engine.createGame("explorador", () => 0.2);
  const round = game.rounds[0];
  const wrong = round.word.split("").reverse().join("") === round.word ? round.word.slice(1) + round.word[0] : round.word.split("").reverse().join("");
  chooseWord(game, wrong);
  assert.equal(game.lastCorrect, false);
  assert.equal(game.mistakes, 1);
  engine.continueGame(game);
  assert.equal(game.currentRound, 0);
  assert.equal(game.selectedLetterIds.length, 0);
});

test("completa la partida solo después de todas las palabras", () => {
  const game = engine.createGame("explorador", () => 0.6);
  for (let index = 0; index < game.roundCount; index += 1) {
    chooseWord(game, game.rounds[game.currentRound].word);
    const result = engine.continueGame(game);
    assert.equal(result.complete, index === game.roundCount - 1);
  }
  assert.equal(game.status, "complete");
  assert.equal(game.correctAnswers, game.roundCount);
});

process.stdout.write("\nTodas las pruebas del motor de Palabra desordenada pasaron.\n");
