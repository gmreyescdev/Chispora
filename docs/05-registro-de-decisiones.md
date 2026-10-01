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

## D-019 — Comprensión antes que velocidad de lectura

- **Fecha:** 29 de septiembre de 2026.
- **Decisión:** Comprensión lectora mostrará el tiempo de sesión por coherencia con el catálogo, pero no guardará ni premiará un “mejor tiempo”.
- **Motivo:** leer con atención, releer y encontrar evidencia son los objetivos educativos; convertir la velocidad en recompensa puede producir presión y desalentar estrategias útiles.
- **Alternativas consideradas:** guardar mejores tiempos como en otros juegos u ocultar completamente el cronómetro.
- **Consecuencia:** el resultado puede informar cuánto duró la sesión, mientras el progreso se concentra en niveles completados, intentos extra, pistas y textos comprendidos.
- **Estado:** aceptada para el MVP.

## D-020 — Recompensas por exploración sin rachas ni puntos

- **Fecha:** 29 de septiembre de 2026.
- **Decisión:** representar cada nivel completado mediante una chispa permanente dentro de su habilidad, sin puntos acumulables, rachas, premios aleatorios o clasificaciones.
- **Motivo:** permite reconocer variedad y constancia sin generar presión por conectarse, competir o repetir mecánicamente una actividad.
- **Alternativas consideradas:** puntos por partida, insignias por velocidad y rachas diarias.
- **Consecuencia:** repetir un nivel conserva valor educativo, pero no aumenta artificialmente la recompensa visual.
- **Estado:** aceptada para el MVP.

## D-021 — Ampliación con fracciones y programación

- **Fecha:** 30 de septiembre de 2026.
- **Decisión:** ampliar el catálogo con Fracciones en acción y Programa al robot, dejando Reloj de aventuras y Laboratorio curioso como candidatos posteriores.
- **Motivo:** incorporan razonamiento matemático visual y pensamiento computacional, habilidades que no estaban representadas directamente en los seis juegos iniciales.
- **Alternativas consideradas:** lectura del reloj, dinero, clasificación científica y construir los cuatro juegos simultáneamente.
- **Consecuencia:** la constelación pasa de seis a ocho habilidades y de 18 a 24 niveles disponibles.
- **Estado:** aceptada e implementada.

## D-022 — Tiempo y ciencia como segunda ampliación

- **Fecha:** 30 de septiembre de 2026.
- **Decisión:** incorporar Reloj de aventuras y Laboratorio curioso como juegos noveno y décimo.
- **Motivo:** completan los cuatro candidatos evaluados y añaden una habilidad matemática cotidiana y razonamiento científico basado en evidencia.
- **Alternativas consideradas:** dinero y compras simuladas, clasificación de memoria y aplazar la ampliación hasta publicar la beta.
- **Consecuencia:** la constelación pasa de ocho a diez habilidades y de 24 a 30 niveles; ambos juegos comparten un controlador de interfaz, pero conservan motores independientes.
- **Estado:** aceptada e implementada.

## D-023 — Densidad compacta sin reducir legibilidad

- **Fecha:** 30 de septiembre de 2026.
- **Decisión:** reducir espacios, títulos y tableros, y usar dos columnas en introducciones y lectura cuando el ancho sea suficiente.
- **Motivo:** el crecimiento a diez juegos hizo que la escala inicial exigiera demasiado desplazamiento antes de jugar.
- **Alternativas consideradas:** reducir todo mediante `zoom`, ocultar información o saltar directamente a la partida.
- **Consecuencia:** el contenido aparece antes sin modificar la escala base del texto, el orden semántico ni el tamaño mínimo de los controles esenciales.
- **Estado:** aceptada e implementada.

## D-024 — Filtros de área sin navegación adicional

- **Fecha:** 30 de septiembre de 2026.
- **Decisión:** organizar las diez misiones con filtros temporales dentro del mismo mapa.
- **Motivo:** permite reducir la cantidad de opciones visibles sin añadir pasos obligatorios antes de jugar.
- **Alternativas consideradas:** cuatro pantallas independientes, acordeones, carruseles y una selección de área obligatoria.
- **Consecuencia:** todas las misiones siguen visibles por defecto y sin JavaScript; el filtro no se almacena como progreso.
- **Estado:** aceptada e implementada.

## D-025 — Tutorial único, repetible y separado del progreso

- **Fecha:** 30 de septiembre de 2026.
- **Decisión:** usar un diálogo compartido con tres pasos específicos por juego y registrar su finalización fuera del progreso.
- **Motivo:** mantiene instrucciones consistentes, evita diez implementaciones duplicadas y permite consultar la ayuda sin iniciar una partida.
- **Alternativas consideradas:** tutorial dentro de la primera partida, videos, recorridos automáticos y diez diálogos independientes.
- **Consecuencia:** completar o abandonar una guía no cambia niveles ni recompensas; los botones solo aparecen cuando JavaScript está disponible.
- **Estado:** aceptada e implementada.

## D-026 — Preferencias visuales globales y locales

- **Fecha:** 30 de septiembre de 2026.
- **Decisión:** guardar cuatro preferencias familiares dentro de `settings` y representarlas mediante atributos globales de HTML y reglas CSS.
- **Motivo:** permite adaptar todas las pantallas de forma consistente sin duplicar componentes ni mezclar presentación con las reglas educativas.
- **Alternativas consideradas:** ajustes por juego, controles flotantes en el área infantil y depender únicamente de preferencias del sistema.
- **Consecuencia:** texto, contraste, movimiento y cronómetros se configuran en un solo lugar; los datos antiguos recuperan valores seguros y la reducción del sistema siempre se respeta.
- **Estado:** aceptada e implementada.

## D-027 — Caché completo con activación controlada

- **Fecha:** 30 de septiembre de 2026.
- **Decisión:** precargar una versión completa de la aplicación y mantener las actualizaciones en espera hasta que el adulto las acepte.
- **Motivo:** evita que una partida combine HTML, estilos y motores de versiones distintas, sin depender de un servidor para jugar.
- **Alternativas consideradas:** caché dinámico recurso por recurso, actualización automática inmediata y conservar todos los cachés indefinidamente.
- **Consecuencia:** cada publicación debe incrementar el nombre del caché y mantener su lista de recursos; el caché anterior se elimina únicamente después de activar correctamente el nuevo.
- **Estado:** aceptada e implementada.

## D-028 — Observación manual, anónima y centrada en el producto

- **Fecha:** 30 de septiembre de 2026.
- **Decisión:** realizar sesiones de hasta 20 minutos con consentimiento del adulto, asentimiento del niño y fichas manuales identificadas solo por un código no reutilizable.
- **Motivo:** permite descubrir problemas de comprensión y comodidad sin incorporar vigilancia, analítica ni perfiles infantiles al producto.
- **Alternativas consideradas:** grabar sesiones, instalar analítica de comportamiento, medir velocidad individual y solicitar formularios identificables.
- **Consecuencia:** la síntesis requiere trabajo manual y una muestra pequeña no permite conclusiones estadísticas, pero protege la privacidad y mantiene el foco en mejorar la interfaz.
- **Estado:** aceptada; protocolo preparado y ejecución pendiente.

## D-029 — Sugerencias externas revisadas por adultos

- **Fecha:** 30 de septiembre de 2026.
- **Decisión:** usar Google Forms con respuestas vinculadas a una hoja privada, mediante un enlace explícito solo desde el panel familiar.
- **Motivo:** el propietario eligió conservar propuestas para evaluarlas sin construir un backend ni pedir cuentas a las familias.
- **Alternativas consideradas:** enlace de correo, formulario incrustado y backend propio.
- **Consecuencia:** requiere conexión y tratamiento externo de Google; no se envían perfil ni progreso, no se solicitan correos y las sugerencias nunca se publican automáticamente.
- **Estado:** aceptada e implementada; verificación de envío completo pendiente del propietario.

## Plantilla para próximas decisiones

- **Fecha:**
- **Decisión:**
- **Motivo:**
- **Alternativas consideradas:**
- **Estado:** propuesta, aceptada, reemplazada o descartada.
