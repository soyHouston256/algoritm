import test from 'node:test';
import assert from 'node:assert/strict';
import {
  classicSnippets,
  lessons,
  modules,
  allLessonIds,
  moduleLessonIds,
} from '../lib/course.ts';
import {
  initialLessonState,
  answerStep,
  nextStep,
  answerTransfer,
  revealHint,
} from '../lib/lesson-engine.mjs';
import {
  codeLanguages,
  defaultCodeLanguage,
  isCodeLanguage,
  resolveLine,
} from '../lib/code-language.ts';
const get = (id) => lessons.find((l) => l.id === id);

test('The route covers each lesson once, with valid actions and drawable state', () => {
  assert.equal(new Set(allLessonIds).size, 37);
  assert.deepEqual(
    modules.flatMap((m) => moduleLessonIds(m.id)).sort(),
    [...allLessonIds].sort(),
  );
  for (const lesson of lessons) {
    assert.ok(modules.some((m) => m.id === lesson.module));
    assert.ok(lesson.steps.length >= 2);
    assert.ok(lesson.transfer.choices[lesson.transfer.answer]);
    for (const s of lesson.steps) {
      assert.equal(
        s.choices.filter((c) => c.value === s.answer).length,
        1,
        lesson.id,
      );
      assert.equal(
        new Set(s.choices.map((c) => c.value)).size,
        s.choices.length,
        lesson.id,
      );
      assert.equal(s.hints.length, 2);
      for (const { id: language } of codeLanguages) {
        const lines = lesson.snippet.code[language];
        const line = resolveLine(lesson.snippet, language, s.line);
        assert.ok(
          line >= 1 && line <= lines.length,
          `${lesson.id} ${language}`,
        );
        assert.match(
          lines[line - 1],
          /[^\s{}();]/,
          `${lesson.id} ${language}: highlighted line ${line} has no content`,
        );
      }
      for (const view of [s.before, s.after]) {
        const ids = view.cells.map((c) => c.id);
        assert.equal(new Set(ids).size, ids.length);
        for (const edge of view.edges || []) {
          assert.ok(ids.includes(edge.from), lesson.id);
          assert.ok(ids.includes(edge.to), lesson.id);
        }
        if (['graph', 'tree'].includes(view.kind))
          for (const c of view.cells) {
            assert.ok(c.x >= 0 && c.x <= 100);
            assert.ok(c.y >= 0 && c.y <= 100);
          }
      }
    }
  }
});
test('Every course journey recovers from wrong answers and requires the transfer case', () => {
  for (const lesson of lessons) {
    let state = initialLessonState();
    assert.deepEqual(
      nextStep(lesson, state),
      state,
      'Cannot skip an unanswered step',
    );
    assert.deepEqual(
      answerTransfer(lesson, state, lesson.transfer.answer),
      state,
      'Cannot claim completion early',
    );
    for (const step of lesson.steps) {
      const wrong = step.choices.find((c) => c.value !== step.answer);
      if (wrong) {
        const old = state;
        state = answerStep(lesson, state, wrong.value);
        assert.equal(state.index, old.index);
        assert.equal(state.solved, false);
        assert.equal(state.mistakes, old.mistakes + 1);
      }
      state = revealHint(revealHint(revealHint(state)));
      assert.equal(state.hint, 2);
      assert.throws(() => answerStep(lesson, state, '__not_an_option__'));
      state = answerStep(lesson, state, step.answer);
      assert.equal(state.solved, true);
      assert.equal(state.mastered, false);
      assert.deepEqual(
        answerStep(lesson, state, step.answer),
        state,
        'Double click cannot advance twice',
      );
      state = nextStep(lesson, state);
    }
    assert.equal(state.transfer, true);
    assert.equal(state.mastered, false);
    assert.throws(() => answerTransfer(lesson, state, NaN));
    state = answerTransfer(
      lesson,
      state,
      (lesson.transfer.answer + 1) % lesson.transfer.choices.length,
    );
    assert.equal(state.mastered, false);
    state = answerTransfer(lesson, state, lesson.transfer.answer);
    assert.equal(state.mastered, true, lesson.id);
    assert.deepEqual(
      answerTransfer(lesson, state, lesson.transfer.answer),
      state,
    );
  }
});
test('Tree traversal answers come from recursively traversing the displayed edges', () => {
  const root = '4';
  const edges = get('inorder').steps[0].before.edges;
  function visit(node, mode) {
    const children = edges.filter((e) => e.from === node).map((e) => e.to);
    const left = children[0] ? visit(children[0], mode) : [];
    const right = children[1] ? visit(children[1], mode) : [];
    return mode === 'preorder'
      ? [node, ...left, ...right]
      : mode === 'inorder'
        ? [...left, node, ...right]
        : [...left, ...right, node];
  }
  for (const id of ['preorder', 'inorder', 'postorder'])
    assert.deepEqual(
      get(id).steps.map((s) => s.answer),
      visit(root, id),
    );
});
test('BFS and DFS match independent traversal of the actual map', () => {
  const edges = get('bfs').steps[0].before.edges;
  const adj = {};
  for (const { from, to } of edges) {
    (adj[from] ??= []).push(to);
    (adj[to] ??= []).push(from);
  }
  Object.values(adj).forEach((a) => a.sort());
  const queue = ['A'],
    seen = new Set(['A']),
    bfs = [];
  while (queue.length) {
    const n = queue.shift();
    bfs.push(n);
    for (const x of adj[n])
      if (!seen.has(x)) {
        seen.add(x);
        queue.push(x);
      }
  }
  const dfs = [],
    visited = new Set();
  function walk(n) {
    visited.add(n);
    dfs.push(n);
    for (const x of adj[n]) if (!visited.has(x)) walk(x);
  }
  walk('A');
  assert.deepEqual(
    get('bfs').steps.map((s) => s.answer),
    bfs,
  );
  assert.deepEqual(
    get('dfs').steps.map((s) => s.answer),
    dfs,
  );
});
test('Topological lesson respects all dependencies and alphabetical tie-breaking', () => {
  const lesson = get('topological'),
    edges = lesson.steps[0].before.edges,
    remaining = new Set(['A', 'B', 'C', 'D']),
    done = new Set();
  const order = [];
  while (remaining.size) {
    const available = [...remaining]
      .filter((n) =>
        edges.filter((e) => e.to === n).every((e) => done.has(e.from)),
      )
      .sort();
    assert.ok(available.length);
    const n = available[0];
    remaining.delete(n);
    done.add(n);
    order.push(n);
  }
  assert.deepEqual(
    lesson.steps.map((s) => s.answer),
    order,
  );
});
test('Dijkstra final labels equal independently computed shortest distances', () => {
  const l = get('dijkstra'),
    view = l.steps[0].before,
    adj = {};
  for (const e of view.edges) {
    (adj[e.from] ??= []).push([e.to, Number(e.label)]);
    (adj[e.to] ??= []).push([e.from, Number(e.label)]);
  }
  const dist = { A: 0, B: Infinity, C: Infinity, D: Infinity },
    done = new Set();
  while (done.size < 4) {
    const u = Object.keys(dist)
      .filter((n) => !done.has(n))
      .sort((a, b) => dist[a] - dist[b])[0];
    done.add(u);
    for (const [v, w] of adj[u]) dist[v] = Math.min(dist[v], dist[u] + w);
  }
  assert.deepEqual(
    l.steps.at(-1).after.stats,
    Object.fromEntries(Object.entries(dist).map(([k, v]) => [k, String(v)])),
  );
});
test('Simulated loop, window, merge and DP states match their computations', () => {
  assert.deepEqual(
    get('for')
      .steps.slice(0, 3)
      .map((s) => s.answer),
    [1, 2, 3].map(String),
  );
  assert.deepEqual(
    get('while')
      .steps.slice(0, 3)
      .map((s) => s.answer),
    [60, 80, 100].map(String),
  );
  const dp = [1, 1];
  for (let i = 2; i <= 4; i++) dp[i] = dp[i - 1] + dp[i - 2];
  assert.deepEqual(
    get('dp').steps.map((s) => s.answer),
    dp.slice(2).map(String),
  );
  const km = [2, 1, 5, 1, 3],
    sums = km
      .slice(0, 3)
      .map((_, i) => km.slice(i, i + 3).reduce((a, b) => a + b, 0));
  assert.deepEqual(
    get('window').steps.map((s) => s.answer),
    sums.map(String),
  );
  assert.deepEqual(
    get('merge').steps.map((s) => Number(s.answer)),
    [2, 5, 1, 4].sort((a, b) => a - b),
  );
});
test('Linked-list insertion preserves the tail and deletion bypasses one node', () => {
  const l = get('linked-insert');
  function path(view, head) {
    const result = [],
      seen = new Set();
    let n = head;
    while (n) {
      assert.ok(!seen.has(n));
      seen.add(n);
      result.push(n);
      n = view.edges.find((e) => e.from === n)?.to;
    }
    return result;
  }
  assert.deepEqual(path(l.steps[0].after, 'A'), ['A', 'C']);
  assert.deepEqual(path(l.steps[0].after, 'B'), ['B', 'C']);
  assert.deepEqual(path(l.steps[1].after, 'A'), ['A', 'B', 'C']);
  assert.deepEqual(path(get('linked-delete').steps.at(-1).after, 'A'), [
    'A',
    'C',
  ]);
});
test('Every snippet ships Python, C++ and Go variants with valid line maps', () => {
  const ids = codeLanguages.map((l) => l.id);
  assert.deepEqual(ids, ['python', 'cpp', 'go']);
  /** @type {[string, import('../lib/lesson-types').CodeSnippet][]} */
  const snippets = [
    ...lessons.map((l) => /** @type {const} */ ([l.id, l.snippet])),
    ...Object.entries(classicSnippets),
  ];
  assert.equal(snippets.length, 36);
  for (const [id, snippet] of snippets) {
    assert.deepEqual(Object.keys(snippet.code).sort(), [...ids].sort(), id);
    for (const language of ids) {
      const lines = snippet.code[language];
      assert.ok(lines.length >= 2, `${id} ${language}`);
      assert.ok(
        lines.every((l) => typeof l === 'string' && !l.includes('\n')),
        `${id} ${language}`,
      );
      assert.ok(
        lines.some((l) => l.trim()),
        `${id} ${language}`,
      );
    }
    assert.equal(snippet.lineMap?.python, undefined, id);
    for (const [language, map] of Object.entries(snippet.lineMap ?? {})) {
      assert.ok(ids.includes(language), id);
      for (const [from, to] of Object.entries(map)) {
        assert.ok(
          Number(from) >= 1 && Number(from) <= snippet.code.python.length,
          `${id} ${language} maps unknown Python line ${from}`,
        );
        assert.ok(
          to >= 1 && to <= snippet.code[language].length,
          `${id} ${language} maps to missing line ${to}`,
        );
      }
    }
    for (const language of Object.keys(snippet.notes ?? {}))
      assert.ok(ids.includes(language), id);
  }
  // Mapped C++/Go snippets highlight the equivalent statement.
  const at = (id, language, line) => {
    const l = get(id);
    return l.snippet.code[language][
      resolveLine(l.snippet, language, line) - 1
    ].trim();
  };
  assert.equal(at('queue', 'cpp', 3), 'fila.pop_front();');
  assert.equal(at('queue', 'go', 3), 'fila = fila[1:]');
  assert.equal(at('recursion', 'go', 4), 'return n + suma(n-1)');
  assert.equal(at('bfs', 'cpp', 5), 'visitar(u);');
  assert.equal(at('bfs', 'go', 5), 'visitar(u)');
  assert.equal(at('inorder', 'go', 4), 'visitar(nodo.dato)');
  assert.equal(at('inorder', 'cpp', 4), 'visitar(nodo->dato);');
  assert.equal(
    at('heap', 'go', 6),
    'heap[padre], heap[i] = heap[i], heap[padre]',
  );
  assert.equal(at('two-pointers', 'go', 6), 'j--');
  assert.equal(at('union-find', 'go', 9), 'parent[rb] = ra');
});
test('Language helpers default to Python and map lines only when needed', () => {
  assert.equal(defaultCodeLanguage, 'python');
  assert.ok(isCodeLanguage('go'));
  assert.ok(!isCodeLanguage('rust'));
  assert.ok(!isCodeLanguage(null));
  const snippet = {
    code: { python: [], cpp: [], go: [] },
    lineMap: { go: { 2: 5 } },
  };
  assert.equal(resolveLine(snippet, 'go', 2), 5);
  assert.equal(resolveLine(snippet, 'go', 3), 3);
  assert.equal(resolveLine(snippet, 'cpp', 2), 2);
  assert.equal(resolveLine(snippet, 'python', undefined), undefined);
});
