# Accesibilidad ampliada

## Objetivo

Permitir que cada familia adapte la presentación de Chispora sin cambiar las reglas, el progreso ni las recompensas de los juegos.

## Preferencias incorporadas

El panel familiar incluye cuatro ajustes persistentes:

- **Tamaño del texto:** normal o grande. La opción grande aumenta la escala base de 16 a 18 píxeles y, con ella, los componentes definidos en `rem`.
- **Contraste:** estándar o alto. El modo alto usa fondo blanco, texto más oscuro, bordes sólidos y foco reforzado; también elimina los adornos del fondo.
- **Movimiento:** según el dispositivo o reducido. La aplicación siempre respeta `prefers-reduced-motion`; la opción manual permite solicitarlo aunque el sistema no lo haga.
- **Cronómetros:** mostrar u ocultar durante las partidas. Ocultarlos no detiene la medición ni altera los resultados.

Los cambios se aplican al guardar y permanecen después de cerrar o recargar la página.

## Arquitectura

- `lib/accessibility-engine.js` valida preferencias, genera atributos de presentación y combina la reducción manual con la del sistema.
- `lib/manifest.js` define valores iniciales seguros.
- `main.js` recupera, aplica y guarda los ajustes mediante atributos `data-*` en el elemento `html`.
- `styles.css` representa las preferencias sin duplicar pantallas ni alterar los motores.
- `tests/accessibility-engine.test.js` comprueba valores antiguos, entradas válidas, atributos y reducción de movimiento.

Las cuatro propiedades viven dentro de `settings`, no de `progress`. La carga combina datos guardados con valores predeterminados, por lo que los estados creados antes de este incremento siguen funcionando.

## Decisiones de alcance

### Cronómetros

Solo se oculta el contador visible de la barra de partida. El reloj interno continúa para conservar resultados comparables si la familia vuelve a mostrarlo. Los tiempos de una partida ya terminada siguen presentes en su resumen.

### Movimiento

La preferencia manual reduce animaciones y transiciones CSS y evita el desplazamiento de entrada de GSAP. También desactiva el efecto magnético de los botones. La preferencia del sistema conserva prioridad: nunca se fuerza movimiento cuando el dispositivo solicita reducirlo.

### Lectura en voz alta

Se evaluó la API local `speechSynthesis`, pero no se incorpora todavía. La disponibilidad, pronunciación en español, voces instaladas y uso local o remoto dependen del navegador y del sistema operativo. Añadirla sin pruebas en dispositivos reales podría producir una experiencia desigual. Se mantiene como evaluación posterior, sin usar servicios externos.

## Auditoría

Se comprobó:

- recuperación de las cuatro preferencias en un estado antiguo que no las contenía;
- aplicación inmediata al guardar y persistencia después de recargar;
- conservación del perfil y del progreso existentes;
- texto base de 18 píxeles en modo grande;
- contraste alto sin fondos decorativos ni pérdida del foco;
- duración mínima de transiciones y animaciones al reducir movimiento;
- ocultación de los diez cronómetros de partida mientras su medición continúa;
- ocho controles nativos del formulario, todos etiquetados, habilitados y alcanzables por teclado;
- foco visible de 3 píxeles, reforzado a 4 píxeles en contraste alto;
- ausencia de desbordamiento horizontal;
- consola limpia;
- puntuación 100 en la auditoría de accesibilidad de Lighthouse para el panel familiar.

## Pruebas

```powershell
node --test tests/accessibility-engine.test.js
node --test tests/*.test.js
node --check main.js
node --check lib/accessibility-engine.js
```

## Explicación sencilla

Una familia puede hacer Chispora más grande, más contrastada, más quieta o esconder el reloj. La elección queda guardada solo en ese navegador y no cambia lo que el niño ha conseguido.

## Próximo incremento

Preparar funcionamiento sin conexión mediante un manifiesto web y un service worker con actualización controlada.
