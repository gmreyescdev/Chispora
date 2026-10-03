"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.join(__dirname, "..");
const source = fs.readFileSync(path.join(root, "sw.js"), "utf8");
const handlers = {};
let cachedFiles = [];
let skipped = false;
const requestOptions = [];

const context = {
  URL: URL,
  Promise: Promise,
  Request: function (url, options) { this.url = url; requestOptions.push(options); },
  fetch: function () { return Promise.reject(new Error("sin red")); },
  caches: {
    open: function () {
      return Promise.resolve({
        addAll: function (files) { cachedFiles = files.map(function (file) { return file.url; }); return Promise.resolve(); },
        match: function (request) {
          const value = typeof request === "string" ? request : request.url;
          return Promise.resolve(value === "./index.html" ? { source: "offline-index" } : null);
        }
      });
    },
    keys: function () { return Promise.resolve([]); },
    delete: function () { return Promise.resolve(true); }
  },
  self: {
    location: { origin: "https://chispora.test" },
    clients: { claim: function () { return Promise.resolve(); } },
    addEventListener: function (name, handler) { handlers[name] = handler; },
    skipWaiting: function () { skipped = true; }
  }
};
vm.createContext(context);
vm.runInContext(source, context);

function waitFor(handler) {
  return new Promise(function (resolve, reject) {
    handler({ waitUntil: function (promise) { promise.then(resolve, reject); } });
  });
}

async function run() {
  await waitFor(handlers.install);
  assert.equal(requestOptions.length, cachedFiles.length);
  assert.ok(requestOptions.every(function (options) { return options.cache === "reload"; }), "la actualización debe evitar copias obsoletas de la caché HTTP");
  assert.ok(cachedFiles.includes("./index.html"));
  assert.ok(cachedFiles.includes("./app.webmanifest?v=2026093001"));
  assert.ok(cachedFiles.includes("./assets/icons/chispora-512.png"));
  ["sequence", "maze", "reading", "fraction", "robot", "clock", "science", "tangram", "sudoku", "differences"].forEach(function (game) {
    assert.ok(cachedFiles.some(function (file) { return file.indexOf("./" + game + "-game.js?") === 0; }));
  });
  const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
  const references = Array.from(html.matchAll(/<(?:script|img|link)\b[^>]*?\b(?:src|href)="([^"]+)"/g), function (match) {
    return "./" + match[1];
  });
  references.forEach(function (reference) {
    assert.ok(cachedFiles.includes(reference), "El HTML usa un recurso no precargado: " + reference);
  });
  cachedFiles.forEach(function (file) {
    const local = file.replace(/^\.\//, "").split("?")[0] || "index.html";
    assert.ok(fs.existsSync(path.join(root, local)), "Falta el recurso " + local);
  });

  assert.equal(skipped, false, "la instalación no debe activar una versión nueva automáticamente");
  handlers.message({ data: { type: "OTRO" } });
  assert.equal(skipped, false);
  handlers.message({ data: { type: "SKIP_WAITING" } });
  assert.equal(skipped, true);

  const response = await new Promise(function (resolve) {
    handlers.fetch({
      request: { method: "GET", mode: "navigate", url: "https://chispora.test/ruta" },
      respondWith: function (promise) { promise.then(resolve); }
    });
  });
  assert.equal(response.source, "offline-index");
  process.stdout.write("✓ precarga todos los recursos locales declarados\n");
  process.stdout.write("✓ activa actualizaciones únicamente por decisión explícita\n");
  process.stdout.write("✓ recupera la aplicación para una navegación sin red\n");
  process.stdout.write("\nTodas las pruebas del service worker pasaron.\n");
}

run().catch(function (error) {
  process.stderr.write("✗ " + error.message + "\n");
  process.exitCode = 1;
});
