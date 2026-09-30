"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const source = fs.readFileSync(path.join(__dirname, "..", "lib", "accessibility-engine.js"), "utf8");
const context = { window: { __BRAND__: {} } };
vm.createContext(context);
vm.runInContext(source, context);
const engine = context.window.__BRAND__.accessibilityEngine;

function test(name, run) {
  try { run(); process.stdout.write("✓ " + name + "\n"); }
  catch (error) { process.stderr.write("✗ " + name + "\n"); throw error; }
}

test("recupera valores seguros para datos ausentes o antiguos", () => {
  assert.deepEqual(JSON.parse(JSON.stringify(engine.normalize(null))), { textSize: "normal", highContrast: false, reducedMotion: false, hideTimers: false });
  assert.equal(engine.normalize({ textSize: "enorme", highContrast: "true" }).textSize, "normal");
  assert.equal(engine.normalize({ textSize: "enorme", highContrast: "true" }).highContrast, false);
});

test("acepta las cuatro preferencias válidas", () => {
  const value = engine.normalize({ textSize: "large", highContrast: true, reducedMotion: true, hideTimers: true });
  assert.equal(value.textSize, "large");
  assert.equal(value.highContrast, true);
  assert.equal(value.reducedMotion, true);
  assert.equal(value.hideTimers, true);
});

test("crea atributos de presentación sin modificar la entrada", () => {
  const settings = { textSize: "large", highContrast: true };
  const value = engine.attributes(settings);
  assert.deepEqual(JSON.parse(JSON.stringify(value)), { textSize: "large", contrast: "high", reducedMotion: "false", hideTimers: "false" });
  assert.equal(settings.hideTimers, undefined);
});

test("combina la reducción manual con la preferencia del sistema", () => {
  assert.equal(engine.shouldReduceMotion({}, true), true);
  assert.equal(engine.shouldReduceMotion({ reducedMotion: true }, false), true);
  assert.equal(engine.shouldReduceMotion({ reducedMotion: false }, false), false);
});

process.stdout.write("\nTodas las pruebas de preferencias de accesibilidad pasaron.\n");
