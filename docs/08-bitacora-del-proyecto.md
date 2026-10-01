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

## 30 de septiembre de 2026 — Fracciones y programación

### Objetivo

Agregar dos juegos entretenidos que amplíen las habilidades del catálogo.

### Trabajo realizado

- Se investigaron propuestas de NCTM, Code.org y Education Endowment Foundation.
- Se construyó Fracciones en acción con identificación, comparación y equivalencias visuales.
- Se construyó Programa al robot con rutas, obstáculos, comandos y corrección de programas.
- Se añadieron seis pantallas, cuatro diálogos, progreso local y dos habilidades a la constelación.
- Se ampliaron el panel familiar y el catálogo a ocho juegos y 24 niveles.

### Decisiones

- Comenzar con tiras de fracciones por su lectura visual clara.
- Usar direcciones absolutas y programas completos para centrar Robot en secuencia y depuración.
- Aceptar rutas alternativas que lleguen a la meta.
- Dejar Reloj de aventuras y Laboratorio curioso como candidatos futuros.

### Verificación

- Todos los mapas de Robot tienen una solución automática comprobada.
- Los motores cubren entradas inválidas, errores, corrección, avance y finalización.
- Se completó una partida Explorador de cada juego en navegador.
- Las nueve suites automáticas pasaron y la consola permaneció limpia.

### Próximo paso

Realizar pruebas supervisadas y retomar accesibilidad ampliada y funcionamiento sin conexión.

### Corrección posterior a la revisión visual

- Se detectó que el nivel Explorador de Fracciones mostraba la notación correcta junto al modelo antes de responder.
- Se ocultó esa etiqueta únicamente en preguntas de identificación.
- Comparación y equivalencias conservan las etiquetas necesarias para plantear su relación.
- Cada segmento del modelo recibió una descripción accesible de su estado coloreado o sin color.

## 30 de septiembre de 2026 — Tiempo y laboratorio

### Objetivo

Completar los dos candidatos restantes con práctica cotidiana y razonamiento basado en evidencia.

### Trabajo realizado

- Se construyó Reloj de aventuras con horas, minutos y duración en tres niveles.
- Se construyó Laboratorio curioso con observaciones, predicciones y pruebas justas.
- Se creó un controlador compartido para el flujo de opciones sin unir las reglas educativas.
- Se añadieron seis pantallas, cuatro diálogos, progreso local y dos habilidades nuevas.
- El catálogo se amplió a diez juegos y la constelación a 30 niveles.

### Decisiones

- Mostrar los doce números en el reloj para apoyar el conteo de cinco en cinco.
- Diferenciar manecillas por longitud y color.
- Dar la evidencia antes de cada pregunta científica y explicarla después del acierto.
- Mantener bancos locales sin imágenes o servicios remotos.

### Verificación

- Las once suites automáticas pasaron y 36 archivos JavaScript tienen sintaxis válida.
- Se completó una partida Explorador de cada juego con error y corrección.
- Pausa, reanudación, salida cancelada y salida confirmada fueron comprobadas.
- Una partida incompleta no alteró el progreso.
- El HTML no tiene identificadores duplicados ni recursos faltantes.
- La consola permaneció limpia.

### Próximo paso

Realizar pruebas supervisadas de los diez juegos y continuar con accesibilidad ampliada y funcionamiento sin conexión.

## 30 de septiembre de 2026 — Interfaz compacta

### Objetivo

Mostrar antes las acciones importantes y simplificar las instrucciones de todos los juegos.

### Trabajo realizado

- Se redujeron títulos, espacios, radios y tarjetas sin cambiar el texto base.
- Las introducciones usan dos columnas desde 720 píxeles.
- Las diez instrucciones se reescribieron con acciones breves.
- El botón inicial ahora dice “Jugar”.
- Se compactaron tableros y controles de los diez juegos.
- Memorama, Laberintos y Comprensión lectora recibieron ajustes específicos para pantallas de poca altura.

### Verificación

- Se midieron las diez introducciones y los diez juegos en una ventana de 800 × 526 píxeles.
- No apareció desbordamiento horizontal.
- Los tableros principales redujeron su altura y las acciones iniciales quedaron visibles antes.
- La consola permaneció limpia.
- Se conservaron foco, orden semántico y controles táctiles cómodos.

### Próximo paso

Observar la interfaz en teléfonos físicos y validar las instrucciones con niños y adultos responsables.

## 30 de septiembre de 2026 — Mapa por áreas

### Objetivo

Ayudar a elegir entre diez juegos sin añadir una pantalla intermedia.

### Trabajo realizado

- Se documentaron las diez ideas de evolución y su orden recomendado.
- Se agruparon las misiones en Palabras, Números, Lógica y Exploración.
- Se añadieron filtros con cantidades, estado activo y mensaje anunciable.
- Se reemplazó “Disponible” por el área de cada juego.
- Se separaron reglas puras e interfaz en dos archivos.

### Verificación

- Todas muestra diez juegos; Palabras y Exploración muestran dos; Números y Lógica muestran tres.
- El filtro Lógica se activó correctamente con teclado.
- Un filtro desconocido recupera la vista completa.
- No apareció desbordamiento horizontal ni errores de consola.
- Las tarjetas permanecen visibles en el HTML sin JavaScript.

### Próximo paso

Crear el patrón común para tutoriales breves que puedan repetirse sin modificar progreso.

## 30 de septiembre de 2026 — Tutoriales breves

### Objetivo

Enseñar las acciones principales antes de jugar sin convertir la guía en una partida obligatoria.

### Trabajo realizado

- Se escribieron tres pasos y ejemplos para cada uno de los diez juegos.
- Se creó un motor común y un diálogo reutilizable.
- Cada introducción ofrece “Cómo se juega” junto a “Jugar”.
- Se añadió avance, retroceso, cierre libre y finalización explícita.
- La finalización se guarda fuera del progreso y la guía puede repetirse.

### Verificación

- Los diez tutoriales abrieron con contenido e indicadores correctos.
- Se comprobó teclado, Enter, Escape, Anterior, Siguiente y Entendido.
- Cerrar temprano no marca la guía; terminarla sí.
- El progreso permaneció idéntico después de completar una guía.
- Se corrigió el centrado de todos los diálogos.
- La consola permaneció limpia.

### Próximo paso

Implementar accesibilidad ampliada con preferencias locales y valores predeterminados seguros.

## 30 de septiembre de 2026 — Accesibilidad ampliada

### Objetivo

Dar a cada familia opciones sencillas para adaptar la presentación sin cambiar el progreso.

### Trabajo realizado

- Se añadieron texto grande, contraste alto, movimiento reducido y cronómetros ocultos.
- Las preferencias se guardan localmente y se aplican en todas las pantallas.
- Se creó un motor puro para normalizar ajustes nuevos y antiguos.
- La reducción manual se combinó con `prefers-reduced-motion`.
- Se evaluó lectura en voz alta local y se aplazó hasta probar voces y dispositivos reales.

### Verificación

- Un estado antiguo recuperó valores predeterminados sin perder perfil ni progreso.
- Las cuatro opciones persistieron después de recargar.
- Los cronómetros quedaron ocultos mientras la medición continuó.
- Texto grande y contraste alto no provocaron desbordamiento horizontal.
- Todos los controles conservaron etiquetas, foco visible y semántica nativa.
- Lighthouse obtuvo 100 en accesibilidad, buenas prácticas y SEO en el panel familiar.
- La consola permaneció limpia.

### Próximo paso

Preparar el funcionamiento sin conexión y la instalación opcional de Chispora.

## 30 de septiembre de 2026 — Funcionamiento sin conexión e instalación

### Objetivo

Guardar la aplicación completa en el dispositivo y ofrecer instalación opcional sin cuentas ni servicios externos.

### Trabajo realizado

- Se creó un manifiesto con iconos adaptables de 192 y 512 píxeles.
- Se precargaron 39 recursos locales mediante un service worker.
- El panel familiar muestra preparación, disponibilidad, desconexión e instalación.
- Las versiones nuevas permanecen en espera hasta que el adulto decide actualizar.
- `.htaccess` reconoce el manifiesto y revalida los archivos que controlan versiones.

### Verificación

- La aplicación recargó y abrió una partida con el servidor detenido.
- Los diez accesos de juego estaban presentes en modo sin conexión.
- La oferta de instalación apareció solo al ser habilitada por el navegador.
- Una versión nueva quedó en espera y reemplazó a la anterior solo después de pulsar Actualizar.
- Perfil, ajustes y progreso permanecieron intactos.
- El panel obtuvo 100 en Lighthouse y no mostró desbordamiento ni errores de consola.

### Próximo paso

Preparar el protocolo y los materiales para pruebas supervisadas breves.

## 30 de septiembre de 2026 — Preparación de pruebas supervisadas

### Objetivo

Dejar listas sesiones breves que permitan observar el producto sin evaluar ni identificar al niño.

### Trabajo realizado

- Se redactaron guiones de consentimiento adulto y asentimiento infantil.
- Se fijaron límites de 20 minutos, criterios de pausa y detención.
- Se creó una matriz que cubre los diez juegos, tres tamaños de dispositivo y tres métodos de entrada.
- Se preparó una ficha anónima por sesión sin nombres, contactos, escuela, ubicación ni grabaciones.
- Se definió una guía para agregar hallazgos y priorizar correcciones antes de la beta.

### Verificación

- Los primeros cinco códigos cubren cada juego una vez y los diez códigos los cubren dos veces.
- La ficha distingue observación independiente, indicio neutral, ayuda de interfaz, ayuda directa y detención.
- Los criterios de síntesis prohíben diagnósticos, comparaciones y perfiles infantiles.
- Se documentó claramente que todavía no existen resultados de sesiones reales.

### Próximo paso

Realizar primero un piloto adulto y después al menos cinco sesiones infantiles supervisadas. Registrar únicamente resultados agregados antes de decidir cambios y preparar la beta.

## 30 de septiembre de 2026 — Buzón de sugerencias

### Objetivo

Guardar propuestas de adultos e ideas infantiles revisadas por un adulto para evaluarlas posteriormente.

### Trabajo realizado

- Se creó y publicó Google Forms con juego opcional, categoría y sugerencia obligatorios.
- Se vinculó una hoja privada de Google Sheets.
- Se desactivaron recopilación de correos, obligación de iniciar sesión, resumen público y guardado automático de borradores.
- Se añadió una tarjeta en el panel familiar con aviso de salida externa y conexión necesaria.
- Se versionó el caché sin incorporar recursos externos al área infantil.

### Verificación

- Acceso sin credenciales al formulario y acceso anónimo rechazado a la hoja.
- Campos, categorías y privacidad comprobados; no se enviaron sugerencias reales.
- Pruebas de integración estática para ubicación, avisos y seguridad del enlace.
- Suite completa: 19 comprobaciones aprobadas en 17 archivos. Sintaxis de los dos JavaScript afectados y diff sin errores.
- Navegador: panel familiar y anchos de 320, 375 y 768 px sin desbordamiento; enlace enfocable y consola sin errores ni advertencias.
- Pendiente del propietario: enviar una prueba identificada y comprobar su fila en Sheets.

### Próximo paso

Comprobar la recepción, revisar ideas semanalmente y continuar las sesiones supervisadas pendientes.

## 30 de septiembre de 2026 — Sugerencias visibles al entrar

- **Motivo:** el usuario señaló que el buzón al final del panel familiar pasaba desapercibido.
- **Cambio:** tarjeta justo debajo del encabezado, antes de ajustes y progreso; botón principal, fondo diferenciado y borde visible. Se conservaron los avisos de privacidad y salida externa con texto más breve.
- **Decisión:** mejorar ubicación y jerarquía en lugar de añadir botones flotantes o enlaces de Google al área infantil.
- **Pruebas:** suite completa aprobada (20 comprobaciones); navegador a 320, 375, 768 y 1280 px sin desbordamiento, enlace enfocable y tarjeta antes de los ajustes. El botón queda dentro de una vista de 800 px de alto en los cuatro tamaños.
- **Actualización:** nueva versión de CSS y caché; las instalaciones existentes deben aceptar la actualización desde el panel familiar.
- **Pendiente:** se mantiene la comprobación de recepción del formulario y las sesiones supervisadas reales.
