# Implementación y auditoría de Sudoku de figuras

## Objetivo y experiencia

Completar un tablero de 4 × 4 sin repetir círculo, triángulo, cuadrado ni estrella en cada fila, columna y cuadro de 2 × 2. Refuerza la deducción lógica sin depender de cálculo ni velocidad.

El niño selecciona una casilla vacía y después una figura. Las pistas iniciales no se modifican. Una respuesta correcta queda colocada; una incorrecta mantiene la casilla vacía y permite seguir probando. No existe límite de intentos ni clasificación por errores.

Es una versión guiada, no un editor libre: comprueba la solución única inmediatamente. Si la figura entra en conflicto con una pista se explica la repetición; si requiere deducción más amplia se invita a revisar los otros cuadros o pedir ayuda.

## Dificultades

| Nivel | Tableros | Casillas vacías por tablero |
|---|---|---|
| Explorador | 2 | 4 |
| Aventurero | 2 | 7 |
| Maestro | 3 | 9 |

Los tres niveles usan el mismo tamaño de tablero. La dificultad cambia por las pistas disponibles, no por controles más pequeños ni por un reloj.

## Generación y reglas

- Motor puro `lib/sudoku-engine.js`, con aleatoriedad inyectable.
- Parte de una solución válida y una máscara de eliminación anidada con solución única. Permuta figuras, bandas, filas, columnas y grupos de columnas conservando validez y unicidad.
- Un contador de soluciones por búsqueda verifica la unicidad en pruebas; no se improvisan máscaras sin comprobar.
- La selección solo acepta índices enteros de casillas vacías. Las entradas son figuras 1–4.
- La pista comunica la figura de la casilla seleccionada sin colocarla. Pedirla repetidamente no aumenta el contador de pistas para esa casilla.
- El último acierto produce `feedback`; solo **Siguiente tablero** o **Ver resultado** permite avanzar.

## Interfaz e integración

- `sudoku-game.js` representa las figuras mediante SVG locales, de tamaño comparable, sin depender de fuentes para su apariencia.
- Casillas y paleta son botones nativos con nombres de fila, columna y figura. Enter/Espacio seleccionan y las flechas desplazan el foco entre casillas vacías sin envolver filas.
- Fila, columna y cuadro relacionados con la selección se señalan mediante bordes; las guías no dependen solo del color.
- `lib/puzzle-game.js` comparte únicamente inicio, pausa, salida, resultado y persistencia con Diferencias. No modifica `main.js`.
- Pausa oculta e inactiva el tablero; Escape reanuda. Salir cancelando conserva la partida y confirmar limpia el estado temporal.
- No hay sonido, cronómetro ni transiciones del juego pendientes.
- Tutorial de tres pasos, misión en Lógica y habilidad «Deducción lógica».
- Guarda el nivel en `chispora.mvp.v1` solo al completar todos los tableros; una escritura fallida se informa sin modificar avances anteriores.
- Incluido en el caché completo y en la constelación de 39 niveles, conservando los 33 anteriores.

## Pruebas deterministas

`tests/sudoku-engine.test.js` comprueba tres dificultades con treinta semillas por nivel y una función aleatoria constante. Verifica cantidad de casillas, filas, columnas, cuadros, unicidad, aislamiento de entradas del solver, entradas inválidas, pistas iniciales, errores sin avance, pistas repetibles, bloqueo y finalización exacta.

Los tests compartidos de progreso comprueban migración de estados de 30 y 33 niveles. Los de tutoriales y service worker incluyen ambos juegos nuevos.

## Explicación sencilla

Busca qué figura falta en una casilla. Si dudas, mira también su fila, columna y cuadro. La pista te ayuda, pero tú eliges la figura. Guardamos una chispa cuando terminas la partida completa.

## Pendientes de validación

### Auditoría técnica del 3 de octubre de 2026

Suite completa: veinte archivos y 38 entradas TAP sin fallos; sintaxis correcta. En navegador se completaron las tres dificultades y se comprobaron corrección, pistas, teclado, pausa/Escape y salida cancelada/confirmada. El guardado conservó perfil, ajustes y avances anteriores. A 320, 375, 768 y 1280 px, también con texto grande y alto contraste, no hubo desbordamiento horizontal. Lighthouse: 100 en accesibilidad, buenas prácticas y SEO. Caché de 46 recursos: recarga y acierto posibles con el servidor detenido. Detalle compartido en la bitácora del 3 de octubre.

### Validación pendiente

Observar con niños si comprenden el cuadro de 2 × 2 y si la comprobación inmediata les ayuda. Probar en dispositivos táctiles reales y mantener la síntesis supervisada pendiente antes de la beta.
