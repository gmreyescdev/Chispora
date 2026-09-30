# Implementación y auditoría de Reloj de aventuras y Laboratorio curioso

## Objetivo

Ampliar Chispora de ocho a diez juegos con dos habilidades cotidianas: interpretar el tiempo en relojes analógicos e investigar fenómenos a partir de observaciones.

## Referencias de diseño

- Los estándares de matemáticas publicados por NCTM incluyen el trabajo con tiempo y la comparación mediante razonamiento. Fuente: [Common Core State Standards for Mathematics](https://www.nctm.org/uploadedFiles/Standards_and_Positions/Common_Core_State_Standards.pdf), consultada el 30 de septiembre de 2026.
- Science Buddies describe la experimentación como un proceso para explorar observaciones y responder preguntas, y diferencia los factores que se cambian de aquellos que se observan. Fuentes: [Steps of the Scientific Method](https://www.sciencebuddies.org/science-fair-projects/science-fair/steps-of-the-scientific-method) y [What are Variables?](https://www.sciencebuddies.org/science-fair-projects/science-fair/variables-beginner), consultadas el 30 de septiembre de 2026.

Las referencias orientaron las habilidades. Los ejercicios, explicaciones, ilustraciones y código se crearon localmente para Chispora.

## Reloj de aventuras

### Experiencia

El jugador observa relojes analógicos con los doce números y dos manecillas diferenciadas por longitud y color.

| Nivel | Rondas | Habilidad |
|---|---:|---|
| Explorador | 5 | Leer horas exactas y medias horas. |
| Aventurero | 6 | Leer cuartos de hora y minutos de cinco en cinco. |
| Maestro del tiempo | 7 | Calcular duraciones de hasta una hora entre dos relojes. |

Después de cada acierto se explica cómo interpretar la manecilla larga o descomponer el intervalo. Una respuesta incorrecta se descarta sin restar puntos ni avanzar.

### Accesibilidad

- Los doce números permanecen visibles en todos los tamaños.
- La manecilla de minutos usa color y mayor longitud; la distinción no depende solo del color.
- Cada reloj anuncia hacia qué número apunta la manecilla larga y cerca de cuál está la corta, sin leer directamente la respuesta.
- En duración, los relojes se identifican como Inicio y Final.

## Laboratorio curioso

### Experiencia

Cada ronda comienza con notas de observación. La pregunta pide clasificar, predecir o elegir la conclusión mejor apoyada, evitando preguntas de simple memorización.

| Nivel | Rondas | Habilidad |
|---|---:|---|
| Explorador | 5 | Observar propiedades, cambios y adaptaciones. |
| Aventurero | 6 | Predecir y explicar resultados con evidencia. |
| Maestro del laboratorio | 7 | Reconocer variables, mediciones y pruebas justas. |

Las explicaciones señalan la evidencia utilizada. Los ejemplos no requieren datos personales, recursos externos ni conocimiento especializado fuera del texto mostrado.

## Arquitectura

- `lib/clock-engine.js` y `lib/science-engine.js`: bancos locales, mezcla determinista, validación, reintentos y finalización.
- `lib/choice-game.js`: controlador reutilizable de opciones, reloj de sesión, pausa, salida, resultado y progreso.
- `clock-game.js` y `science-game.js`: representaciones específicas de cada juego.
- `tests/clock-engine.test.js` y `tests/science-engine.test.js`: reglas, contenido, entradas inválidas, errores, avance y finalización exacta.

El controlador compartido recibe configuración y renderizadores; no contiene reglas educativas. El progreso antiguo sigue siendo válido porque las nuevas ramas `clock` y `science` se crean solo cuando hacen falta.

## Progreso y recompensas

- Cada juego registra niveles completados, mejor cantidad de intentos extra y total de desafíos resueltos.
- Una partida incompleta no modifica el progreso.
- La constelación incorpora Tiempo y duración e Investigación científica.
- El catálogo pasa de ocho a diez juegos y de 24 a 30 niveles.
- No se guardan respuestas individuales ni duración como logro competitivo.

## Auditoría automática

Las pruebas verifican:

- Tres dificultades con 5, 6 y 7 rondas sin duplicados.
- Horas y minutos dentro de intervalos válidos.
- Observaciones sustantivas, tres opciones únicas y explicación en cada ronda.
- Recuperación segura ante dificultades desconocidas.
- Rechazo de entradas inválidas, bloqueo durante retroalimentación y descarte de errores.
- Avance solo tras acertar y finalización exactamente en la última ronda.
- Resumen completo de diez habilidades y 30 niveles.

Las once suites del proyecto finalizaron correctamente y los 36 archivos JavaScript pasaron la comprobación de sintaxis.

## Auditoría en navegador

Se completó una partida Explorador de cada juego y se comprobó:

- Inicio, error, reintento, explicación, avance manual y resultado.
- Doce números, manecillas y tres opciones en cada reloj.
- Observaciones y respuestas del laboratorio sin revelar la solución.
- Persistencia de cinco desafíos por juego y actualización del progreso.
- Pausa con contenido oculto, reanudación y salida cancelada.
- Salida confirmada sin guardar una partida incompleta.
- Ausencia de desbordamiento horizontal en el ancho revisado.
- Consola sin errores ni advertencias propias de la aplicación.

Durante la auditoría se reforzó la reanudación explícita desde los botones de los diálogos, porque algunos navegadores pueden cerrar un formulario de diálogo sin emitir el evento `close` de la misma manera.

## Riesgos y próximos pasos

- Probar con niños si la posición de la manecilla corta durante las medias horas se interpreta con claridad.
- Revisar con una persona docente el vocabulario de variables y pruebas justas.
- Incorporar posteriormente actividades donde el jugador mueva las manecillas o construya un procedimiento experimental.
- Continuar con accesibilidad ampliada, operación sin conexión y beta gratuita.

## Cómo comprobarlo

```powershell
node --test tests/clock-engine.test.js tests/science-engine.test.js
node --test tests/*.test.js
node --check lib/choice-game.js
node --check clock-game.js
node --check science-game.js
```
