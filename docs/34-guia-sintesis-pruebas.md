# Guía para sintetizar pruebas supervisadas

## Propósito

Convertir fichas anónimas en decisiones de producto sin crear perfiles infantiles, diagnósticos ni métricas de participación adictiva.

## Cuándo sintetizar

Realiza una primera revisión después del piloto adulto y otra cuando:

- los once juegos hayan sido observados al menos una vez; o
- se detecte una barrera grave que deba corregirse antes de continuar.

No esperes a completar todas las sesiones para corregir un problema de seguridad, privacidad, pérdida de progreso o control inaccesible.

## Preparación de los datos

1. Revisa que cada ficha use solo un código de sesión.
2. Elimina inmediatamente cualquier dato personal escrito por accidente.
3. Separa fallos técnicos, problemas de comprensión y preferencias individuales.
4. Agrupa por pantalla, juego, dispositivo y método de entrada.
5. Conserva paráfrasis; no transcribas expresiones identificables.

No intentes enlazar sesiones realizadas por la misma persona.

## Clasificación de hallazgos

| Severidad | Definición | Acción |
|---|---|---|
| P0 · Crítica | Riesgo de privacidad, seguridad, pérdida de progreso o imposibilidad general de continuar. | Detener pruebas afectadas y corregir antes de reanudar. |
| P1 · Alta | Bloquea una tarea principal o requiere ayuda directa en más de una sesión. | Corregir antes de la beta. |
| P2 · Media | Genera duda, pero el niño se recupera con una pista neutral o tutorial. | Planificar y volver a observar. |
| P3 · Baja | Preferencia visual o mejora de redacción sin bloqueo. | Registrar para refinamiento. |

Una observación única puede ser P0. Para P1 o P2, busca repetición en dos sesiones o evidencia técnica adicional. La frecuencia no convierte una preferencia personal en diagnóstico.

## Preguntas de síntesis

### Comprensión

- ¿La acción principal se entendió antes de recibir ayuda directa?
- ¿El tutorial resolvió la duda o añadió pasos?
- ¿Alguna palabra fue interpretada de forma distinta a la esperada?
- ¿Las pistas ayudaron sin revelar la respuesta?

### Controles

- ¿Toque, mouse y teclado permitieron completar la tarea?
- ¿El foco fue visible y siguió un orden comprensible?
- ¿Pausa y salida se encontraron sin provocar pérdida accidental?
- ¿Algún control quedó fuera de pantalla?

### Dificultad y bienestar

- ¿Explorador permitió aprender la mecánica?
- ¿El aumento de dificultad añadió razonamiento y no solo carga?
- ¿La sesión terminó antes de producir cansancio?
- ¿Los errores recibieron mensajes amables y recuperables?

### Accesibilidad y contexto

- ¿Texto grande y contraste alto conservaron todos los controles?
- ¿Movimiento reducido eliminó efectos innecesarios?
- ¿Ocultar cronómetros redujo presión sin causar confusión?
- ¿La aplicación siguió disponible sin conexión?

## Tabla consolidada

No incluyas códigos de sesión en informes públicos. Se pueden usar temporalmente durante la revisión interna y eliminarlos después de consolidar.

| Hallazgo | Pantallas afectadas | Evidencia agregada | Dispositivos | Severidad | Cambio propuesto | Estado |
|---|---|---|---|---|---|---|
| | | | | | | Pendiente |

## Regla para decidir cambios

Un cambio debe:

1. resolver un comportamiento observado;
2. conservar mouse, teclado y toque;
3. no añadir presión, comparación ni recolección de datos;
4. incluir una forma de comprobar la corrección;
5. evitar perjudicar juegos que no presentaban el problema.

No se cambia una mecánica únicamente porque un participante prefiera otro color o tema. Sí se cambia cuando el color impide comprender un estado o reduce contraste.

## Verificación posterior

Para cada P0, P1 o P2 corregida:

- añadir o actualizar una prueba automática cuando sea posible;
- repetir el flujo técnico afectado;
- observar la corrección en una sesión posterior sin explicar el cambio;
- documentar resultado, commit y posibles efectos secundarios.

## Informe final de esta etapa

El informe agregado debe contener:

- cantidad de sesiones realizadas, sin describir participantes;
- cobertura por juego, dispositivo y entrada;
- ajustes de accesibilidad probados;
- número de hallazgos por severidad;
- cambios implementados y pendientes;
- limitaciones de la muestra;
- decisión razonada sobre continuar o no hacia la beta.

Después de aprobar el informe, elimina las fichas individuales y cualquier tabla temporal que relacione códigos de sesión con hallazgos. El informe agregado no debe conservar códigos.

## Criterio para avanzar a beta

- Todos los juegos fueron observados al menos una vez.
- No quedan hallazgos P0 abiertos.
- Los P1 tienen corrección verificada o una decisión explícita de aplazamiento que no afecte seguridad ni acceso.
- No se recopilaron datos identificables.
- Las sesiones respetaron consentimiento, asentimiento y límite de duración.
- La documentación distingue claramente observaciones reales de pruebas técnicas.
