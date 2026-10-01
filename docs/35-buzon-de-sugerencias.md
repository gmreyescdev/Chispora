# Buzón privado de sugerencias

## Experiencia

El panel familiar ofrece **Enviar una sugerencia**. Un adulto puede compartir su propuesta o transmitir una idea de un niño, sin nombres, contactos, escuela ni otros datos personales.

La tarjeta aparece justo debajo de «Para familias», antes de los ajustes y el progreso, con fondo diferenciado y botón principal. Esta ubicación evita que el buzón quede oculto al final de una pantalla larga, sin llevarlo al área infantil.

El enlace abre Google Forms en otra pestaña. No hay formulario incrustado, scripts de Google ni solicitudes automáticas a Google desde Chispora. El enlace tampoco incluye perfil, progreso ni parámetros precargados.

El formulario requiere conexión; los juegos siguen funcionando sin red. Chispora no guarda borradores de sugerencias ni confirma envíos: la confirmación corresponde a Google Forms.

## Formulario creado

Título: **Chispora · Ideas y sugerencias**.

Enlace público para responder:

https://docs.google.com/forms/d/e/1FAIpQLSdNQjfuve6K-9SO5aMy9PHookGjut4CpKrGaD_E1Bu2HxHTjQ/viewform

Campos:

1. Juego relacionado, opcional (texto libre).
2. Categoría, obligatoria: Nuevo juego, Mejorar un juego, Otra idea, Instrucciones o Problema técnico.
3. Sugerencia, obligatoria (párrafo).

No solicita nombre ni correo, no exige iniciar sesión, no limita a una respuesta y no muestra el resumen de resultados a quienes responden. El guardado automático de borradores en cuentas Google está deshabilitado.

## Destino y operación

Las respuestas están vinculadas a la hoja **Chispora - Buzón privado de sugerencias**, creada en la cuenta del propietario. Se accede desde la pestaña **Respuestas → Ver en Hojas de cálculo** del formulario. La hoja no se enlaza desde la aplicación ni se comparte públicamente.

Cada respuesta guarda automáticamente una marca temporal junto con los tres campos. Se recomienda revisar el buzón semanalmente y añadir, sin modificar las columnas originales, columnas de seguimiento: estado, decisión y próximo paso.

Estados recomendados: pendiente, en evaluación, planificada, implementada y descartada. No hay votos, perfiles de participantes ni comentarios públicos.

## Privacidad y límites

Google Forms es un servicio externo sujeto a las condiciones y política de privacidad de Google. Desactivar la recopilación de correos no elimina el tratamiento de datos técnicos que pueda realizar Google. No se promete anonimato técnico absoluto.

El aviso de no incluir datos personales reduce riesgos, pero no puede impedir que alguien los escriba en texto libre. El propietario debe:

- eliminar datos identificables y spam al revisar;
- no compartir ni publicar respuestas individuales;
- mantener restringido el acceso a la hoja y a la edición del formulario;
- conservar las respuestas originales como máximo 90 días antes de resumir las ideas útiles y eliminarlas;
- recordar que eliminar filas de Sheets no elimina las respuestas de Forms: revisar ambos destinos y sus papeleras cuando corresponda;
- no usar este buzón para recibir fichas de observación infantil ni solicitudes que necesiten respuesta personal.

Sin correo de contacto no puede prometerse una respuesta individual. Las ideas se evalúan, pero no se garantiza su implementación.

## Implementación

- `index.html`: tarjeta y enlace estáticos solo en el panel familiar, disponibles como mejora progresiva.
- `styles.css`: tarjeta compacta, adaptable y compatible con preferencias de accesibilidad.
- `sw.js`: nueva versión del caché y nueva referencia a CSS; nunca precarga el destino externo.
- `tests/suggestions.test.js`: verifica ubicación, avisos, seguridad del enlace y ausencia de incrustación o precarga de Google.

El enlace usa `noopener noreferrer`, `referrerpolicy="no-referrer"` y un aviso accesible de nueva pestaña. No añade backend, paquetes ni almacenamiento infantil.

## Verificación

- El formulario publicado se abrió mediante una petición sin credenciales.
- Se comprobaron sus tres campos, categorías y preguntas obligatorias.
- Se verificó “No recopilar”, ausencia del límite de una respuesta y resumen de resultados deshabilitado.
- Se creó y vinculó la hoja; el acceso anónimo a su URL devolvió 401.
- `node --test tests/*.test.js`: 19 comprobaciones aprobadas en 17 archivos, sin fallos.
- `node --check sw.js`, `node --check tests/suggestions.test.js` y `git diff --check`: sin errores.
- Panel familiar comprobado en navegador y en marcos de 320, 375 y 768 px, sin desbordamiento horizontal; el enlace acepta foco y la consola no registra errores ni advertencias.
- No se envió una sugerencia real. La comprobación de una respuesta completa hasta la fila de Sheets queda pendiente de un envío de prueba por el propietario.

Para esa comprobación, enviar “PRUEBA TÉCNICA — no evaluar como sugerencia”, verificar la fila y eliminar la respuesta de Forms y Sheets. Nunca usar datos infantiles reales para probar.

## Explicación sencilla

Un adulto pulsa el botón, escribe una idea en Google Forms y Google la guarda en tu hoja privada. Chispora no envía nada del niño ni muestra lo que otras familias escribieron.
