"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const source = fs.readFileSync(path.join(__dirname, "..", "lib", "tutorial-engine.js"), "utf8");
const context = { window: { __BRAND__: {} } };
vm.createContext(context);
vm.runInContext(source, context);
const engine = context.window.__BRAND__.tutorialEngine;

function test(name, run) {
  try { run(); process.stdout.write("✓ " + name + "\n"); }
  catch (error) { process.stderr.write("✗ " + name + "\n"); throw error; }
}

test("incluye once tutoriales breves de tres pasos", () => {
  assert.equal(Object.keys(engine.tutorials).length, 11);
  Object.values(engine.tutorials).forEach((tutorial) => {
    assert.equal(tutorial.steps.length, 3);
    tutorial.steps.forEach((step) => { assert.ok(step.title); assert.ok(step.text); assert.ok(step.visual); });
  });
});

test("rechaza un juego desconocido", () => {
  assert.equal(engine.createTutorial("otro"), null);
});

test("avanza, retrocede y expone el paso actual", () => {
  const tutorial = engine.createTutorial("memory");
  assert.equal(engine.current(tutorial).position, 1);
  assert.equal(engine.next(tutorial).moved, true);
  assert.equal(engine.current(tutorial).position, 2);
  assert.equal(engine.previous(tutorial), true);
  assert.equal(engine.current(tutorial).position, 1);
  assert.equal(engine.previous(tutorial), false);
});

test("completa exactamente después del tercer paso", () => {
  const tutorial = engine.createTutorial("science");
  assert.equal(engine.next(tutorial).complete, false);
  assert.equal(engine.next(tutorial).complete, false);
  assert.equal(engine.next(tutorial).complete, true);
  assert.equal(tutorial.complete, true);
  assert.equal(engine.next(tutorial).moved, false);
});

process.stdout.write("\nTodas las pruebas del motor de tutoriales pasaron.\n");
