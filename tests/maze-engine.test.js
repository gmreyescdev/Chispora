"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const source = fs.readFileSync(path.join(__dirname, "..", "lib", "maze-engine.js"), "utf8");
const context = { window: { __BRAND__: {} }, Math: Math, Set: Set };
vm.createContext(context); vm.runInContext(source, context);
const engine = context.window.__BRAND__.mazeEngine;

function test(name, run) {
  try { run(); process.stdout.write("✓ " + name + "\n"); }
  catch (error) { process.stderr.write("✗ " + name + "\n"); throw error; }
}

function reachableCells(maze) {
  const visited = new Set([maze.start]);
  const pending = [maze.start];
  while (pending.length) {
    const index = pending.shift();
    const cell = maze.cells[index];
    Object.entries(engine.directions).forEach(([name, direction]) => {
      if (cell.walls[direction.wall]) return;
      const next = (cell.row + direction.row) * maze.size + cell.column + direction.column;
      if (!visited.has(next)) { visited.add(next); pending.push(next); }
    });
  }
  return visited;
}

function solution(maze) {
  const pending = [{ index: maze.start, path: [] }];
  const visited = new Set([maze.start]);
  while (pending.length) {
    const current = pending.shift();
    if (current.index === maze.goal) return current.path;
    const cell = maze.cells[current.index];
    Object.entries(engine.directions).forEach(([name, direction]) => {
      if (cell.walls[direction.wall]) return;
      const next = (cell.row + direction.row) * maze.size + cell.column + direction.column;
      if (!visited.has(next)) { visited.add(next); pending.push({ index: next, path: current.path.concat(name) }); }
    });
  }
  return [];
}

test("genera las dimensiones correctas para cada dificultad", () => {
  [["explorador", 5], ["aventurero", 7], ["maestro", 9]].forEach(([id, size]) => {
    const game = engine.createGame(id, () => 0.37);
    assert.equal(game.roundCount, 2);
    game.rounds.forEach((maze) => assert.equal(maze.cells.length, size * size));
  });
});

test("cada laberinto conecta todas las casillas y conserva paredes simétricas", () => {
  const maze = engine.createMaze(9, () => 0.61);
  assert.equal(reachableCells(maze).size, maze.cells.length);
  maze.cells.forEach((cell) => {
    if (cell.column < maze.size - 1) assert.equal(cell.walls.right, maze.cells[cell.row * maze.size + cell.column + 1].walls.left);
    if (cell.row < maze.size - 1) assert.equal(cell.walls.bottom, maze.cells[(cell.row + 1) * maze.size + cell.column].walls.top);
  });
});

test("rechaza direcciones inválidas, paredes y movimientos durante el bloqueo", () => {
  const game = engine.createGame("explorador", () => 0.25);
  assert.equal(engine.move(game, "diagonal").reason, "invalid");
  const wallDirection = Object.keys(engine.directions).find((name) => game.rounds[0].cells[0].walls[engine.directions[name].wall]);
  assert.equal(engine.move(game, wallDirection).reason, "wall");
  assert.equal(game.position, 0);
  game.status = "feedback";
  assert.equal(engine.move(game, "right").reason, "locked");
});

test("una ruta válida llega a la meta y avanza al segundo laberinto", () => {
  const game = engine.createGame("explorador", () => 0.42);
  solution(game.rounds[0]).forEach((direction) => engine.move(game, direction));
  assert.equal(game.completedMazes, 1);
  assert.equal(game.status, "feedback");
  assert.equal(engine.continueGame(game).complete, false);
  assert.equal(game.currentRound, 1);
  assert.equal(game.position, game.rounds[1].start);
});

test("completa la partida exactamente después del último laberinto", () => {
  const game = engine.createGame("aventurero", () => 0.54);
  for (let round = 0; round < game.roundCount; round += 1) {
    solution(game.rounds[game.currentRound]).forEach((direction) => engine.move(game, direction));
    const result = engine.continueGame(game);
    assert.equal(result.complete, round === game.roundCount - 1);
  }
  assert.equal(game.status, "complete");
  assert.equal(game.completedMazes, game.roundCount);
  assert.ok(game.totalMoves > 0);
});

process.stdout.write("\nTodas las pruebas del motor de Laberintos pasaron.\n");
