# Implementación y auditoría de Fracciones en acción y Programa al robot

## Objetivo

Ampliar Chispora de seis a ocho juegos con dos habilidades nuevas: razonamiento con fracciones visuales y pensamiento computacional mediante programas de comandos.

## Referencias de diseño

- National Council of Teachers of Mathematics propone nombrar, comparar y reconocer fracciones equivalentes mediante varios modelos visuales, incluyendo tiras de fracciones. Fuente: [Exploring Equivalent Fractions](https://www.nctm.org/Classroom-Resources/ARCs/Equivalent-Fractions/), consultada el 30 de septiembre de 2026.
- Code.org incluye secuencias, algoritmos, resolución de problemas y depuración en sus recorridos de fundamentos para primaria. Fuente: [Curriculum](https://code.org/en-US/curriculum), consultada el 30 de septiembre de 2026.
- Education Endowment Foundation destaca que los juegos matemáticos necesitan un propósito claro y contextos significativos para apoyar conexiones y razonamiento. Fuente: [Gains from games](https://educationendowmentfoundation.org.uk/news/eef-blog-gains-from-games), consultada el 30 de septiembre de 2026.

Las fuentes orientaron el tipo de práctica, pero todo el contenido y código de los juegos se creó localmente para Chispora.

## Fracciones en acción

### Experiencia

El jugador observa tiras divididas en partes iguales y responde desafíos graduados:

| Nivel | Rondas | Habilidad |
|---|---:|---|
| Explorador | 5 | Nombrar la parte coloreada. |
| Aventurero | 6 | Comparar dos fracciones con `>`, `<` o `=`. |
| Maestro de fracciones | 7 | Reconocer equivalencias sencillas. |

Un error descarta temporalmente esa opción, pero no resta puntos ni cambia de desafío. Después de acertar se explica la relación entre el modelo y la respuesta.

### Arquitectura

- `lib/fraction-engine.js`: bancos, mezcla, validación, reintentos y finalización.
- `fraction-game.js`: modelos visuales, interfaz, reloj, pausa, salida y progreso.
- `tests/fraction-engine.test.js`: niveles, entradas inválidas, bloqueo, avance y cierre.

El progreso guarda niveles completados, mejor cantidad de intentos extra y total de desafíos resueltos.

## Programa al robot

### Experiencia

El jugador construye un programa completo con flechas, lo ejecuta y observa dónde termina el robot. Puede quitar comandos, limpiar, solicitar una pista y corregir el mismo programa después de un choque.

| Nivel | Rutas | Tablero | Habilidad |
|---|---:|---:|---|
| Explorador | 4 | 4 × 4 | Secuencias directas. |
| Aventurero | 5 | 5 × 5 | Desvíos alrededor de obstáculos. |
| Maestro del código | 6 | 6 × 6 | Programas largos con varios giros. |

Los comandos son absolutos —arriba, derecha, abajo e izquierda— para concentrar el primer incremento en orden, predicción y depuración. Bucles, giros relativos y funciones quedan fuera del alcance inicial.

### Arquitectura

- `lib/robot-engine.js`: tableros, comandos, simulación, choques, pistas y finalización.
- `robot-game.js`: tablero, constructor de programa, reloj, pausa, salida y progreso.
- `tests/robot-engine.test.js`: validez y solución de todos los mapas, límites, edición, errores y cierre.

El progreso guarda niveles completados, mejores correcciones y pistas, y total de rutas resueltas.

## Privacidad, accesibilidad y recompensas

- Ambos juegos funcionan con controles nativos de teclado, clic y toque.
- Los modelos de fracciones incluyen nombres accesibles como “2 de 4 partes”.
- Los comandos del robot anuncian dirección y posición dentro del programa.
- Obstáculos, meta y robot tienen símbolos además de color.
- Pausar oculta el contenido y detiene el cronómetro.
- Una partida incompleta no guarda progreso.
- La constelación incorpora Fracciones visuales y Pensamiento computacional, ampliando el máximo de 18 a 24 niveles.
- No se transmiten respuestas, programas o estadísticas.

## Auditoría automática

Fracciones verifica tres niveles sin repeticiones, respuestas completas, recuperación segura, entradas inválidas, opciones descartadas, reintentos y finalización exacta.

Robot verifica todos los tableros y sus soluciones, posiciones válidas, límites de comandos, edición, pista única, choques, corrección y finalización exacta.

Las nueve suites automáticas del proyecto finalizaron correctamente después de integrar ambos juegos.

## Auditoría en navegador

Se completó una partida Explorador de cada juego. Se comprobó:

- Carga de introducción, dificultad y partida.
- Modelos de fracciones con partes y etiquetas correctas.
- Error, opción descartada, reintento, explicación y resultado de Fracciones.
- Tablero de 16 casillas, constructor y límite de comandos de Robot.
- Ejecución fallida al salir del tablero, conservación del programa y corrección.
- Resultado y progreso guardados una sola vez por juego.
- Constelación actualizada a 3 de 24 niveles con las dos habilidades nuevas.
- Ausencia de desbordamiento horizontal en el cuerpo durante la revisión.
- Consola sin errores ni advertencias de la aplicación.

## Riesgos y próximos pasos

- Los modelos de fracciones usan tiras; incorporar círculos o rectas numéricas permitiría comprobar transferencia entre representaciones.
- Robot acepta cualquier programa que llegue a la meta, no solamente la solución almacenada. Esto favorece rutas alternativas, aunque todavía no compara eficiencia.
- Los textos `>` y `<` necesitan observación supervisada para confirmar que todos los niños conocen esos símbolos.
- Los juegos candidatos “Reloj de aventuras” y “Laboratorio curioso” quedan registrados para una expansión posterior.

## Cómo comprobarlo

```powershell
node --test tests/fraction-engine.test.js tests/robot-engine.test.js
node --test tests/*.test.js
node --check fraction-game.js
node --check robot-game.js
```

## Próximo incremento

Realizar pruebas supervisadas de los ocho juegos y retomar accesibilidad ampliada y funcionamiento sin conexión.
