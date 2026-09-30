# Funcionamiento sin conexión e instalación opcional

## Objetivo

Permitir que Chispora se abra como aplicación y que sus diez juegos continúen disponibles después de una primera carga con conexión.

## Experiencia

El panel familiar incorpora una tarjeta **Chispora en este equipo** con un estado breve:

- **Preparando uso sin conexión:** el navegador está instalando los recursos esenciales.
- **Lista para usar sin conexión:** los juegos ya están guardados en el dispositivo.
- **Sin conexión · puedes seguir jugando:** no hay red, pero la copia local está preparada.
- **Uso sin conexión no disponible aquí:** el navegador no admite service workers.

El botón **Instalar Chispora** solo aparece cuando el navegador ofrece esa capacidad. La instalación es opcional, no crea una cuenta y no modifica el progreso. Si el navegador no expone el botón, todavía puede ofrecer instalación desde su propio menú.

## Arquitectura

- `app.webmanifest` define nombre, colores, modo independiente, acceso directo e iconos de 192 y 512 píxeles.
- `sw.js` precarga 39 recursos locales en un caché versionado.
- `lib/pwa-engine.js` deriva mensajes y acciones para preparación, conexión, instalación y actualización.
- `pwa.js` registra el service worker, escucha cambios de conexión y controla las acciones de instalación y actualización.
- `assets/icons/*` contiene el icono vectorial fuente y las variantes PNG seguras para iconos adaptables.
- `.htaccess` declara el tipo MIME del manifiesto y obliga a revalidar código, manifiesto y service worker.

No se añade backend, cuenta, analítica ni recurso remoto.

## Estrategia sin conexión

La instalación del service worker descarga de forma atómica:

- documento principal y estilos;
- manifiesto e iconos;
- librerías locales;
- motores de los diez juegos;
- controladores de interfaz;
- mapa, recompensas, tutoriales, accesibilidad e instalación.

Las navegaciones y los recursos esenciales usan primero el caché de la versión activa. Si no existe una respuesta local para una navegación, se recupera `index.html`. Las solicitudes ajenas al origen no se guardan.

## Actualizaciones controladas

Cada publicación debe cambiar `CACHE_NAME` en `sw.js` y actualizar las versiones de los archivos modificados. El nuevo service worker:

1. crea otro caché completo;
2. permanece en espera;
3. muestra **Actualizar Chispora** en el panel familiar;
4. solo se activa cuando el adulto pulsa el botón;
5. recarga la aplicación y elimina el caché anterior.

Esto evita mezclar archivos de dos versiones. Los cachés no contienen `localStorage`, de modo que perfil, ajustes y progreso sobreviven a la actualización.

## Mejora progresiva y seguridad

- Sin JavaScript, el contenido esencial sigue presente, aunque no puede instalarse por primera vez.
- El service worker solo se registra en contextos seguros; `localhost` cuenta como seguro durante desarrollo y la publicación requerirá HTTPS.
- La instalación no se solicita automáticamente ni bloquea el uso en navegador.
- El botón de actualización solo está visible en el panel familiar, fuera de la partida infantil.
- Los mensajes usan una región de estado anunciable y no dependen únicamente del color.

## Auditoría

Se comprobó:

- manifiesto JSON válido con modo `standalone` e iconos de 192 y 512 píxeles;
- registro activo con alcance completo del sitio;
- 39 recursos locales presentes en el caché;
- tarjeta compacta sin desbordamiento horizontal;
- oferta de instalación y cancelación recuperable;
- cambio anunciado entre estados conectado y sin conexión;
- recarga real con el servidor local detenido;
- presencia de los diez accesos de juego y apertura de Reloj de aventuras sin red;
- reglas y finalización de los diez juegos cubiertas por sus pruebas deterministas;
- versión nueva en espera hasta la acción explícita del adulto;
- eliminación del caché anterior después de actualizar;
- conservación del perfil, los ajustes y el número de partidas terminadas;
- consola limpia;
- puntuación 100 en accesibilidad, buenas prácticas y SEO para el panel familiar.

## Pruebas

```powershell
node --test tests/pwa-engine.test.js tests/service-worker.test.js
node --test tests/*.test.js
node --check pwa.js
node --check sw.js
python -m json.tool app.webmanifest
```

## Explicación sencilla

Después de abrir Chispora una vez con internet, el navegador guarda la aplicación completa. Más tarde puede abrirla sin red. Si hay una versión nueva, el adulto decide cuándo actualizar y el progreso permanece en el equipo.

## Próximo incremento

Preparar pruebas supervisadas breves con adultos responsables y niños, usando registros manuales anónimos.
