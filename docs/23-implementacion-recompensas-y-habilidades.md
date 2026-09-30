# Implementación y auditoría de recompensas y habilidades

## Resultado

El mapa de misiones incluye una constelación que resume las seis habilidades del catálogo. Cada nivel completado ilumina una chispa y actualiza una descripción neutral del recorrido.

La recompensa representa contenido explorado. No utiliza puntos, rachas, premios aleatorios, clasificaciones ni comparaciones entre niños.

## Qué ve el jugador

- Un resumen total de niveles recorridos sobre 18 disponibles.
- Una barra de progreso general.
- Seis tarjetas: memoria visual, cálculo mental, lectura y vocabulario, lógica y atención, orientación espacial y comprensión lectora.
- Tres chispas por habilidad, correspondientes a las dificultades Explorador, Aventurero y Maestro.
- Descripciones graduales: “Lista para explorar”, “Primer recorrido”, “Camino avanzado” y “Tres niveles recorridos”.

El panel familiar muestra también los niveles recorridos y el progreso total, además del detalle existente por juego.

## Cómo funciona

`lib/progress-engine.js` transforma el progreso local en un resumen derivado. Reconoce únicamente las tres dificultades válidas, limita cada habilidad a tres niveles y calcula un porcentaje sobre 18.

`progress-summary.js` representa ese resumen en el mapa y el panel familiar. Escucha el evento `chispora:state-updated` para actualizar la vista después de guardar una partida sin recargar la página. También escucha cambios de almacenamiento producidos en otras pestañas.

Los datos derivados no se vuelven a guardar. La constelación siempre se reconstruye a partir del progreso real de cada juego, evitando duplicación e inconsistencias.

## Principios educativos

- Las chispas reconocen exploración, no superioridad ni rapidez.
- No se muestran diagnósticos, porcentajes de acierto o etiquetas sobre la capacidad del niño.
- No se pierde progreso por errores, pausas o tiempo sin jugar.
- No hay recompensas variables ni invitaciones a mantener una racha.
- El lenguaje describe el camino recorrido sin comparar usuarios.

## Archivos responsables

- `lib/progress-engine.js`: definición de habilidades y cálculo del resumen.
- `progress-summary.js`: sincronización con `localStorage` y representación.
- `tests/progress-engine.test.js`: pruebas de recuperación, conteo, estados y catálogo completo.
- `index.html`: constelación y resumen familiar.
- `styles.css`: tarjetas, chispas y adaptación.
- `main.js`: emisión del evento de actualización después de guardar perfil, ajustes o progreso.

## Cómo comprobarlo

```powershell
node --test tests/progress-engine.test.js
node --test tests/*.test.js
node --check progress-summary.js
```

## Auditoría

Se verificó:

- Estado vacío con seis habilidades, 0 de 18 niveles y recuperación segura.
- Conteo exclusivo de dificultades reconocidas.
- Estados descriptivos para cero, uno, dos y tres niveles.
- Cálculo de 100 % al recorrer los 18 niveles.
- Lectura correcta del progreso ya guardado de Comprensión lectora.
- Actualización inmediata al cambiar el progreso y emitir el evento de la aplicación.
- Restauración correcta del estado después de la prueba dinámica.
- Resumen accesible mediante nombres y cantidades, sin depender de las chispas visuales.
- Ausencia de errores y advertencias en la consola.
- Siete suites automáticas aprobadas después de la integración.

## Riesgos y próximos ajustes

- Completar un nivel varias veces no agrega nuevas chispas; la constelación representa variedad de niveles, no cantidad de sesiones.
- El resumen agrupa cada juego como una habilidad. Una evaluación educativa real requeriría criterios profesionales y está fuera del alcance del MVP.
- Antes de la beta debe observarse si los niños comprenden “camino avanzado” y “niveles recorridos”.

## Próximo incremento

Ampliar accesibilidad y preparar funcionamiento sin conexión.
