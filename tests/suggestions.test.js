"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");

test("el buzón externo existe únicamente dentro del panel familiar", () => {
  const start = html.indexOf('<section id="panel-familiar"');
  const end = html.indexOf("</main>", start);
  const matches = Array.from(html.matchAll(/<a\b[^>]*data-suggestions-link[^>]*>/g));
  assert.equal(matches.length, 1);
  assert.ok(matches[0].index > start && matches[0].index < end);
  const link = matches[0][0];
  assert.match(link, /href="https:\/\/docs\.google\.com\/forms\/d\/e\/[^"?]+\/viewform"/);
  assert.match(link, /target="_blank"/);
  assert.match(link, /rel="noopener noreferrer"/);
  assert.match(link, /referrerpolicy="no-referrer"/);
  assert.match(link, /aria-describedby="suggestions-external-note"/);
});

test("avisa de privacidad, salida externa y necesidad de conexión", () => {
  const section = html.slice(html.indexOf('<section class="suggestions-card"'));
  assert.match(section, /Un adulto debe revisarla/);
  assert.match(section, /sin nombres, correos, escuela/);
  assert.match(section, /requiere conexión/);
  assert.match(section, /no se publican/);
  assert.match(section, /No enviamos tu perfil ni progreso/);
});

test("Google Forms no se incrusta ni se precarga en el área infantil", () => {
  assert.doesNotMatch(html, /<(?:iframe|script|link|img)\b[^>]*(?:docs\.google|forms\.gle)/);
  const worker = fs.readFileSync(path.join(root, "sw.js"), "utf8");
  assert.doesNotMatch(worker, /docs\.google|forms\.gle/);
});
