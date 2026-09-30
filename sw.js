"use strict";

const CACHE_PREFIX = "chispora-shell-";
const CACHE_NAME = CACHE_PREFIX + "2026093002";
const SHELL_FILES = [
  "./",
  "./index.html",
  "./app.webmanifest?v=2026093001",
  "./styles.css?v=2026093009",
  "./assets/img/chispora-symbol.svg?v=2026090703",
  "./assets/img/chispora-symbol.svg",
  "./assets/icons/chispora-192.png",
  "./assets/icons/chispora-512.png",
  "./lib/gsap.min.js?v=2026090706",
  "./lib/ScrollTrigger.min.js?v=2026090706",
  "./lib/manifest.js?v=2026093008",
  "./lib/accessibility-engine.js?v=2026093008",
  "./lib/pwa-engine.js?v=2026093001",
  "./lib/memory-engine.js?v=2026090706",
  "./lib/operation-engine.js?v=2026090706",
  "./lib/word-engine.js?v=2026090706",
  "./lib/sequence-engine.js?v=2026090706",
  "./lib/maze-engine.js?v=2026090706",
  "./lib/reading-engine.js?v=2026092901",
  "./lib/progress-engine.js?v=2026093003",
  "./lib/fraction-engine.js?v=2026093001",
  "./lib/robot-engine.js?v=2026093001",
  "./lib/choice-game.js?v=2026093003",
  "./lib/clock-engine.js?v=2026093003",
  "./lib/science-engine.js?v=2026093003",
  "./lib/mission-map-engine.js?v=2026093001",
  "./lib/tutorial-engine.js?v=2026093001",
  "./main.js?v=2026093008",
  "./sequence-game.js?v=2026090706",
  "./maze-game.js?v=2026090706",
  "./reading-game.js?v=2026092901",
  "./progress-summary.js?v=2026092902",
  "./mission-map.js?v=2026093001",
  "./fraction-game.js?v=2026093002",
  "./robot-game.js?v=2026093001",
  "./clock-game.js?v=2026093003",
  "./science-game.js?v=2026093003",
  "./tutorials.js?v=2026093001",
  "./pwa.js?v=2026093001"
];

self.addEventListener("install", function (event) {
  event.waitUntil(caches.open(CACHE_NAME).then(function (cache) {
    return cache.addAll(SHELL_FILES);
  }));
});

self.addEventListener("activate", function (event) {
  event.waitUntil(caches.keys().then(function (names) {
    return Promise.all(names.filter(function (name) {
      return name.indexOf(CACHE_PREFIX) === 0 && name !== CACHE_NAME;
    }).map(function (name) {
      return caches.delete(name);
    }));
  }).then(function () {
    return self.clients.claim();
  }));
});

self.addEventListener("message", function (event) {
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch", function (event) {
  const request = event.request;
  if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) return;

  event.respondWith(caches.open(CACHE_NAME).then(function (cache) {
    return cache.match(request).then(function (cached) {
      if (cached) return cached;
      if (request.mode === "navigate") return cache.match("./index.html");
      return fetch(request);
    });
  }));
});
