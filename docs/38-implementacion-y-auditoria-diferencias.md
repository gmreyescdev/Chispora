# Implementación y auditoría de Busca las diferencias

## Objetivo y experiencia

Comparar dos ilustraciones y encontrar cambios de forma o cantidad. Ejercita atención a los detalles sin presión de tiempo ni pérdida de intentos.

Tres escenas locales: jardín, playa y campamento. Cada escena tiene nueve zonas grandes. A es la referencia; los botones superpuestos de B permiten seleccionar una zona mediante mouse, tacto, Enter o Espacio sin exigir tocar un detalle diminuto.

Al encontrar un cambio se marca la zona con borde, número y signo de verificación. Una elección incorrecta invita a seguir observando; no elimina hallazgos ni bloquea nuevos intentos. Al encontrar todos los cambios el niño decide cuándo continuar.

## Dificultades

| Nivel | Escenas | Cambios por escena |
|---|---|---|
| Explorador | 2 | 3 |
| Aventurero | 2 | 4 |
| Maestro | 3 | 5 |

El tamaño de las zonas no disminuye al subir de nivel. Las escenas no se repiten dentro de una partida.

## Reglas y representaciones

- `lib/differences-engine.js` define escenas, objetos, variantes, zonas cambiadas y hallazgos sin DOM.
- Aleatoriedad inyectable para orden de escenas, elección de cambios y variantes iniciales.
- Las escenas A y B tienen exactamente el número de cambios configurado. Cada zona contiene un objeto o grupo; en zonas no cambiadas las variantes son iguales.
- Los cambios incluyen sol/luna, nube/pájaro/pez simple o doble, forma de cometa, copa de árbol, ventana, pétalos, postes, vela, concha, asa, entrada de tienda y bolsillos.
- No hay cambios únicamente de color. Las ilustraciones SVG de `differences-game.js` son propias y locales, sin imágenes externas ni rastreadores.
- No se cuentan dos veces zonas encontradas; las entradas inválidas y las posteriores a `feedback` o `complete` se rechazan.
- Una pista indica una zona pendiente sin marcarla automáticamente; puede repetirse.

## Accesibilidad y ciclo de partida

El desplegable **Leer descripción de las escenas** permite comparar el contenido A/B de cada zona sin depender de la visión. Es una alternativa válida, no una trampa ni un modo con menos recompensas. Puede hacer la actividad más sencilla, pero no se comparan resultados entre participantes.

Los botones tienen posición y estado en su nombre accesible; las descripciones no se incluyen en la etiqueta del botón cerrado para no revelar todas las respuestas involuntariamente. Se conservan foco, contraste y controles amplios desde 320 px.

`lib/puzzle-game.js` comparte únicamente el ciclo de partida y almacenamiento con Sudoku. Pausar oculta e inactiva escenas y descripciones, deteniendo la interacción. Salir cancela o confirma mediante diálogo; confirmar o navegar fuera limpia la partida.

No hay reloj, sonidos ni transiciones pendientes. Solo se guarda el progreso al completar todas las escenas. El resultado informa errores de escritura y nunca comienza otra partida por sí solo.

Tutorial de tres pasos, misión en Exploración, habilidad «Observación de detalles» y recursos incluidos en el caché completo.

## Pruebas deterministas

`tests/differences-engine.test.js` verifica creación, independencia de escenas y partidas, cantidad exacta y unicidad de cambios, coherencia entre variantes y descripciones, entradas inválidas, errores sin pérdida, bloqueo de hallazgos repetidos, pistas y finalización exacta.

Los tests compartidos de progreso, tutoriales y caché incluyen el juego y preservan los niveles anteriores.

## Explicación sencilla

Mira las escenas A y B. Toca en B el número donde algo cambió. Si dudas, usa una pista o lee qué hay en cada zona. No pierdes nada si te equivocas.

## Pendientes de validación

### Auditoría técnica del 3 de octubre de 2026

Suite completa: veinte archivos y 38 entradas TAP sin fallos; sintaxis correcta. En navegador se completaron las tres dificultades y se comprobaron errores, pistas, Espacio, pausa/Escape y salida cancelada/confirmada. Una escritura bloqueada informó el problema sin cambiar los datos guardados. A 320, 375, 768 y 1280 px, también con texto grande y alto contraste, no hubo desbordamiento horizontal y las zonas superaron 44 px. Lighthouse: 100 en accesibilidad, buenas prácticas y SEO. Recarga y hallazgo posibles con el servidor de auditoría detenido y los 46 recursos en caché. Detalle compartido en la bitácora del 3 de octubre.

### Validación pendiente

Observar si los números de las zonas resultan claros, si las diferencias se ven cómodamente en teléfonos y si las descripciones funcionan bien con lectores de pantalla reales. Sesiones infantiles específicas y hardware táctil real pendientes.
