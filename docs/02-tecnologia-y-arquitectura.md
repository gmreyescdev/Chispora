# Tecnología y arquitectura

## Enfoque inicial

La primera versión será una aplicación web estática. Esto reduce costos, facilita la publicación y permite validar los juegos antes de construir cuentas, pagos o infraestructura compleja.

## Tecnologías propuestas para el MVP

- **HTML5:** estructura, contenido y elementos semánticos.
- **CSS3:** diseño adaptable para computador, tableta y teléfono.
- **JavaScript sin frameworks:** lógica de los juegos y navegación.
- **Canvas o SVG:** laberintos, tableros y elementos interactivos cuando sea necesario.
- **Web Audio API:** sonidos opcionales y controlados, sin reproducción automática molesta.
- **localStorage:** guardar progreso únicamente en el dispositivo durante la primera etapa.
- **PWA más adelante:** instalación opcional y funcionamiento sin conexión.

## Estado técnico actual

El prototipo actual utiliza:

- `index.html` para las pantallas y todo el contenido esencial.
- `styles.css` para identidad, componentes y adaptación a distintos tamaños.
- `main.js` para navegación, formularios, almacenamiento y los tres primeros juegos.
- `sequence-game.js`, `maze-game.js` y `reading-game.js` para aislar la interfaz de los incrementos más recientes.
- Motores independientes en `lib/*-engine.js` para separar reglas comprobables de la interfaz.
- `lib/reading-engine.js` contiene el banco local y las reglas probadas de Comprensión lectora.
- `lib/progress-engine.js` deriva el resumen de habilidades sin modificar el estado guardado.
- `progress-summary.js` representa recompensas y mantiene sincronizadas sus vistas.
- `fraction-game.js` y `robot-game.js` aíslan las interfaces de los juegos séptimo y octavo.
- `lib/fraction-engine.js` y `lib/robot-engine.js` contienen modelos, comandos y reglas comprobables.
- `clock-game.js` y `science-game.js` representan las interfaces específicas de los juegos noveno y décimo.
- `lib/clock-engine.js` y `lib/science-engine.js` contienen los bancos y reglas educativas probadas.
- `tangram-game.js` ofrece selección, giro, volteo, colocación y pausa mediante controles nativos; `lib/tangram-engine.js` valida geometría, simetrías y finalización sin DOM.
- `lib/choice-game.js` reutiliza el flujo de opciones, pausa, salida y progreso sin mezclar reglas de contenido.
- `lib/mission-map-engine.js` define las áreas y reglas puras del filtro; `mission-map.js` actualiza el mapa sin modificar progreso.
- `lib/tutorial-engine.js` contiene las guías y su avance; `tutorials.js` reutiliza un diálogo y registra únicamente tutoriales completados.
- `lib/accessibility-engine.js` normaliza las preferencias visuales; `main.js` las aplica mediante atributos en el documento sin alterar los juegos.
- `app.webmanifest`, `sw.js`, `lib/pwa-engine.js` y `pwa.js` permiten instalación opcional, caché completo y actualización controlada.
- `lib/manifest.js` como configuración central de marca y valores iniciales.
- GSAP como mejora visual opcional para transiciones.
- `localStorage` para perfil y ajustes del navegador.
- Enlace externo voluntario a Google Forms solo en el panel familiar; sus respuestas se guardan en Google Sheets, no en la aplicación. No se cargan scripts ni marcos de Google en Chispora.

No utiliza frameworks, compilación, servidor de aplicaciones ni base de datos. La carpeta de librerías conserva Lenis como recurso disponible del kit, pero `index.html` no lo carga ni lo ejecuta.

## Estructura prevista

```text
WebDidactico/
├── index.html
├── styles.css
├── main.js
├── pwa.js
├── sw.js
├── app.webmanifest
├── .htaccess
├── assets/
│   ├── brand/
│   ├── icons/
│   ├── img/
│   └── photos/source/
├── lib/
│   ├── manifest.js
│   ├── memory-engine.js
│   ├── operation-engine.js
│   ├── word-engine.js
│   ├── sequence-engine.js
│   ├── maze-engine.js
│   ├── reading-engine.js
│   ├── progress-engine.js
│   ├── fraction-engine.js
│   ├── robot-engine.js
│   ├── clock-engine.js
│   ├── science-engine.js
│   ├── choice-game.js
│   ├── mission-map-engine.js
│   ├── tutorial-engine.js
│   ├── accessibility-engine.js
│   ├── pwa-engine.js
│   ├── gsap.min.js
│   └── ScrollTrigger.min.js
├── docs/
└── tests/
```

## Evolución futura

Si el producto demuestra uso real, se podrá incorporar:

- Backend para sincronizar progreso entre dispositivos.
- Cuenta exclusiva para adultos y perfiles infantiles asociados.
- Base de datos con progreso seudonimizado.
- Panel para familias o docentes.
- Suscripciones y pagos administrados por el adulto.
- Sistema editorial para agregar ejercicios sin modificar código.

La elección del backend se realizará cuando existan requisitos concretos. Evitarlo inicialmente impide pagar y mantener infraestructura innecesaria.

## Calidad y seguridad

- El contenido esencial funcionará sin depender de animaciones.
- No se cargarán anuncios, rastreadores ni recursos de terceros en el área infantil.
- Se probará navegación táctil, teclado y tamaños de pantalla habituales.
- Los juegos tendrán pruebas de reglas, puntuación y niveles.
- No se solicitarán nombre completo, fotografía, ubicación, escuela ni fecha de nacimiento exacta.
