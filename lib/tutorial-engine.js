(function () {
  "use strict";

  const TUTORIALS = {
    memory: { name: "Memorama", steps: [
      { title: "Mira las cartas", text: "Primero verás todas las figuras durante unos segundos.", visual: "◇  ○  △" },
      { title: "Elige dos", text: "Toca dos cartas para comprobar si tienen la misma figura.", visual: "□  +  □" },
      { title: "Encuentra las parejas", text: "Recuerda sus lugares hasta reunir todas las parejas.", visual: "◇  ◇" }
    ] },
    operation: { name: "Operación misteriosa", steps: [
      { title: "Mira el cálculo", text: "Observa los números y el resultado.", visual: "4  ?  3  =  7" },
      { title: "Elige un signo", text: "Prueba suma, resta o multiplicación según el nivel.", visual: "+  −  ×" },
      { title: "Corrige si hace falta", text: "Si no coincide, intenta con otro signo.", visual: "4 + 3 = 7" }
    ] },
    word: { name: "Palabra desordenada", steps: [
      { title: "Observa las letras", text: "Las letras aparecen mezcladas.", visual: "S  O  L" },
      { title: "Tócalas en orden", text: "Construye la palabra de izquierda a derecha.", visual: "S → O → L" },
      { title: "Usa las ayudas", text: "Puedes quitar la última letra, limpiar o pedir una pista.", visual: "↶  ·  Pista" }
    ] },
    sequence: { name: "Secuencia lógica", steps: [
      { title: "Observa el patrón", text: "Mira cómo cambian los números o figuras.", visual: "2  4  6  ?" },
      { title: "Descubre la regla", text: "Pregunta qué se repite o cuánto aumenta.", visual: "+2  +2  +2" },
      { title: "Elige qué sigue", text: "Toca la opción que continúa la misma regla.", visual: "8" }
    ] },
    maze: { name: "Laberintos", steps: [
      { title: "Busca la estrella", text: "El punto azul debe llegar hasta la meta.", visual: "●  →  ★" },
      { title: "Usa las flechas", text: "Muévete arriba, abajo, a la izquierda o a la derecha.", visual: "←  ↑  ↓  →" },
      { title: "Prueba otro camino", text: "Una pared solo detiene ese movimiento; puedes continuar.", visual: "●  ║  ↗" }
    ] },
    reading: { name: "Comprensión lectora", steps: [
      { title: "Lee con calma", text: "Puedes releer el relato todas las veces que quieras.", visual: "Lee  ↻" },
      { title: "Busca una pista", text: "Encuentra en el texto la parte relacionada con la pregunta.", visual: "Texto  →  Pista" },
      { title: "Elige una respuesta", text: "Si dudas, usa la pista y vuelve al relato.", visual: "A  B  C" }
    ] },
    fraction: { name: "Fracciones en acción", steps: [
      { title: "Cuenta las partes", text: "Mira cuántas partes iguales tiene el modelo.", visual: "▮  ▯  ▯  ▯" },
      { title: "Cuenta las coloreadas", text: "El número de partes coloreadas va arriba.", visual: "1 de 4" },
      { title: "Elige la fracción", text: "Compara el modelo con las opciones.", visual: "1/4" }
    ] },
    robot: { name: "Programa al robot", steps: [
      { title: "Planea la ruta", text: "Busca un camino desde el robot hasta la estrella.", visual: "🤖  ·  ★" },
      { title: "Agrega flechas", text: "Ordena los movimientos que debe seguir el robot.", visual: "↑  →  →" },
      { title: "Ejecuta y corrige", text: "Prueba el programa. Si choca, cambia las flechas.", visual: "▶  ↶" }
    ] },
    clock: { name: "Reloj de aventuras", steps: [
      { title: "Mira la manecilla larga", text: "Indica los minutos. Cada número representa cinco minutos.", visual: "3 = 15 min" },
      { title: "Mira la manecilla corta", text: "Indica la hora y avanza poco a poco.", visual: "Hora  →  4" },
      { title: "Compara con las opciones", text: "Une la hora y los minutos antes de responder.", visual: "4:15" }
    ] },
    sudoku: { name: "Sudoku de figuras", steps: [
      { title: "Elige una casilla vacía", text: "Las figuras que ya están en el tablero son tus pistas.", visual: "○  ·  □  ☆" },
      { title: "Mira fila, columna y cuadro", text: "Cada grupo debe tener las cuatro figuras sin repetir.", visual: "○  △  □  ☆" },
      { title: "Elige la figura que falta", text: "Si no encaja, puedes probar otra o pedir una pista.", visual: "Casilla → Figura" }
    ] },
    differences: { name: "Busca las diferencias", steps: [
      { title: "Compara A y B", text: "Mira las formas y cuenta los objetos en las dos escenas.", visual: "A  ↔  B" },
      { title: "Elige una zona de B", text: "Toca el número donde veas un cambio. Las zonas son amplias.", visual: "Zona 1  ✓" },
      { title: "Busca con calma", text: "Puedes pedir una pista o leer las descripciones. No hay reloj.", visual: "Mirar  ·  Pista" }
    ] },
    tangram: { name: "Tangram", steps: [
      { title: "Elige una pieza", text: "Mira las siete piezas y toca la que quieras colocar.", visual: "△  □  ▱" },
      { title: "Gira o voltea", text: "Usa los botones para que coincida con un espacio. Puedes pedir una pista.", visual: "↻  ·  Pista" },
      { title: "Elige un espacio", text: "Toca su número. Si no encaja, puedes seguir probando sin perder piezas.", visual: "Pieza → Espacio 1" }
    ] },
    science: { name: "Laboratorio curioso", steps: [
      { title: "Lee las notas", text: "La observación contiene la información necesaria.", visual: "Observar  👀" },
      { title: "Busca la evidencia", text: "Fíjate qué cambió y qué resultado se obtuvo.", visual: "Cambio  →  Resultado" },
      { title: "Elige una conclusión", text: "Escoge la respuesta apoyada por las notas.", visual: "Notas  →  Idea" }
    ] }
  };

  function createTutorial(gameId) {
    if (!Object.prototype.hasOwnProperty.call(TUTORIALS, gameId)) return null;
    return { gameId: gameId, currentStep: 0, stepCount: TUTORIALS[gameId].steps.length, complete: false };
  }

  function current(tutorial) {
    if (!tutorial || !TUTORIALS[tutorial.gameId]) return null;
    const content = TUTORIALS[tutorial.gameId];
    return { name: content.name, step: content.steps[tutorial.currentStep], position: tutorial.currentStep + 1, total: tutorial.stepCount };
  }

  function next(tutorial) {
    if (!tutorial || tutorial.complete) return { moved: false, complete: Boolean(tutorial && tutorial.complete) };
    if (tutorial.currentStep === tutorial.stepCount - 1) { tutorial.complete = true; return { moved: false, complete: true }; }
    tutorial.currentStep += 1;
    return { moved: true, complete: false };
  }

  function previous(tutorial) {
    if (!tutorial || tutorial.complete || tutorial.currentStep === 0) return false;
    tutorial.currentStep -= 1;
    return true;
  }

  window.__BRAND__ = window.__BRAND__ || {};
  window.__BRAND__.tutorialEngine = { tutorials: TUTORIALS, createTutorial: createTutorial, current: current, next: next, previous: previous };
})();
