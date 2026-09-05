# Algo

Prototipo en español de un feed de retos interactivos para aprender algoritmos.

## Experiencias

- Número escondido: 1–100, objetivo de siete intentos.
- Ascensor: 128 pisos, objetivo de ocho paradas.
- Libros: ordenamiento por selección con pistas recuperables.

Cada intento de búsqueda reduce el intervalo visible. El límite habilita práctica ilimitada, sin reiniciar las pistas. El progreso vive en la sesión y se reinicia al recargar. Los secretos iniciales son fijos para una primera experiencia reproducible; «Otro número» elige uno nuevo aleatoriamente. Esta es una experiencia educativa local al navegador, no un concurso seguro.

## Desarrollo

`npm install`, `npm run dev`. Producción: `npm run build`.

## Verificación

`node --test tests/game.test.mjs` cubre todos los secretos posibles, entradas inválidas y continuidad del modo práctica. `npx tsc --noEmit` verifica tipos.

No se realizó QA visual ni interacción automatizada en navegador. Se registran herramientas WebMCP si el navegador admite `document.modelContext`; su contrato no pudo verificarse en un contexto compatible. La interfaz funciona sin esa API.

El lint global del scaffold señala incidencias en componentes UI y hooks preinstalados que no usa esta página; se verifica por separado el código del producto.
