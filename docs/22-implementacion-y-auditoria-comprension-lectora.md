# Implementación y auditoría de Comprensión lectora

## Resultado

Comprensión lectora es el sexto juego funcional del catálogo inicial. El jugador lee relatos locales, responde una pregunta por texto, puede solicitar una pista y recibe una explicación que relaciona la respuesta con la evidencia del relato.

## Qué ve el jugador

- Una introducción con tres dificultades y una explicación de la extensión esperada.
- Relatos presentados con ancho moderado, párrafos separados e interlineado amplio.
- Una pregunta con tres respuestas posibles.
- Una pista que destaca el párrafo relevante sin revelar directamente la respuesta.
- Mensajes amables para releer después de un error.
- Una explicación explícita después de acertar.
- Tiempo, pausa, salida y resultado final.

El avance después de una respuesta queda bajo control del jugador mediante un botón. Esto permite leer la explicación sin una transición automática.

## Niveles

| Nivel | Textos por partida | Extensión | Enfoque |
|---|---:|---:|---|
| Explorador | 4 | 35 a 55 palabras | Información explícita. |
| Aventurero | 5 | 60 a 85 palabras | Secuencia, causa e inferencia directa. |
| Maestro lector | 6 | 90 a 120 palabras | Inferencia, vocabulario e intención. |

El banco inicial contiene 18 relatos: cinco de Explorador, seis de Aventurero y siete de Maestro lector. Cada partida utiliza una selección sin repeticiones y mezcla también las respuestas.

## Cómo funciona

`lib/reading-engine.js` contiene el banco local y las reglas. Crea partidas, valida opciones, conserva respuestas descartadas, registra pistas y reconoce la finalización. No utiliza DOM, almacenamiento ni temporizadores.

`reading-game.js` conecta el motor con la interfaz. Gestiona dificultad, representación segura del contenido, foco, cronómetro, sonido, pausa, salida, resultado y progreso local.

Una respuesta incorrecta no avanza ni resta puntos. Queda visualmente descartada y el jugador decide cuándo volver a intentarlo. Una respuesta correcta muestra la explicación y habilita el siguiente texto.

## Progreso local

Al completar una partida se guardan:

- Niveles completados.
- Mejor cantidad de intentos extra por nivel.
- Mejor cantidad de pistas por nivel.
- Total de textos comprendidos.

El tiempo se muestra únicamente como duración de la sesión. No se guarda un mejor tiempo ni se presenta la velocidad como logro. Tampoco se guardan respuestas individuales, textos seleccionados o errores concretos.

## Accesibilidad y privacidad

- Las respuestas funcionan con clic, toque y navegación nativa de teclado.
- El foco pasa al título de cada relato y a la acción de continuación después de responder.
- Los estados de error y acierto incluyen texto y no dependen solamente del color.
- La pista tiene mensaje textual y énfasis visual en el párrafo relevante.
- La pausa oculta el relato y detiene el cronómetro.
- Los sonidos respetan la configuración familiar y son opcionales.
- Todo el contenido se incluye localmente; no se transmiten lecturas ni respuestas.

## Archivos responsables

- `lib/reading-engine.js`: contenido, selección, respuestas, pistas y finalización.
- `reading-game.js`: interfaz, tiempo, pausa, sonido y progreso.
- `tests/reading-engine.test.js`: pruebas automáticas del motor y del contenido.
- `index.html`: tarjeta, introducción, partida, resultado y diálogos.
- `styles.css`: composición de lectura, respuestas, pista y adaptación.
- `docs/21-especificacion-comprension-lectora.md`: reglas y criterios previos.

## Cómo comprobarlo

```powershell
node --test tests/reading-engine.test.js
node --test tests/*.test.js
node --check reading-game.js
```

Para la integración:

```powershell
python -m http.server 8765
```

Después se abre `http://localhost:8765/#introduccion-lectura`.

## Auditoría automática

La nueva suite verifica:

- Cantidad y ausencia de repeticiones por nivel.
- Extensión de los 18 relatos.
- Tres opciones únicas y respuesta correcta presente.
- Pistas asociadas a párrafos existentes.
- Recuperación segura ante una dificultad inválida.
- Rechazo de opciones inválidas, bloqueadas y descartadas.
- Reintento sin avance después de un error.
- Uso único de la pista por ejercicio.
- Avance y limpieza de descartes después de acertar.
- Finalización exacta después del último texto.

Las seis suites automáticas del proyecto finalizaron correctamente después de la integración.

## Auditoría en navegador

Se recorrió una partida Explorador completa. Se verificaron:

- Introducción y resumen dinámico de dificultad.
- Error, bloqueo temporal, opción descartada y reintento.
- Pista única con mensaje y párrafo destacado.
- Respuesta correcta, explicación y avance manual.
- Cronómetro y diálogo de pausa con contenido oculto.
- Cancelación del diálogo de salida.
- Salida confirmada sin guardar una partida incompleta.
- Resultado con textos, intentos, nivel, tiempo y pistas.
- Progreso actualizado a 1 de 3 niveles y contador global incrementado una sola vez.
- Contenido ajustado en un ancho restringido de 357 px sin desbordamiento del cuerpo.
- Consola sin errores ni advertencias de la aplicación.

## Riesgos y revisión humana pendiente

- Las pruebas garantizan estructura y reglas, pero no pueden decidir si cada texto resulta interesante o perfectamente claro para todos los niños.
- Los 18 ejercicios necesitan revisión continuada por adultos y una prueba de uso supervisada con el rango de edad previsto.
- El banco es suficiente para el MVP, pero partidas frecuentes producirán repeticiones entre sesiones.
- La lectura en voz alta no se incluyó porque las voces sintéticas varían entre dispositivos y requieren una evaluación de accesibilidad separada.

## Próximo incremento

Crear recompensas visuales y un resumen por habilidad, seguido por accesibilidad ampliada y funcionamiento sin conexión.
