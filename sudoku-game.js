(function () {
  "use strict";

  const brand = window.__BRAND__ || {}, engine = brand.sudokuEngine;
  function symbolSvg(value) {
    const shapes = ['<circle cx="16" cy="16" r="11" />', '<path d="M16 4 L29 27 H3 Z" />', '<rect x="5" y="5" width="22" height="22" />', '<path d="M16 3 L20 12 L29 12 L22 19 L25 29 L16 23 L7 29 L10 19 L3 12 L12 12 Z" />'];
    return '<svg viewBox="0 0 32 32" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round">' + shapes[value - 1] + '</svg>';
  }
  function cellName(index) { return "Fila " + (Math.floor(index / 4) + 1) + ", columna " + (index % 4 + 1); }
  function focus(api) { const cell = api.$("board").querySelector("button:not(:disabled)"); if (cell) cell.focus(); }
  brand.createPuzzleGame({
    id: "sudoku", engine, noun: "tableros", nextLabel: "Siguiente tablero",
    startMessage: "Elige una casilla vacía y una figura. No repitas en fila, columna ni cuadro de 2 × 2.",
    canHint: (game) => game.selected !== null,
    focus,
    build: function (api) {
      for (let index = 0; index < 16; index += 1) {
        const cell = document.createElement("button"); cell.type = "button"; cell.className = "sudoku-cell";
        if (index % 4 === 1) cell.classList.add("sudoku-block-right");
        if (Math.floor(index / 4) === 1) cell.classList.add("sudoku-block-bottom");
        cell.addEventListener("click", () => api.run((game) => {
          if (engine.selectCell(game, index)) api.message(cellName(index) + ": elige una figura.");
        }));
        api.$("board").append(cell);
      }
      engine.symbols.forEach((symbol) => {
        const button = document.createElement("button"); button.type = "button"; button.className = "button button-secondary sudoku-symbol";
        button.innerHTML = symbolSvg(symbol.value) + '<span>' + api.escape(symbol.name) + '</span>';
        button.addEventListener("click", () => {
          const result = api.run((game) => {
            const answer = engine.submitSymbol(game, symbol.value);
            if (answer.accepted) api.message(answer.solved ? "¡Tablero completo! Continúa cuando quieras." : answer.correct ? "¡Encajó! Elige otra casilla." : answer.conflict ? "Esa figura ya está en su fila, columna o cuadro. Prueba otra." : "Todavía no encaja. Mira también los otros cuadros o pide una pista.");
            return answer;
          });
          if (result && result.correct && !result.solved) focus(api);
        });
        api.$("symbols").append(button);
      });
      api.$("board").addEventListener("keydown", (event) => {
        const buttons = Array.from(api.$("board").querySelectorAll("button")), index = buttons.indexOf(event.target);
        const step = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 4, ArrowUp: -4 }[event.key];
        if (index < 0 || !step) return;
        event.preventDefault();
        for (let next = index + step; next >= 0 && next < 16; next += step) {
          if ((step === 1 || step === -1) && Math.floor(next / 4) !== Math.floor(index / 4)) break;
          if (!buttons[next].disabled) { buttons[next].focus(); break; }
        }
      });
    },
    render: function (game, locked, api) {
      const round = game.rounds[game.currentRound];
      api.$("board").querySelectorAll("button").forEach((cell, index) => {
        const value = round.values[index], symbol = engine.symbols.find((s) => s.value === value);
        cell.innerHTML = symbol ? symbolSvg(value) : '<span aria-hidden="true">·</span>';
        cell.disabled = locked || Boolean(value);
        cell.setAttribute("aria-label", cellName(index) + ": " + (symbol ? symbol.name + (round.givens[index] ? ", pista inicial" : ", colocada") : "vacía"));
        cell.setAttribute("aria-pressed", String(game.selected === index));
        cell.classList.toggle("is-given", Boolean(round.givens[index]));
        cell.classList.toggle("is-peer", game.selected !== null && index !== game.selected && engine.peers(game.selected, index));
      });
      api.$("symbols").querySelectorAll("button").forEach((button) => { button.disabled = locked || game.selected === null; });
      api.$("selected").textContent = game.selected === null ? "Elige una casilla vacía." : cellName(game.selected) + " seleccionada.";
    },
    hint: function (game, api) {
      const hint = engine.useHint(game);
      if (hint) api.message("Pista: " + cellName(hint.index) + " necesita " + engine.symbols[hint.value - 1].name.toLowerCase() + ". Elige esa figura abajo.");
    }
  });
})();
