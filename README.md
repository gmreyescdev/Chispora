# Chispora

**Juega. Piensa. Descubre.**

Plataforma de juegos educativos clásicos para niños de aproximadamente 8 años. El proyecto busca ofrecer una alternativa tranquila, segura y útil frente a juegos con violencia, publicidad invasiva o mecánicas adictivas.

## Objetivos

- Reforzar memoria, cálculo, lectura, lógica, atención y creatividad.
- Ofrecer partidas cortas con dificultad progresiva.
- Premiar el esfuerzo y la constancia, no el tiempo conectado.
- Permitir que madres, padres o tutores controlen el tiempo de uso.
- Construir una base que pueda monetizarse responsablemente en el futuro.

## Primera versión propuesta

El catálogo actual incluye diez juegos:

1. Memorama.
2. Operación misteriosa.
3. Palabra desordenada.
4. Secuencia lógica.
5. Laberintos.
6. Comprensión lectora.
7. Fracciones en acción.
8. Programa al robot.
9. Reloj de aventuras.
10. Laboratorio curioso.

Cada juego tendrá tres niveles de dificultad y sesiones sugeridas de entre 5 y 10 minutos.

## Documentación

- [Cómo está documentado el proyecto](docs/00-sistema-de-documentacion.md)
- [Visión del producto](docs/01-vision-del-producto.md)
- [Tecnología y arquitectura](docs/02-tecnologia-y-arquitectura.md)
- [Hoja de ruta](docs/03-hoja-de-ruta.md)
- [Monetización responsable](docs/04-monetizacion-responsable.md)
- [Registro de decisiones](docs/05-registro-de-decisiones.md)
- [Nombre e identidad visual](docs/06-nombre-e-identidad.md)
- [Verificación de marca y dominios](docs/07-verificacion-marca-y-dominio.md)
- [Bitácora del proyecto](docs/08-bitacora-del-proyecto.md)
- [Ruta personal de aprendizaje](docs/09-ruta-de-aprendizaje.md)
- [Camino de producto a empresa](docs/10-de-producto-a-empresa.md)
- [Glosario técnico](docs/11-glosario.md)
- [Mapa de pantallas y recorridos](docs/12-mapa-de-pantallas-y-recorridos.md)
- [Especificación del primer prototipo](docs/13-especificacion-del-mvp.md)
- [Wireframes de baja fidelidad](docs/14-wireframes-de-baja-fidelidad.md)
- [Implementación del prototipo navegable](docs/15-implementacion-del-prototipo.md)
- [Implementación y auditoría de Memorama](docs/16-implementacion-y-auditoria-memorama.md)
- [Implementación y auditoría de Operación misteriosa](docs/17-implementacion-y-auditoria-operacion.md)
- [Implementación y auditoría de Palabra desordenada](docs/18-implementacion-y-auditoria-palabras.md)
- [Implementación y auditoría de Secuencia lógica](docs/19-implementacion-y-auditoria-secuencia.md)
- [Implementación y auditoría de Laberintos](docs/20-implementacion-y-auditoria-laberintos.md)
- [Especificación de Comprensión lectora](docs/21-especificacion-comprension-lectora.md)
- [Implementación y auditoría de Comprensión lectora](docs/22-implementacion-y-auditoria-comprension-lectora.md)
- [Implementación y auditoría de recompensas y habilidades](docs/23-implementacion-recompensas-y-habilidades.md)
- [Implementación y auditoría de Fracciones y Robot](docs/24-implementacion-fracciones-y-robot.md)
- [Implementación y auditoría de Reloj y Laboratorio](docs/25-implementacion-reloj-y-laboratorio.md)
- [Compactación visual e instrucciones](docs/26-compactacion-visual-e-instrucciones.md)
- [Plan de evolución del producto](docs/27-plan-de-evolucion-del-producto.md)
- [Organización del mapa por áreas](docs/28-organizacion-del-mapa-por-areas.md)
- [Tutoriales breves para los diez juegos](docs/29-tutoriales-breves.md)
- [Accesibilidad ampliada](docs/30-accesibilidad-ampliada.md)
- [Funcionamiento sin conexión e instalación](docs/31-funcionamiento-sin-conexion-e-instalacion.md)
- [Historial de versiones](CHANGELOG.md)

## Estado

Fase 0 completada. Fase 1 técnica completada; la Fase 2 tiene diez juegos funcionales, recompensas visuales, accesibilidad ampliada e instalación opcional con funcionamiento sin conexión.

- **Dominio:** `chispora.cl` adquirido por el propietario del proyecto.
- **Marca CHISPORA:** disponibilidad preliminar informada; todavía no solicitada ni registrada en INAPI.

## Forma de trabajo

Cada avance debe dejar cuatro rastros: código versionado, motivo de las decisiones, pruebas realizadas y una explicación en lenguaje sencillo. El sistema completo está descrito en la guía de documentación.

## Abrir el prototipo

Puedes abrir `index.html` directamente o iniciar un servidor local desde esta carpeta:

```powershell
python -m http.server 8765
```

Luego visita `http://localhost:8765/`. El servidor evita diferencias entre una vista local y el futuro alojamiento.
