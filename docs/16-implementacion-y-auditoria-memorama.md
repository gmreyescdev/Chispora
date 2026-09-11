# Implementación y auditoría de Memorama

## Resultado

Memorama ya es un juego completo. Cada partida crea pares, los mezcla, compara dos selecciones, impide elegir una tercera carta durante la resolución y termina únicamente cuando se encuentran todas las parejas.

## Niveles

| Nivel | Cartas | Parejas | Vista previa |
|---|---:|---:|---:|
| Explorador | 12 | 6 | 3 segundos |
| Aventurero | 16 | 8 | 2 segundos |
| Maestro del mapa | 20 | 10 | Sin vista previa |

La elección de dificultad define el tablero real. La vista previa bloquea las cartas mientras se muestran y el reloj comienza cuando el jugador puede actuar.

## Reglas implementadas

- Una carta abierta o ya encontrada no puede seleccionarse otra vez.
- Tras la segunda carta, todo el tablero queda bloqueado hasta resolver el turno.
- Una coincidencia permanece visible; un error vuelve a ocultarse después de un tiempo breve.
- Los movimientos se cuentan por cada par de cartas comparado.
- La pausa congela el reloj y cualquier comparación o vista previa pendiente.
- Salir descarta la partida incompleta.
- El sonido puede activarse o silenciarse y respeta el ajuste familiar.

## Progreso local

Al completar una partida se guarda únicamente en `localStorage`:

- cantidad total de partidas terminadas;
- niveles completados;
- mejor cantidad de movimientos por nivel;
- mejor tiempo por nivel;
- total de parejas encontradas.

Una partida se registra una sola vez. Las partidas incompletas no modifican el progreso.

## Separación entre reglas y pantalla

`lib/memory-engine.js` contiene las reglas puras del juego. `main.js` se encarga del tablero visible, los mensajes, el reloj, la pausa, el sonido y el guardado. Esta separación permite probar las reglas sin depender del navegador.

## Auditoría automática

El archivo `tests/memory-engine.test.js` comprueba:

1. Cantidad correcta de cartas y pares en los tres niveles.
2. Bloqueo durante la vista previa.
3. Rechazo de índices inválidos y cartas ya abiertas.
4. Bloqueo de una tercera selección.
5. Resolución de una pareja incorrecta.
6. Conservación de una pareja correcta.
7. Detección exacta del final y conteo de movimientos.

Ejecutar desde la raíz:

```powershell
node tests/memory-engine.test.js
```

## Auditoría en navegador

Se recorrió una partida real en Chromium mediante servidor local. Resultado:

| Prueba | Resultado |
|---|---|
| Vista previa y bloqueo inicial | Correcto |
| Error de pareja y ocultación posterior | Correcto |
| Bloqueo de tercera selección | Correcto |
| Pareja encontrada y contador | Correcto |
| Pausa con reloj congelado | Correcto |
| Finalización y resumen dinámico | Correcto |
| Guardado visible en mapa y panel familiar | Correcto |
| Consola del navegador | Sin errores ni advertencias |
| Nivel Maestro con 20 cartas a 360 × 800 | Sin desbordamiento horizontal |
| Verificador estructural del sitio | 11 controles correctos, 0 advertencias, 0 errores |

## Incremento posterior

Operación misteriosa se construyó a continuación conservando la misma separación entre motor de reglas, interfaz y pruebas automáticas. Está documentado en `17-implementacion-y-auditoria-operacion.md`.
