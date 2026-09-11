# Implementación y auditoría de Laberintos

## Resultado

Laberintos es un juego completo de orientación espacial y planificación. El jugador guía un punto azul desde la esquina superior izquierda hasta una estrella situada en la esquina inferior derecha.

## Qué ve el jugador

- Un laberinto generado localmente para cada ronda.
- Un punto azul que representa su posición y una estrella que indica la meta.
- Botones grandes para moverse arriba, abajo, a la izquierda y a la derecha.
- Mensajes amables cuando intenta atravesar una pared o alcanza la meta.
- Movimiento, tiempo, pausa, salida y resultado final.

También puede usar las cuatro flechas del teclado. Los controles táctiles permanecen visibles para que la actividad funcione sin teclado.

## Niveles

| Nivel | Laberintos por partida | Tamaño |
|---|---:|---:|
| Explorador | 2 | 5 × 5 casillas |
| Aventurero | 2 | 7 × 7 casillas |
| Maestro del laberinto | 2 | 9 × 9 casillas |

## Cómo funciona

`lib/maze-engine.js` genera laberintos perfectos mediante una búsqueda en profundidad con retroceso. Perfecto significa que todas las casillas están conectadas y existe una sola ruta simple entre dos puntos cualesquiera. Al abrir un paso se elimina la pared de una casilla y la pared opuesta de su vecina, manteniendo el tablero coherente.

`maze-game.js` se ocupa de la interfaz, los controles, el cronómetro, la pausa, los mensajes y el progreso. La lógica del laberinto permanece separada para poder probarla sin navegador.

## Reglas educativas

- Chocar con una pared no resta puntos ni reinicia el recorrido.
- La ficha solo se mueve por pasos abiertos.
- Llegar a la estrella completa la ronda y presenta un laberinto nuevo.
- La partida termina después de resolver los dos laberintos del nivel.
- La pausa congela el reloj y cualquier transición pendiente.
- Las partidas incompletas no modifican el progreso.

## Progreso local

Se guardan niveles completados, mejores resultados por movimientos y tiempo, y el total de laberintos resueltos. No se transmite información a servicios externos.

## Archivos responsables

- `lib/maze-engine.js`: generación, paredes, movimientos y finalización.
- `maze-game.js`: representación visual, controles y progreso local.
- `index.html`: pantallas, botones, textos y diálogos.
- `styles.css`: tablero adaptable, ficha, meta y controles.
- `tests/maze-engine.test.js`: auditoría automática de las reglas.

## Cómo comprobarlo

```powershell
node --test tests/maze-engine.test.js
```

La prueba verifica tamaños, conectividad total, simetría de paredes, movimientos inválidos, choques, bloqueo, avance de ronda y finalización exacta.

## Riesgos y casos límite

- En pantallas pequeñas, una cuadrícula grande necesita casillas compactas; por eso la ficha y la estrella escalan con el ancho disponible.
- El laberinto se genera en el navegador. Si JavaScript está desactivado, las instrucciones siguen siendo legibles pero la actividad no puede jugarse.
- El algoritmo actual crea una única ruta simple entre cada par de casillas. Futuras variantes podrían añadir ciclos o llaves, pero eso ampliaría el alcance educativo.

## Auditoría en navegador

La auditoría completó los dos laberintos de una partida Explorador. Se verificaron:

- Un choque contra una pared sin movimiento ni penalización.
- Movimiento válido mediante una flecha del teclado.
- Controles direccionales táctiles durante el recorrido completo.
- Reloj detenido en el mismo segundo durante la pausa.
- Cancelación del diálogo de salida y salida confirmada sin guardar una partida incompleta.
- Resultado dinámico con laberintos, movimientos, nivel y tiempo.
- Progreso actualizado a 1 de 3 niveles en el mapa.
- Vista móvil a 357 px sin desbordamiento horizontal, incluido el nivel Maestro de 81 casillas.
- Consola del navegador sin errores ni advertencias.

Las cinco suites automáticas del proyecto continuaron aprobadas después de la integración.

## Próximo incremento

Construir Comprensión lectora, el sexto juego del catálogo inicial.
