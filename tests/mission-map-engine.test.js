"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const source = fs.readFileSync(path.join(__dirname, "..", "lib", "mission-map-engine.js"), "utf8");
const context = { window: { __BRAND__: {} } };
vm.createContext(context);
vm.runInContext(source, context);
const engine = context.window.__BRAND__.missionMapEngine;

function test(name, run) {
  try { run(); process.stdout.write("✓ " + name + "\n"); }
  catch (error) { process.stderr.write("✗ " + name + "\n"); throw error; }
}

test("reconoce las cuatro áreas y la vista completa", () => {
  assert.deepEqual(Object.keys(engine.areas), ["all", "words", "numbers", "logic", "exploration"]);
});

test("recupera la vista completa ante un filtro desconocido", () => {
  assert.equal(engine.normalizeArea("otra"), "all");
  assert.equal(engine.matches("otra", "words"), true);
});

test("muestra solo las misiones del área seleccionada", () => {
  assert.equal(engine.matches("numbers", "numbers"), true);
  assert.equal(engine.matches("numbers", "logic"), false);
});

test("crea mensajes breves para el estado del filtro", () => {
  assert.equal(engine.status(10, "all"), "10 juegos disponibles");
  assert.equal(engine.status(3, "logic"), "3 juegos de Lógica");
});

process.stdout.write("\nTodas las pruebas del filtro de misiones pasaron.\n");
