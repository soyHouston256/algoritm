# Algo

Feed educativo en español con **37 retos**: 34 experiencias guiadas nuevas y los tres juegos originales. Mantiene el diseño oscuro, las pistas recuperables y el avance por scroll.

## Ruta

| Etapa | Retos | Contenido |
| --- | ---: | --- |
| Desde cero | 6 | Instrucciones, variables, if/else, for, while, funciones |
| Organiza datos | 7 | Índices, búsqueda lineal, stack, queue, creación/inserción/eliminación en linked lists |
| Piensa en algoritmos | 7 | Recursión, Big O, merge sort, quicksort, dos búsquedas binarias y ordenamiento por selección |
| Árboles | 6 | BST, preorder, inorder, postorder, min-heap y trie |
| Grafos | 5 | Adyacencia, BFS, DFS, Dijkstra y orden topológico |
| Siguiente nivel | 6 | Hash con colisiones, dos punteros, ventana deslizante, backtracking, programación dinámica y Union–Find |

Los retos nuevos alternan predicción, cambio visible de estado, pistas en dos niveles y un caso de transferencia. Un reto solo se marca como descubierto después de acertar ese nuevo caso. Las explicaciones de código son fragmentos guiados en **Python, C++ o Go**: no son un editor ni un entorno ejecutable. El lenguaje se elige una sola vez (selector en la cabecera o en cualquier fragmento), se aplica a todos los retos y se recuerda en `localStorage` (Python por defecto).

La ruta introduce una colección amplia de conceptos; no sustituye la práctica de implementación ni garantiza dominio avanzado por completarla. Las etapas no están bloqueadas. El progreso y los pasos sobreviven a los cambios de etapa durante la sesión porque los paneles conservan su estado. **Recargar reinicia el progreso**; no hay cuentas de alumno ni persistencia.

## Arquitectura

- `lib/course.ts`: módulos, contenido, estados visuales, decisiones y casos de transferencia.
- `lib/lesson-types.ts`: contrato de contenido. Cada `snippet` guarda `code.python`, `code.cpp` y `code.go` (una entrada por línea); `step.line` se numera según Python y `lineMap` traduce esa línea cuando otro lenguaje necesita más líneas.
- `lib/code-language.ts`: lenguajes disponibles y traducción de la línea resaltada.
- `components/course/code-snippet.tsx`: preferencia global de lenguaje, selector y bloque de código.
- `lib/lesson-engine.mjs`: transiciones de pasos, pistas, errores y comprobación final.
- `components/course/lesson-card.tsx`: interacción, visualización de árboles/grafos/nodos y código por paso.
- `components/course/classic.tsx`: retos originales preservados.
- `app/page.tsx`: navegación accesible por etapas y avance de sesión.

## Desarrollo y validación

- `npm install` y `npm run dev`.
- `npm run build` genera la versión publicable.
- `node --experimental-strip-types --test tests/*.test.mjs` (Node 22.13+): 13 pruebas, incluyendo las variantes Python/C++/Go de cada fragmento y sus líneas resaltadas, los 34 recorridos completos, errores recuperables, referencias de diagramas y comparación independiente de BFS/DFS, recorridos de árboles, Dijkstra, orden topológico, linked lists y resultados numéricos.
- `npx tsc --noEmit` verifica tipos.
- `npx oxlint app components/course lib/course.ts lib/lesson-types.ts lib/lesson-engine.mjs lib/code-language.ts` verifica el código del producto. El lint global también incluye incidencias preexistentes del scaffold en componentes no modificados.

No se realizó QA visual ni interacción automatizada en navegador. La respuesta HTTP local y la compilación fueron verificadas. Se conservan las herramientas WebMCP de las búsquedas originales; su contrato no fue verificado en un contexto de navegador compatible. Toda la interfaz funciona sin esa API.
