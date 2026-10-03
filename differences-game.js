(function () {
  "use strict";

  const brand = window.__BRAND__ || {}, engine = brand.differencesEngine;
  const fish = '<ellipse cx="-3" cy="0" rx="15" ry="8" /><path d="M11 0 L26 -10 L26 10 Z" /><circle cx="-10" cy="-2" r="1.8" fill="var(--ink)" />';
  const cloud = '<path d="M-27 8 Q-36 -9 -18 -12 Q-14 -31 3 -18 Q25 -26 27 -7 Q39 12 18 14 L-16 14 Q-29 14 -27 8 Z" />';
  const bird = '<path d="M-25 5 Q-12 -18 0 5 Q12 -18 25 5" fill="none" />';
  function drawing(kind, variant) {
    const pair = (shape) => variant ? '<g transform="translate(-14 -9) scale(.57)">' + shape + '</g><g transform="translate(15 12) scale(.57)">' + shape + '</g>' : shape;
    switch (kind) {
      case "sky": return variant ? '<path d="M8 -28 A29 29 0 1 0 8 28 A23 23 0 0 1 8 -28 Z" fill="var(--yellow)" />' : '<circle r="18" fill="var(--yellow)" />' + Array.from({ length: 8 }, (_, i) => '<path transform="rotate(' + i * 45 + ')" d="M0 -23 V-32" />').join("");
      case "cloud": return pair(cloud);
      case "bird": return pair(bird);
      case "kite": return '<polygon fill="var(--coral)" points="' + (variant ? '0,-28 25,14 -25,14' : '0,-28 20,0 0,24 -20,0') + '" /><path d="M0 24 Q-12 30 2 36" fill="none" />';
      case "tree": return '<path d="M0 10 V35" stroke-width="8" />' + (variant ? '<path d="M0 -30 L30 18 H-30 Z" fill="var(--turquoise)" />' : '<circle cy="-7" r="27" fill="var(--turquoise)" />');
      case "house": return '<path d="M-28 -8 H28 V34 H-28 Z" fill="var(--yellow)" /><path d="M-34 -8 L0 -35 L34 -8 Z" fill="var(--coral)" />' + (variant ? '<circle cy="10" r="10" />' : '<rect x="-10" y="0" width="20" height="20" />');
      case "flower": return '<path d="M0 6 V36 M0 25 Q-23 11 -12 30 Z" fill="var(--turquoise)" />' + Array.from({ length: variant ? 6 : 4 }, (_, i) => '<ellipse transform="rotate(' + i * 360 / (variant ? 6 : 4) + ')" cy="-17" rx="7" ry="12" fill="var(--coral)" />').join("") + '<circle r="8" fill="var(--yellow)" />';
      case "pond": return '<ellipse cy="6" rx="34" ry="24" fill="var(--sky)" /><g transform="translate(0 5) scale(.65)" fill="var(--yellow)">' + pair(fish) + '</g>';
      case "fish": return '<g fill="var(--coral)">' + pair(fish) + '</g>';
      case "fence": return '<path d="M-34 0 H34 M-34 19 H34" stroke-width="5" />' + (variant ? [-30, -10, 10, 30] : [-24, 0, 24]).map((x) => '<path d="M' + x + ' -20 V33" stroke-width="7" />').join("");
      case "boat": return '<path d="M-34 14 H34 L23 32 H-22 Z" fill="var(--coral)" /><path d="M0 -31 V14" />' + (variant ? '<rect x="2" y="-29" width="28" height="33" fill="var(--yellow)" />' : '<path d="M2 -29 L30 4 H2 Z" fill="var(--yellow)" />');
      case "umbrella": return '<path d="M-34 0 A34 32 0 0 1 34 0 Z" fill="var(--coral)" />' + (variant ? '<path d="M0 -32 V0" />' : '') + '<path d="M0 0 V28 Q0 39 12 31" fill="none" />';
      case "shell": return '<path d="M-30 -10 Q0 -42 30 -10 L8 28 H-8 Z" fill="var(--yellow)" />' + Array.from({ length: variant ? 5 : 3 }, (_, i) => '<path d="M0 24 L' + ((i + 1) * 48 / ((variant ? 5 : 3) + 1) - 24) + ' -17" fill="none" />').join("");
      case "bucket": return '<path d="M-26 -16 H26 L20 30 H-20 Z" fill="var(--yellow)" />' + (variant ? '' : '<path d="M-26 -14 Q0 -50 26 -14" fill="none" />');
      case "tent": return '<path d="M0 -34 L36 32 H-36 Z" fill="var(--coral)" />' + (variant ? '<rect x="-12" y="4" width="24" height="28" />' : '<path d="M0 0 L16 32 H-16 Z" />');
      case "backpack": return '<rect x="-25" y="-30" width="50" height="64" rx="12" fill="var(--yellow)" /><path d="M-10 -30 V-37 H10 V-30" fill="none" />' + (variant ? '<rect x="-18" y="0" width="15" height="22" rx="3" /><rect x="3" y="0" width="15" height="22" rx="3" />' : '<rect x="-17" y="0" width="34" height="22" rx="3" />');
      default: return "";
    }
  }
  function scene(items, name, api) {
    return '<svg viewBox="0 0 300 240" role="img" aria-label="' + api.escape(name) + '. Nueve zonas, descritas en el texto desplegable."><path d="M0 0 H300 V240 H0 Z" fill="var(--paper)" /><path d="M0 0 H300 V85 H0 Z" fill="var(--sky)" opacity=".22" /><path d="M0 165 Q80 145 150 165 T300 155 V240 H0 Z" fill="var(--turquoise)" opacity=".15" />' + items.map((item, index) => '<g transform="translate(' + (50 + index % 3 * 100) + ' ' + (40 + Math.floor(index / 3) * 80) + ')" fill="var(--surface-solid)" stroke="var(--ink)" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round">' + drawing(item.kind, item.variant) + '</g>').join("") + '</svg>';
  }
  function focus(api) { const button = api.$("zones").querySelector("button:not(:disabled)"); if (button) button.focus(); }
  brand.createPuzzleGame({
    id: "differences", slug: "diferencias", engine, noun: "escenas", nextLabel: "Siguiente escena", focus,
    startMessage: "Compara las escenas A y B. Toca una zona de B donde veas un cambio.",
    build: function (api) {
      engine.zones.forEach((name, index) => {
        const button = document.createElement("button"); button.type = "button"; button.className = "difference-zone";
        button.addEventListener("click", () => {
          const result = api.run((game) => {
            const answer = engine.chooseZone(game, index);
            if (answer.accepted) api.message(answer.solved ? "¡Encontraste todos los cambios! Continúa cuando quieras." : answer.correct ? "¡Encontraste un cambio! Busca otro con calma." : "En esa zona no hay cambio. Sigue mirando o pide una pista.");
            return answer;
          });
          if (result && result.correct && !result.solved) focus(api);
        });
        api.$("zones").append(button);
      });
    },
    render: function (game, locked, api) {
      const round = game.rounds[game.currentRound];
      api.$("left").innerHTML = scene(round.left, "Escena A: " + round.name, api);
      api.$("right").innerHTML = scene(round.right, "Escena B: " + round.name, api);
      api.$("count").textContent = round.found.length + " de " + round.changes.length + " cambios encontrados";
      api.$("zones").querySelectorAll("button").forEach((button, index) => {
        const found = round.found.includes(index);
        button.disabled = locked || found;
        button.setAttribute("aria-label", "Zona " + (index + 1) + ": " + engine.zones[index] + (found ? ", cambio encontrado" : ", comparar"));
        button.classList.toggle("is-found", found);
        button.textContent = found ? "✓ " + (index + 1) : String(index + 1);
      });
      api.$("descriptions").innerHTML = round.left.map((item, index) => '<li><strong>Zona ' + (index + 1) + ' · ' + api.escape(engine.zones[index]) + '</strong><br>A: ' + api.escape(engine.descriptions[item.kind][item.variant]) + '. B: ' + api.escape(engine.descriptions[round.right[index].kind][round.right[index].variant]) + '.</li>').join("");
    },
    hint: function (game, api) {
      const hint = engine.useHint(game);
      if (hint) api.message("Pista: compara la zona " + (hint.index + 1) + ", " + engine.zones[hint.index].toLowerCase() + ", en las dos escenas.");
    }
  });
})();
