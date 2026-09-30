# Especificación de Comprensión lectora

## Objetivo del incremento

Construir el sexto juego del catálogo inicial de Chispora. El jugador leerá relatos breves, responderá una pregunta por texto y recibirá una explicación que le ayude a relacionar la respuesta con lo leído.

La actividad está dirigida inicialmente a niños de 7 a 9 años. Debe valorar la comprensión y la relectura, no la velocidad.

## Habilidad educativa

El juego practicará cuatro habilidades graduales:

1. Localizar información explícita.
2. Ordenar hechos y reconocer relaciones de causa y efecto.
3. Inferir información sencilla a partir de pistas del texto.
4. Comprender palabras por contexto e identificar la intención general de un relato.

Las preguntas no deben depender de conocimientos externos ni utilizar respuestas engañosas. Cada pregunta tendrá una única respuesta claramente justificable mediante el texto.

## Experiencia del jugador

1. Elige una dificultad.
2. Lee un texto breve presentado con tipografía cómoda y párrafos cortos.
3. Lee una pregunta y elige entre tres respuestas.
4. Si se equivoca, recibe un mensaje amable, puede releer y vuelve a intentarlo.
5. Puede solicitar una pista que señala el párrafo relevante sin entregar directamente la respuesta.
6. Al acertar, ve una explicación breve antes de continuar.
7. Al resolver todos los textos, recibe un resumen y puede volver al mapa o terminar la sesión.

No habrá cuenta regresiva, pérdida de puntos ni avance automático después de una respuesta incorrecta.

## Niveles de dificultad

| Nivel | Textos por partida | Extensión aproximada | Habilidades principales |
|---|---:|---:|---|
| Explorador | 4 | 35 a 55 palabras | Información explícita: quién, qué y dónde. |
| Aventurero | 5 | 60 a 85 palabras | Secuencia, causa y efecto e inferencias directas. |
| Maestro lector | 6 | 90 a 120 palabras | Inferencia, vocabulario por contexto e intención general. |

Cada nivel tendrá un banco inicial mayor que la cantidad utilizada en una partida. Los textos y las respuestas se presentarán en orden aleatorio, evitando repetir un texto dentro de la misma sesión.

## Modelo de contenido

Cada ejercicio tendrá esta estructura conceptual:

```text
ejercicio
├── id
├── titulo
├── parrafos[]
├── tipoPregunta
├── pregunta
├── opciones[]
│   ├── id
│   └── texto
├── respuestaId
├── pista
│   ├── parrafoIndice
│   └── texto
└── explicacion
```

Los identificadores permiten comprobar respuestas sin comparar el texto visible. La pista señalará dónde releer y la explicación mostrará qué parte del relato permite responder.

## Reglas del motor

- `createGame(difficulty, random)` crea una partida y permite inyectar una función aleatoria para las pruebas.
- Solo acepta una opción perteneciente al ejercicio actual.
- Durante la retroalimentación no acepta nuevas respuestas.
- Una opción incorrecta queda descartada durante ese ejercicio.
- Un error aumenta los intentos extra, pero no resta puntos ni cambia de texto.
- La pista puede usarse una vez por ejercicio y se registra únicamente como apoyo utilizado.
- Una respuesta correcta aumenta los textos comprendidos y habilita el avance.
- El juego termina exactamente después de resolver el último ejercicio.
- El motor no depende del DOM, `localStorage`, audio ni temporizadores.

## Estado previsto de una partida

```text
game
├── difficulty
├── rounds[]
├── currentRound
├── roundCount
├── correctAnswers
├── extraAttempts
├── hintsUsed
├── rejectedOptionIds[]
├── hintedRounds[]
├── lastCorrect
└── status
```

Los estados serán `playing`, `feedback` y `complete`.

## Interfaz prevista

Se agregarán tres pantallas:

- `introduccion-lectura`: habilidad, selector de dificultad y resumen del nivel.
- `partida-lectura`: título, texto, pregunta, respuestas, pista, avance, pausa y salida.
- `resultado-lectura`: textos comprendidos, intentos extra, pistas utilizadas, nivel y tiempo total.

También se añadirá una tarjeta activa al mapa de misiones y diálogos propios de pausa y salida.

El texto deberá:

- Utilizar un ancho de lectura moderado.
- Tener interlineado amplio y párrafos visualmente separados.
- Conservar tamaño legible en pantallas pequeñas.
- Permitir seleccionar texto sin activar respuestas accidentalmente.
- No depender del color para identificar pista, error o acierto.

Cuando se muestre una pista, el párrafo relevante tendrá énfasis visual y una explicación textual accesible. El foco regresará a una zona lógica después de cada cambio de ejercicio.

## Cronómetro, pausa y sonido

- El cronómetro muestra la duración para mantener coherencia con los demás juegos, pero el tiempo no se interpreta como velocidad lectora ni determina el éxito.
- La pausa detiene el reloj y cualquier transición pendiente.
- El texto permanece oculto detrás del diálogo de pausa para que el descanso sea real.
- Los sonidos de selección, acierto y final respetan la configuración familiar.
- El juego debe funcionar completamente con el sonido desactivado.

## Progreso local

Al completar una partida se guardará:

```text
progress.reading
├── completedByDifficulty
├── bestExtraAttempts
├── bestHints
└── totalTextsCompleted
```

El tiempo puede mostrarse en el resultado de la sesión, pero no se guardará como “mejor tiempo”. Leer más rápido no se presentará como un logro educativo.

No se guardarán textos seleccionados, respuestas individuales ni errores concretos del niño. Una partida abandonada no modificará el progreso.

## Criterios de contenido

- Español claro y natural, comprensible en Chile y otros países hispanohablantes.
- Situaciones cotidianas, naturaleza, creatividad, colaboración y curiosidad.
- Personajes y contextos variados sin estereotipos discriminatorios.
- Sin violencia, publicidad, compras, miedo intenso ni solicitudes de información personal.
- Oraciones y vocabulario adecuados al nivel, sin infantilizar excesivamente.
- Distractores plausibles pero inequívocamente incorrectos según el texto.
- Explicaciones breves que citen o parafraseen la evidencia relevante.

El banco inicial debe revisarse manualmente por un adulto y, antes de una beta pública, mediante una sesión supervisada con niños del rango previsto.

## Criterios de aceptación funcionales

- Las tres dificultades generan la cantidad prevista de ejercicios sin repeticiones.
- El orden de ejercicios y opciones cambia entre partidas.
- Clic, toque y teclado permiten seleccionar cualquier respuesta.
- No se aceptan opciones inválidas, descartadas o enviadas durante el bloqueo.
- Una respuesta incorrecta permite releer y reintentar el mismo ejercicio.
- La pista se muestra una sola vez por ejercicio y no revela directamente la respuesta.
- Una respuesta correcta presenta una explicación y permite avanzar.
- La partida finaliza exactamente al resolver el último texto.
- Pausa y salida conservan un estado coherente.
- Una partida incompleta no guarda progreso.
- El resultado y el progreso se guardan una sola vez al completar la sesión.
- Los datos antiguos de `localStorage` continúan funcionando.

## Pruebas automáticas mínimas

`tests/reading-engine.test.js` deberá comprobar:

1. Cantidad, extensión y tipos de ejercicios por dificultad.
2. Ausencia de ejercicios repetidos en una partida.
3. Presencia de la respuesta correcta entre las opciones.
4. Rechazo de opciones inválidas y entradas durante el bloqueo.
5. Descarte de una respuesta incorrecta sin avanzar.
6. Uso único de la pista por ejercicio.
7. Avance únicamente después de una respuesta correcta.
8. Limpieza de descartes al cambiar de ejercicio.
9. Finalización exacta después del último ejercicio.

## Archivos previstos

- `lib/reading-engine.js`: banco, selección, respuestas, pistas y finalización.
- `reading-game.js`: interfaz, tiempo, pausa, sonido y progreso.
- `tests/reading-engine.test.js`: reglas automáticas.
- `index.html`: tarjeta, introducción, partida, resultado y diálogos.
- `styles.css`: texto, preguntas, opciones, pista y adaptación móvil.
- `docs/22-implementacion-y-auditoria-comprension-lectora.md`: resultado y verificación del incremento terminado.

## Fuera de alcance inicial

- Lectura en voz alta mediante voces sintéticas o grabaciones.
- Preguntas abiertas corregidas automáticamente.
- Generación de textos con servicios externos.
- Adaptación automática basada en perfiles del niño.
- Envío de respuestas o estadísticas a un servidor.

Estas funciones solo se evaluarán después de validar la experiencia básica y sus implicaciones de accesibilidad y privacidad.

## Definición de terminado

Comprensión lectora estará terminada cuando el motor y la interfaz cumplan los criterios anteriores, todas las suites automáticas pasen, el flujo completo se audite en navegador y móvil, la consola permanezca limpia y un adulto revise la claridad de todos los textos, preguntas y explicaciones.
