# Guía para agentes de desarrollo

## Propósito del proyecto

Chispora es una plataforma de juegos educativos breves para niños de aproximadamente 7 a 9 años. Debe ofrecer una experiencia tranquila, segura y útil, sin publicidad invasiva, rastreadores ni mecánicas adictivas.

Antes de cambiar el producto, consulta `README.md`, `docs/01-vision-del-producto.md`, `docs/02-tecnologia-y-arquitectura.md` y `docs/03-hoja-de-ruta.md`.

## Arquitectura vigente

- Aplicación web estática construida con HTML, CSS y JavaScript sin frameworks.
- No hay gestor de paquetes, compilación, backend ni base de datos.
- `index.html` contiene las pantallas y el contenido esencial.
- `styles.css` contiene el sistema visual y el diseño adaptable.
- `main.js` gestiona navegación, perfil, ajustes y los tres primeros juegos.
- `sequence-game.js` y `maze-game.js` contienen controladores de interfaz independientes.
- `lib/*-engine.js` contiene reglas puras y comprobables de cada juego.
- `lib/manifest.js` centraliza marca, clave de almacenamiento y valores iniciales.
- `localStorage`, mediante la clave `chispora.mvp.v1`, conserva perfil, ajustes y progreso en el dispositivo.
- `tests/*-engine.test.js` prueba los motores con las APIs integradas de Node.js.

Mantén esta arquitectura durante el MVP. No añadas frameworks, dependencias npm, servicios externos o un backend sin una decisión explícita y documentada.

## Principios obligatorios

- Diseña primero para niños y usa instrucciones breves, amables y comprensibles.
- Premia el esfuerzo y la constancia; no castigues errores ni compares niños.
- No inicies otra partida automáticamente al finalizar una sesión.
- El sonido debe ser opcional y no debe reproducirse de forma molesta.
- Conserva soporte para mouse, teclado y pantalla táctil.
- Mantén foco visible, controles cómodos, contraste suficiente y compatibilidad desde 320 px.
- Respeta `prefers-reduced-motion` cuando agregues animaciones.
- No recopiles nombre real, correo, ubicación, escuela, fecha de nacimiento ni otros datos identificables.
- No añadas publicidad, rastreadores, analítica de terceros ni recursos remotos al área infantil.
- El acceso familiar por pulsación prolongada es disuasorio, no autenticación.

## Convenciones de implementación

- Usa JavaScript estricto dentro de una IIFE y evita contaminar el espacio global.
- Expón motores mediante `window.__BRAND__` para conservar compatibilidad con la aplicación y las pruebas.
- Separa las reglas del juego de su interfaz: `lib/<juego>-engine.js` no debe depender del DOM.
- Permite inyectar una función aleatoria en motores que mezclen contenido para facilitar pruebas deterministas.
- Escapa todo contenido dinámico antes de insertarlo mediante `innerHTML`.
- Conserva la mejora progresiva: la información principal debe seguir presente en HTML.
- Usa atributos `data-*` para enlazar comportamiento, siguiendo los componentes existentes.
- Evita aumentar `main.js` con juegos nuevos; crea un controlador independiente `<juego>-game.js`.
- Reutiliza las dificultades `explorador`, `aventurero` y `maestro` salvo que se documente otra decisión.
- Una partida incompleta no debe modificar el progreso.
- Pausar debe detener cronómetros y transiciones pendientes; salir debe limpiar el estado temporal.
- Guarda progreso al completar la partida, no en cada interacción.
- Mantén compatibilidad con datos antiguos de `localStorage` mediante valores predeterminados seguros.

## Pruebas y comprobaciones

Ejecuta todas las pruebas después de modificar reglas o integración:

```powershell
node --test tests/*.test.js
```

Comprueba la sintaxis de un archivo modificado con:

```powershell
node --check ruta/al/archivo.js
```

Para probar la aplicación en navegador:

```powershell
python -m http.server 8765
```

Abre `http://localhost:8765/` y revisa, según el cambio:

- Flujo completo desde introducción hasta resultado.
- Pausa, reanudación, salida cancelada y salida confirmada.
- Persistencia y recuperación segura del progreso.
- Interacción con teclado, mouse y controles táctiles.
- Vista móvil y ausencia de desbordamiento horizontal.
- Consola sin errores ni advertencias propias de la aplicación.
- Funcionamiento con sonido desactivado y movimiento reducido.

Cada motor nuevo debe tener pruebas deterministas para creación, entradas inválidas, bloqueo, errores, avance y finalización exacta.

## Documentación de cada incremento

Sigue el ritual de `docs/00-sistema-de-documentacion.md`. Un incremento terminado debe dejar:

1. Código versionable.
2. Motivo de las decisiones importantes.
3. Pruebas realizadas y resultados.
4. Explicación en lenguaje sencillo.

Actualiza cuando corresponda:

- `README.md`: estado general y mapa documental.
- `CHANGELOG.md`: cambios relevantes sin publicar.
- `docs/02-tecnologia-y-arquitectura.md`: responsabilidades técnicas.
- `docs/03-hoja-de-ruta.md`: estado de tareas.
- `docs/05-registro-de-decisiones.md`: elecciones con alternativas o consecuencias.
- `docs/08-bitacora-del-proyecto.md`: trabajo, pruebas, aprendizaje y próximo paso.
- Un documento específico de implementación y auditoría para cada juego nuevo.

No declares una tarea terminada solo porque se vea bien. Debe cumplir sus criterios, pasar pruebas, funcionar en los tamaños previstos y dejar actualizada la documentación afectada.

## Estado y siguiente prioridad

Hay ocho juegos implementados: Memorama, Operación misteriosa, Palabra desordenada, Secuencia lógica, Laberintos, Comprensión lectora, Fracciones en acción y Programa al robot.

Las recompensas visuales y el resumen por habilidad están implementados. Las siguientes prioridades son accesibilidad ampliada, funcionamiento sin conexión y publicación de una beta gratuita.
