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
