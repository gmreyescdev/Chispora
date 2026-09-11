# Implementación y auditoría de Secuencia lógica

## Resultado

Secuencia lógica es un juego completo de razonamiento y atención. El jugador observa una serie numérica o visual, elige el elemento siguiente y recibe una explicación breve de la regla al acertar.

## Niveles

| Nivel | Patrones por partida | Tipo de regla |
|---|---:|---|
| Explorador | 6 | Repeticiones y saltos directos |
| Aventurero | 8 | Dobles, descensos y combinaciones |
| Maestro de patrones | 10 | Saltos variables y reglas compuestas |

## Reglas educativas

- Cada patrón ofrece tres alternativas y siempre contiene una respuesta válida.
- Una respuesta incorrecta no avanza ni revela la solución.
- Las alternativas ya descartadas quedan deshabilitadas para orientar el reintento.
- Al acertar se explica la regla antes de presentar el patrón siguiente.
- La pausa congela el reloj y cualquier retroalimentación pendiente.
- La partida termina únicamente después de resolver todos los patrones.

## Progreso local

Se guardan niveles completados, mejores resultados por intentos extra y tiempo, además del total de patrones resueltos. Las partidas incompletas no modifican el progreso.

## Auditoría

`tests/sequence-engine.test.js` comprueba cantidades por nivel, respuestas válidas, bloqueo, reintentos, descarte de alternativas, avance y finalización exacta.

La auditoría visual y funcional completó una partida con un error intencional, comprobó que la alternativa queda descartada, verificó que la pausa congela el reloj y confirmó el progreso del mapa. La vista móvil se probó a 357 px de ancho sin desbordamiento horizontal ni errores de consola.

## Próximo incremento

Laberintos se construyó a continuación y está documentado en `20-implementacion-y-auditoria-laberintos.md`. El próximo juego pendiente es Comprensión lectora; las pruebas supervisadas con personas también siguen pendientes.
