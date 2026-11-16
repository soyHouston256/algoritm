'use client';
import { useEffect, useRef, useState } from 'react';
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Check,
  Code2,
  Lightbulb,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { flushSync } from 'react-dom';
import { initialGame, guessNumber } from '../../lib/game.mjs';
import { codeLanguageInfo, resolveLine } from '../../lib/code-language';
import { classicSnippets } from '../../lib/course';
import { CodeBlock, LanguagePicker, useCodeLanguage } from './code-snippet';

type Game = {
  low: number;
  high: number;
  target: number;
  won: boolean;
  attempts: { value: number; direction: string }[];
};
export const challenges = [
  {
    id: 'number',
    label: 'EL NÚMERO ESCONDIDO',
    title: (
      <>
        Un número. <em>Siete intentos.</em>
      </>
    ),
    description:
      'He escondido un número entre 1 y 100. ¿Puedes encontrarlo? Después de cada intento te diré si es mayor o menor.',
    max: 100,
    budget: 7,
    unit: 'número',
    concept: 'Búsqueda binaria',
    initial: 73,
  },
  {
    id: 'building',
    label: 'EL ASCENSOR AVERIADO',
    title: (
      <>
        128 pisos. <em>Una pista por parada.</em>
      </>
    ),
    description:
      'Un paquete quedó en un piso del edificio. El ascensor te dice si está más arriba o más abajo. ¿Lo encuentras en ocho paradas?',
    max: 128,
    budget: 8,
    unit: 'piso',
    concept: 'Búsqueda binaria en la vida real',
    initial: 91,
  },
];
export function BinaryChallenge({
  config,
  index,
  onComplete,
}: {
  config: (typeof challenges)[number];
  index: number;
  onComplete: (id: string) => void;
}) {
  const [game, setGame] = useState<Game>(() =>
    initialGame(config.max, config.initial),
  );
  const [value, setValue] = useState('');
  const [hint, setHint] = useState(false);
  const [error, setError] = useState('');
  const [showCode, setShowCode] = useState(false);
  const language = useCodeLanguage();
  const ref = useRef<HTMLInputElement>(null);
  const latest = game.attempts.at(-1);
  const middle = Math.floor((game.low + game.high) / 2);
  function submit(n: number) {
    try {
      const next = guessNumber(game, n);
      setGame(next);
      setError('');
      setValue('');
      setHint(false);
      if (next.won) {
        onComplete(config.id);
        setShowCode(true);
      }
      return {
        low: next.low,
        high: next.high,
        won: next.won,
        attempts: next.attempts.length,
      };
    } catch (e) {
      const message = (e as Error).message;
      setError(message);
      return { error: message };
    }
  }
  const actionRef = useRef(submit);
  useEffect(() => {
    actionRef.current = submit;
  });
  useEffect(() => {
    const context = (
      document as Document & {
        modelContext?: {
          registerTool: (
            tool: unknown,
            options: unknown,
          ) => void | Promise<void>;
        };
      }
    ).modelContext;
    if (!context?.registerTool) return;
    const life = new AbortController();
    try {
      Promise.resolve(
        context.registerTool(
          {
            name: `guess_${config.id}`,
            description: `Enviar un intento al reto ${config.label}. Devuelve el intervalo que queda.`,
            inputSchema: {
              type: 'object',
              properties: {
                value: { type: 'integer', minimum: 1, maximum: config.max },
              },
              required: ['value'],
              additionalProperties: false,
            },
            annotations: { readOnlyHint: false },
            execute: (input: unknown) => {
              const n = (input as { value?: unknown })?.value;
              if (typeof n !== 'number')
                throw new Error('value debe ser un número entero.');
              let result;
              flushSync(() => {
                result = actionRef.current(n);
              });
              return result;
            },
          },
          { signal: life.signal },
        ),
      ).catch(() => {});
    } catch {}
    return () => life.abort();
  }, [config]);
  return (
    <section className="feed-section" id={config.id} aria-label={config.label}>
      <div className="challenge-top">
        <span className="eyebrow">
          <span className="live-dot" /> RETO{' '}
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className="difficulty">
          <span /> Principiante · Interactivo
        </span>
      </div>
      <article className="challenge">
        <div className="story">
          <div className="eyebrow muted">{config.label}</div>
          <h1>{config.title}</h1>
          <p>{config.description}</p>
        </div>
        <div className="game-area">
          <div className="range-heading">
            <span>{game.won ? '¡Lo encontraste!' : 'Tu zona de búsqueda'}</span>
            <span className="mono">
              {game.high - game.low + 1}{' '}
              {game.high === game.low ? 'posibilidad' : 'posibilidades'}
            </span>
          </div>
          <div className={'mystery ' + (game.won ? 'solved' : '')}>
            <span className="bracket">[</span>
            <strong>{game.won ? game.target : '?'}</strong>
            <span className="bracket">]</span>
            <span className="mystery-label">
              {game.won
                ? 'RETO RESUELTO'
                : config.unit.toUpperCase() + ' SECRETO'}
            </span>
          </div>
          <div className="number-grid" aria-hidden="true">
            {Array.from({ length: config.max }, (_, i) => i + 1).map((n) => (
              <span
                key={n}
                className={
                  (n < game.low || n > game.high ? 'eliminated ' : '') +
                  (game.won && n === game.target ? 'found' : '')
                }
                title={String(n)}
              />
            ))}
          </div>
          <div className="range-labels mono">
            <span>{game.low}</span>
            <span className="range-caption">
              {game.won
                ? 'Una buena idea te trajo hasta aquí'
                : 'Cada pista hace el mapa más pequeño'}
            </span>
            <span>{game.high}</span>
          </div>
          <output
            className={'feedback ' + (game.won ? 'success' : '')}
            aria-live="polite"
          >
            {game.won ? (
              <>
                <Check size={20} />
                <span>
                  ¡Era el {game.target}! Lo encontraste en{' '}
                  {game.attempts.length}{' '}
                  {config.id === 'building' ? 'paradas' : 'intentos'}.
                </span>
              </>
            ) : latest ? (
              <>
                {latest.direction === 'higher' ? (
                  <ArrowUp size={20} />
                ) : (
                  <ArrowDown size={20} />
                )}
                <span>
                  Es{' '}
                  <strong>
                    {latest.direction === 'higher' ? 'mayor' : 'menor'} que{' '}
                    {latest.value}
                  </strong>
                  . Ahora busca entre {game.low} y {game.high}.
                </span>
              </>
            ) : (
              <>
                <Sparkles size={19} />
                <span>
                  Empieza con una intuición. Las pistas vienen después.
                </span>
              </>
            )}
          </output>
          {!game.won ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submit(value.trim() === '' ? NaN : Number(value));
              }}
            >
              <label className="sr-only" htmlFor={'guess-' + config.id}>
                Tu {config.unit}, entre {game.low} y {game.high}
              </label>
              <input
                ref={ref}
                id={'guess-' + config.id}
                inputMode="numeric"
                type="number"
                min={game.low}
                max={game.high}
                step="1"
                placeholder={
                  config.id === 'building'
                    ? 'Elige un piso'
                    : 'Escribe un número'
                }
                value={value}
                onChange={(e) => setValue(e.target.value)}
                required
              />
              <button className="primary" type="submit">
                Probar <ArrowRight size={18} />
              </button>
            </form>
          ) : (
            <button
              className="primary full"
              onClick={() => {
                setGame(
                  initialGame(
                    config.max,
                    Math.floor(Math.random() * config.max) + 1,
                  ),
                );
                setValue('');
                setShowCode(false);
                setHint(false);
                setError('');
              }}
            >
              Otro {config.unit} <RotateCcw size={17} />
            </button>
          )}
          {error && (
            <p role="alert" className="error">
              {error}
            </p>
          )}
          <div className="attempt-row">
            <span
              className="attempt-dots"
              aria-label={`${game.attempts.length} de ${config.budget} intentos`}
            >
              {Array.from({ length: config.budget }, (_, i) => (
                <i key={i} className={i < game.attempts.length ? 'used' : ''} />
              ))}
            </span>
            <span>
              {game.attempts.length}/{config.budget}{' '}
              {config.id === 'building' ? 'paradas' : 'intentos'}
            </span>
            {!game.won && (
              <button
                className="hint-button"
                onClick={() => setHint(!hint)}
                aria-expanded={hint}
              >
                <Lightbulb size={16} /> Dame una pista
              </button>
            )}
          </div>
          {game.attempts.length >= config.budget && !game.won && (
            <p className="practice">
              Sigue en modo práctica. Las pistas se conservan; puedes terminar a
              tu ritmo.
            </p>
          )}
          {hint && !game.won && (
            <div className="hint">
              <strong>¿Y si divides las posibilidades en dos?</strong>
              <p>
                Prueba el punto medio: {middle}. Una respuesta descarta
                aproximadamente la mitad de lo que queda.
              </p>
              <button
                onClick={() => {
                  setValue(String(middle));
                  ref.current?.focus();
                }}
              >
                Usar {middle} <ArrowRight size={15} />
              </button>
            </div>
          )}
          {game.attempts.length > 0 && (
            <div className="history" aria-label="Historial de intentos">
              {game.attempts.map((a, i) => (
                <span key={i}>
                  {a.value}{' '}
                  {a.direction === 'equal'
                    ? '✓'
                    : a.direction === 'higher'
                      ? '↑'
                      : '↓'}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="reveal">
          <button
            onClick={() => setShowCode(!showCode)}
            aria-expanded={showCode}
          >
            <Code2 size={18} />
            <span>
              {game.won
                ? 'Descubriste: ' + config.concept
                : '¿Qué algoritmo hay detrás?'}
            </span>
            <span className="reveal-plus">{showCode ? '−' : '+'}</span>
          </button>
          {showCode && (
            <div className="explanation">
              <p>
                <strong>Eso es búsqueda binaria.</strong> Prueba el punto medio
                y conserva solo la mitad donde puede estar la respuesta.
                Funciona cuando las posibilidades tienen un orden y la pista
                indica qué lado conservar.
              </p>
              <div className="code-toolbar">
                <p className="code-note">
                  Fragmento guiado en {codeLanguageInfo(language).label} · se
                  resalta la rama de tu último intento.
                </p>
                <LanguagePicker compact />
              </div>
              <CodeBlock
                lines={classicSnippets.binary.code[language]}
                language={language}
                activeLine={resolveLine(
                  classicSnippets.binary,
                  language,
                  game.won
                    ? 5
                    : latest?.direction === 'higher'
                      ? 3
                      : latest?.direction === 'lower'
                        ? 4
                        : undefined,
                )}
              />
              <p className="small">
                Eligiendo siempre el punto medio, bastan como máximo{' '}
                {config.budget} intentos para {config.max} posibilidades. Con un
                millón, bastan 20.
              </p>
            </div>
          )}
        </div>
      </article>
      <a
        className="next-challenge"
        href={config.id === 'number' ? '#building' : '#books'}
      >
        Desliza para otro reto <ArrowDown size={16} />
      </a>
    </section>
  );
}
export function Books({
  onComplete,
  index = 2,
}: {
  onComplete: (id: string) => void;
  index?: number;
}) {
  const books = [240, 120, 360, 80, 180];
  const [sorted, setSorted] = useState<number[]>([]);
  const [message, setMessage] = useState(
    'Elige el libro más corto para empezar.',
  );
  const [hint, setHint] = useState(false);
  const language = useCodeLanguage();
  const remaining = books.filter((n) => !sorted.includes(n));
  const done = remaining.length === 0;
  return (
    <section className="feed-section" id="books">
      <div className="challenge-top">
        <span className="eyebrow">
          <span className="live-dot" /> RETO{' '}
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className="difficulty">Principiante · Ordenamiento</span>
      </div>
      <article className="challenge">
        <div className="story">
          <div className="eyebrow muted">TU PRÓXIMA LECTURA</div>
          <h1>
            Una pila de libros.<em> Ponlos en orden.</em>
          </h1>
          <p>
            Quieres leer del más corto al más largo. Elige, en cada paso, el
            libro con menos páginas de los que quedan.
          </p>
        </div>
        <div className="game-area">
          <div className="books">
            {remaining.map((n) => (
              <button
                key={n}
                style={{ height: 90 + n / 3 }}
                onClick={() => {
                  if (n !== Math.min(...remaining)) {
                    setMessage(
                      `${n} páginas: todavía queda un libro más corto. Compara los números y vuelve a intentar.`,
                    );
                    return;
                  }
                  const next = [...sorted, n];
                  setSorted(next);
                  setHint(false);
                  setMessage(
                    next.length === 5
                      ? '¡En orden! Acabas de hacer un ordenamiento por selección.'
                      : `Bien: ${n} páginas va en la posición ${next.length}. Busca ahora el menor de los que quedan.`,
                  );
                  if (next.length === 5) onComplete('books');
                }}
              >
                {n}
                <small>páginas</small>
              </button>
            ))}
          </div>
          <output className="feedback">
            {done ? <Check size={20} /> : <Lightbulb size={20} />}
            <span>{message}</span>
          </output>
          <div className="sorted-books">
            {Array.from({ length: 5 }, (_, i) => (
              <span key={i} className={sorted[i] ? 'filled' : ''}>
                {sorted[i] || '·'}
              </span>
            ))}
          </div>
          {!done ? (
            <button className="hint-button" onClick={() => setHint(!hint)}>
              Dame una pista <Lightbulb size={16} />
            </button>
          ) : (
            <button
              className="primary full"
              onClick={() => {
                setSorted([]);
                setHint(false);
                setMessage('Elige el libro más corto para empezar.');
              }}
            >
              Volver a ordenar <RotateCcw size={16} />
            </button>
          )}
          {hint && (
            <p className="hint">
              El menor que queda tiene {Math.min(...remaining)} páginas.
              Selecciónalo para ocupar la siguiente posición.
            </p>
          )}
          {done && (
            <div className="explanation">
              <p>
                <strong>Ordenamiento por selección:</strong> busca el menor
                elemento, colócalo en la siguiente posición y repite con el
                resto. Una computadora hace lo mismo comparando los valores de
                una lista.
              </p>
              <div className="code-toolbar">
                <p className="code-note">
                  Fragmento guiado en {codeLanguageInfo(language).label}.
                </p>
                <LanguagePicker compact />
              </div>
              <CodeBlock
                lines={classicSnippets.books.code[language]}
                language={language}
              />
            </div>
          )}
        </div>
      </article>
      <a className="next-challenge" href="#number">
        Volver al primer reto <ArrowUp size={16} />
      </a>
    </section>
  );
}
