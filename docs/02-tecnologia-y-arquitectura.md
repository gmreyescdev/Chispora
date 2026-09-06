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

## Estructura prevista

```text
WebDidactico/
├── index.html
├── juegos/
├── assets/
│   ├── audio/
│   ├── iconos/
│   └── imagenes/
├── css/
├── js/
│   ├── juegos/
│   └── componentes/
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

