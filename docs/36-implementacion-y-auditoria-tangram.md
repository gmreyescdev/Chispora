# Implementación y auditoría de Tangram

## Objetivo y alcance

Componer figuras con las siete piezas del tangram tradicional: dos triángulos grandes, uno mediano, dos pequeños, un cuadrado y un paralelogramo. Ejercita observación de formas, orientación y composición espacial sin evaluar ni comparar al niño.

Primera versión guiada con tres modelos: cuadrado, triángulo y rombo. No es un editor de arrastre libre. Los espacios están delineados y numerados; tocar un botón coloca la pieza solo si su forma y orientación coinciden. No se usan colores para identificar respuestas.

## Qué ve el niño

1. Selecciona una pieza; su botón conserva foco y muestra selección.
2. Puede girarla 45°, voltearla o pedir una pista.
3. Elige el botón del espacio numerado correspondiente al modelo.
4. Si no encaja, conserva la pieza y prueba de nuevo. Si encaja, se rellena el espacio.
5. Al completar siete espacios, decide cuándo pasar a la siguiente figura.
6. Al terminar, puede descansar, volver al mapa o repetir voluntariamente.

La pista orienta la pieza y comunica el número del espacio sin colocarla automáticamente. Puede volver a pedirse y no hay penalización; el motor solo cuenta una pista por pieza de cada figura.

## Dificultades

| Nivel | Figuras | Ayudas iniciales |
|---|---|---|
| Explorador | Cuadrado y triángulo | Piezas ya orientadas; nombre de la forma junto al espacio. |
| Aventurero | Cuadrado, triángulo y rombo | Orientaciones mezcladas; espacios solo numerados. |
| Maestro | Cuadrado, triángulo y rombo | Orientaciones mezcladas y piezas que pueden necesitar voltearse. |

Giro, volteo y pistas están disponibles en los tres niveles para favorecer la exploración. No hay límite de tiempo, cronómetro, sonido ni animación propia del juego.

## Reglas y geometría

- `lib/tangram-engine.js` es puro: no accede al DOM ni al almacenamiento.
- La función aleatoria se inyecta para reproducir las orientaciones iniciales en las pruebas.
- Los modelos utilizan las siete piezas a la misma escala y tienen área total 16 en las unidades del motor.
- Para comprobar encaje se centran los vértices, se aplica giro/reflexión y se compara su geometría con tolerancia de redondeo de 1/10000 de unidad.
- Esto acepta simetrías reales e intercambiar triángulos del mismo tamaño; no exige identificar una pieza por su letra.
- Cada espacio acepta una sola pieza y cada pieza se coloca una sola vez.
- El último encaje produce `feedback`, no inicia otra figura. Solo la continuación explícita avanza o produce `complete`.

## Integración y seguridad

- `tangram-game.js`: interfaz independiente, sin aumentar `main.js`.
- `index.html`: tarjeta en Lógica, introducción, partida, resultado y diálogos.
- `styles.css`: SVG adaptable, botones nativos y contraste reforzado.
- Tutorial compartido de tres pasos y habilidad «Composición de figuras».
- Once juegos y 33 niveles totales; datos antiguos muestran cero niveles de Tangram sin borrar los treinta anteriores.
- Guarda en `chispora.mvp.v1` únicamente al completar toda la partida; un fallo de almacenamiento se informa en el resultado.
- Pausa y salida cancelada mantienen la figura sin permitir interacciones. Escape reanuda; salida confirmada y navegación fuera de la partida limpian el estado temporal.
- No existen temporizadores ni transiciones del juego que puedan avanzar durante la pausa.
- Nueva versión completa del caché `chispora-shell-2026100203`, incluidos motor y controlador; las solicitudes de instalación usan `cache: "reload"` para evitar copias HTTP obsoletas.
- Contenido dinámico escapado al construir HTML; no hay recursos externos nuevos.

## Pruebas

Las pruebas deterministas de `tests/tangram-engine.test.js` cubren creación, geometría y ausencia de solapamiento interior por muestreo, dificultades inválidas, entradas inválidas, errores sin avance, giro/reflexión, triángulos intercambiables, pistas, bloqueo y finalización exacta.

Los tests de progreso verifican los 33 niveles y la recuperación de un estado antiguo con 30 niveles completos. Los de tutorial verifican once guías y los del service worker exigen precargar todas las referencias HTML.

La ausencia de solapamiento se comprueba por muestreo además de la congruencia y el área; no se presenta como una demostración formal general para figuras arbitrarias.

### Resultados del 2 de octubre de 2026

- Suite completa: 18 archivos de pruebas, sin fallos; las seis pruebas nuevas del motor pasaron.
- Sintaxis comprobada de nueve archivos JavaScript nuevos o modificados.
- Navegador: partidas completas de las tres dificultades; Explorador resuelto sin pistas y las otras dos con giro, volteo y pistas.
- Corrección sin perder piezas, pausa con controles bloqueados y modelo oculto, reanudación con Escape, salida cancelada y confirmada.
- Una partida incompleta no escribió progreso. La completa conservó perfil, ajustes y avances de Memorama; la recarga recuperó el nuevo nivel.
- Fallo de escritura simulado: resultado informó que no pudo guardar y los datos anteriores quedaron intactos.
- Activación explícita de la actualización en el navegador de auditoría mantuvo las cinco partidas del estado de prueba.
- Caché con 41 recursos locales; recarga y colocación de una pieza con el servidor de auditoría detenido. El servidor habitual del usuario no se detuvo.
- Anchos de 320, 375, 768 y 1280 px, con texto normal y grande, contraste alto y movimiento reducido: sin desbordamiento horizontal. Botones de piezas de al menos 64 px de alto.
- Selección mediante Enter y conservación del foco comprobadas. Los botones nativos proporcionan la misma acción para mouse y pantalla táctil; no se simuló hardware táctil físico.
- Lighthouse con servidor disponible: 100 en accesibilidad, buenas prácticas y SEO, sin fallos. Consola sin errores ni advertencias propias.
- Pendiente: observación infantil específica y uso en dispositivos táctiles reales. El comentario favorable del usuario sobre la página anterior no se atribuye a Tangram ni sustituye las fichas del protocolo.

## Comprobación manual recomendada

- Probar Explorador sin pistas y usar giro/volteo en las otras dificultades.
- Seleccionar y activar controles con Tab, Enter y Espacio.
- Pausar, reanudar con Escape y confirmar/cancelar salida.
- Completar una partida, recargar y comprobar progreso; abandonar otra y comprobar que no se guarda.
- Revisar desde 320 px, texto grande, contraste alto y movimiento reducido.
- Preparar el caché con conexión y abrir Tangram sin servidor disponible.
- Observar con un adulto si la relación entre número del modelo y botón del espacio resulta clara. La validación infantil de este juego sigue pendiente.

## Explicación sencilla

Eliges una pieza y el número donde crees que encaja. Puedes girarla, darle la vuelta y pedir ayuda. Si no coincide, no pierdes nada. Al completar todas las figuras, guardamos una nueva chispa en este equipo.
