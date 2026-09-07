# Wireframes de baja fidelidad

## Propósito

Los wireframes validan la estructura antes del diseño visual definitivo. Utilizan contenido real, jerarquía básica y acciones navegables, pero no representan todavía las ilustraciones, animaciones ni acabado final de Chispora.

## Principios aplicados

- Una acción principal por pantalla.
- Texto breve y comprensible para un niño de 8 años.
- Controles grandes para mouse, teclado y pantalla táctil.
- Salida visible durante el juego.
- Compras y configuraciones separadas del recorrido infantil.
- Cierre explícito de cada partida y de la sesión.

## 01 — Bienvenida

```text
┌──────────────────────────────────┐
│ ✦ CHISPORA          Para familias│
│                                  │
│     Juega. Piensa. Descubre.     │
│  Misiones breves para despertar  │
│           tu curiosidad.         │
│                                  │
│        [ Comenzar misión ]       │
│                                  │
│      Sin anuncios · Sin chat     │
└──────────────────────────────────┘
```

La acción infantil es dominante. “Para familias” permanece visible, pero con menor peso.

## 02 — Perfil local

```text
┌──────────────────────────────────┐
│ ← Volver                         │
│       ¿Cómo quieres llamarte?    │
│        [ Apodo: _________ ]      │
│                                  │
│        Elige tu explorador       │
│        ( ) ( ) ( ) ( )           │
│                                  │
│           [ Continuar ]          │
│   Se guarda solo en este equipo  │
└──────────────────────────────────┘
```

El apodo tiene máximo 12 caracteres. No se solicita nombre real, edad exacta ni correo.

## 03 — Mapa de misiones

```text
┌──────────────────────────────────┐
│ ✦ CHISPORA       Hola, Leo  (●)  │
│                                  │
│          Elige una misión        │
│                                  │
│      ┌────────────────────┐      │
│      │ Memorama           │      │
│      │ Entrena tu memoria │      │
│      │ [ Ver misión ]     │      │
│      └────────────────────┘      │
│                                  │
│      Próximas misiones ···       │
└──────────────────────────────────┘
```

Los juegos futuros se anuncian sin crear bloqueos artificiales ni presión por desbloquearlos.

## 04 — Introducción a Memorama

```text
┌──────────────────────────────────┐
│ ← Mapa                           │
│            MEMORAMA              │
│ Encuentra las parejas recordando │
│ dónde viste cada figura.         │
│                                  │
│ Dificultad: [ Explorador      ▾ ] │
│ 12 cartas · Vista previa: 3 s    │
│                                  │
│            [ Comenzar ]          │
└──────────────────────────────────┘
```

La pantalla explica objetivo, habilidad y efecto de la dificultad antes de jugar.

## 05 — Partida

```text
┌──────────────────────────────────┐
│ Salir       Parejas 2/6    Pausa │
│                                  │
│       [?] [?] [★] [?]            │
│       [?] [★] [?] [?]            │
│       [?] [?] [?] [?]            │
│                                  │
│      Recuerda dónde estaban      │
└──────────────────────────────────┘
```

El tablero es el protagonista. No hay publicidad, navegación general ni recompensas animadas permanentes.

## 06 — Resultado

```text
┌──────────────────────────────────┐
│           ¡Bien pensado!         │
│                                  │
│       Encontraste 6 parejas      │
│        usando 14 movimientos     │
│                                  │
│          + 1 pieza de mapa       │
│                                  │
│          [ Volver al mapa ]      │
│            Terminar sesión       │
└──────────────────────────────────┘
```

Se reconoce la estrategia y se permite terminar. No existe el botón “otra partida” como acción automática dominante.

## 07 — Pausa sugerida

```text
┌──────────────────────────────────┐
│             Buena misión         │
│                                  │
│     Tu mente también descansa.   │
│   ¿Qué tal beber agua, moverte   │
│      o mirar algo a lo lejos?    │
│                                  │
│          [ Terminar por hoy ]    │
│       Volver al mapa con adulto  │
└──────────────────────────────────┘
```

La pausa no asusta ni bloquea el dispositivo; comunica un límite saludable y deja control al adulto.

## 08 — Acceso para familias

```text
┌──────────────────────────────────┐
│ ← Bienvenida                     │
│          Espacio para adultos    │
│                                  │
│ Mantén presionado el botón para  │
│ abrir los ajustes familiares.    │
│                                  │
│       [ Mantener para entrar ]   │
│                                  │
│ Esto evita accesos accidentales. │
└──────────────────────────────────┘
```

Esta acción es disuasoria, no autenticación. Si posteriormente existen pagos o datos sensibles deberá utilizarse seguridad real.

## 09 — Panel familiar

```text
┌──────────────────────────────────┐
│ Para familias        Ir al juego │
│                                  │
│ Duración sugerida     [ 20 min ▾]│
│ Sonido                [ Sí     ] │
│ Dificultad inicial    [ Autom. ▾]│
│                                  │
│ Progreso local                   │
│ Memorama · 3 partidas terminadas │
│                                  │
│            [ Guardar ]           │
└──────────────────────────────────┘
```

El panel utiliza lenguaje comprensible. En el MVP no muestra diagnósticos, comparación con otros niños ni una calificación de inteligencia.

## Comportamiento adaptable

- En teléfonos, el contenido usa una sola columna.
- En tabletas y escritorio, el tablero puede crecer sin cambiar el orden de navegación.
- Los botones principales permanecen cerca del pulgar, pero no pegados al borde inferior.
- El texto nunca se reduce para forzar contenido; las secciones se desplazan verticalmente.

## Preguntas para validar

1. ¿“Comenzar misión” se entiende sin explicación adulta?
2. ¿El niño distingue “Mapa”, “Pausa” y “Salir”?
3. ¿Comprende qué cambia al elegir dificultad?
4. ¿El resultado se siente positivo sin estimular otra partida inmediata?
5. ¿El adulto entiende qué datos se guardan localmente?
6. ¿La sugerencia de descanso se percibe como clara y respetuosa?

## Decisiones pendientes para una prueba posterior

- Diseñar los cuatro avatares iniciales.
- Elegir la temática de las parejas de Memorama.
- Determinar si 20 minutos será el valor predeterminado de sesión.
- Probar si “Mantener para entrar” resulta comprensible para adultos y niños.

