(function () {
  "use strict";

  const DIFFICULTIES = {
    explorador: {
      id: "explorador", name: "Explorador", roundCount: 4, minWords: 35, maxWords: 55,
      description: "Información que aparece directamente en el texto",
      exercises: [
        {
          id: "explorador-huerto", title: "Una visita al huerto", type: "literal",
          paragraphs: ["El sábado, Inés visitó el huerto de su abuelo. Llevó una regadera azul y llenó con agua la tierra de los tomates. Antes de volver a casa, encontró una frutilla madura y su abuelo la guardó para la merienda."],
          question: "¿Qué plantas regó Inés?",
          options: [{ id: "tomates", text: "Los tomates" }, { id: "frutillas", text: "Las frutillas" }, { id: "arboles", text: "Los árboles" }],
          answerId: "tomates", hint: { paragraphIndex: 0, text: "Relee la oración que cuenta dónde usó la regadera." },
          explanation: "El texto dice que Inés llenó con agua la tierra de los tomates."
        },
        {
          id: "explorador-cometa", title: "La cometa amarilla", type: "literal",
          paragraphs: ["Tomás llevó su cometa amarilla al parque después de almorzar. Primero buscó un espacio sin árboles y luego soltó el hilo. El viento levantó la cometa muy alto, mientras su hermana Clara observaba desde una banca."],
          question: "¿Dónde hizo volar Tomás su cometa?",
          options: [{ id: "playa", text: "En la playa" }, { id: "parque", text: "En el parque" }, { id: "patio", text: "En el patio" }],
          answerId: "parque", hint: { paragraphIndex: 0, text: "Busca el lugar mencionado en la primera oración." },
          explanation: "La primera oración cuenta que Tomás llevó la cometa al parque."
        },
        {
          id: "explorador-biblioteca", title: "El libro de animales", type: "literal",
          paragraphs: ["En la biblioteca, Mila buscaba un libro sobre animales marinos. La bibliotecaria le mostró tres estantes y Mila eligió un libro de ballenas. Se sentó junto a la ventana para leerlo y anotó dos datos interesantes en su cuaderno."],
          question: "¿Sobre qué animal eligió un libro Mila?",
          options: [{ id: "delfines", text: "Delfines" }, { id: "ballenas", text: "Ballenas" }, { id: "pinguinos", text: "Pingüinos" }],
          answerId: "ballenas", hint: { paragraphIndex: 0, text: "Relee qué libro escogió después de mirar los estantes." },
          explanation: "El texto indica que Mila eligió un libro de ballenas."
        },
        {
          id: "explorador-lluvia", title: "Una tarde de lluvia", type: "literal",
          paragraphs: ["La lluvia comenzó cuando Leo regresaba de la escuela. Como llevaba botas, caminó con cuidado por las veredas mojadas. El aire estaba frío y las gotas golpeaban suavemente su paraguas rojo. Al llegar, dejó la mochila en su pieza y preparó chocolate caliente con su papá."],
          question: "¿Con quién preparó Leo chocolate caliente?",
          options: [{ id: "papa", text: "Con su papá" }, { id: "amiga", text: "Con una amiga" }, { id: "abuela", text: "Con su abuela" }],
          answerId: "papa", hint: { paragraphIndex: 0, text: "La respuesta está al final del relato." },
          explanation: "La última oración dice que Leo preparó chocolate caliente con su papá."
        },
        {
          id: "explorador-semillas", title: "Semillas para el balcón", type: "literal",
          paragraphs: ["Nora tenía tres sobres de semillas: albahaca, cilantro y caléndulas. Eligió las caléndulas para dar color al balcón. Puso tierra en una maceta, hizo pequeños agujeros y dejó las semillas cubiertas cerca de una ventana soleada."],
          question: "¿Qué semillas plantó Nora?",
          options: [{ id: "cilantro", text: "Cilantro" }, { id: "albahaca", text: "Albahaca" }, { id: "calendulas", text: "Caléndulas" }],
          answerId: "calendulas", hint: { paragraphIndex: 0, text: "Busca cuáles eligió para dar color al balcón." },
          explanation: "Nora eligió y plantó las semillas de caléndulas."
        }
      ]
    },
    aventurero: {
      id: "aventurero", name: "Aventurero", roundCount: 5, minWords: 60, maxWords: 85,
      description: "Secuencias, causas e inferencias directas",
      exercises: [
        {
          id: "aventurero-puente", title: "El puente de cartón", type: "cause",
          paragraphs: ["Amalia y Bruno construyeron un puente con tiras de cartón para la exposición de ciencias. En la primera prueba, el centro se dobló cuando pusieron encima un autito. Observaron el problema y pegaron dos tiras más debajo del puente. También esperaron unos minutos para que el pegamento secara completamente. En la segunda prueba, el autito cruzó sin hundirlo. Ambos anotaron el cambio para recordarlo."],
          question: "¿Por qué pegaron más tiras debajo del puente?",
          options: [{ id: "decorar", text: "Para decorarlo" }, { id: "reforzar", text: "Para reforzar la parte que se doblaba" }, { id: "alargar", text: "Para hacerlo más largo" }],
          answerId: "reforzar", hint: { paragraphIndex: 0, text: "Compara lo ocurrido en la primera y la segunda prueba." },
          explanation: "El centro se dobló en la primera prueba, así que las tiras nuevas sirvieron para reforzarlo."
        },
        {
          id: "aventurero-gorrion", title: "El gorrión del patio", type: "sequence",
          paragraphs: ["Un gorrión entró al patio cubierto de la escuela y no encontraba la salida. Volaba de una ventana a otra mientras todos lo observaban en silencio. Sara pidió a sus compañeros que se alejaran para no asustarlo. Después, abrió una puerta hacia el jardín y dejó unas migas cerca de ella. El ave se acercó poco a poco y finalmente salió volando entre los árboles."],
          question: "¿Qué hizo Sara antes de abrir la puerta?",
          options: [{ id: "migas", text: "Dejó migas junto a la puerta" }, { id: "alejar", text: "Pidió a sus compañeros que se alejaran" }, { id: "volar", text: "Salió volando entre los árboles" }],
          answerId: "alejar", hint: { paragraphIndex: 0, text: "Sigue el orden de las acciones desde que apareció el gorrión." },
          explanation: "Primero Sara pidió espacio a sus compañeros y después abrió la puerta."
        },
        {
          id: "aventurero-linterna", title: "La linterna apagada", type: "inference",
          paragraphs: ["Durante el campamento, Simón quiso usar su linterna, pero no encendió. El cielo ya estaba oscuro y necesitaba encontrar su cantimplora. Revisó el interruptor y vio que estaba en la posición correcta. Luego abrió la tapa y cambió las pilas por unas nuevas que guardaba en su mochila. Cuando volvió a presionar el botón, un círculo de luz apareció sobre la carpa."],
          question: "¿Qué causaba probablemente el problema de la linterna?",
          options: [{ id: "pilas", text: "Las pilas estaban gastadas" }, { id: "boton", text: "El botón había desaparecido" }, { id: "carpa", text: "La carpa bloqueaba la luz" }],
          answerId: "pilas", hint: { paragraphIndex: 0, text: "Observa qué cambio hizo Simón justo antes de que funcionara." },
          explanation: "La linterna encendió después de cambiar las pilas, por eso las anteriores probablemente estaban gastadas."
        },
        {
          id: "aventurero-pan", title: "Pan para compartir", type: "cause",
          paragraphs: ["El curso preparó panes pequeños para una convivencia y siguió con atención una receta. Al sacar la primera bandeja, notaron que algunos seguían pálidos y blandos. La profesora explicó que el horno había perdido calor porque la puerta se abrió muchas veces. Para la segunda bandeja, miraron por la ventana del horno y esperaron hasta que todos estuvieron dorados y olían deliciosos."],
          question: "¿Por qué la primera bandeja necesitó más cocción?",
          options: [{ id: "harina", text: "Porque faltaba harina" }, { id: "calor", text: "Porque el horno perdió calor" }, { id: "grandes", text: "Porque los panes eran demasiado grandes" }],
          answerId: "calor", hint: { paragraphIndex: 0, text: "Busca la explicación que dio la profesora." },
          explanation: "La profesora explicó que abrir muchas veces la puerta hizo que el horno perdiera calor."
        },
        {
          id: "aventurero-charco", title: "El camino sin charcos", type: "inference",
          paragraphs: ["Después de la lluvia, Elena salió a pasear con su perro y a comprar unas semillas. La vereda cercana al río estaba cubierta de charcos profundos. Elena miró sus zapatillas de tela y eligió la calle que pasaba por la plaza, aunque era un poco más larga. Bajo los árboles todavía caían algunas gotas. Llegó al almacén con los pies secos y el perro contento."],
          question: "¿Por qué Elena eligió el camino más largo?",
          options: [{ id: "perderse", text: "Quería perderse en la plaza" }, { id: "mojarse", text: "Quería evitar mojar sus zapatillas" }, { id: "correr", text: "Quería correr con su perro" }],
          answerId: "mojarse", hint: { paragraphIndex: 0, text: "Relaciona los charcos con el tipo de zapatillas que llevaba." },
          explanation: "La vereda tenía charcos y Elena llevaba zapatillas de tela, así que cambió de ruta para mantenerlas secas."
        },
        {
          id: "aventurero-mural", title: "Un mural para el pasillo", type: "sequence",
          paragraphs: ["Para crear un mural, el grupo comenzó dibujando varias ideas en hojas pequeñas. Querían representar un lugar que invitara a cuidar la naturaleza. Luego votaron por un paisaje con montañas y repartieron las tareas. Unos estudiantes trazaron el diseño sobre el papel grande, mientras otros mezclaron los colores. Al final, todos revisaron los bordes antes de colgar la obra en el pasillo principal."],
          question: "¿Qué ocurrió después de elegir el paisaje?",
          options: [{ id: "ideas", text: "Dibujaron las primeras ideas" }, { id: "tareas", text: "Repartieron las tareas" }, { id: "colgar", text: "Colgaron inmediatamente la obra" }],
          answerId: "tareas", hint: { paragraphIndex: 0, text: "Busca la acción que sigue a la votación." },
          explanation: "Después de votar por el paisaje, el grupo repartió las tareas."
        }
      ]
    },
    maestro: {
      id: "maestro", name: "Maestro lector", roundCount: 6, minWords: 90, maxWords: 120,
      description: "Inferencias, vocabulario por contexto e intención general",
      exercises: [
        {
          id: "maestro-reloj", title: "El reloj de la plaza", type: "inference",
          paragraphs: ["Cada tarde, el reloj de la plaza marcaba las cinco con una campanada clara. Un martes permaneció silencioso y varias personas levantaron la vista sorprendidas. La señora Julia, que reparaba objetos antiguos, subió a la torre con una caja de herramientas. Encontró una pequeña rueda cubierta de polvo, la limpió con cuidado y aplicó una gota de aceite.", "Al día siguiente, la campana volvió a sonar. Julia sonrió desde su taller cuando escuchó el sonido atravesar la ventana. No necesitó mirar el reloj para saber que su reparación había funcionado correctamente."],
          question: "¿Cómo supo Julia desde su taller que el reloj funcionaba?",
          options: [{ id: "campana", text: "Escuchó nuevamente la campana" }, { id: "visita", text: "Una persona fue a contárselo" }, { id: "herramientas", text: "Miró su caja de herramientas" }],
          answerId: "campana", hint: { paragraphIndex: 1, text: "Relee qué percibió Julia desde la ventana." },
          explanation: "Julia escuchó la campana desde su taller y ese sonido confirmó que el mecanismo volvía a funcionar."
        },
        {
          id: "maestro-invernadero", title: "El rincón más fresco", type: "vocabulary",
          paragraphs: ["En el invernadero escolar, casi todas las plantas crecían derechas y verdes. Sin embargo, los helechos de una esquina tenían las hojas caídas. Omar observó que ese lugar recibía sol durante toda la tarde y que la tierra se secaba con rapidez. Antes de hacer cambios, comparó esa esquina con otra zona más fresca. Movió las macetas bajo una malla que filtraba la luz y organizó turnos para revisar la humedad.", "Una semana después, las hojas nuevas aparecieron firmes. La profesora dijo que la recuperación era evidente y felicitó al grupo por observar antes de actuar."],
          question: "¿Qué significa “evidente” en la última oración?",
          options: [{ id: "clara", text: "Que se podía notar claramente" }, { id: "secreta", text: "Que estaba escondida" }, { id: "imposible", text: "Que no podía ocurrir" }],
          answerId: "clara", hint: { paragraphIndex: 1, text: "Relaciona la palabra con las hojas nuevas y firmes." },
          explanation: "Las hojas firmes permitían notar claramente la recuperación; por eso “evidente” significa visible o clara."
        },
        {
          id: "maestro-mapa", title: "El mapa incompleto", type: "inference",
          paragraphs: ["Valentina dibujó un mapa para que su primo encontrara la cancha del barrio. Marcó su casa, la panadería y una hilera de árboles, pero olvidó señalar hacia dónde estaba el norte. Su primo llegó a la panadería y luego tomó la calle contraria. Después de varios minutos, llamó para decir que veía una fuente redonda en medio de una plazoleta.", "Valentina comprendió dónde estaba porque conocía esa fuente. Le pidió regresar una cuadra y girar junto al quiosco. Esa tarde agregó una flecha de orientación y nombres claros a todas las calles."],
          question: "¿Qué aprendió Valentina al mejorar el mapa?",
          options: [{ id: "detalles", text: "Que un mapa necesita referencias y orientación claras" }, { id: "dibujos", text: "Que debía borrar todos los dibujos" }, { id: "telefono", text: "Que nadie debe usar un teléfono" }],
          answerId: "detalles", hint: { paragraphIndex: 1, text: "Observa qué elementos agregó después de la confusión." },
          explanation: "Agregó una flecha y nombres de calles porque comprendió que esas referencias ayudaban a seguir la ruta."
        },
        {
          id: "maestro-semilla", title: "La semilla paciente", type: "main-idea",
          paragraphs: ["Mateo plantó dos porotos en vasos transparentes. Puso uno junto a la ventana y guardó el otro dentro de un armario. Cada mañana humedecía ambos algodones con la misma cantidad de agua. Durante los primeros días no vio diferencias, pero decidió continuar con cuidado.", "Al sexto día, la semilla de la ventana tenía un brote verde y firme. La del armario había producido un tallo pálido que buscaba la rendija de luz. Mateo anotó sus observaciones y preparó una nueva prueba para descubrir si el segundo tallo cambiaba al acercarlo a la ventana."],
          question: "¿Cuál es la idea principal del relato?",
          options: [{ id: "observar", text: "Observar con paciencia permite descubrir cómo influye la luz" }, { id: "armario", text: "Los armarios son buenos lugares para todas las plantas" }, { id: "rapido", text: "Las semillas siempre crecen en un solo día" }],
          answerId: "observar", hint: { paragraphIndex: 1, text: "Piensa qué comparó Mateo y qué decidió investigar después." },
          explanation: "Mateo cuidó, comparó y registró ambas semillas para comprender el efecto de la luz."
        },
        {
          id: "maestro-orquesta", title: "Ensayo en la cocina", type: "inference",
          paragraphs: ["Camila debía crear sonidos para una obra escolar, pero no tenía instrumentos en casa. Recorrió la cocina y probó golpear suavemente una caja, agitar arroz dentro de un frasco y rozar dos cucharas de madera. Escuchó cada efecto varias veces y anotó qué sonido podía representar la lluvia, los pasos y una puerta antigua.", "En el ensayo, sus compañeros cerraron los ojos mientras ella acompañaba la historia. Al terminar, identificaron cada escena sin mirar. Camila reemplazó solamente el sonido de la puerta, porque las cucharas se parecían demasiado a los pasos."],
          question: "¿Qué demuestra que los sonidos funcionaron bien en el ensayo?",
          options: [{ id: "escenas", text: "Los compañeros reconocieron las escenas sin mirar" }, { id: "instrumentos", text: "Camila compró instrumentos nuevos" }, { id: "silencio", text: "Nadie pudo escuchar la historia" }],
          answerId: "escenas", hint: { paragraphIndex: 1, text: "Busca cómo reaccionaron sus compañeros con los ojos cerrados." },
          explanation: "Reconocer cada escena solo por el sonido mostró que la mayoría de los efectos comunicaba bien la historia."
        },
        {
          id: "maestro-laguna", title: "Noticias de la laguna", type: "purpose",
          paragraphs: ["Un grupo visitó la laguna cercana y encontró varias botellas vacías entre los juncos. En vez de recogerlas sin más, contaron los residuos y tomaron notas sobre los lugares donde se acumulaban con mayor frecuencia. Luego limpiaron el sector con ayuda de adultos y separaron el material reciclable.", "De regreso, prepararon un cartel con dibujos, cantidades y recomendaciones para reducir la basura. Lo instalaron en la entrada del sendero y entregaron una copia a la junta vecinal. Querían que otras personas entendieran el problema y ayudaran a mantener limpia la laguna durante todo el año."],
          question: "¿Para qué incluyeron cantidades y recomendaciones en el cartel?",
          options: [{ id: "informar", text: "Para informar y animar a cuidar la laguna" }, { id: "competir", text: "Para ganar una competencia de dibujo" }, { id: "ocultar", text: "Para ocultar dónde encontraron basura" }],
          answerId: "informar", hint: { paragraphIndex: 1, text: "Relee qué querían lograr con otras personas." },
          explanation: "El cartel mostraba el problema y proponía acciones para que más personas ayudaran a cuidar el lugar."
        },
        {
          id: "maestro-sombra", title: "La sombra del mediodía", type: "vocabulary",
          paragraphs: ["Durante una semana, Ana dibujó la sombra de un poste a distintas horas. Por la mañana era larga y apuntaba hacia un extremo del patio. Cerca del mediodía se volvía corta, y por la tarde crecía hacia el lado contrario. Ana usó siempre el mismo poste y marcó la hora junto a cada línea.", "Al comparar sus dibujos, encontró un patrón constante. Aunque algunas nubes interrumpieron una observación, las demás mediciones coincidían. En su informe escribió que los resultados eran consistentes y que repetiría la actividad en invierno para compararlos."],
          question: "¿Qué significa “consistentes” en este informe?",
          options: [{ id: "coinciden", text: "Que mantienen un patrón y coinciden" }, { id: "borrados", text: "Que fueron borrados por las nubes" }, { id: "distintos", text: "Que no tienen ninguna relación" }],
          answerId: "coinciden", hint: { paragraphIndex: 1, text: "La oración anterior menciona un patrón en las mediciones." },
          explanation: "Los resultados eran consistentes porque las mediciones repetían un patrón y coincidían entre sí."
        }
      ]
    }
  };

  function shuffle(items, random) {
    const result = items.slice();
    for (let index = result.length - 1; index > 0; index -= 1) {
      const target = Math.floor(random() * (index + 1));
      const temporary = result[index]; result[index] = result[target]; result[target] = temporary;
    }
    return result;
  }

  function cloneExercise(exercise, random) {
    return {
      id: exercise.id,
      title: exercise.title,
      type: exercise.type,
      paragraphs: exercise.paragraphs.slice(),
      question: exercise.question,
      options: shuffle(exercise.options, random).map((option) => ({ id: option.id, text: option.text })),
      answerId: exercise.answerId,
      hint: { paragraphIndex: exercise.hint.paragraphIndex, text: exercise.hint.text },
      explanation: exercise.explanation
    };
  }

  function createGame(difficulty, random) {
    const config = DIFFICULTIES[difficulty] || DIFFICULTIES.explorador;
    const randomValue = typeof random === "function" ? random : Math.random;
    const selected = shuffle(config.exercises, randomValue).slice(0, config.roundCount);
    return {
      difficulty: config.id,
      roundCount: config.roundCount,
      rounds: selected.map((exercise) => cloneExercise(exercise, randomValue)),
      currentRound: 0,
      correctAnswers: 0,
      extraAttempts: 0,
      hintsUsed: 0,
      rejectedOptionIds: [],
      hintedRounds: [],
      lastCorrect: false,
      status: "playing"
    };
  }

  function submitAnswer(game, optionId) {
    if (game.status !== "playing") return { accepted: false, reason: "locked" };
    const round = game.rounds[game.currentRound];
    if (!round.options.some((option) => option.id === optionId)) return { accepted: false, reason: "invalid" };
    if (game.rejectedOptionIds.includes(optionId)) return { accepted: false, reason: "rejected" };
    game.lastCorrect = optionId === round.answerId;
    game.status = "feedback";
    if (game.lastCorrect) game.correctAnswers += 1;
    else {
      game.extraAttempts += 1;
      game.rejectedOptionIds.push(optionId);
    }
    return {
      accepted: true,
      correct: game.lastCorrect,
      finalRound: game.lastCorrect && game.currentRound === game.roundCount - 1,
      explanation: game.lastCorrect ? round.explanation : ""
    };
  }

  function useHint(game) {
    if (game.status !== "playing") return null;
    if (!game.hintedRounds.includes(game.currentRound)) {
      game.hintedRounds.push(game.currentRound);
      game.hintsUsed += 1;
    }
    return game.rounds[game.currentRound].hint;
  }

  function continueGame(game) {
    if (game.status !== "feedback") return { continued: false };
    if (game.lastCorrect && game.currentRound === game.roundCount - 1) {
      game.status = "complete";
      return { continued: true, complete: true };
    }
    if (game.lastCorrect) {
      game.currentRound += 1;
      game.rejectedOptionIds = [];
    }
    game.status = "playing";
    return { continued: true, complete: false };
  }

  window.__BRAND__ = window.__BRAND__ || {};
  window.__BRAND__.readingEngine = {
    difficulties: DIFFICULTIES,
    createGame: createGame,
    submitAnswer: submitAnswer,
    useHint: useHint,
    continueGame: continueGame
  };
})();
