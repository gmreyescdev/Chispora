# Compactación visual e instrucciones

## Objetivo

Reducir el desplazamiento necesario para elegir y comenzar un juego, y expresar cada instrucción con acciones breves y directas.

## Problema observado

La interfaz conservaba títulos, espacios y tarjetas pensados para un catálogo pequeño. Al crecer a diez juegos, esa escala hacía que:

- las introducciones ocuparan demasiado espacio vertical;
- el botón para iniciar quedara cerca o fuera del borde inferior en pantallas bajas;
- algunos tableros requirieran desplazarse antes de ver sus controles;
- las explicaciones iniciales mezclaran varias ideas en una sola frase.

## Cambios realizados

### Densidad general

- Se redujeron títulos, radios, espacios internos y separaciones.
- El área principal comienza más cerca del borde superior.
- Los botones principales bajaron de 48 a 46 píxeles mínimos, mientras los controles secundarios conservan al menos 42–44 píxeles.
- Las tarjetas de misión colocan icono y descripción en la misma fila.
- La constelación y los resultados usan menos espacio sin ocultar información.

### Inicio rápido

Desde 720 píxeles, cada introducción presenta en dos columnas:

1. nombre e instrucción;
2. dificultad, resumen y botón **Jugar**.

En anchos menores conserva una sola columna. No se cambió el orden del documento, por lo que la lectura con teclado y tecnologías de asistencia sigue siendo predecible.

### Juegos

- Memorama limita el ancho del tablero para evitar cartas excesivamente grandes.
- Operación misteriosa reduce ecuación y opciones.
- Palabras y Secuencias reducen fichas, separaciones y zonas internas.
- Laberintos limita el tablero y coloca los controles en una fila desde 540 píxeles.
- Comprensión lectora distribuye relato y pregunta en dos columnas desde 720 píxeles.
- Fracciones, Robot, Reloj y Laboratorio reducen tableros, modelos, relojes y espacios internos.
- Los controles táctiles esenciales siguen manteniendo dimensiones cómodas.

### Instrucciones

Las diez introducciones ahora usan dos acciones como máximo. Ejemplos:

- “Mira el resultado. Elige el signo correcto.”
- “Descubre la regla. Elige qué elemento sigue.”
- “Agrega flechas. Ejecuta y corrige la ruta.”
- “Lee las notas. Elige la conclusión con evidencia.”

El botón **Comenzar** se reemplazó por **Jugar**, una llamada a la acción más breve.

## Auditoría

En una ventana de 800 × 526 píxeles se comprobó:

- las diez introducciones sin desbordamiento horizontal;
- nueve botones **Jugar** claramente dentro de la vista y Comprensión lectora ajustada con una nota más breve;
- el botón de Operación misteriosa pasó de terminar cerca de 473 píxeles a terminar cerca de 374 píxeles antes del último ajuste tipográfico;
- Memorama pasó de un tablero de 576 a aproximadamente 365 píxeles de alto;
- Laberintos pasó de aproximadamente 586 a 406 píxeles;
- Comprensión lectora pasó de aproximadamente 459 a 397 píxeles mediante dos columnas;
- Operación, Palabras, Secuencias, Fracciones, Robot, Reloj y Laboratorio muestran su área principal dentro de la primera vista o junto a su borde inferior;
- la consola no mostró errores ni advertencias propias de la aplicación.

También se revisaron sintaxis, pruebas automáticas, identificadores HTML y recursos locales. La mejora adaptable desde 320 píxeles se conserva mediante la columna única y los límites fluidos existentes; sigue pendiente una observación manual adicional en dispositivos físicos.

## Decisiones de accesibilidad

- No se redujo el texto base del cuerpo.
- No se ocultaron instrucciones ni datos de progreso.
- Se conservaron foco visible, controles nativos y orden semántico.
- La disposición en columnas solo cambia la presentación visual.
- Los juegos que necesitan lectura extensa pueden seguir desplazándose naturalmente.

## Próximo paso

Validar la nueva densidad con niños y adultos responsables, especialmente en teléfonos de 320–390 píxeles y en pantallas con altura reducida.
