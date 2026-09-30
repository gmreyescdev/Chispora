# Plan de evolución del producto

## Propósito

Registrar las mejoras propuestas después de completar los diez juegos iniciales y establecer un orden de implementación verificable. El plan prioriza claridad, accesibilidad, funcionamiento local y validación antes de ampliar nuevamente el catálogo.

## Principios para todos los incrementos

- Mantener una experiencia tranquila, sin rachas, clasificaciones ni presión por jugar.
- Conservar mouse, teclado y pantalla táctil.
- No recopilar datos identificables de niños.
- Guardar únicamente información necesaria en el dispositivo.
- Explicar cada cambio con lenguaje breve y comprensible.
- Probar cada incremento antes de publicarlo.

## Orden acordado

### 1. Organizar el mapa por áreas

**Objetivo:** facilitar la elección entre diez juegos.

Áreas propuestas:

- **Palabras:** Palabra desordenada y Comprensión lectora.
- **Números:** Operación misteriosa, Fracciones en acción y Reloj de aventuras.
- **Lógica:** Secuencia lógica, Laberintos y Programa al robot.
- **Exploración:** Memorama y Laboratorio curioso.

**Primera versión:** filtros visibles para mostrar todas las misiones o una sola área. Sin JavaScript, las diez tarjetas deben permanecer visibles.

**Criterios de aceptación:** selección comprensible, estado anunciado, uso con teclado, sin pérdida de progreso y sin desbordamiento horizontal.

### 2. Añadir tutoriales breves

**Objetivo:** enseñar cada control mediante una práctica sencilla antes de la primera partida.

- Botón “¿Cómo se juega?”.
- Uno o dos pasos interactivos.
- Ejemplo que no modifica el progreso.
- Opción para omitir o repetir el tutorial.
- Registro local únicamente de que el tutorial ya fue visto.

**Criterios de aceptación:** el jugador puede comprender la acción principal sin leer un párrafo largo y puede salir del tutorial en cualquier momento.

### 3. Accesibilidad ampliada

**Objetivo:** permitir que cada familia adapte la presentación.

- Texto normal o grande.
- Contraste alto.
- Movimiento reducido configurable además de `prefers-reduced-motion`.
- Opción para ocultar cronómetros.
- Auditoría completa solo con teclado.
- Evaluación de lectura en voz alta mediante capacidades locales del dispositivo, sin servicios externos.

**Criterios de aceptación:** preferencias persistentes, recuperación segura de datos antiguos y ninguna pérdida de controles táctiles o foco visible.

### 4. Funcionamiento sin conexión

**Objetivo:** convertir Chispora en una aplicación web instalable.

- Manifiesto de aplicación.
- Service worker con recursos esenciales locales.
- Pantalla e iconos de instalación.
- Indicador sencillo de disponibilidad sin conexión.
- Actualizaciones controladas para evitar mezclar versiones de archivos.

**Criterios de aceptación:** los diez juegos abren y terminan sin red después de la primera carga; las actualizaciones no borran progreso.

### 5. Pruebas supervisadas

**Objetivo:** observar comprensión y comodidad reales.

- Guía de observación para adultos.
- Preguntas sobre instrucciones, controles y dificultad.
- Registro manual y anónimo, fuera del área infantil.
- Revisión específica en teléfonos de 320–390 píxeles y tabletas.
- Cambios basados en problemas observados, no en métricas adictivas.

**Criterios de aceptación:** sesiones breves, consentimiento del adulto y ausencia de datos identificables en el producto.

### 6. Publicar la beta gratuita

**Objetivo:** ofrecer una versión estable en `chispora.cl`.

- Revisión final de privacidad y accesibilidad.
- Pruebas en navegadores y dispositivos reales.
- Página informativa para familias.
- Canal de comentarios exclusivo para adultos.
- Lista de comprobación para despliegue y recuperación.

**Criterios de aceptación:** HTTPS, consola limpia, recursos locales, funcionamiento sin conexión y flujo completo de los diez juegos.

## Ideas posteriores al orden principal

### 7. Sesiones guiadas

Recorridos opcionales de 5, 10 o 15 minutos con dos o tres juegos variados, una pausa entre actividades y un resumen final sin puntuación acumulativa.

### 8. Sugerencias de dificultad

Recomendaciones locales y opcionales basadas en partidas terminadas. Nunca reducir automáticamente el nivel, bloquear opciones ni presentar el error como fracaso.

### 9. Más variedad de contenido

Ampliar textos, palabras, patrones, experimentos, relojes, mapas del robot y representaciones de fracciones antes de crear más juegos.

### 10. Panel familiar ampliado

Mostrar habilidades exploradas, niveles recorridos y sugerencias de actividades fuera de pantalla. No incluir diagnósticos, comparaciones, perfiles publicitarios ni vigilancia en tiempo real.

## Estado

Los puntos 1 a 4 están completados y auditados. El punto 5, pruebas supervisadas, es el siguiente incremento. Los puntos 5 y 6 completan la ruta principal; los puntos 7 a 10 quedan documentados para incrementos posteriores.
