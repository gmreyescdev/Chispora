# Implementación y auditoría de Palabra desordenada

## Resultado

Palabra desordenada ya es un juego completo de lectura y vocabulario. El jugador selecciona fichas para construir una palabra, puede corregir su selección y solicitar una pista contextual.

## Niveles

| Nivel | Palabras por partida | Extensión aproximada |
|---|---:|---:|
| Explorador | 5 | 3 a 4 letras |
| Aventurero | 6 | 6 a 8 letras |
| Maestro de palabras | 7 | 7 a 10 letras |

Todas las palabras y pistas están escritas localmente. El juego no consulta servicios externos ni transmite respuestas.

## Reglas educativas

- Cada ficha solo puede usarse una vez, incluso cuando una letra se repite.
- Quitar última y Limpiar permiten corregir antes de completar la palabra.
- Una respuesta incorrecta no avanza ni revela la solución.
- Tras un error, todas las fichas vuelven y el mensaje invita a reintentar.
- Cada pista se contabiliza una sola vez por palabra.
- La pausa congela el reloj y la retroalimentación pendiente.

## Progreso local

Se guardan niveles completados, mejores resultados por errores, pistas y tiempo, además del total de palabras resueltas. Las partidas incompletas no modifican el progreso.

## Auditoría

`tests/word-engine.test.js` comprueba mezcla de letras, identificadores únicos, entradas inválidas, letras repetidas, correcciones, pistas, errores, avance y finalización.

La auditoría en Chromium completó una partida con error y pista, verificó el progreso en el mapa y confirmó que la pausa detiene el reloj. Maestro de palabras se probó a 360 × 800 sin desbordamiento horizontal ni errores de consola.

## Próximo incremento

Secuencia lógica se construyó a continuación y está documentado en `19-implementacion-y-auditoria-secuencia.md`. Las pruebas supervisadas con personas siguen pendientes porque requieren participación externa.
