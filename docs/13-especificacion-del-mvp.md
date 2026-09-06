# Especificación del primer prototipo

## Objetivo del incremento

Construir una experiencia navegable y jugable que permita a un niño crear un perfil local, encontrar Memorama, completar una partida y recibir un cierre saludable. El adulto podrá configurar opciones básicas sin crear una cuenta.

## Alcance incluido

- Bienvenida e identidad Chispora.
- Perfil local con apodo y avatar.
- Mapa de misiones.
- Memorama con tres dificultades.
- Resultado y progreso local.
- Sugerencia de descanso.
- Panel familiar con configuración local.
- Diseño adaptable, accesibilidad básica y navegación con teclado.

## Fuera de alcance

- Backend, base de datos o sincronización.
- Registro, correo o contraseña.
- Pagos y suscripciones.
- Publicidad y analítica de terceros.
- Aplicación móvil nativa.
- Los otros cinco juegos completos.
- Panel escolar.

## Reglas de Memorama

### Dificultades

| Nivel | Tablero | Parejas | Ayuda inicial |
|---|---:|---:|---|
| Explorador | 3 × 4 | 6 | Cartas visibles durante 3 segundos. |
| Aventurero | 4 × 4 | 8 | Cartas visibles durante 2 segundos. |
| Maestro del mapa | 4 × 5 | 10 | Sin vista previa automática. |

### Comportamiento

1. El jugador descubre una carta.
2. Descubre una segunda carta.
3. Si coinciden, permanecen visibles y se celebra discretamente.
4. Si no coinciden, se muestran brevemente y vuelven a ocultarse.
5. No se permite descubrir una tercera carta durante la comparación.
6. La partida termina al encontrar todas las parejas.

No se penalizan intentos. Los movimientos sirven para observar progreso personal, no para comparar niños.

## Criterios de aceptación funcionales

- El perfil se conserva después de recargar la página en el mismo navegador.
- El apodo tiene un límite visible y no exige nombre real.
- Las cartas se mezclan al iniciar una nueva partida.
- Cada carta puede activarse mediante clic, toque o teclado.
- Una carta encontrada no puede volver a seleccionarse.
- La interfaz bloquea entradas durante la comparación de dos cartas.
- La partida reconoce correctamente todas las parejas.
- El progreso se guarda al terminar, no en cada animación.
- El jugador puede pausar o abandonar sin que la web quede en un estado inconsistente.
- Sonido, tiempo y dificultad se conservan localmente.

## Criterios educativos

- La introducción explica qué habilidad se practica.
- Las instrucciones usan frases breves y un ejemplo visual.
- Los mensajes reconocen estrategia y perseverancia.
- El resultado no asigna etiquetas como “inteligente” o “malo”.
- La sesión tiene un cierre y no inicia otra partida automáticamente.

## Criterios visuales y de accesibilidad

- El texto principal mantiene contraste suficiente con el fondo.
- El amarillo no se usa como texto sobre blanco.
- Los controles táctiles tienen tamaño cómodo.
- El foco del teclado es visible.
- El tablero no depende exclusivamente del color para distinguir cartas.
- Las animaciones no parpadean ni bloquean el contenido.
- El sonido está desactivado o controlado hasta una acción del usuario.
- La experiencia funciona desde 320 píxeles de ancho y en pantallas de escritorio.

## Datos locales previstos

```text
perfil
├── apodo
├── avatarId
└── fechaCreacion

configuracion
├── sonidoActivo
├── duracionSesionMinutos
└── dificultadPreferida

progreso
└── memoria
    ├── nivelMaximoCompletado
    ├── partidasTerminadas
    └── mejorMarcaPersonalPorNivel
```

No se guardarán nombre completo, correo, ubicación, escuela ni fecha de nacimiento.

## Pruebas del primer prototipo

### Técnicas

- Abrir, recargar y continuar con el mismo perfil.
- Completar los tres niveles.
- Probar clic rápido repetido y selección doble.
- Probar teclado completo sin mouse.
- Probar pantalla de teléfono, tableta y escritorio.
- Borrar los datos locales y comprobar recuperación segura.

### De uso supervisado

- Observar si el niño comprende “Comenzar misión”.
- Comprobar si puede volver al mapa sin ayuda.
- Registrar palabras o iconos que generen dudas.
- Observar si el cierre se entiende como fin de sesión.
- Preguntar al adulto qué información le resultaría útil.

No se debe dirigir al niño durante la prueba salvo que quede bloqueado; las dificultades observadas son información para mejorar el diseño.

## Resultado esperado

El prototipo estará listo para su primera prueba cuando todos los criterios funcionales críticos se cumplan, no existan bloqueos de navegación y un adulto pueda comprender qué datos se guardan y dónde.

