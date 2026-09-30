# Tutoriales breves para los diez juegos

## Objetivo

Explicar la acción principal de cada juego antes de comenzar, mediante una guía breve, repetible y separada del progreso.

## Experiencia

Cada introducción incorpora dos acciones:

- **Cómo se juega:** abre la guía.
- **Jugar:** comienza una partida normal.

La guía comparte la misma estructura en los diez juegos:

1. tres pasos;
2. una instrucción corta por paso;
3. un ejemplo visual de texto y símbolos;
4. botones Anterior y Siguiente;
5. cierre libre mediante Cerrar o Escape.

El último paso usa el botón **Entendido**. Terminar una guía registra localmente que fue vista, pero siempre puede abrirse otra vez.

## Contenido por juego

| Juego | Conceptos de la guía |
|---|---|
| Memorama | Vista previa, elegir dos cartas y reunir parejas. |
| Operación misteriosa | Leer el cálculo, elegir signo y corregir. |
| Palabra desordenada | Observar letras, ordenarlas y usar ayudas. |
| Secuencia lógica | Observar, descubrir la regla y continuar. |
| Laberintos | Identificar la meta, mover y buscar otra ruta. |
| Comprensión lectora | Leer, localizar evidencia y responder. |
| Fracciones en acción | Contar partes, contar coloreadas y elegir notación. |
| Programa al robot | Planear, agregar comandos y depurar. |
| Reloj de aventuras | Leer minutos, leer hora y combinar. |
| Laboratorio curioso | Leer notas, encontrar evidencia y concluir. |

## Arquitectura

- `lib/tutorial-engine.js` contiene el contenido y las reglas puras de avance.
- `tutorials.js` crea los botones como mejora progresiva, controla el diálogo y registra finalizaciones.
- `tests/tutorial-engine.test.js` comprueba contenido, entradas desconocidas, avance, retroceso y cierre exacto.
- `index.html` contiene un único diálogo reutilizable.

Los botones se crean con JavaScript. Si este no está disponible, la introducción y el botón **Jugar** original permanecen completos.

## Persistencia

Las guías completadas se guardan en `tutorialsSeen`, fuera de `progress`. Cerrar antes del último paso no registra finalización. Completar una guía no altera:

- partidas terminadas;
- niveles recorridos;
- recompensas;
- mejores intentos;
- tiempo de juego.

Los datos antiguos siguen funcionando porque la rama se crea únicamente cuando se completa una guía.

## Accesibilidad

- Botones nativos para teclado, mouse y toque.
- Diálogo modal con título asociado.
- Foco trasladado al título de cada paso para anunciar el cambio.
- Paso actual comunicado con texto y `aria-live`.
- Indicadores visuales acompañados por “Paso X de 3”.
- Escape cierra la guía.
- El diálogo se centra y conserva controles de al menos 44 píxeles.

## Auditoría

Se comprobó:

- creación de diez botones, uno por juego;
- apertura de los diez contenidos correctos;
- tres pasos e indicadores en cada guía;
- avance, retroceso y estado deshabilitado de Anterior;
- apertura mediante Enter y cierre mediante Escape;
- cierre temprano sin registrar la guía;
- finalización con registro local;
- progreso idéntico antes y después de completar la guía;
- ausencia de desbordamiento horizontal;
- consola limpia.

La revisión visual detectó que el reinicio global de CSS anulaba el centrado nativo de los diálogos. Se añadió `margin: auto` a `.app-dialog`, corrigiendo tanto tutoriales como diálogos de pausa y salida.

## Pruebas

```powershell
node --test tests/tutorial-engine.test.js
node --test tests/*.test.js
node --check tutorials.js
```

## Próximo incremento

Ampliar los ajustes de accesibilidad: tamaño de texto, contraste, movimiento reducido configurable y opción para ocultar cronómetros.
