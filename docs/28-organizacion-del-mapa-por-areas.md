# Organización del mapa por áreas

## Objetivo

Facilitar la elección entre diez juegos sin crear una pantalla adicional ni esconder contenido esencial.

## Áreas

| Área | Juegos |
|---|---|
| Palabras | Palabra desordenada y Comprensión lectora. |
| Números | Operación misteriosa, Fracciones en acción y Reloj de aventuras. |
| Lógica | Secuencia lógica, Laberintos y Programa al robot. |
| Exploración | Memorama y Laboratorio curioso. |

La clasificación describe la habilidad principal de cada juego. No pretende limitar otras habilidades que también se practican.

## Interfaz

El mapa incorpora cinco controles:

- **Todas:** muestra los diez juegos.
- **Palabras:** muestra dos juegos.
- **Números:** muestra tres juegos.
- **Lógica:** muestra tres juegos.
- **Exploración:** muestra dos juegos.

Cada control incluye la cantidad disponible y usa `aria-pressed` para comunicar cuál está activo. Un mensaje vivo anuncia el resultado, por ejemplo, “3 juegos de Lógica”. Las tarjetas muestran el nombre de su área en lugar del texto redundante “Disponible”.

En pantallas estrechas, la fila de áreas puede desplazarse horizontalmente sin provocar desbordamiento en toda la página.

## Arquitectura

- `lib/mission-map-engine.js` valida áreas, decide coincidencias y crea el texto de estado.
- `mission-map.js` enlaza botones y tarjetas mediante atributos `data-*`.
- `tests/mission-map-engine.test.js` comprueba áreas, recuperación segura, coincidencias y mensajes.

El filtro no se guarda en `localStorage`: es una preferencia momentánea de navegación, no progreso infantil.

## Mejora progresiva

Las tarjetas no tienen `hidden` en el HTML. Si JavaScript no está disponible, los diez juegos permanecen visibles y sus etiquetas de área siguen siendo comprensibles. El controlador solo oculta temporalmente las tarjetas después de elegir un filtro.

## Accesibilidad y privacidad

- Los filtros son botones nativos utilizables con teclado, mouse y toque.
- El foco visible se conserva.
- El estado activo se comunica con texto, color y `aria-pressed`.
- El cambio de filtro se anuncia mediante `aria-live`.
- No se modifica ni se transmite el progreso.
- Elegir un área no inicia automáticamente ningún juego.

## Auditoría

Se comprobó en navegador:

- Vista inicial con diez juegos y un único botón activo.
- Palabras con dos juegos correctos.
- Números con tres juegos correctos.
- Lógica con tres juegos correctos mediante teclado y tecla Enter.
- Estado activo y mensaje anunciable actualizados.
- Ausencia de desbordamiento horizontal.
- Consola sin errores ni advertencias propias de la aplicación.

El motor también recupera la vista completa cuando recibe un identificador desconocido.

## Pruebas

```powershell
node --test tests/mission-map-engine.test.js
node --test tests/*.test.js
node --check mission-map.js
```

## Próximo incremento

Diseñar tutoriales breves y repetibles para los diez juegos, comenzando por un patrón común que no modifique el progreso.
