"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const source = fs.readFileSync(path.join(__dirname, "..", "lib", "pwa-engine.js"), "utf8");
const context = { window: { __BRAND__: {} } };
vm.createContext(context);
vm.runInContext(source, context);
const engine = context.window.__BRAND__.pwaEngine;

function test(name, run) {
  try { run(); process.stdout.write("✓ " + name + "\n"); }
  catch (error) { process.stderr.write("✗ " + name + "\n"); throw error; }
}

test("distingue preparación, disponibilidad y modo sin conexión", () => {
  assert.equal(engine.viewModel({ supported: true, online: true }).connectionState, "checking");
  assert.equal(engine.viewModel({ supported: true, online: true, cacheReady: true }).connectionState, "ready");
  assert.equal(engine.viewModel({ supported: true, online: false, cacheReady: true }).connectionState, "offline");
});

test("ofrece instalación solo cuando el navegador la permite", () => {
  const available = engine.viewModel({ supported: true, online: true, cacheReady: true, installAvailable: true });
  assert.equal(available.action, "install");
  assert.equal(available.actionLabel, "Instalar Chispora");
  assert.equal(engine.viewModel({ installed: true, installAvailable: true }).action, null);
});

test("prioriza una actualización completa sobre la instalación", () => {
  const value = engine.viewModel({ installed: true, installAvailable: true, updateAvailable: true });
  assert.equal(value.action, "update");
  assert.equal(value.actionLabel, "Actualizar Chispora");
});

test("explica cuando el navegador no admite uso sin conexión", () => {
  const value = engine.viewModel({ supported: false, online: true });
  assert.equal(value.connectionState, "unavailable");
  assert.match(value.message, /navegador no permite/);
});

process.stdout.write("\nTodas las pruebas del estado PWA pasaron.\n");
