# Bitácora del proyecto

## 5 de septiembre de 2026 — Inicio y definición

### Objetivo

Definir una alternativa educativa a juegos poco apropiados para un niño de 8 años.

### Trabajo realizado

- Se propuso un catálogo de juegos de memoria, lenguaje, matemáticas, lógica y orientación espacial.
- Se eligieron seis actividades para el MVP.
- Se definieron principios de seguridad, privacidad y sesiones con final.
- Se documentó una arquitectura web inicial sin servidor.
- Se preparó una hoja de ruta y modelos de monetización responsable.

### Decisiones

- Comenzar con una web sencilla antes de crear cuentas o backend.
- Dirigir cualquier compra o suscripción exclusivamente al adulto.
- Evitar anuncios personalizados, chat y recompensas adictivas.

## 5 de septiembre de 2026 — Marca

### Trabajo realizado

- Se eligió **Chispora** como identidad de trabajo.
- Se definió el lema “Juega. Piensa. Descubre.”
- Se creó una paleta, voz de marca, concepto de símbolo y personaje guía.
- El propietario confirmó la adquisición de `chispora.cl`.
- Se dejó registrada la disponibilidad preliminar de la marca y la solicitud pendiente ante INAPI.

## 5 de septiembre de 2026 — Sistema de aprendizaje

### Objetivo

Convertir el desarrollo de Chispora en una experiencia comprensible y reutilizable para futuros productos.

### Trabajo realizado

- Se creó un sistema documental.
- Se añadió una ruta de aprendizaje técnico.
- Se documentó el camino desde MVP hasta empresa.
- Se añadió un glosario y un historial de versiones.
- Se preparó el repositorio para utilizar Git como memoria técnica.

### Control de versiones

- Se configuró la identidad local de Git del propietario, sin modificar otros repositorios.
- Se preparó el primer commit como punto de partida histórico de Chispora.

### Próximo paso

Definir el mapa de pantallas, los recorridos de niño y adulto, y los criterios de aceptación del primer prototipo.

## 5 de septiembre de 2026 — Arquitectura de experiencia

### Objetivo

Convertir la visión del producto en pantallas, recorridos y comportamientos verificables antes de escribir código.

### Trabajo realizado

- Se definieron nueve pantallas para el primer prototipo.
- Se separaron los recorridos infantil y adulto.
- Se documentaron el primer uso, una sesión normal y la sugerencia de descanso.
- Se definió Memorama como único juego completo del primer incremento.
- Se establecieron criterios funcionales, visuales, educativos y de accesibilidad.

### Aprendizaje técnico

Diseñar el flujo antes de programar reduce retrabajo: permite encontrar pantallas ausentes, ciclos confusos y responsabilidades mal ubicadas cuando todavía son fáciles de cambiar.

### Próximo paso

Crear wireframes visuales de baja fidelidad y luego construir la estructura HTML navegable.

## 7 de septiembre de 2026 — Wireframes de baja fidelidad

### Objetivo

Comprobar jerarquía, navegación y contenido de las nueve pantallas sin invertir todavía en ilustraciones o animaciones finales.

### Trabajo realizado

- Se creó un recorrido visual navegable de las nueve pantallas.
- Se definieron acciones principales y secundarias en cada paso.
- Se diseñaron estados representativos de Memorama, resultado, pausa y panel familiar.
- Se estableció un único perfil local para reducir el alcance del MVP.
- Se documentaron preguntas de validación para las primeras pruebas.

### Aprendizaje técnico

Un wireframe representa estructura y comportamiento, no apariencia definitiva. Sirve para corregir el producto cuando mover un botón todavía cuesta minutos y no horas de programación.

### Próximo paso

Construir un prototipo HTML navegable usando contenido real y sin implementar todavía la lógica completa de Memorama.

## 7 de septiembre de 2026 — Primer prototipo navegable

### Objetivo

Transformar los wireframes en una web real sin ampliar todavía el alcance hacia un juego completo.

### Trabajo realizado

- Se construyeron las nueve pantallas en HTML semántico.
- Se aplicó la identidad Chispora en CSS con diseño adaptable.
- Se implementó navegación por hash, perfil local, selección de avatar y ajustes familiares.
- Se añadió un tablero demostrativo, diálogos de pausa y salida, resultado y cierre de sesión.
- Se incorporó acceso adulto por pulsación prolongada, descrito correctamente como barrera disuasoria.
- Se configuró caché para alojamiento estático y versiones en los archivos CSS y JavaScript.

### Verificación

- Sintaxis de JavaScript comprobada con Node.
- Verificador del proyecto: 11 controles correctos, 0 advertencias y 0 errores.
- Servidor local: respuesta HTTP 200.
- Documento servido con título, estilos, JavaScript y nueve pantallas detectados.
- Navegación bienvenida → perfil → misiones comprobada en navegador.
- Validación de apodo y selección de avatar comprobadas.
- Cambio de dificultad, giro demostrativo de cartas y diálogo de pausa comprobados.
- Vista móvil comprobada a 360 × 800 píxeles sin desbordamiento horizontal.
- Consola del navegador revisada sin errores ni advertencias.

### Aprendizaje técnico

HTML contiene estructura y significado; CSS controla presentación; JavaScript agrega comportamiento. Mantener esas responsabilidades separadas facilita encontrar errores y reemplazar una parte sin reconstruir las demás.

### Próximo paso

Probar la navegación en el navegador, corregir detalles visuales observados y después implementar la lógica completa de Memorama con pruebas automatizadas.

## 7 de septiembre de 2026 — Expansión del catálogo educativo

### Objetivo

Convertir el prototipo navegable en un catálogo real de juegos breves, graduados y comprobables.

### Trabajo realizado

- Se completaron y documentaron Memorama, Operación misteriosa, Palabra desordenada y Secuencia lógica.
- Cada juego recibió tres niveles, pausa, tiempo, resultado y progreso guardado localmente.
- Se separaron los motores de reglas para probarlos con Node sin depender del navegador.
- Se ajustó Secuencia lógica después de observar que el patrón y las respuestas necesitaban una separación visual más clara.
- Se completó Laberintos con generación local, controles táctiles y de teclado, tres dificultades y progreso propio.

### Decisiones

- Mantener mensajes educativos sin castigos ni pérdida de puntos por equivocarse.
- Generar laberintos perfectos para garantizar solución y coherencia de paredes.
- Mantener el catálogo sin cuentas, anuncios, rastreadores ni transmisión de respuestas.

### Verificación

- Los motores existentes cuentan con pruebas automáticas de reglas y finalización.
- Los cuatro primeros juegos fueron recorridos en navegador y revisados en vista móvil.
- Laberintos superó pruebas de conectividad, paredes, teclado, controles táctiles, pausa, salida, resultado, progreso y vista móvil sin errores de consola.

### Aprendizaje técnico

Separar las reglas de un juego de su representación visual permite comprobar casos difíciles con rapidez y cambiar la interfaz sin alterar el comportamiento educativo.

### Próximo paso

Construir Comprensión lectora, el sexto juego del catálogo inicial.

## 29 de septiembre de 2026 — Diseño de Comprensión lectora

### Objetivo

Definir las reglas educativas y técnicas del sexto juego antes de comenzar su implementación.

### Trabajo realizado

- Se definieron tres dificultades con extensión y habilidades graduales.
- Se diseñó el flujo de lectura, pregunta, reintento, pista y explicación.
- Se establecieron el modelo de contenido, el estado del motor y el progreso local.
- Se escribieron criterios funcionales, de contenido, accesibilidad y pruebas.
- Se creó `AGENTS.md` con las reglas de trabajo y calidad del repositorio.
- Se creó un banco local de 18 relatos con preguntas, opciones, pistas y explicaciones.
- Se implementó `lib/reading-engine.js` con selección aleatoria, reintentos, pistas y finalización.
- Se añadieron pruebas automáticas para contenido, entradas inválidas, bloqueo, avance y cierre exacto.
- Se integraron la tarjeta de misión y las pantallas de introducción, partida y resultado.
- Se creó `reading-game.js` para tiempo, foco, pausa, salida, sonido y progreso local.
- Se añadieron estilos de lectura, respuestas, pista, explicación y adaptación a pantallas estrechas.

### Decisiones

- Valorar comprensión y relectura en lugar de velocidad.
- Mantener el cronómetro como información de sesión sin guardar mejores tiempos.
- Usar textos locales revisados, sin generación ni servicios externos.
- No guardar respuestas o errores concretos del niño.

### Verificación

- Se comprobó que la especificación respeta la arquitectura estática y el modelo local de privacidad.
- Se contrastaron los criterios con la definición de terminado de los juegos existentes.
- Los 18 relatos cumplen los rangos de extensión establecidos para sus niveles.
- Las seis suites automáticas del proyecto finalizaron correctamente.
- La sintaxis del motor y sus pruebas se comprobó con Node.js.
- Una partida Explorador completa verificó error, reintento, pista, explicación, pausa, salida y resultado.
- La salida de una partida incompleta no modificó el progreso ya guardado.
- El progreso de lectura se reflejó en el mapa y la consola del navegador quedó limpia.

### Próximo paso

Crear recompensas visuales y un resumen por habilidad, y luego ampliar accesibilidad y funcionamiento sin conexión.

## 29 de septiembre de 2026 — Constelación de habilidades

### Objetivo

Reconocer el progreso del catálogo sin introducir puntos, rachas o comparaciones.

### Trabajo realizado

- Se definieron seis habilidades asociadas a los juegos disponibles.
- Se creó un motor puro que deriva niveles, estados y progreso total desde los datos locales.
- Se añadió una constelación con tres chispas por habilidad al mapa de misiones.
- Se amplió el panel familiar con niveles recorridos y progreso general.
- Se sincronizaron las vistas mediante un evento local después de guardar cambios.

### Decisiones

- Representar variedad de niveles en vez de cantidad de partidas.
- Utilizar descripciones neutrales y evitar diagnósticos sobre capacidad.
- Calcular el resumen en cada lectura sin duplicarlo en `localStorage`.

### Verificación

- Las pruebas cubren estado vacío, datos desconocidos, cuatro etapas y catálogo completo.
- La constelación reflejó el progreso existente y se actualizó sin recargar.
- El contenido visual tiene cantidades y nombres accesibles.
- Las siete suites automáticas finalizaron correctamente y la consola permaneció limpia.

### Próximo paso

Ampliar accesibilidad y preparar funcionamiento sin conexión.
