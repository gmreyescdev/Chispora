# Sistema de documentación

## Propósito

Chispora es simultáneamente un producto, un proyecto de aprendizaje y la base de una futura empresa. La documentación debe permitir responder cinco preguntas:

1. ¿Qué problema estamos resolviendo?
2. ¿Qué construimos y cómo funciona?
3. ¿Por qué tomamos cada decisión importante?
4. ¿Cómo comprobamos que funciona?
5. ¿Qué aprendimos y qué sigue?

## Mapa documental

| Documento | Pregunta que responde |
|---|---|
| `README.md` | ¿Qué es el proyecto y dónde encuentro cada cosa? |
| `01-vision-del-producto.md` | ¿Para quién y para qué existe? |
| `02-tecnologia-y-arquitectura.md` | ¿Cómo está construido? |
| `03-hoja-de-ruta.md` | ¿En qué orden avanzamos? |
| `04-monetizacion-responsable.md` | ¿Cómo podría sostenerse económicamente? |
| `05-registro-de-decisiones.md` | ¿Por qué elegimos una opción sobre otra? |
| `08-bitacora-del-proyecto.md` | ¿Qué ocurrió en cada sesión? |
| `09-ruta-de-aprendizaje.md` | ¿Qué conceptos debes comprender? |
| `10-de-producto-a-empresa.md` | ¿Cómo pasa de proyecto a negocio? |
| `11-glosario.md` | ¿Qué significa cada término técnico? |
| `CHANGELOG.md` | ¿Qué cambió entre versiones? |

## Ritual de cada sesión

### Antes de trabajar

- Definir un resultado pequeño y verificable.
- Leer la documentación relacionada.
- Comprobar el estado de Git y conservar cambios anteriores.

### Durante el trabajo

- Explicar los conceptos nuevos en lenguaje sencillo.
- Registrar decisiones que tengan alternativas o consecuencias futuras.
- Separar cambios grandes en pasos comprensibles.

### Al terminar

- Probar el resultado.
- Anotar las pruebas y sus resultados.
- Actualizar la bitácora y el historial de versiones.
- Crear un commit de Git con un mensaje que explique el cambio.
- Registrar dudas, riesgos y el próximo paso.

## Niveles de explicación

Cada componente importante tendrá, cuando corresponda:

- **Qué ve el usuario:** comportamiento visible.
- **Cómo funciona:** explicación técnica intermedia.
- **Dónde está:** archivos responsables.
- **Cómo comprobarlo:** pasos de prueba.
- **Qué podría fallar:** riesgos y casos límite.

## Definición de terminado

Una tarea no está terminada únicamente porque “se ve bien”. Debe:

- Cumplir el objetivo acordado.
- Funcionar en los tamaños de pantalla previstos.
- Tener controles accesibles y mensajes comprensibles.
- No introducir errores conocidos en otras funciones.
- Incluir pruebas proporcionales al riesgo.
- Dejar actualizada la documentación afectada.

## Principio de aprendizaje

No es necesario memorizar todo. El objetivo es que puedas explicar la arquitectura general, localizar el código responsable, ejecutar las pruebas y comprender las consecuencias de una decisión.

