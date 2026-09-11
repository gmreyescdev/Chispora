# Registro de decisiones

Este archivo conserva las decisiones importantes y sus motivos. Se actualizará durante todo el proyecto.

## D-001 — Público inicial

- **Decisión:** diseñar primero para niños de 8 años, considerando un rango aproximado de 7 a 9.
- **Motivo:** permite ajustar lenguaje, dificultad, lectura y controles a un grupo concreto.
- **Estado:** aceptada.

## D-002 — Primera versión sin servidor

- **Decisión:** comenzar con HTML, CSS y JavaScript, guardando el progreso en el dispositivo.
- **Motivo:** reduce complejidad, costo y exposición de datos infantiles durante la validación.
- **Estado:** propuesta.

## D-003 — Seis juegos para el MVP

- **Decisión:** Memorama, Operación misteriosa, Palabra desordenada, Secuencia lógica, Laberintos y Comprensión lectora.
- **Motivo:** cubren varias habilidades y permiten reutilizar componentes técnicos.
- **Estado:** propuesta.

## D-004 — Monetización dirigida al adulto

- **Decisión:** priorizar suscripción familiar, compra única o licencias escolares.
- **Motivo:** permite financiar el proyecto sin explotar la atención infantil.
- **Estado:** aceptada como principio.

## D-005 — Identidad provisional Chispora

- **Decisión:** utilizar **Chispora** como nombre de trabajo y “Juega. Piensa. Descubre.” como lema.
- **Motivo:** el nombre une la idea de una chispa mental con la exploración, es breve, pronunciable y permite ampliar la plataforma a familias y colegios.
- **Alternativas consideradas:** Misión Chispa, LudoLuz, Club Ingenio y Planeta Curioso.
- **Estado:** aceptada como identidad de trabajo. El dominio `chispora.cl` fue adquirido por el propietario. La marca presenta disponibilidad preliminar informada, pero todavía no ha sido solicitada ni registrada en INAPI.

## D-006 — Estado de dominio y marca

- **Fecha:** 5 de septiembre de 2026.
- **Decisión:** dejar constancia de que `chispora.cl` ya se encuentra adquirido para el proyecto.
- **Marca:** no se encontró un registro previo de CHISPORA según la comprobación informada por el propietario; se considera disponible de manera preliminar.
- **Alcance:** esta constancia no equivale a concesión, reserva ni protección de la marca. La disponibilidad definitiva dependerá de la solicitud y examen de INAPI.
- **Estado:** dominio asegurado; solicitud de marca pendiente.

## D-007 — Primer prototipo centrado en Memorama

- **Fecha:** 5 de septiembre de 2026.
- **Decisión:** el primer incremento funcional tendrá un solo juego completo: Memorama.
- **Motivo:** permite validar navegación, perfiles locales, niveles, recompensas, accesibilidad y pausas antes de multiplicar la complejidad.
- **Alternativas consideradas:** construir los seis juegos simultáneamente o comenzar solamente con una portada visual.
- **Estado:** aceptada.

## D-008 — Dos recorridos claramente separados

- **Fecha:** 5 de septiembre de 2026.
- **Decisión:** separar el recorrido infantil de la zona para familias.
- **Motivo:** reduce distracciones y evita mostrar configuraciones, métricas o futuras compras dentro del espacio de juego.
- **Estado:** aceptada.

## D-009 — Perfil local sin cuenta

- **Fecha:** 5 de septiembre de 2026.
- **Decisión:** permitir un apodo corto y un avatar, guardados únicamente en el dispositivo.
- **Motivo:** personaliza la experiencia sin recopilar identidad, correo ni contraseña del niño durante el MVP.
- **Estado:** aceptada.

## D-010 — Acceso adulto disuasorio, no autenticación

- **Fecha:** 5 de septiembre de 2026.
- **Decisión:** utilizar una acción deliberada para entrar en “Para familias”, dejando claro que no es una barrera de seguridad.
- **Motivo:** evita accesos accidentales sin crear cuentas en esta etapa. Un PIN o autenticación real se evaluará si aparecen datos, pagos o controles sensibles.
- **Estado:** aceptada para el MVP.

## D-011 — Navegación infantil lineal y visible

- **Fecha:** 7 de septiembre de 2026.
- **Decisión:** cada pantalla infantil tendrá una acción principal evidente y una salida secundaria predecible.
- **Motivo:** una navegación lineal reduce dudas en el primer uso y facilita observar dónde se bloquea el niño.
- **Alternativas consideradas:** barra inferior permanente con varias secciones y menú lateral.
- **Estado:** aceptada para el primer prototipo.

## D-012 — Un perfil local durante el MVP

- **Fecha:** 7 de septiembre de 2026.
- **Decisión:** la primera versión guardará un único perfil infantil por navegador.
- **Motivo:** permite validar el juego y el progreso sin diseñar todavía selección, edición y eliminación de varios perfiles.
- **Consecuencia:** varios hermanos compartirían el perfil durante esta etapa; el soporte multiperfil se evaluará después de las primeras pruebas.
- **Estado:** aceptada para el MVP.

## D-013 — Cierre explícito de la sesión

- **Fecha:** 7 de septiembre de 2026.
- **Decisión:** el resultado ofrecerá volver al mapa o terminar; nunca iniciará otra partida automáticamente.
- **Motivo:** refuerza que jugar tiene un final y evita convertir la continuidad en la opción por defecto.
- **Estado:** aceptada.

## D-014 — JavaScript progresivo sobre HTML completo

- **Fecha:** 7 de septiembre de 2026.
- **Decisión:** conservar las nueve pantallas y su contenido en HTML; JavaScript solamente oculta, navega y mejora la interacción.
- **Motivo:** si JavaScript falla, el contenido sigue siendo visible y comprensible. También facilita accesibilidad, revisión y alojamiento estático.
- **Alternativas consideradas:** generar todas las pantallas dinámicamente desde JavaScript o usar un framework SPA.
- **Estado:** aceptada e implementada.

## D-015 — Arquitectura Glassmorphism Modern adaptada

- **Fecha:** 7 de septiembre de 2026.
- **Decisión:** utilizar superficies claras translúcidas, formas redondeadas y gradientes suaves como dirección del prototipo.
- **Motivo:** comunica tecnología amable y permite aplicar la identidad de Chispora sin una estética infantil excesiva.
- **Límite:** todo componente translúcido tiene un fondo sólido de respaldo para conservar legibilidad.
- **Estado:** aceptada para el prototipo.

## D-016 — Navegación nativa sin ejecutar Lenis

- **Fecha:** 7 de septiembre de 2026.
- **Decisión:** usar desplazamiento nativo del navegador y no cargar Lenis en la página.
- **Motivo:** reduce peso y evita inconsistencias de rueda, panel táctil y escalado en Windows. Chispora no necesita inercia especial para cumplir su propósito.
- **Estado:** aceptada e implementada.

## D-017 — Aplicación estática sin framework

- **Fecha:** 7 de septiembre de 2026.
- **Decisión:** construir con HTML, CSS y JavaScript sin React, Vue, paquetes npm ni proceso de compilación.
- **Motivo:** el alcance actual es pequeño, puede alojarse fácilmente y permite aprender los fundamentos sin capas adicionales.
- **Revisión futura:** si la complejidad de estado o equipo crece, se volverá a evaluar con evidencia.
- **Estado:** aceptada para el MVP.

## D-018 — Laberintos perfectos generados localmente

- **Fecha:** 7 de septiembre de 2026.
- **Decisión:** generar cada laberinto en el navegador mediante búsqueda en profundidad con retroceso, conservando una única ruta simple entre cada par de casillas.
- **Motivo:** garantiza que todos los tableros tengan solución, permite crear partidas distintas sin descargar contenido y mantiene las reglas fáciles de auditar.
- **Alternativas consideradas:** dibujar mapas fijos manualmente, utilizar imágenes o generar laberintos con ciclos y múltiples soluciones.
- **Consecuencia:** la variedad visual es amplia, pero esta primera versión no incluye llaves, obstáculos ni rutas alternativas cíclicas.
- **Estado:** aceptada para el MVP.

## Plantilla para próximas decisiones

- **Fecha:**
- **Decisión:**
- **Motivo:**
- **Alternativas consideradas:**
- **Estado:** propuesta, aceptada, reemplazada o descartada.
