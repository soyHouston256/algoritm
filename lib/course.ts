import type { Lesson, View, Step, Cell } from './lesson-types';
export const modules = [
  {
    id: 'basics',
    name: 'Desde cero',
    subtitle: 'Dale instrucciones a una computadora.',
    level: '01',
    requires: 'No necesitas saber programar.',
  },
  {
    id: 'structures',
    name: 'Organiza datos',
    subtitle: 'Cada estructura cambia lo que puedes hacer.',
    level: '02',
    requires: 'Variables, condiciones y bucles.',
  },
  {
    id: 'strategies',
    name: 'Piensa en algoritmos',
    subtitle: 'Busca, divide y ordena.',
    level: '03',
    requires: 'Listas, índices y funciones.',
  },
  {
    id: 'trees',
    name: 'Árboles',
    subtitle: 'Conecta, recorre y prioriza.',
    level: '04',
    requires: 'Referencias, pilas y recursión.',
  },
  {
    id: 'graphs',
    name: 'Grafos',
    subtitle: 'Explora redes y encuentra caminos.',
    level: '05',
    requires: 'Colas, pilas y árboles.',
  },
  {
    id: 'advanced',
    name: 'Siguiente nivel',
    subtitle: 'Combina ideas para resolver más con menos.',
    level: '06',
    requires: 'Complejidad, recorridos y estructuras.',
  },
];
export const cells = (
  values: (string | number)[],
  active = -1,
  done: number[] = [],
  notes: string[] = [],
): View => ({
  kind: 'cells',
  cells: values.map((v, i) => ({
    id: String(i),
    label: String(v),
    note: notes[i],
    state: i === active ? 'active' : done.includes(i) ? 'done' : undefined,
  })),
});
const stats = (values: Record<string, string>, caption?: string): View => ({
  cells: [],
  stats: values,
  caption,
});
const choices = (values: (string | number)[]) =>
  values.map((v) => ({ value: String(v), label: String(v) }));
const step = (
  prompt: string,
  options: (string | number)[],
  answer: string | number,
  before: View,
  after: View,
  success: string,
  hints: [string, string],
  line = 1,
): Step => ({
  prompt,
  choices: choices(options),
  answer: String(answer),
  before,
  after,
  success,
  hints,
  line,
});
export const lessons: Lesson[] = [
  {
    id: 'instructions',
    module: 'basics',
    concept: 'Instrucciones y orden',
    title: 'Un robot con hambre.',
    accent: 'Tú eliges el camino.',
    description:
      'Una computadora sigue instrucciones concretas, en orden. Lleva el robot desde la casilla 0 hasta la merienda en la casilla 3. Cada avance lo mueve una casilla.',
    takeaway:
      'Un programa es una secuencia de instrucciones. La computadora hace lo que indicas; no adivina el objetivo.',
    code: 'posicion = 0\nposicion = posicion + 1\nposicion = posicion + 1\nposicion = posicion + 1\ncomer()',
    steps: [
      ...[0, 1, 2].map((i) =>
        step(
          `Estás en la casilla ${i}. ¿Qué instrucción acerca al robot a la merienda?`,
          ['Avanzar una casilla', 'Comer aquí'],
          'Avanzar una casilla',
          cells(['0', '1', '2', 'Merienda'], i),
          cells(['0', '1', '2', 'Merienda'], i + 1),
          `El robot ejecutó una instrucción: ahora está en ${i + 1}.`,
          [
            'Primero hay que llegar a la casilla 3.',
            'Avanzar suma 1 a la posición actual.',
          ],
          i + 2,
        ),
      ),
      step(
        'Ya llegaste a la merienda. ¿Qué toca hacer?',
        ['Seguir avanzando', 'Comer aquí'],
        'Comer aquí',
        cells(['0', '1', '2', 'Merienda'], 3),
        cells(['0', '1', '2', '¡Ñam!'], -1, [3]),
        '¡Objetivo cumplido! El orden de las instrucciones hizo la diferencia.',
        [
          'La casilla actual ya tiene la merienda.',
          'Ahora ejecuta Comer aquí.',
        ],
        5,
      ),
    ],
    transfer: {
      prompt:
        'Si ejecutas comer() antes de llegar, ¿el robot corrige el programa por su cuenta?',
      choices: ['Sí, entiende mi intención', 'No, sigue las instrucciones'],
      answer: 1,
      explanation:
        'Los programas necesitan instrucciones y condiciones explícitas; no basta con tener una intención.',
    },
  },
  {
    id: 'variables',
    module: 'basics',
    concept: 'Variables y asignación',
    title: 'Tu monedero cambia.',
    accent: 'La etiqueta se queda.',
    description:
      'Una variable es un nombre que usamos para guardar un valor. El monedero empieza con 5 monedas. Vamos a seguir sus cambios.',
    takeaway:
      'El signo = guarda el valor de la derecha en el nombre de la izquierda. En monedas = monedas + 3, primero lees el valor anterior y después lo reemplazas.',
    code: 'monedas = 5\nmonedas = monedas + 3\nmonedas = monedas - 2',
    steps: [
      step(
        'Ejecutamos monedas = 5. ¿Qué valor queda guardado?',
        [0, 5, 10],
        5,
        stats({ monedas: 'sin asignar' }),
        stats({ monedas: '5' }),
        'La variable monedas ahora guarda 5.',
        [
          'La asignación no suma nada todavía.',
          'El valor a la derecha del = es 5.',
        ],
      ),
      step(
        'Recibes 3 monedas. ¿Cuánto guarda monedas = monedas + 3?',
        [3, 5, 8],
        8,
        stats({ monedas: '5', operación: '+ 3' }),
        stats({ monedas: '8' }),
        'Primero calculamos 5 + 3. Después guardamos 8 en monedas.',
        ['Usa el valor que ya estaba guardado.', '5 + 3 = 8.'],
        2,
      ),
      step(
        'Gastas 2. ¿Qué valor queda?',
        [2, 6, 10],
        6,
        stats({ monedas: '8', operación: '− 2' }),
        stats({ monedas: '6' }),
        'La etiqueta sigue siendo monedas; su valor ahora es 6.',
        ['Parte de 8, no del valor inicial.', '8 − 2 = 6.'],
        3,
      ),
    ],
    transfer: {
      prompt: 'vidas = 3; vidas = vidas - 1. ¿Cuánto vale vidas al final?',
      choices: ['1', '2', '3'],
      answer: 1,
      explanation: 'Se toma el 3 anterior, se resta 1 y se guarda 2.',
    },
  },
  {
    id: 'conditions',
    module: 'basics',
    concept: 'Condiciones · if / else',
    title: 'La puerta del cine.',
    accent: 'Una regla decide.',
    description:
      'En este cine ficticio, una entrada abre la puerta. Un booleano solo tiene dos valores: True (verdadero) o False (falso). if ejecuta una rama según esa condición.',
    takeaway:
      'if comprueba una condición. Si es verdadera ejecuta su bloque; si es falsa, puede ejecutar el bloque else.',
    code: 'if tiene_entrada:\n    abrir_puerta()\nelse:\n    pedir_entrada()',
    steps: [
      step(
        'Ana tiene entrada: tiene_entrada = True. ¿Qué sucede?',
        ['Abrir la puerta', 'Pedir entrada'],
        'Abrir la puerta',
        stats({ persona: 'Ana', tiene_entrada: 'True' }),
        stats({ persona: 'Ana', puerta: 'Abierta' }),
        'True entra en el bloque del if.',
        [
          'True significa que sí se cumple la condición.',
          'La rama verdadera ejecuta abrir_puerta().',
        ],
        2,
      ),
      step(
        'Luis no tiene entrada: tiene_entrada = False. ¿Qué sucede?',
        ['Abrir la puerta', 'Pedir entrada'],
        'Pedir entrada',
        stats({ persona: 'Luis', tiene_entrada: 'False' }),
        stats({ persona: 'Luis', acción: 'Pedir entrada' }),
        'False toma la alternativa else.',
        [
          'No se cumple la condición de entrada.',
          'El bloque else llama a pedir_entrada().',
        ],
        4,
      ),
    ],
    transfer: {
      prompt:
        'Si saldo = 4, ¿se cumple saldo >= 5? (>= significa mayor o igual).',
      choices: ['True', 'False'],
      answer: 1,
      explanation:
        '4 no es mayor o igual que 5, así que la comparación produce False.',
    },
  },
  {
    id: 'for',
    module: 'basics',
    concept: 'Bucle for',
    title: 'Tres plantas sedientas.',
    accent: 'Una instrucción que se repite.',
    description:
      'Un bucle repite instrucciones. En Python, range(3) produce 0, 1 y 2: empieza en 0 y no incluye el 3. En cada vuelta, i toma el siguiente valor.',
    takeaway:
      'for recorre una secuencia. El cuerpo indentado se ejecuta una vez por cada elemento. range(n) realiza n vueltas, desde 0 hasta n − 1.',
    code: 'regadas = 0\nfor i in range(3):\n    regar(i)\n    regadas = regadas + 1',
    steps: [
      ...[0, 1, 2].map((i) =>
        step(
          `Vuelta ${i + 1}: i = ${i}. Hay ${i} plantas regadas. Después de regar esta planta, ¿cuántas habrá?`,
          [i, i + 1, i + 2],
          i + 1,
          {
            ...cells(
              ['Planta 0', 'Planta 1', 'Planta 2'],
              i,
              Array.from({ length: i }, (_, j) => j),
            ),
            stats: { i: String(i), regadas: String(i) },
          },
          {
            ...cells(
              ['Planta 0', 'Planta 1', 'Planta 2'],
              -1,
              Array.from({ length: i + 1 }, (_, j) => j),
            ),
            stats: { i: String(i), regadas: String(i + 1) },
          },
          `Una vuelta más: regadas pasa de ${i} a ${i + 1}.`,
          ['Cada vuelta riega exactamente una planta.', `${i} + 1 = ${i + 1}.`],
          4,
        ),
      ),
      step(
        'Terminó la vuelta con i = 2. ¿Habrá otra con i = 3?',
        ['Sí, una vuelta más', 'No, el bucle termina'],
        'No, el bucle termina',
        stats({ secuencia: '0 → 1 → 2', regadas: '3' }),
        stats({ estado: 'Bucle terminado', regadas: '3' }),
        'range(3) excluye el 3. Ejecutamos tres vueltas en total.',
        [
          'El límite final de range no se incluye.',
          'Los únicos valores de i son 0, 1 y 2.',
        ],
        2,
      ),
    ],
    transfer: {
      prompt: '¿Cuántas veces se ejecuta el cuerpo de for i in range(5)?',
      choices: ['4 veces', '5 veces', '6 veces'],
      answer: 1,
      explanation: 'i toma 0, 1, 2, 3 y 4: cinco valores, cinco vueltas.',
    },
  },
  {
    id: 'while',
    module: 'basics',
    concept: 'Bucle while',
    title: 'Carga al cien.',
    accent: '¿Cuándo hay que parar?',
    description:
      'while repite un bloque mientras su condición sea verdadera. La batería empieza en 40 y cada carga suma 20. < significa menor que.',
    takeaway:
      'while vuelve a comprobar su condición antes de cada vuelta. Si el cuerpo nunca cambia lo necesario para volverla falsa, el bucle puede no terminar.',
    code: 'bateria = 40\nwhile bateria < 100:\n    bateria = bateria + 20',
    steps: [
      ...[40, 60, 80].map((n) =>
        step(
          `La batería está en ${n}. Como ${n} < 100, cargamos una vez. ¿En cuánto queda?`,
          [n, n + 20, 100 + n],
          n + 20,
          stats({ bateria: `${n}%`, condición: `${n} < 100 → True` }),
          stats({ bateria: `${n + 20}%` }),
          `La batería cambia a ${n + 20}; ahora se volverá a comprobar la condición.`,
          ['Esta vuelta suma 20 al valor actual.', `${n} + 20 = ${n + 20}.`],
          3,
        ),
      ),
      step(
        'Ahora bateria = 100. ¿Se ejecuta otra carga?',
        ['Sí', 'No'],
        'No',
        stats({ bateria: '100%', condición: '100 < 100' }),
        stats({ bateria: '100%', estado: 'Fin del bucle' }),
        '100 no es menor que 100. La condición es falsa y el bucle termina.',
        ['Menor que no incluye la igualdad.', '100 < 100 es False.'],
        2,
      ),
    ],
    transfer: {
      prompt:
        'Si quitamos la línea que aumenta la batería, ¿qué pasa al empezar con 40?',
      choices: [
        'El bucle se repite sin terminar',
        'La batería llega sola a 100',
      ],
      answer: 0,
      explanation:
        'La condición sigue siendo verdadera porque bateria nunca cambia.',
    },
  },
  {
    id: 'functions',
    module: 'basics',
    concept: 'Funciones · parámetros y return',
    title: 'Una máquina de dobles.',
    accent: 'Entra un valor, sale otro.',
    description:
      'Una función agrupa instrucciones para reutilizarlas. El parámetro n recibe un valor y return devuelve el resultado. * significa multiplicar.',
    takeaway:
      'Definir una función no la ejecuta. Al llamarla, sus parámetros reciben los argumentos y return entrega un resultado a quien la llamó.',
    code: 'def doble(n):\n    return n * 2\n\nresultado = doble(4)',
    steps: [
      step(
        'Llamas a doble(4). ¿Qué valor recibe n?',
        [2, 4, 8],
        4,
        stats({ llamada: 'doble(4)' }),
        stats({ n: '4' }),
        'El argumento 4 se guarda en el parámetro n.',
        [
          'El número entre paréntesis es la entrada.',
          'n recibe 4; todavía no multiplicamos.',
        ],
        4,
      ),
      step(
        'Dentro de la función, return n * 2 usa n = 4. ¿Qué devuelve?',
        [4, 6, 8],
        8,
        stats({ n: '4', cálculo: '4 × 2' }),
        stats({ resultado: '8' }),
        'return devuelve 8. La variable resultado recibe ese valor.',
        ['Multiplica la entrada por dos.', '4 × 2 = 8.'],
        2,
      ),
      step(
        'Usas la misma función con doble(7). ¿Qué devuelve?',
        [9, 14, 7],
        14,
        stats({ llamada: 'doble(7)', n: '7' }),
        stats({ retorno: '14' }),
        'Reutilizamos las instrucciones con un dato distinto.',
        ['La regla no cambió: n × 2.', '7 × 2 = 14.'],
        2,
      ),
    ],
    transfer: {
      prompt:
        'Solo escribes def doble(n): return n * 2, sin llamarla. ¿Ya calculó doble(4)?',
      choices: ['Sí', 'No'],
      answer: 1,
      explanation:
        'La definición crea la función. Para calcular ese resultado hace falta la llamada doble(4).',
    },
  },
  {
    id: 'arrays',
    module: 'structures',
    concept: 'Arrays y listas · índices',
    title: 'Casilleros numerados.',
    accent: 'Empieza contando desde cero.',
    description:
      'Una lista guarda valores en posiciones. El índice es el número de una posición y en Python empieza en 0. Aquí, objetos[1] lee el segundo casillero.',
    takeaway:
      'El índice identifica la posición, no el valor. Una lista de longitud n tiene índices desde 0 hasta n − 1.',
    code: 'objetos = ["Llave", "Libro", "Mapa", "Agua"]\nsegundo = objetos[1]\nobjetos[2] = "Brújula"',
    steps: [
      step(
        '¿Qué objeto devuelve objetos[1]?',
        ['Llave', 'Libro', 'Mapa'],
        'Libro',
        cells(
          ['Llave', 'Libro', 'Mapa', 'Agua'],
          -1,
          [],
          ['índice 0', 'índice 1', 'índice 2', 'índice 3'],
        ),
        cells(['Llave', 'Libro', 'Mapa', 'Agua'], 1, [], ['0', '1', '2', '3']),
        'El índice 1 apunta al segundo elemento: Libro.',
        [
          'El primer casillero tiene índice 0.',
          'El segundo, índice 1, contiene Libro.',
        ],
        2,
      ),
      step(
        'Guardas Brújula en objetos[2]. ¿Qué objeto reemplazas?',
        ['Libro', 'Mapa', 'Agua'],
        'Mapa',
        cells(['Llave', 'Libro', 'Mapa', 'Agua'], 2),
        cells(['Llave', 'Libro', 'Brújula', 'Agua'], 2),
        'Cambiamos el valor de una posición sin mover los demás.',
        ['Cuenta 0, 1, 2 desde la izquierda.', 'El índice 2 contiene Mapa.'],
        3,
      ),
    ],
    transfer: {
      prompt: 'Una lista tiene 6 elementos. ¿Cuál es su último índice?',
      choices: ['5', '6', '7'],
      answer: 0,
      explanation: 'Sus índices son 0, 1, 2, 3, 4 y 5.',
    },
    cost: 'Acceso por índice en un array: O(1).',
  },
  {
    id: 'linear',
    module: 'structures',
    concept: 'Búsqueda lineal',
    title: '¿Dónde está tu llave?',
    accent: 'Abre un cajón a la vez.',
    description:
      'Los cajones no están ordenados. Revisa de izquierda a derecha hasta encontrar la llave; no puedes descartar una mitad solo por mirar un cajón.',
    takeaway:
      'La búsqueda lineal compara un elemento a la vez. Si encuentra el objetivo se detiene; si no, puede revisar todos.',
    code: 'for i in range(len(cajones)):\n    if cajones[i] == "Llave":\n        return i\nreturn -1',
    steps: ['Goma', 'Clip', 'Llave'].map((item, i) =>
      step(
        `Revisas el cajón ${i} y encuentras ${item}. ¿Qué haces?`,
        ['Seguir al siguiente', 'Encontrada: detenerse'],
        i === 2 ? 'Encontrada: detenerse' : 'Seguir al siguiente',
        cells(
          ['Goma', 'Clip', 'Llave', 'Cinta'],
          i,
          Array.from({ length: i }, (_, j) => j),
        ),
        cells(
          ['Goma', 'Clip', 'Llave', 'Cinta'],
          i === 2 ? 2 : i + 1,
          Array.from({ length: i + 1 }, (_, j) => j),
        ),
        i === 2
          ? 'Encontramos la llave en el índice 2 tras tres comparaciones.'
          : 'Este elemento no coincide; avanzamos al siguiente.',
        [
          'Compara el contenido con Llave.',
          item === 'Llave'
            ? 'Ya coincide: detente.'
            : 'No es Llave: sigue buscando.',
        ],
        i === 2 ? 3 : 2,
      ),
    ),
    transfer: {
      prompt:
        'En una lista desordenada de 100 elementos, el objetivo no existe. ¿Cuántos elementos podrías tener que revisar?',
      choices: ['1', '7', '100'],
      answer: 2,
      explanation:
        'Sin una estructura que permita descartar candidatos, hay que revisar los 100.',
    },
    cost: 'Tiempo O(n); espacio adicional O(1).',
  },
  {
    id: 'stack',
    module: 'structures',
    concept: 'Pila · stack · LIFO',
    title: 'Deshaz tu dibujo.',
    accent: 'Lo último sale primero.',
    description:
      'Dibujaste un círculo, un cuadrado y una estrella, en ese orden. Deshacer usa una pila: solo puedes retirar el elemento de arriba, el más reciente.',
    takeaway:
      'Una pila agrega con push y retira con pop por el mismo extremo. LIFO significa último en entrar, primero en salir.',
    code: 'historial = ["Círculo", "Cuadrado", "Estrella"]\nultimo = historial.pop()',
    steps: ['Estrella', 'Cuadrado', 'Círculo'].map((name, i) => {
      const list = ['Círculo', 'Cuadrado', 'Estrella'].slice(0, 3 - i);
      return step(
        `Pulsa deshacer. ¿Qué figura desaparece ahora?`,
        list,
        name,
        {
          ...cells(list, list.length - 1),
          kind: 'stack',
          caption: 'Arriba está la acción más reciente.',
        },
        { ...cells(list.slice(0, -1)), kind: 'stack' },
        `${name} sale por la cima de la pila.`,
        [
          'Mira la última acción que todavía queda.',
          `La cima contiene ${name}.`,
        ],
        2,
      );
    }),
    transfer: {
      prompt: 'Apilas A, luego B, luego C. ¿Qué devuelve el primer pop()?',
      choices: ['A', 'B', 'C'],
      answer: 2,
      explanation: 'C fue el último en entrar y está en la cima.',
    },
    cost: 'Push y pop: O(1) amortizado en una lista dinámica.',
  },
  {
    id: 'queue',
    module: 'structures',
    concept: 'Cola · queue · FIFO',
    title: 'La fila del café.',
    accent: 'Respeta el turno.',
    description:
      'Ana llegó primero, luego Bruno y al final Carla. Una cola atiende a quien lleva más tiempo esperando. Los nuevos llegan al final.',
    takeaway:
      'Una cola agrega por el final y retira por el frente. FIFO significa primero en entrar, primero en salir. En Python, deque permite hacerlo eficientemente.',
    code: 'from collections import deque\nfila = deque(["Ana", "Bruno", "Carla"])\natendido = fila.popleft()',
    steps: ['Ana', 'Bruno', 'Carla'].map((name, i) => {
      const list = ['Ana', 'Bruno', 'Carla'].slice(i);
      return step(
        '¿A quién atiendes ahora?',
        list,
        name,
        cells(list, 0),
        cells(list.slice(1), 0),
        `${name} sale del frente. El resto conserva su orden.`,
        ['Quien llegó antes tiene prioridad.', `${name} está al frente.`],
        3,
      );
    }),
    transfer: {
      prompt: 'Quedan Bruno y Carla. Llega Diego. ¿Quién se atiende primero?',
      choices: ['Diego', 'Carla', 'Bruno'],
      answer: 2,
      explanation: 'Diego entra al final; Bruno ya estaba esperando antes.',
    },
    cost: 'En deque, agregar al final y retirar del frente: O(1).',
  },
];

const chain = (
  links: [string, string][],
  labels: string[],
  focus?: string,
): View => ({
  kind: 'chain',
  cells: labels.map((label) => ({
    id: label,
    label,
    state: label === focus ? 'active' : undefined,
  })),
  edges: links.map(([from, to]) => ({ from, to, directed: true })),
  caption:
    'head señala el primer nodo. Cada flecha representa next. ∅ significa que no hay siguiente.',
});
lessons.push(
  {
    id: 'linked-create',
    module: 'structures',
    concept: 'Linked list · nodos y referencias',
    title: 'Una playlist enlazada.',
    accent: 'Cada canción sabe quién sigue.',
    description:
      'Un nodo guarda un dato y una referencia next al siguiente nodo. Construye A → B → C. head es una referencia al primer nodo; None significa que no hay nodo.',
    takeaway:
      'Una lista enlazada no necesita posiciones consecutivas. Para recorrerla, empiezas en head y sigues referencias next hasta None.',
    code: 'class Nodo:\n    def __init__(self, dato):\n        self.dato = dato\n        self.next = None\n\na, b, c = Nodo("A"), Nodo("B"), Nodo("C")\nhead = a\na.next = b\nb.next = c',
    steps: [
      step(
        '¿A qué nodo debe apuntar head para reproducir A primero?',
        ['A', 'B', 'C'],
        'A',
        chain([], ['A', 'B', 'C']),
        { ...chain([], ['A', 'B', 'C'], 'A'), stats: { head: 'A' } },
        'head apunta a A. Crear nodos todavía no los enlaza.',
        [
          'head es la puerta de entrada de la lista.',
          'La primera canción es A.',
        ],
        7,
      ),
      step(
        'Después de A quieres escuchar B. ¿Qué enlace creas?',
        ['a.next = b', 'b.next = a', 'a.next = c'],
        'a.next = b',
        chain([], ['A', 'B', 'C'], 'A'),
        chain([['A', 'B']], ['A', 'B', 'C'], 'B'),
        'A ahora guarda una referencia al nodo B.',
        [
          'La referencia se guarda en el nodo que viene antes.',
          'Asigna b a a.next.',
        ],
        8,
      ),
      step(
        'Completa la playlist sin formar un ciclo. ¿Qué enlace falta?',
        ['c.next = a', 'b.next = c', 'b.next = a'],
        'b.next = c',
        chain([['A', 'B']], ['A', 'B', 'C'], 'B'),
        {
          ...chain(
            [
              ['A', 'B'],
              ['B', 'C'],
            ],
            ['A', 'B', 'C'],
            'C',
          ),
          stats: { head: 'A', 'c.next': 'None' },
        },
        'A → B → C → None. C conserva next = None.',
        ['B debe llevarte a C.', 'Asigna c a b.next.'],
        9,
      ),
    ],
    transfer: {
      prompt: '¿Cómo llegas al tercer nodo desde head?',
      choices: ['head.next.next', 'head[2] siempre funciona', 'head.next'],
      answer: 0,
      explanation:
        'Sigues dos referencias desde el primer nodo. Esta clase Nodo no implementa acceso por índice.',
    },
    cost: 'Recorrer n nodos: O(n).',
  },
  {
    id: 'linked-insert',
    module: 'structures',
    concept: 'Linked list · inserción',
    title: 'Una canción entre dos.',
    accent: 'No pierdas el resto.',
    description:
      'Tienes A → C y quieres insertar B entre ambos. El nodo b ya existe. Primero enlaza B al sucesor de A y después conecta A con B.',
    takeaway:
      'Al insertar, preserva la referencia al resto antes de reemplazar el enlace original. Si ya tienes el nodo anterior, basta con cambiar dos referencias.',
    code: 'b.next = a.next\na.next = b',
    steps: [
      step(
        '¿Qué referencia debes guardar primero para no perder el camino hacia C?',
        ['b.next = a.next', 'a.next = b'],
        'b.next = a.next',
        chain([['A', 'C']], ['A', 'B', 'C'], 'A'),
        chain(
          [
            ['A', 'C'],
            ['B', 'C'],
          ],
          ['A', 'B', 'C'],
          'B',
        ),
        'B ya apunta a C. A todavía mantiene su enlace original.',
        [
          'Antes de reemplazar a.next, reutiliza su valor.',
          'Primero b.next = a.next.',
        ],
      ),
      step(
        'B ya apunta a C. ¿Cómo lo incorporas a la lista desde A?',
        ['a.next = b', 'b.next = a'],
        'a.next = b',
        chain(
          [
            ['A', 'C'],
            ['B', 'C'],
          ],
          ['A', 'B', 'C'],
          'B',
        ),
        chain(
          [
            ['A', 'B'],
            ['B', 'C'],
          ],
          ['A', 'B', 'C'],
          'A',
        ),
        'Ahora el recorrido desde head es A → B → C.',
        ['Modifica el enlace que sale de A.', 'a.next debe apuntar a b.'],
        2,
      ),
    ],
    transfer: {
      prompt:
        'Si solo tienes head y buscas insertar tras el último nodo de una lista de n nodos, ¿todo cuesta O(1)?',
      choices: ['Sí, siempre', 'No: primero debes recorrer la lista'],
      answer: 1,
      explanation:
        'Cambiar enlaces es O(1); encontrar el nodo anterior puede costar O(n).',
    },
    cost: 'O(1) con el nodo anterior disponible; localizarlo puede costar O(n).',
  },
  {
    id: 'linked-delete',
    module: 'structures',
    concept: 'Linked list · eliminación',
    title: 'Salta una canción.',
    accent: 'Conserva el camino.',
    description:
      'En A → B → C, quieres quitar B del recorrido. La variable a ya apunta al nodo anterior. No hace falta mover el dato de C.',
    takeaway:
      'Eliminar un nodo intermedio consiste en enlazar su anterior con su sucesor. Quitar la cabeza requiere actualizar head.',
    code: 'a.next = a.next.next\n# Para quitar la cabeza:\nhead = head.next',
    steps: [
      step(
        'a.next es B. ¿A qué nodo apunta a.next.next?',
        ['A', 'B', 'C'],
        'C',
        chain(
          [
            ['A', 'B'],
            ['B', 'C'],
          ],
          ['A', 'B', 'C'],
          'A',
        ),
        chain(
          [
            ['A', 'B'],
            ['B', 'C'],
          ],
          ['A', 'B', 'C'],
          'C',
        ),
        'Dos saltos desde A llegan a C.',
        ['Sigue A → B y después B → C.', 'El sucesor de B es C.'],
      ),
      step(
        '¿Qué asignación deja A → C?',
        ['a.next = a.next.next', 'a.next = None', 'a.next.next = a'],
        'a.next = a.next.next',
        chain(
          [
            ['A', 'B'],
            ['B', 'C'],
          ],
          ['A', 'B', 'C'],
        ),
        chain([['A', 'C']], ['A', 'C'], 'A'),
        'Desde head, B ya no es alcanzable. Conservamos el enlace hacia C.',
        [
          'No queremos cortar el resto de la lista.',
          'Haz que A apunte directamente al sucesor de B.',
        ],
      ),
    ],
    transfer: {
      prompt:
        'En head → A → C, quieres quitar A, el primer nodo. ¿Qué actualizas?',
      choices: ['head = head.next', 'Solo a.next = None'],
      answer: 0,
      explanation:
        'Al quitar la cabeza, la referencia de entrada debe apuntar al siguiente nodo.',
    },
    cost: 'O(1) para quitar el sucesor de un nodo conocido.',
  },
);
lessons.push(
  {
    id: 'recursion',
    module: 'strategies',
    concept: 'Recursión · caso base',
    title: 'Cajas dentro de cajas.',
    accent: 'Abre una más pequeña.',
    description:
      'Una función recursiva se llama a sí misma con un problema más pequeño. Calcula la suma de 1 hasta 3: suma(3) = 3 + suma(2). El caso base suma(0) devuelve 0.',
    takeaway:
      'La recursión necesita un caso base y llamadas que se acerquen a él. Las llamadas pendientes se resuelven al regresar, como una pila.',
    code: 'def suma(n):\n    if n == 0:\n        return 0\n    return n + suma(n - 1)',
    steps: [
      step(
        'suma(3) deja pendiente sumar 3. ¿Qué llamada abre ahora?',
        ['suma(3)', 'suma(2)', 'suma(4)'],
        'suma(2)',
        stats({ pendiente: '3 + suma(2)' }),
        { ...cells(['suma(3)', 'suma(2)'], 1), kind: 'stack' },
        'El argumento baja de 3 a 2: el problema se hace más pequeño.',
        ['La llamada usa n − 1.', '3 − 1 = 2.'],
        4,
      ),
      step(
        'Seguimos bajando hasta suma(0). ¿Qué devuelve el caso base?',
        [0, 1, 3],
        0,
        {
          ...cells(['suma(3)', 'suma(2)', 'suma(1)', 'suma(0)'], 3),
          kind: 'stack',
        },
        stats({ 'suma(0)': '0', 'suma(1)': '1 + 0 = 1' }),
        'El caso base detiene las llamadas. Ahora comienzan los retornos.',
        [
          'La condición n == 0 es verdadera.',
          'La línea del caso base dice return 0.',
        ],
        3,
      ),
      step(
        'suma(1) devolvió 1; suma(2) devuelve 2 + 1 = 3. ¿Qué devuelve suma(3)?',
        [3, 5, 6],
        6,
        stats({ 'suma(2)': '3', 'suma(3)': '3 + 3' }),
        stats({ 'suma(3)': '6' }),
        'Las llamadas se resuelven de adentro hacia afuera: 0, 1, 3, 6.',
        ['Usa el resultado de la llamada más pequeña.', '3 + 3 = 6.'],
        4,
      ),
    ],
    transfer: {
      prompt:
        'Si siempre llamamos a suma(n) desde suma(n), sin reducir n, ¿alcanzaremos el caso base empezando en 3?',
      choices: ['Sí', 'No'],
      answer: 1,
      explanation:
        'El argumento no cambia: no nos acercamos a 0. Las llamadas siguen hasta agotar recursos.',
    },
    cost: 'Para suma(n): O(n) tiempo y O(n) pila.',
  },
  {
    id: 'complexity',
    module: 'strategies',
    concept: 'Complejidad · Big O',
    title: 'De diez a diez mil.',
    accent: '¿Cuánto crece el trabajo?',
    description:
      'Big O describe cómo crece el trabajo al aumentar los datos; no mide segundos exactos. Compara consultar una posición, revisar toda una lista y comparar cada par.',
    takeaway:
      'O(1) no crece con n; O(n) crece linealmente; O(n²) puede cuadruplicar el trabajo al duplicar n. O(log n) aparece al reducir repetidamente por un factor constante.',
    code: 'valor = datos[0]          # O(1)\nfor x in datos:           # O(n)\n    visitar(x)\nfor x in datos:           # O(n²)\n    for y in datos:\n        comparar(x, y)',
    steps: [
      step(
        'Una lista pasa de 10 a 10000 elementos. Leer datos[0] en un array requiere…',
        ['La misma clase de acceso', 'Recorrer los 10000'],
        'La misma clase de acceso',
        stats({ n: '10', operación: 'Leer índice 0' }),
        stats({ n: '10000', crecimiento: 'O(1)' }),
        'Un acceso por índice en un array no necesita recorrer los elementos.',
        [
          'La posición se calcula directamente.',
          'El trabajo del acceso no crece con n.',
        ],
      ),
      step(
        'Recorres cada elemento una vez. Si duplicas n, el número de visitas…',
        ['Se duplica', 'Se cuadruplica', 'No cambia'],
        'Se duplica',
        stats({ n: '100', visitas: '100' }),
        stats({ n: '200', visitas: '200', crecimiento: 'O(n)' }),
        'Dos veces los elementos implica dos veces las visitas.',
        ['Hay una visita por elemento.', '100 visitas pasan a 200.'],
        2,
      ),
      step(
        'Comparas cada x con cada y, incluyendo consigo mismo. De 10 × 10 pasas a 20 × 20. ¿Cuántas comparaciones nuevas hay?',
        [200, 400, 40],
        400,
        stats({ antes: '10 × 10 = 100' }),
        stats({ después: '20 × 20 = 400', crecimiento: 'O(n²)' }),
        'Duplicar n cuadruplicó las comparaciones.',
        [
          'Multiplica las vueltas del bucle exterior por las del interior.',
          '20 × 20 = 400.',
        ],
        6,
      ),
    ],
    transfer: {
      prompt: '¿O(n) significa que una operación tarda exactamente n segundos?',
      choices: ['Sí', 'No, describe crecimiento'],
      answer: 1,
      explanation:
        'Big O abstrae constantes y detalles de la máquina; describe el crecimiento asintótico.',
    },
  },
  {
    id: 'merge',
    module: 'strategies',
    concept: 'Merge sort · dividir y combinar',
    title: 'Dos filas ya ordenadas.',
    accent: 'Una sola fila al final.',
    description:
      'Combina [2, 5] y [1, 4]. Solo necesitas comparar el primer elemento disponible de cada fila y sacar el menor. Merge sort obtiene esas filas dividiendo y ordenando recursivamente.',
    takeaway:
      'Merge sort divide hasta listas pequeñas y combina mitades ordenadas. La combinación visita cada elemento una vez por nivel.',
    code: 'while izquierda and derecha:\n    if izquierda[0] <= derecha[0]:\n        salida.append(izquierda.pop(0))\n    else:\n        salida.append(derecha.pop(0))\nsalida.extend(izquierda or derecha)',
    steps: [
      step(
        'Cabezas disponibles: 2 y 1. ¿Qué sacas primero?',
        [2, 1],
        1,
        stats({ izquierda: '2, 5', derecha: '1, 4', salida: 'vacía' }),
        stats({ izquierda: '2, 5', derecha: '4', salida: '1' }),
        'El 1 es el menor de las cabezas.',
        ['Compara solo las cabezas actuales.', '1 < 2.'],
        5,
      ),
      step(
        'Ahora las cabezas son 2 y 4. ¿Qué sigue?',
        [2, 4, 5],
        2,
        stats({ izquierda: '2, 5', derecha: '4', salida: '1' }),
        stats({ izquierda: '5', derecha: '4', salida: '1, 2' }),
        'Sacamos el 2 de la izquierda.',
        ['El 5 todavía está detrás del 2.', '2 es menor que 4.'],
        3,
      ),
      step(
        'Quedan 5 y 4. ¿Cuál agregas?',
        [5, 4],
        4,
        stats({ izquierda: '5', derecha: '4', salida: '1, 2' }),
        stats({ izquierda: '5', derecha: 'vacía', salida: '1, 2, 4' }),
        'La derecha se vacía; podemos copiar lo que queda en la izquierda.',
        ['El orden debe seguir de menor a mayor.', '4 < 5.'],
        5,
      ),
      step(
        'La derecha está vacía. ¿Qué agregas al final?',
        [1, 2, 5],
        5,
        stats({ izquierda: '5', derecha: 'vacía', salida: '1, 2, 4' }),
        cells([1, 2, 4, 5], -1, [0, 1, 2, 3]),
        'Resultado: [1, 2, 4, 5]. Ambas mitades fueron consumidas.',
        ['Solo queda un elemento sin copiar.', 'Agrega el 5 restante.'],
        6,
      ),
    ],
    transfer: {
      prompt:
        '¿Puedes aplicar esta combinación directamente a dos filas desordenadas?',
      choices: ['Sí, sin cambios', 'No: cada mitad debe estar ordenada'],
      answer: 1,
      explanation:
        'Si hay un elemento menor escondido detrás de una cabeza, la combinación no garantiza el orden.',
    },
    cost: 'Merge sort con índices: O(n log n) tiempo y O(n) espacio auxiliar. El fragmento usa pop(0) para enseñar; en listas Python ese desplazamiento es O(n).',
  },
  {
    id: 'quicksort',
    module: 'strategies',
    concept: 'Quicksort · partición',
    title: 'Un pivote en la fiesta.',
    accent: 'Cada número a su lado.',
    description:
      'El pivote es 4. Clasifica [7, 2, 4, 1, 6] en menores, iguales y mayores. Una partición separa los grupos; todavía falta ordenar cada lado.',
    takeaway:
      'Quicksort particiona respecto a un pivote y ordena recursivamente los lados. Un pivote desafortunado repetidamente puede producir particiones muy desequilibradas.',
    code: 'def quicksort(datos):\n    if len(datos) <= 1: return datos\n    pivote = datos[len(datos) // 2]\n    menores = [x for x in datos if x < pivote]\n    iguales = [x for x in datos if x == pivote]\n    mayores = [x for x in datos if x > pivote]\n    return quicksort(menores) + iguales + quicksort(mayores)',
    steps: [7, 2, 4, 1, 6].map((n, i) => {
      const prev = [7, 2, 4, 1, 6].slice(0, i),
        next = [...prev, n];
      const view = (xs: number[]) =>
        stats({
          pivote: '4',
          menores: xs.filter((x) => x < 4).join(', ') || 'vacío',
          iguales: xs.filter((x) => x === 4).join(', ') || 'vacío',
          mayores: xs.filter((x) => x > 4).join(', ') || 'vacío',
        });
      return step(
        `¿En qué grupo colocas el ${n}?`,
        ['Menores', 'Iguales', 'Mayores'],
        n < 4 ? 'Menores' : n === 4 ? 'Iguales' : 'Mayores',
        view(prev),
        view(next),
        `${n} ${n < 4 ? 'es menor que' : n === 4 ? 'es igual a' : 'es mayor que'} 4.`,
        [
          'Compara el valor con el pivote 4.',
          `Usa el grupo ${n < 4 ? 'Menores' : n === 4 ? 'Iguales' : 'Mayores'}.`,
        ],
        n < 4 ? 4 : n === 4 ? 5 : 6,
      );
    }),
    transfer: {
      prompt:
        'Después de particionar, menores = [2, 1]. ¿Ya está ordenada esa mitad?',
      choices: ['Sí', 'No: falta ordenar recursivamente'],
      answer: 1,
      explanation:
        'La partición garantiza menores que el pivote, no el orden dentro de cada grupo.',
    },
    cost: 'O(n log n) promedio; O(n²) en el peor caso. Esta versión usa listas adicionales.',
  },
);

const treeCells: Cell[] = [
  { id: '4', label: '4', x: 50, y: 13 },
  { id: '2', label: '2', x: 25, y: 44 },
  { id: '6', label: '6', x: 75, y: 44 },
  { id: '1', label: '1', x: 12, y: 82 },
  { id: '3', label: '3', x: 38, y: 82 },
  { id: '5', label: '5', x: 62, y: 82 },
  { id: '7', label: '7', x: 88, y: 82 },
];
const treeEdges = [
  ['4', '2'],
  ['4', '6'],
  ['2', '1'],
  ['2', '3'],
  ['6', '5'],
  ['6', '7'],
];
const tree = (visited: string[] = [], active?: string): View => ({
  kind: 'tree',
  cells: treeCells.map((c) => ({
    ...c,
    state:
      c.id === active ? 'active' : visited.includes(c.id) ? 'done' : undefined,
  })),
  edges: treeEdges.map(([from, to]) => ({ from, to })),
  stats: { visitados: visited.join(' → ') || 'ninguno' },
  caption:
    'Raíz: 4. Izquierda y derecha se refieren a cada nodo. Un árbol conecta nodos sin ciclos.',
});
lessons.push({
  id: 'bst',
  module: 'trees',
  concept: 'Árbol binario de búsqueda · BST',
  title: 'Cada decisión abre una rama.',
  accent: 'Encuentra el cinco.',
  description:
    'En este BST no hay duplicados. Todos los valores del subárbol izquierdo son menores que su raíz; los del derecho, mayores. Busca 5 empezando en 4.',
  takeaway:
    'Un BST permite decidir una rama según la comparación. Su rendimiento depende de la altura: sin equilibrio puede parecerse a una lista.',
  code: 'def buscar(nodo, objetivo):\n    if nodo is None: return None\n    if objetivo == nodo.dato: return nodo\n    if objetivo < nodo.dato:\n        return buscar(nodo.izquierda, objetivo)\n    return buscar(nodo.derecha, objetivo)',
  steps: [
    step(
      'Buscas 5 y estás en 4. ¿Qué rama sigues?',
      ['Izquierda: 2', 'Derecha: 6'],
      'Derecha: 6',
      tree([], '4'),
      tree(['4'], '6'),
      'Como 5 > 4, descartamos el subárbol izquierdo.',
      [
        'Compara el objetivo con el nodo actual.',
        '5 es mayor que 4: ve a la derecha.',
      ],
      6,
    ),
    step(
      'Estás en 6 buscando 5. ¿Qué rama sigues?',
      ['Izquierda: 5', 'Derecha: 7'],
      'Izquierda: 5',
      tree(['4'], '6'),
      tree(['4', '6'], '5'),
      '5 < 6. Entramos por la izquierda de 6.',
      ['Ahora la comparación es con 6.', '5 es menor que 6.'],
      5,
    ),
    step(
      'Llegaste a 5. ¿Continúas bajando?',
      ['No, encontrado', 'Sí, siempre hay que llegar a None'],
      'No, encontrado',
      tree(['4', '6'], '5'),
      tree(['4', '6', '5']),
      'La igualdad permite terminar la búsqueda.',
      ['El objetivo coincide con el nodo actual.', 'Devuelve el nodo 5.'],
      3,
    ),
  ],
  transfer: {
    prompt: 'Insertas 8 en este BST. Tras pasar por 4, 6 y 7, ¿dónde crece?',
    choices: ['A la izquierda de 7', 'A la derecha de 7'],
    answer: 1,
    explanation:
      '8 es mayor que 7; el enlace derecho vacío recibe el nuevo nodo.',
  },
  cost: 'O(h) tiempo, donde h es la altura; O(log n) si está equilibrado, O(n) en el peor caso.',
});
for (const [id, concept, rule, order, lines] of [
  [
    'preorder',
    'Preorder · preorden',
    'raíz → izquierda → derecha',
    ['4', '2', '1', '3', '6', '5', '7'],
    [
      'visitar(nodo.dato)',
      'recorrer(nodo.izquierda)',
      'recorrer(nodo.derecha)',
    ],
  ],
  [
    'inorder',
    'Inorder · inorden',
    'izquierda → raíz → derecha',
    ['1', '2', '3', '4', '5', '6', '7'],
    [
      'recorrer(nodo.izquierda)',
      'visitar(nodo.dato)',
      'recorrer(nodo.derecha)',
    ],
  ],
  [
    'postorder',
    'Postorder · postorden',
    'izquierda → derecha → raíz',
    ['1', '3', '2', '5', '7', '6', '4'],
    [
      'recorrer(nodo.izquierda)',
      'recorrer(nodo.derecha)',
      'visitar(nodo.dato)',
    ],
  ],
] as const) {
  lessons.push({
    id,
    module: 'trees',
    concept,
    title:
      id === 'preorder'
        ? 'Primero, quien abre la puerta.'
        : id === 'inorder'
          ? 'Izquierda. Tú. Derecha.'
          : 'Los hijos van primero.',
    accent: 'Recorre el árbol.',
    description: `Visitar significa registrar un nodo en la salida. Sigue la regla ${rule} en cada subárbol. Toca los nodos en el orden en que se registran; las pistas te acompañan.`,
    takeaway:
      id === 'inorder'
        ? 'Inorder visita izquierda, raíz y derecha. En un BST produce valores ordenados; en un árbol binario cualquiera, no necesariamente.'
        : id === 'preorder'
          ? 'Preorder registra la raíz antes que sus descendientes: raíz, izquierda y derecha. Es un recorrido; no ordena cualquier conjunto de datos.'
          : 'Postorder registra cada raíz después de sus descendientes. Resulta útil cuando un padre necesita primero los resultados de sus hijos.',
    code: `def recorrer(nodo):\n    if nodo is None: return\n${lines.map((x) => '    ' + x).join('\n')}`,
    steps: order.map((n, i) =>
      step(
        i === 0
          ? '¿Qué nodo registras primero?'
          : `Salida actual: ${order.slice(0, i).join(' → ')}. ¿Qué nodo registras ahora?`,
        [4, 2, 6, 1, 3, 5, 7],
        n,
        tree(order.slice(0, i)),
        tree(order.slice(0, i + 1), n),
        `Registraste ${n}. ${i === 6 ? 'El árbol completo fue visitado una vez.' : `Seguimos la regla ${rule}.`}`,
        [
          `Aplica ${rule} también dentro de cada rama.`,
          `El siguiente nodo que se registra es ${n}.`,
        ],
        id === 'preorder' ? 3 : id === 'inorder' ? 4 : 5,
      ),
    ),
    transfer: {
      prompt:
        id === 'inorder'
          ? '¿Inorder produce valores ordenados en cualquier árbol binario?'
          : id === 'preorder'
            ? 'En un árbol con raíz A, hijo izquierdo B y derecho C, ¿cuál es el preorden?'
            : 'Con raíz A e hijos B (izquierda) y C (derecha), ¿cuál es el postorden?',
      choices:
        id === 'inorder'
          ? ['Sí, siempre', 'No: hace falta la propiedad de BST']
          : id === 'preorder'
            ? ['B, A, C', 'A, B, C', 'B, C, A']
            : ['A, B, C', 'B, A, C', 'B, C, A'],
      answer: id === 'inorder' ? 1 : id === 'preorder' ? 1 : 2,
      explanation:
        id === 'inorder'
          ? 'Inorder solo define el orden de visita. La propiedad de búsqueda del BST es lo que garantiza valores ordenados.'
          : id === 'preorder'
            ? 'La raíz A se registra antes que las ramas B y C.'
            : 'Se visitan B y C antes de registrar la raíz A.',
    },
    cost: 'O(n) tiempo; O(h) pila recursiva.',
  });
}
lessons.push(
  {
    id: 'heap',
    module: 'trees',
    concept: 'Min-heap · cola de prioridad',
    title: 'La tarea más urgente.',
    accent: 'Sube hasta donde toca.',
    description:
      'Un min-heap es un árbol binario completo: se llena por niveles, de izquierda a derecha. Cada padre es menor o igual que sus hijos. Insertas prioridad 1 al final de [2, 4, 7, 8]; un número menor significa más urgencia.',
    takeaway:
      'Un heap mantiene el mínimo en la raíz sin ordenar toda la colección. Al insertar, añade al final y sube intercambiando con el padre mientras viola la propiedad.',
    code: 'heap.append(1)\ni = len(heap) - 1\nwhile i > 0:\n    padre = (i - 1) // 2\n    if heap[padre] <= heap[i]: break\n    heap[padre], heap[i] = heap[i], heap[padre]\n    i = padre',
    steps: [
      step(
        'El 1 entra en el índice 4. Su padre está en (4 − 1) // 2 = 1, valor 4. ¿Qué haces?',
        ['Intercambiar 1 y 4', 'Dejarlo al final'],
        'Intercambiar 1 y 4',
        cells([2, 4, 7, 8, 1], 4, [], ['0', '1', '2', '3', '4']),
        cells([2, 1, 7, 8, 4], 1),
        'El 1 sube: es menor que su padre 4.',
        [
          'El padre no puede ser mayor que el hijo.',
          'Como 1 < 4, intercámbialos.',
        ],
        6,
      ),
      step(
        'El 1 está en el índice 1 y su padre es 2. ¿Qué toca?',
        ['Intercambiar 1 y 2', 'Intercambiar 1 y 7'],
        'Intercambiar 1 y 2',
        cells([2, 1, 7, 8, 4], 1),
        cells([1, 2, 7, 8, 4], 0),
        'El mínimo llega a la raíz. La lista [1, 2, 7, 8, 4] es un heap, aunque no está totalmente ordenada.',
        [
          'Solo comparas con el padre, no con los hermanos.',
          '1 < 2: sube otra vez.',
        ],
        6,
      ),
    ],
    transfer: {
      prompt:
        'En [1, 2, 7, 8, 4], ¿el hecho de que 8 aparezca antes que 4 rompe el min-heap?',
      choices: [
        'Sí, todo debe estar ordenado',
        'No: se exige orden entre padres e hijos',
      ],
      answer: 1,
      explanation:
        'Cada padre sigue siendo menor o igual que sus hijos. Los hermanos y otros nodos no tienen que estar ordenados.',
    },
    cost: 'Consultar el mínimo O(1); insertar o extraer mínimo O(log n).',
  },
  {
    id: 'trie',
    module: 'trees',
    concept: 'Trie · árbol de prefijos',
    title: 'Escribe «ca»…',
    accent: 'El árbol completa la idea.',
    description:
      'Un trie comparte prefijos. Guardamos casa y cama: ambas comparten c → a y luego se separan. Una marca de fin distingue una palabra completa de un simple prefijo.',
    takeaway:
      'Un trie recorre caracteres en lugar de comparar palabras completas. Compartir un prefijo no significa que ese prefijo sea también una palabra almacenada.',
    code: 'nodo = raiz\nfor letra in palabra:\n    if letra not in nodo.hijos:\n        nodo.hijos[letra] = Nodo()\n    nodo = nodo.hijos[letra]\nnodo.es_palabra = True',
    steps: [
      step(
        'Ya existe c → a → s → a para casa. Al insertar cama, ¿qué prefijo reutilizas?',
        ['c → a', 'c → a → s', 'Toda casa'],
        'c → a',
        stats({ guardada: 'casa', nueva: 'cama' }),
        stats({ compartido: 'c → a', ramas: 's → a | m → a' }),
        'Las primeras dos letras coinciden. Después, m abre otra rama.',
        [
          'Compara las letras hasta la primera diferencia.',
          'c y a coinciden; s y m no.',
        ],
        3,
      ),
      step(
        'Tras insertar cama, ¿qué nodo marcas como final de palabra?',
        ['La c inicial', 'La a de la rama c → a → m → a', 'El prefijo c → a'],
        'La a de la rama c → a → m → a',
        stats({ camino: 'c → a → m → a', fin: 'sin marcar' }),
        stats({ camino: 'c → a → m → a', es_palabra: 'True' }),
        'La marca está en el último carácter del camino completo.',
        [
          'La palabra completa es cama, no ca.',
          'Marca la a que viene después de m.',
        ],
        6,
      ),
    ],
    transfer: {
      prompt:
        'Solo guardaste casa y cama. ¿Encontrar el camino c → a basta para afirmar que ca es una palabra guardada?',
      choices: ['Sí', 'No, falta la marca de fin'],
      answer: 1,
      explanation:
        'El camino demuestra que ca es un prefijo; hace falta es_palabra para confirmar la palabra exacta.',
    },
    cost: 'Consultar una palabra de longitud L: O(L), suponiendo acceso O(1) a los hijos.',
  },
);
const graphCells: Cell[] = [
  { id: 'A', label: 'A', x: 15, y: 45 },
  { id: 'B', label: 'B', x: 43, y: 15 },
  { id: 'C', label: 'C', x: 43, y: 78 },
  { id: 'D', label: 'D', x: 76, y: 15 },
  { id: 'E', label: 'E', x: 76, y: 78 },
];
const graphEdges = [
  ['A', 'B'],
  ['A', 'C'],
  ['B', 'D'],
  ['B', 'E'],
  ['C', 'E'],
];
const graph = (
  visited: string[] = [],
  active?: string,
  frontier?: string,
): View => ({
  kind: 'graph',
  cells: graphCells.map((c) => ({
    ...c,
    state:
      active === c.id ? 'active' : visited.includes(c.id) ? 'done' : undefined,
  })),
  edges: graphEdges.map(([from, to]) => ({ from, to })),
  stats: {
    visitados: visited.join(' → ') || 'ninguno',
    ...(frontier ? { pendientes: frontier } : {}),
  },
  caption:
    'Calles de doble sentido. Cuando hay varios vecinos, los consideramos en orden alfabético.',
});
lessons.push({
  id: 'adjacency',
  module: 'graphs',
  concept: 'Grafo · lista de adyacencia',
  title: 'Un mapa sin coordenadas.',
  accent: 'Solo importa quién conecta.',
  description:
    'Un grafo tiene nodos y aristas. Aquí cada letra es un lugar y cada línea, una calle de doble sentido. La lista de adyacencia guarda los vecinos directos de cada lugar.',
  takeaway:
    'Un grafo puede tener ciclos y múltiples caminos. Una lista de adyacencia describe vecinos; no exige que todo tenga un único padre, como un árbol enraizado.',
  code: 'vecinos = {\n    "A": ["B", "C"],\n    "B": ["A", "D", "E"],\n    "C": ["A", "E"],\n    "D": ["B"],\n    "E": ["B", "C"],\n}',
  steps: [
    step(
      '¿Qué lugares tienen una calle directa con A?',
      ['B y C', 'D y E', 'Solo B'],
      'B y C',
      graph([], 'A'),
      { ...graph(['A']), stats: { 'vecinos[A]': 'B, C' } },
      'A se conecta directamente con B y C. Llegar a D requiere pasar por otro lugar.',
      [
        'Mira las líneas que salen de A.',
        'A — B y A — C son las dos conexiones.',
      ],
      2,
    ),
    step(
      'La calle C — E es de doble sentido. Si E está en vecinos[C], ¿qué más debe aparecer?',
      ['C en vecinos[E]', 'A en vecinos[E]', 'Nada'],
      'C en vecinos[E]',
      graph([], 'C'),
      {
        ...graph(['C', 'E']),
        stats: { 'vecinos[C]': 'A, E', 'vecinos[E]': 'B, C' },
      },
      'Las aristas no dirigidas se representan en ambas listas.',
      ['Doble sentido permite ir y volver.', 'También debe registrarse E → C.'],
      6,
    ),
  ],
  transfer: {
    prompt:
      'En un grafo dirigido, ¿una arista A → B implica automáticamente B → A?',
    choices: ['Sí', 'No'],
    answer: 1,
    explanation:
      'Las aristas dirigidas tienen un sentido. La vuelta requiere otra arista.',
  },
  cost: 'Una lista de adyacencia usa O(V + E) espacio.',
});
for (const config of [
  {
    id: 'bfs',
    concept: 'BFS · búsqueda en anchura',
    title: 'Encuentra lo más cercano.',
    accent: 'Primero, todos tus vecinos.',
    order: ['A', 'B', 'C', 'D', 'E'],
    frontiers: ['A', 'B, C', 'C, D, E', 'D, E', 'E', 'vacía'],
    description:
      'Explora este mapa desde A usando una cola. Saca del frente, registra el lugar y agrega vecinos nuevos al final, en orden alfabético. Marcamos al encolar para no repetir.',
    takeaway:
      'BFS visita por capas de distancia. En un grafo sin pesos, descubre caminos con el menor número de aristas. El conjunto vistos evita repetir nodos en ciclos.',
    code: 'from collections import deque\ncola, vistos = deque(["A"]), {"A"}\nwhile cola:\n    u = cola.popleft()\n    visitar(u)\n    for v in vecinos[u]:\n        if v not in vistos:\n            vistos.add(v)\n            cola.append(v)',
  },
  {
    id: 'dfs',
    concept: 'DFS · búsqueda en profundidad',
    title: 'Sigue una calle hasta el fondo.',
    accent: 'Después, vuelve atrás.',
    order: ['A', 'B', 'D', 'E', 'C'],
    frontiers: ['A', 'A → B', 'A → B → D', 'A → B → E', 'A → B → E → C', 'fin'],
    description:
      'Recorre desde A con DFS recursivo. Registra al entrar y toma el primer vecino no visitado en orden alfabético. Si ya no hay ninguno, regresa a quien te llamó.',
    takeaway:
      'DFS profundiza antes de explorar las otras ramas. La pila de llamadas permite volver atrás. Un conjunto de visitados impide quedar atrapado en ciclos.',
    code: 'vistos = set()\ndef dfs(u):\n    vistos.add(u)\n    visitar(u)\n    for v in vecinos[u]:\n        if v not in vistos:\n            dfs(v)\ndfs("A")',
  },
])
  lessons.push({
    id: config.id,
    module: 'graphs',
    concept: config.concept,
    title: config.title,
    accent: config.accent,
    description: config.description,
    takeaway: config.takeaway,
    code: config.code,
    steps: config.order.map((n, i) =>
      step(
        i === 0
          ? 'El recorrido empieza en A. ¿Qué nodo registras primero?'
          : `Ya registraste ${config.order.slice(0, i).join(' → ')}. ¿Cuál sigue?`,
        ['A', 'B', 'C', 'D', 'E'],
        n,
        graph(config.order.slice(0, i), undefined, config.frontiers[i]),
        graph(config.order.slice(0, i + 1), n, config.frontiers[i + 1]),
        `${n} queda registrado. ${config.id === 'bfs' ? 'La cola conserva el orden de llegada.' : n === 'D' ? 'D no tiene vecinos nuevos: volvemos a B.' : 'Seguimos el primer vecino aún no visitado; si no hay, regresamos.'}`,
        [
          config.id === 'bfs'
            ? 'Toma el nodo que está al frente de la cola.'
            : 'Profundiza por vecinos nuevos en orden alfabético; retrocede cuando se agoten.',
          `El próximo nodo que se registra es ${n}.`,
        ],
        config.id === 'bfs' ? 5 : 4,
      ),
    ),
    transfer: {
      prompt:
        config.id === 'bfs'
          ? '¿BFS minimiza el tiempo de viaje si las calles tienen duraciones distintas?'
          : '¿DFS garantiza encontrar el camino con menos aristas?',
      choices: ['Sí', 'No'],
      answer: 1,
      explanation:
        config.id === 'bfs'
          ? 'BFS minimiza el número de aristas en un grafo sin pesos. Con tiempos distintos hace falta considerar los pesos.'
          : 'DFS explora en profundidad; el primer camino que encuentra puede ser más largo que otro.',
    },
    cost: 'O(V + E) tiempo y O(V) espacio con listas de adyacencia.',
  });
const weighted = (
  done: string[],
  dist: Record<string, string>,
  active?: string,
): View => ({
  kind: 'graph',
  cells: [
    { id: 'A', label: 'A', x: 15, y: 50 },
    { id: 'B', label: 'B', x: 50, y: 18 },
    { id: 'C', label: 'C', x: 50, y: 82 },
    { id: 'D', label: 'D', x: 85, y: 50 },
  ].map((c) => ({
    ...c,
    state:
      c.id === active ? 'active' : done.includes(c.id) ? 'done' : undefined,
  })),
  edges: [
    ['A', 'B', '4'],
    ['A', 'C', '1'],
    ['C', 'B', '2'],
    ['B', 'D', '1'],
    ['C', 'D', '5'],
  ].map(([from, to, label]) => ({ from, to, label })),
  stats: dist,
  caption:
    'Calles de doble sentido. Los números son minutos. Todos los pesos son no negativos.',
});
lessons.push(
  {
    id: 'dijkstra',
    module: 'graphs',
    concept: 'Dijkstra · camino mínimo',
    title: 'La entrega más rápida.',
    accent: 'Menos minutos, no menos calles.',
    description:
      'Partes de A. La distancia tentativa es el mejor tiempo conocido hasta ahora. Fija el nodo pendiente con menor distancia y mejora las distancias de sus vecinos. ∞ significa que todavía no conocemos un camino.',
    takeaway:
      'Dijkstra fija la menor distancia pendiente y relaja las aristas. Necesita pesos no negativos. El camino con menos aristas no siempre pesa menos.',
    code: 'dist = {"A": 0, "B": inf, "C": inf, "D": inf}\n# Extrae u con menor distancia pendiente.\nfor v, peso in vecinos[u]:\n    candidata = dist[u] + peso\n    if candidata < dist[v]:\n        dist[v] = candidata\n        anterior[v] = u',
    steps: [
      step(
        'Tras fijar A: B cuesta 4 y C cuesta 1. ¿Qué nodo fijas ahora?',
        ['B', 'C', 'D'],
        'C',
        weighted(['A'], { A: '0', B: '4', C: '1', D: '∞' }),
        weighted(['A', 'C'], { A: '0', B: '4', C: '1', D: '∞' }, 'C'),
        'C tiene la menor distancia tentativa pendiente: 1.',
        [
          'Compara las distancias, no el orden alfabético.',
          '1 es menor que 4.',
        ],
        2,
      ),
      step(
        'Desde C, llegar a B suma 1 + 2. B tenía 4. ¿Qué distancia guardas?',
        [2, 3, 4],
        3,
        weighted(['A', 'C'], { B: '4', candidata: '1 + 2' }),
        weighted(['A', 'C'], { A: '0', B: '3', C: '1', D: '6' }, 'B'),
        'Mejoramos B a 3. También descubrimos D por C en 1 + 5 = 6.',
        [
          'Relajar significa conservar la mejor distancia conocida.',
          '1 + 2 = 3, que mejora el 4 anterior.',
        ],
        6,
      ),
      step(
        'Fijamos B con distancia 3. La calle B — D pesa 1. ¿Cuánto cuesta llegar a D por B?',
        [4, 6, 1],
        4,
        weighted(['A', 'C', 'B'], { B: '3', D: '6' }),
        weighted(['A', 'C', 'B', 'D'], { A: '0', B: '3', C: '1', D: '4' }, 'D'),
        'A → C → B → D tarda 4 minutos; mejora A → C → D, que tardaba 6.',
        [
          'Suma la distancia desde el origen, no solo la última calle.',
          '3 + 1 = 4.',
        ],
        6,
      ),
    ],
    transfer: {
      prompt: '¿Podemos usar Dijkstra sin cambios si algunas aristas pesan −5?',
      choices: ['Sí', 'No'],
      answer: 1,
      explanation:
        'Los pesos negativos invalidan la garantía de que una distancia fijada ya es mínima. Se necesitan otros algoritmos, como Bellman–Ford.',
    },
    cost: 'Con heap binario y listas de adyacencia: O((V + E) log V).',
  },
  {
    id: 'topological',
    module: 'graphs',
    concept: 'Orden topológico · dependencias',
    title: 'Publica tu proyecto.',
    accent: 'Primero, lo que hace falta.',
    description:
      'A = escribir código, B = compilar, C = probar y D = publicar. A debe ir antes que B y C; B y C antes que D. No hay ciclos. Cuando haya empate, elige la letra menor.',
    takeaway:
      'Un orden topológico coloca cada origen antes de su destino en un grafo dirigido acíclico (DAG). No es una ordenación por valor ni un recorrido inorder.',
    code: 'while disponibles:\n    u = sacar_menor_letra(disponibles)\n    salida.append(u)\n    for v in siguientes[u]:\n        grado_entrada[v] -= 1\n        if grado_entrada[v] == 0:\n            disponibles.add(v)',
    steps: ['A', 'B', 'C', 'D'].map((n, i) => {
      const v = (count: number): View => ({
        kind: 'graph',
        cells: [
          { id: 'A', label: 'A', note: 'Código', x: 15, y: 50 },
          { id: 'B', label: 'B', note: 'Compilar', x: 50, y: 15 },
          { id: 'C', label: 'C', note: 'Probar', x: 50, y: 85 },
          { id: 'D', label: 'D', note: 'Publicar', x: 85, y: 50 },
        ].map((c) => ({
          ...c,
          state: ['A', 'B', 'C', 'D'].slice(0, count).includes(c.id)
            ? 'done'
            : undefined,
        })),
        edges: [
          ['A', 'B'],
          ['A', 'C'],
          ['B', 'D'],
          ['C', 'D'],
        ].map(([from, to]) => ({ from, to, directed: true })),
        stats: {
          terminadas:
            ['A', 'B', 'C', 'D'].slice(0, count).join(', ') || 'ninguna',
        },
        caption: 'Una flecha X → Y exige terminar X antes de empezar Y.',
      });
      return step(
        '¿Qué tarea está disponible ahora? Si hay empate, elige la letra menor.',
        ['A', 'B', 'C', 'D'],
        n,
        v(i),
        v(i + 1),
        `${n} queda terminada; eliminamos sus dependencias salientes.`,
        [
          'Elige una tarea cuyas predecesoras ya estén terminadas.',
          `La siguiente según esta regla es ${n}.`,
        ],
        3,
      );
    }),
    transfer: {
      prompt:
        'Si añadimos D → A, cerramos un ciclo. ¿Existe un orden topológico para todas las tareas?',
      choices: ['Sí', 'No'],
      answer: 1,
      explanation:
        'El ciclo exige que A vaya antes que D y D antes que A. No hay un orden que satisfaga ambas dependencias.',
    },
    cost: 'O(V + E) usando una cola; elegir siempre la letra menor con un heap añade O(V log V).',
  },
);
lessons.push(
  {
    id: 'hash',
    module: 'advanced',
    concept: 'Tabla hash · colisiones',
    title: 'Casilleros con atajo.',
    accent: 'Dos llaves, un mismo cajón.',
    description:
      'Usamos 5 casilleros y hash(clave) = clave % 5. % devuelve el resto de la división. Guardaremos claves 12 y 17; con encadenamiento, cada casillero contiene una lista de entradas.',
    takeaway:
      'Una función hash decide un casillero, no identifica por sí sola la clave. Las colisiones son normales: la búsqueda debe comparar la clave completa dentro del casillero.',
    code: 'indice = clave % 5\ncubetas[indice].append((clave, valor))\n\nfor k, v in cubetas[clave % 5]:\n    if k == clave:\n        return v',
    steps: [
      step(
        '12 dividido entre 5 deja resto 2. ¿En qué casillero guardas la clave 12?',
        [0, 2, 4],
        2,
        cells(
          ['vacío', 'vacío', 'vacío', 'vacío', 'vacío'],
          -1,
          [],
          ['0', '1', '2', '3', '4'],
        ),
        cells(
          ['vacío', 'vacío', '12', 'vacío', 'vacío'],
          2,
          [],
          ['0', '1', '2', '3', '4'],
        ),
        'La clave 12 cae en el casillero 2.',
        ['Usa el resto, no el cociente.', '12 % 5 = 2.'],
      ),
      step(
        '17 % 5 también es 2. ¿Cómo preservas ambas claves con encadenamiento?',
        [
          'Borrar 12 y guardar 17',
          'Guardar 12 y 17 en la lista del casillero 2',
        ],
        'Guardar 12 y 17 en la lista del casillero 2',
        cells(['vacío', 'vacío', '12', 'vacío', 'vacío'], 2),
        cells(['vacío', 'vacío', '12 → 17', 'vacío', 'vacío'], 2),
        'Una colisión comparte casillero sin perder entradas.',
        [
          'Encadenamiento permite varios elementos en una cubeta.',
          'Agrega 17 a la lista que ya contiene 12.',
        ],
        2,
      ),
      step(
        'Buscas la clave 17. Llegas al casillero 2 y ves primero 12. ¿Qué haces?',
        ['Devolver el valor de 12', 'Seguir hasta comparar la clave 17'],
        'Seguir hasta comparar la clave 17',
        stats({ buscada: '17', cubeta: '12 → 17' }),
        stats({
          comparaciones: '12 ≠ 17; 17 = 17',
          resultado: 'Valor asociado a 17',
        }),
        'Comparar la clave completa evita confundir entradas que comparten hash.',
        ['Mismo hash no significa misma clave.', 'Salta 12 y comprueba 17.'],
        5,
      ),
    ],
    transfer: {
      prompt:
        '¿Una tabla hash garantiza O(1) en el peor caso si todas las claves caen en una sola lista?',
      choices: ['Sí', 'No, buscar puede costar O(n)'],
      answer: 1,
      explanation:
        'O(1) esperado depende de una distribución adecuada y control de carga. Una cubeta con n entradas puede exigir n comparaciones.',
    },
    cost: 'Búsqueda O(1) esperado con buena distribución; O(n) peor caso.',
  },
  {
    id: 'two-pointers',
    module: 'advanced',
    concept: 'Dos punteros',
    title: 'Dos precios, un presupuesto.',
    accent: 'Acerca los extremos.',
    description:
      'En los precios ordenados [1, 3, 4, 6, 8], encuentra dos que sumen 10. Un puntero empieza a la izquierda y otro a la derecha. Compara su suma con el objetivo.',
    takeaway:
      'Con valores ordenados, una suma baja permite aumentar el puntero izquierdo; una suma alta permite reducir el derecho. Cada movimiento descarta candidatos con una razón.',
    code: 'i, j = 0, len(precios) - 1\nwhile i < j:\n    total = precios[i] + precios[j]\n    if total == 10: return (i, j)\n    if total < 10: i += 1\n    else: j -= 1',
    steps: [
      step(
        'Los extremos suman 1 + 8 = 9. ¿Qué mueves?',
        ['Izquierdo hacia la derecha', 'Derecho hacia la izquierda'],
        'Izquierdo hacia la derecha',
        {
          ...cells([1, 3, 4, 6, 8], 0, [], ['i', '', '', '', 'j']),
          stats: { suma: '9', objetivo: '10' },
        },
        {
          ...cells([1, 3, 4, 6, 8], 1, [], ['', 'i', '', '', 'j']),
          stats: { suma: '3 + 8 = 11' },
        },
        'Necesitamos aumentar la suma; descartamos 1 como extremo izquierdo.',
        [
          'Mover el derecho a un valor menor bajaría aún más la suma.',
          'Avanza i hacia un precio mayor.',
        ],
        5,
      ),
      step(
        'Ahora suman 3 + 8 = 11. ¿Qué mueves?',
        ['Izquierdo hacia la derecha', 'Derecho hacia la izquierda'],
        'Derecho hacia la izquierda',
        stats({ i: '3', j: '8', suma: '11' }),
        {
          ...cells([1, 3, 4, 6, 8], 3, [], ['', 'i', '', 'j', '']),
          stats: { suma: '3 + 6 = 9' },
        },
        'La suma supera 10; reducimos el extremo derecho.',
        ['Ahora necesitamos disminuir la suma.', 'Mueve j de 8 a 6.'],
        6,
      ),
      step(
        '3 + 6 = 9: avanza i. Los nuevos valores son 4 y 6. ¿Qué haces?',
        ['Devolver esta pareja', 'Seguir moviendo siempre'],
        'Devolver esta pareja',
        {
          ...cells([1, 3, 4, 6, 8], 2, [], ['', '', 'i', 'j', '']),
          stats: { suma: '4 + 6 = 10' },
        },
        cells([1, 3, 4, 6, 8], -1, [2, 3]),
        'La pareja 4 y 6 cumple el objetivo usando dos posiciones distintas.',
        [
          'Comprueba la igualdad antes de mover otra vez.',
          '4 + 6 = 10: encontramos una solución.',
        ],
        4,
      ),
    ],
    transfer: {
      prompt:
        '¿Esta regla de mover extremos funciona igual si los precios están desordenados?',
      choices: ['Sí', 'No, necesita orden'],
      answer: 1,
      explanation:
        'El orden garantiza cómo cambia la suma al mover cada extremo.',
    },
    cost: 'O(n) tiempo y O(1) espacio si los datos ya están ordenados.',
  },
  {
    id: 'window',
    module: 'advanced',
    concept: 'Ventana deslizante',
    title: 'Tu mejor racha de tres días.',
    accent: 'Sale uno, entra otro.',
    description:
      'Registraste [2, 1, 5, 1, 3] kilómetros. Encuentra la mayor suma de tres días consecutivos. Al mover una ventana, resta el día que sale y suma el que entra.',
    takeaway:
      'Una ventana deslizante reutiliza el resultado anterior. Para una suma de tamaño fijo, cada movimiento actualiza dos elementos en lugar de volver a sumar toda la ventana.',
    code: 'suma = sum(km[:3])\nmejor = suma\nfor fin in range(3, len(km)):\n    suma += km[fin] - km[fin - 3]\n    mejor = max(mejor, suma)',
    steps: [
      step(
        'Primera ventana: 2 + 1 + 5. ¿Cuál es su suma?',
        [6, 8, 10],
        8,
        cells([2, 1, 5, 1, 3], -1, [0, 1, 2]),
        {
          ...cells([2, 1, 5, 1, 3], -1, [0, 1, 2]),
          stats: { suma: '8', mejor: '8' },
        },
        'Guardamos 8 como suma actual y mejor conocida.',
        ['Suma los tres primeros elementos.', '2 + 1 + 5 = 8.'],
      ),
      step(
        'Sale el 2 y entra el 1 del día siguiente. ¿Cuál es la nueva suma?',
        [7, 8, 9],
        7,
        stats({ anterior: '8', sale: '2', entra: '1' }),
        {
          ...cells([2, 1, 5, 1, 3], -1, [1, 2, 3]),
          stats: { suma: '7', mejor: '8' },
        },
        '8 − 2 + 1 = 7. La mejor sigue siendo 8.',
        ['Resta lo que sale antes de sumar lo nuevo.', '8 − 2 + 1 = 7.'],
        4,
      ),
      step(
        'Ahora sale el 1 del segundo día y entra el 3 final. ¿Qué suma obtienes?',
        [8, 9, 10],
        9,
        stats({ anterior: '7', sale: '1', entra: '3' }),
        {
          ...cells([2, 1, 5, 1, 3], -1, [2, 3, 4]),
          stats: { suma: '9', mejor: '9' },
        },
        '7 − 1 + 3 = 9: los últimos tres días son la mejor ventana.',
        ['No vuelvas a sumar días fuera de la ventana.', '7 − 1 + 3 = 9.'],
        4,
      ),
    ],
    transfer: {
      prompt:
        '¿Este reto permite elegir días 1, 3 y 5 para formar una ventana?',
      choices: ['Sí', 'No: deben ser consecutivos'],
      answer: 1,
      explanation: 'Una ventana representa un segmento contiguo, sin saltos.',
    },
    cost: 'O(n) tiempo y O(1) espacio adicional para una suma de ventana fija.',
  },
  {
    id: 'backtracking',
    module: 'advanced',
    concept: 'Backtracking · probar y deshacer',
    title: 'Un código de dos dígitos.',
    accent: 'Volver también es avanzar.',
    description:
      'Usa dos dígitos diferentes de {1, 2, 3} que sumen 4. Empiezas probando 2. Si una rama no puede dar una solución, deshaz esa elección y explora otra.',
    takeaway:
      'Backtracking construye soluciones parciales, descarta ramas inválidas y restaura el estado para explorar alternativas. Deshacer la elección es parte del algoritmo.',
    code: 'def buscar(actual):\n    if len(actual) == 2:\n        return actual.copy() if sum(actual) == 4 else None\n    for d in [2, 1, 3]:\n        if d in actual: continue\n        actual.append(d)\n        resultado = buscar(actual)\n        actual.pop()\n        if resultado is not None: return resultado\n    return None',
    steps: [
      step(
        'Elegiste 2 primero. Para sumar 4 necesitarías otro 2, pero no se puede repetir. ¿Qué haces?',
        ['Repetir 2 de todos modos', 'Deshacer el primer 2'],
        'Deshacer el primer 2',
        cells([2, '?'], 0),
        stats({ prefijo: 'vacío', rama: '2 descartado' }),
        'La rama que empieza por 2 no tiene solución; restauramos el prefijo vacío.',
        [
          'Una solución debe cumplir suma y dígitos distintos.',
          'Retrocede: quita el 2.',
        ],
        8,
      ),
      step(
        'Pruebas 1 como primer dígito. ¿Qué segundo dígito completa la suma sin repetir?',
        [1, 2, 3],
        3,
        cells([1, '?'], 0),
        cells([1, 3], -1, [0, 1]),
        '1 + 3 = 4 y son distintos. Encontramos una solución válida.',
        ['Resta el primer dígito al objetivo.', '4 − 1 = 3.'],
        3,
      ),
    ],
    transfer: {
      prompt:
        'Si no retiras las elecciones fallidas antes de explorar otras ramas, ¿qué sucede?',
      choices: [
        'El estado de una rama puede contaminar las siguientes',
        'Siempre se obtiene la misma solución',
      ],
      answer: 0,
      explanation:
        'Restaurar el estado permite que cada alternativa empiece con el prefijo correcto.',
    },
    cost: 'Puede explorar un número exponencial de candidatos; la poda reduce trabajo, no garantiza tiempo polinómico.',
  },
  {
    id: 'dp',
    module: 'advanced',
    concept: 'Programación dinámica',
    title: 'Cuatro escalones.',
    accent: 'No cuentes lo mismo dos veces.',
    description:
      'Puedes subir 1 o 2 escalones cada vez. dp[n] guarda cuántas secuencias distintas llegan al escalón n. Para llegar a n, el último salto viene de n − 1 o n − 2.',
    takeaway:
      'La programación dinámica guarda soluciones de subproblemas. Aquí dp[n] = dp[n − 1] + dp[n − 2], con dp[0] = 1 (no dar pasos) y dp[1] = 1.',
    code: 'dp = [0] * 5\ndp[0], dp[1] = 1, 1\nfor n in range(2, 5):\n    dp[n] = dp[n - 1] + dp[n - 2]',
    steps: [
      step(
        'dp[0] = 1 y dp[1] = 1. ¿Cuánto vale dp[2]?',
        [1, 2, 3],
        2,
        cells(
          [1, 1, '?', '?', '?'],
          2,
          [],
          ['n=0', 'n=1', 'n=2', 'n=3', 'n=4'],
        ),
        cells([1, 1, 2, '?', '?'], 2, [], ['0', '1', '2', '3', '4']),
        'Dos formas: 1 + 1, o un salto de 2.',
        ['Suma las dos soluciones anteriores.', '1 + 1 = 2.'],
        4,
      ),
      step(
        'dp[3] = dp[2] + dp[1]. ¿Qué guardas?',
        [2, 3, 4],
        3,
        cells([1, 1, 2, '?', '?'], 3),
        cells([1, 1, 2, 3, '?'], 3),
        'Tres secuencias: 1+1+1, 1+2 y 2+1.',
        ['El orden de los saltos sí cuenta.', '2 + 1 = 3.'],
        4,
      ),
      step(
        'dp[4] = dp[3] + dp[2]. ¿Cuántas formas llegan al cuarto escalón?',
        [4, 5, 6],
        5,
        cells([1, 1, 2, 3, '?'], 4),
        cells([1, 1, 2, 3, 5], 4),
        'Cinco formas, sin volver a calcular los subproblemas anteriores.',
        ['Usa los valores guardados: 3 y 2.', '3 + 2 = 5.'],
        4,
      ),
    ],
    transfer: {
      prompt:
        'Si solo necesitas el resultado final, ¿debes conservar todos los valores anteriores?',
      choices: ['Sí, siempre', 'No: bastan los dos últimos'],
      answer: 1,
      explanation:
        'Esta recurrencia solo depende de dos valores; podemos reducir el espacio a O(1).',
    },
    cost: 'O(n) tiempo; O(n) tabla, reducible a O(1) espacio.',
  },
  {
    id: 'union-find',
    module: 'advanced',
    concept: 'Union–Find · conjuntos disjuntos',
    title: 'Conecta las comunidades.',
    accent: '¿Ya pertenecen al mismo grupo?',
    description:
      'A y B están conectados; C y D también. Union–Find representa cada grupo con una raíz. find encuentra esa raíz y union combina dos grupos distintos.',
    takeaway:
      'Union–Find responde conectividad sin reconstruir caminos. Con compresión de caminos y unión por tamaño o rango, sus operaciones son casi constantes amortizadas.',
    code: 'def find(x):\n    if parent[x] != x:\n        parent[x] = find(parent[x])\n    return parent[x]\n\nra, rb = find(a), find(b)\nif ra != rb:\n    if size[ra] < size[rb]: ra, rb = rb, ra\n    parent[rb] = ra\n    size[ra] += size[rb]',
    steps: [
      step(
        'B tiene raíz A y C tiene raíz C. ¿Ya pertenecen al mismo grupo?',
        ['Sí', 'No'],
        'No',
        stats({
          'grupo A': 'A, B',
          'grupo C': 'C, D',
          'find(B)': 'A',
          'find(C)': 'C',
        }),
        stats({ comparación: 'A ≠ C', acción: 'Se pueden unir' }),
        'Raíces distintas indican conjuntos distintos.',
        [
          'Compara representantes, no letras de los nodos originales.',
          'A y C son representantes diferentes.',
        ],
        6,
      ),
      step(
        'Unimos B y C. Ambos grupos tienen tamaño 2; elegimos A como raíz. ¿Qué enlace cambiamos?',
        ['parent[C] = A', 'parent[B] = D'],
        'parent[C] = A',
        stats({ 'parent[B]': 'A', 'parent[D]': 'C', raíces: 'A, C' }),
        stats({
          'parent[B]': 'A',
          'parent[C]': 'A',
          'parent[D]': 'C',
          grupo: 'A, B, C, D',
        }),
        'Enlazamos una raíz con la otra. D llega a A a través de C.',
        [
          'union enlaza representantes para combinar grupos completos.',
          'La raíz C pasa a apuntar a A.',
        ],
        9,
      ),
      step(
        'Añades una arista A — D al grafo. find(A) y find(D) ya son A. ¿Qué indica?',
        ['Conecta grupos nuevos', 'La arista cierra un ciclo'],
        'La arista cierra un ciclo',
        stats({ 'find(A)': 'A', 'find(D)': 'A' }),
        stats({ resultado: 'Ya había un camino A → B → C → D' }),
        'En este grafo no dirigido, unir dos nodos ya conectados cierra un ciclo.',
        [
          'Ambos extremos ya pertenecen al mismo componente.',
          'La nueva arista añade una vuelta al camino existente.',
        ],
        7,
      ),
    ],
    transfer: {
      prompt:
        '¿Union–Find por sí solo devuelve el camino más corto entre A y D?',
      choices: ['Sí', 'No, responde conectividad'],
      answer: 1,
      explanation:
        'Conocer si dos nodos comparten componente no da la secuencia de un camino mínimo.',
    },
    cost: 'Con compresión y unión por tamaño: O(α(n)) amortizado por operación, donde α crece extremadamente despacio.',
  },
);

export const classicIds = ['number', 'building', 'books'];
export const allLessonIds = [...lessons.map((l) => l.id), ...classicIds];
export function moduleLessonIds(id: string) {
  return [
    ...lessons.filter((l) => l.module === id).map((l) => l.id),
    ...(id === 'strategies' ? classicIds : []),
  ];
}
