# Implementación del prototipo navegable

## Resultado

El proyecto ya puede abrirse como una web. Las nueve pantallas existen, se puede recorrer el flujo infantil y el familiar, y el navegador conserva el perfil y los ajustes localmente.

Memorama nació en esta etapa como una demostración visual. Su implementación completa y la auditoría posterior están documentadas en `16-implementacion-y-auditoria-memorama.md`.

## Responsabilidad de cada archivo

### `index.html`

Contiene la estructura y el contenido real. Define títulos, botones, formularios, tablero y diálogos.

La decisión importante es que las pantallas no nacen desde JavaScript. Si el script falla, el documento todavía permite leer toda la propuesta.

### `styles.css`

Contiene los colores, tipografía, tamaños, distribución, estados y adaptación a teléfonos, tabletas y escritorio.

Está organizado en bloques: variables, base, utilidades, fondo, componentes, pantallas, efectos y tamaños de pantalla.

### `main.js`

Agrega comportamiento:

- Muestra una pantalla a la vez.
- Actualiza el hash de la dirección.
- Valida y guarda el perfil.
- Permite elegir un avatar.
- Actualiza la descripción de dificultad.
- Demuestra el giro de cartas.
- Abre diálogos de pausa y salida.
- Gestiona la pulsación prolongada del acceso adulto.
- Guarda ajustes familiares.

El archivo utiliza una IIFE: una función que se ejecuta inmediatamente y evita contaminar el espacio global del navegador.

### `lib/manifest.js`

Define datos estables de la marca, la clave de almacenamiento y valores iniciales. Expone un único objeto global llamado `window.__BRAND__`.

### `.htaccess`

Configura el alojamiento Apache para que HTML, CSS y JavaScript no queden obsoletos por caché después de publicar cambios.

## Navegación por hash

Cada pantalla tiene un identificador, por ejemplo `#misiones`. El texto después de `#` se llama hash.

Cuando cambia:

1. JavaScript comprueba que la pantalla exista.
2. Oculta las demás pantallas mediante el atributo `hidden`.
3. Muestra la pantalla solicitada.
4. Lleva el foco al título para orientar a usuarios de teclado o lectores de pantalla.

Este mecanismo mantiene una sola página física y permite usar Atrás y Adelante del navegador.

## Estado local

El objeto guardado tiene tres grupos:

```text
appState
├── profile
│   ├── nickname
│   └── avatarId
├── settings
│   ├── sessionMinutes
│   ├── soundEnabled
│   └── preferredDifficulty
└── progress
    └── completedGames
```

Se serializa como JSON en `localStorage`. Permanece en ese navegador y no viaja a ningún servidor.

## Mejora progresiva

El contenido empieza como HTML legible. Cuando JavaScript está disponible, el documento recibe la clase `js-enabled` y se convierte en una experiencia de una pantalla a la vez.

Esta estrategia se denomina mejora progresiva: comenzar con una base robusta y añadir capacidades, en vez de depender completamente de ellas.

## Seguridad y privacidad actuales

- No hay cuentas ni contraseñas.
- No se transmite información.
- No hay analítica, publicidad ni recursos infantiles de terceros.
- El apodo y la configuración permanecen en el dispositivo.
- La pulsación prolongada del área adulta evita accidentes, pero no es autenticación.

## Cómo ejecutarlo

Desde la carpeta del proyecto:

```powershell
python -m http.server 8765
```

Abrir `http://localhost:8765/` en el navegador.

También se puede abrir `index.html` directamente. El servidor local se recomienda porque se parece más al futuro alojamiento.

## Pruebas realizadas

| Prueba | Resultado |
|---|---|
| Sintaxis de `main.js` | Correcta. |
| Scripts como módulos | Ninguno. |
| Scripts sin `defer` | Ninguno. |
| Referencias a imágenes inexistentes | Ninguna. |
| Mezcla JPG/PNG en producción | Ninguna. |
| Patrón IIFE | Correcto. |
| Manifiesto de marca | Correcto. |
| Respuesta del servidor local | HTTP 200. |
| Número de pantallas detectadas | Nueve. |
| Validación de apodo inválido | Mensaje correcto y foco devuelto al campo. |
| Perfil y avatar | Guardados; navegación al mapa correcta. |
| Selector de dificultad | Resumen actualizado correctamente. |
| Cartas demostrativas | Estado visual y mensaje actualizados. |
| Diálogo de pausa | Apertura y cierre correctos. |
| Consola del navegador | Sin errores ni advertencias. |
| Vista móvil 360 × 800 | Sin desbordamiento horizontal. |

## Qué debes poder explicar en esta etapa

- Por qué HTML, CSS y JavaScript tienen responsabilidades diferentes.
- Qué significa navegación por hash.
- Qué información guarda `localStorage`.
- Por qué no usamos todavía backend o framework.
- Cómo iniciar el servidor y abrir el prototipo.
- Por qué el contenido permanece en HTML aunque JavaScript gestione la navegación.

## Incremento siguiente a este documento

La implementación completa de Memorama se realizó en el incremento posterior. El siguiente juego pendiente de la Fase 1 es Operación misteriosa.
