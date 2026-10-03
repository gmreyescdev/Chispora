"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const source = fs.readFileSync(path.join(__dirname, "..", "lib", "progress-engine.js"), "utf8");
const context = { window: { __BRAND__: {} }, Math: Math };
vm.createContext(context); vm.runInContext(source, context);
const engine = context.window.__BRAND__.progressEngine;

function test(name, run) {
  try { run(); process.stdout.write("✓ " + name + "\n"); }
  catch (error) { process.stderr.write("✗ " + name + "\n"); throw error; }
}

test("resume un estado vacío de forma segura", () => {
  const summary = engine.summarize(null);
  assert.equal(summary.skills.length, 11);
  assert.equal(summary.totalLevels, 0);
  assert.equal(summary.maximumLevels, 33);
  assert.equal(summary.percentage, 0);
  assert.equal(summary.completedGames, 0);
});

test("cuenta únicamente las tres dificultades reconocidas", () => {
  const summary = engine.summarize({ progress: { memory: { completedByDifficulty: { explorador: true, aventurero: true, inventado: true } } } });
  assert.equal(summary.skills.find((skill) => skill.id === "memory").levels, 2);
  assert.equal(summary.totalLevels, 2);
  assert.equal(summary.percentage, 6);
});

test("asigna estados descriptivos sin puntajes ni comparaciones", () => {
  const summary = engine.summarize({ progress: {
    memory: { completedByDifficulty: {} },
    operation: { completedByDifficulty: { explorador: true } },
    word: { completedByDifficulty: { explorador: true, aventurero: true } },
    sequence: { completedByDifficulty: { explorador: true, aventurero: true, maestro: true } }
  } });
  assert.equal(summary.skills.find((skill) => skill.id === "memory").label, "Lista para explorar");
  assert.equal(summary.skills.find((skill) => skill.id === "operation").label, "Primer recorrido");
  assert.equal(summary.skills.find((skill) => skill.id === "word").label, "Camino avanzado");
  assert.equal(summary.skills.find((skill) => skill.id === "sequence").label, "Tres niveles recorridos");
});

test("calcula el catálogo completo y conserva partidas terminadas", () => {
  const progress = { completedGames: 24 };
  engine.skills.forEach((skill) => { progress[skill.id] = { completedByDifficulty: { explorador: true, aventurero: true, maestro: true } }; });
  const summary = engine.summarize({ progress: progress });
  assert.equal(summary.totalLevels, 33);
  assert.equal(summary.percentage, 100);
  assert.equal(summary.completedGames, 24);
  assert.equal(summary.message, "Recorriste todo el mapa disponible.");
});

test("conserva los treinta niveles antiguos al incorporar Tangram", () => {
  const progress = { completedGames: 10 };
  engine.skills.filter((skill) => skill.id !== "tangram").forEach((skill) => {
    progress[skill.id] = { completedByDifficulty: { explorador: true, aventurero: true, maestro: true } };
  });
  const summary = engine.summarize({ progress });
  assert.equal(summary.totalLevels, 30);
  assert.equal(summary.maximumLevels, 33);
  assert.equal(summary.skills.find((skill) => skill.id === "tangram").levels, 0);
  assert.equal(summary.completedGames, 10);
});

process.stdout.write("\nTodas las pruebas del resumen de habilidades pasaron.\n");
