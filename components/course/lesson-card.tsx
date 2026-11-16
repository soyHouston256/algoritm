'use client';
import { useId, useState } from 'react';
import {
  ArrowDown,
  ArrowRight,
  Check,
  Code2,
  Lightbulb,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { Progress } from '../ui/progress';
import type { Lesson, View } from '../../lib/lesson-types';
import {
  answerStep,
  answerTransfer,
  initialLessonState,
  nextStep,
  revealHint,
} from '../../lib/lesson-engine.mjs';
import { codeLanguageInfo, resolveLine } from '../../lib/code-language';
import { CodeBlock, LanguagePicker, useCodeLanguage } from './code-snippet';

function Diagram({
  view,
  onChoose,
  available,
  disabled,
}: {
  view: View;
  onChoose: (value: string) => void;
  available: string[];
  disabled: boolean;
}) {
  const svgId = useId().replace(/:/g, '');
  const network = view.kind === 'tree' || view.kind === 'graph';
  return (
    <div className="lesson-visual">
      {network ? (
        <div
          className="network"
          aria-label={
            view.kind === 'tree' ? 'Diagrama de árbol' : 'Diagrama de grafo'
          }
        >
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <marker
                id={svgId}
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="5"
                markerHeight="5"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#91a1af" />
              </marker>
            </defs>
            {view.edges?.map((e, i) => {
              const a = view.cells.find((c) => c.id === e.from),
                b = view.cells.find((c) => c.id === e.to);
              if (!a || !b) return null;
              const ax = a.x ?? 0,
                ay = a.y ?? 0,
                bx = b.x ?? 0,
                by = b.y ?? 0;
              const dx = bx - ax,
                dy = by - ay;
              const distance = Math.hypot(dx, dy) || 1;
              const endX = bx - (dx / distance) * 6,
                endY = by - (dy / distance) * 9;
              return (
                <g key={i}>
                  <line
                    x1={ax}
                    y1={ay}
                    x2={e.directed ? endX : bx}
                    y2={e.directed ? endY : by}
                    stroke={
                      a.state === 'done' && b.state === 'done'
                        ? '#749946'
                        : '#475563'
                    }
                    strokeWidth=".7"
                    markerEnd={e.directed ? `url(#${svgId})` : undefined}
                  />
                  {e.label && (
                    <>
                      <rect
                        x={(ax + bx) / 2 - 4}
                        y={(ay + by) / 2 - 5}
                        width="8"
                        height="9"
                        rx="2"
                        fill="#111920"
                      />
                      <text
                        x={(ax + bx) / 2}
                        y={(ay + by) / 2 + 1.8}
                        textAnchor="middle"
                        fill="#d3f3a3"
                        fontSize="5"
                      >
                        {e.label}
                      </text>
                    </>
                  )}
                </g>
              );
            })}
          </svg>
          {view.cells.map((c) => {
            const clickable = available.includes(c.id);
            return (
              <div
                className="network-position"
                key={c.id}
                style={{ left: `${c.x}%`, top: `${c.y}%` }}
              >
                {clickable ? (
                  <button
                    disabled={disabled}
                    onClick={() => onChoose(c.id)}
                    aria-label={`Elegir nodo ${c.label}`}
                    className={`network-node ${c.state || ''}`}
                  >
                    {c.label}
                  </button>
                ) : (
                  <span className={`network-node ${c.state || ''}`}>
                    {c.label}
                  </span>
                )}
                {c.note && <small>{c.note}</small>}
              </div>
            );
          })}
        </div>
      ) : view.kind === 'chain' ? (
        <div className="linked-visual">
          <div className="linked-nodes">
            {view.cells.map((c) => (
              <div className={`linked-node ${c.state || ''}`} key={c.id}>
                <strong>{c.label}</strong>
                <span>
                  next <ArrowRight size={14} />
                  <b>{view.edges?.find((e) => e.from === c.id)?.to || '∅'}</b>
                </span>
              </div>
            ))}
          </div>
          <div className="link-legend">
            {view.edges?.map((e, i) => (
              <span key={i}>
                {e.from} → {e.to}
              </span>
            ))}
          </div>
        </div>
      ) : view.cells.length > 0 ? (
        <div
          className={`data-cells ${view.kind === 'stack' ? 'data-stack' : ''}`}
        >
          {view.cells.map((c) => (
            <div className={`data-cell ${c.state || ''}`} key={c.id}>
              <strong>{c.label}</strong>
              {c.note && <small>{c.note}</small>}
            </div>
          ))}
        </div>
      ) : null}
      {view.stats && (
        <dl className="state-values">
          {Object.entries(view.stats).map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      )}
      {view.caption && <p className="visual-caption">{view.caption}</p>}
    </div>
  );
}
export function LessonCard({
  lesson,
  index,
  onComplete,
  nextHref,
}: {
  lesson: Lesson;
  index: number;
  onComplete: (id: string) => void;
  nextHref?: string;
}) {
  const [state, setState] = useState(initialLessonState);
  const [showCode, setShowCode] = useState(false);
  const language = useCodeLanguage();
  const languageInfo = codeLanguageInfo(language);
  const current = lesson.steps[state.index];
  const choose = (value: string) =>
    setState((s) => answerStep(lesson, s, value));
  const transfer = (index: number) => {
    const next = answerTransfer(lesson, state, index);
    setState(next);
    if (next.mastered) onComplete(lesson.id);
  };
  const completeSteps = state.index + (state.solved ? 1 : 0);
  const percent = state.mastered
    ? 100
    : (completeSteps / (lesson.steps.length + 1)) * 100;
  const view = state.solved ? current.after : current.before;
  return (
    <section
      className="feed-section lesson-section"
      id={lesson.id}
      aria-labelledby={`${lesson.id}-title`}
    >
      <div className="challenge-top">
        <span className="eyebrow">
          <span className="live-dot" /> RETO{' '}
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className="difficulty">
          {state.mastered
            ? '✓ Descubierto'
            : `${lesson.steps.length} pasos + un nuevo caso`}
        </span>
      </div>
      <article className="challenge">
        <div className="story">
          <div className="eyebrow muted">{lesson.concept}</div>
          <h2 id={`${lesson.id}-title`}>
            {lesson.title}
            <em>{lesson.accent}</em>
          </h2>
          <p>{lesson.description}</p>
        </div>
        <div className="lesson-stage">
          <div className="step-heading">
            <span>
              {state.mastered
                ? 'Un nuevo descubrimiento'
                : state.transfer
                  ? 'Ahora, otro caso'
                  : `Paso ${state.index + 1} de ${lesson.steps.length}`}
            </span>
            <span>
              {state.transfer ? (
                <Sparkles size={16} />
              ) : (
                <span className="mono">
                  {completeSteps}/{lesson.steps.length}
                </span>
              )}
            </span>
          </div>
          <Progress
            className="lesson-progress"
            value={percent}
            aria-label="Avance del reto"
          />
          <Diagram
            view={view}
            onChoose={choose}
            available={
              state.transfer ? [] : current.choices.map((c) => c.value)
            }
            disabled={state.solved || state.transfer}
          />
          {!state.transfer ? (
            <>
              <h3 className="step-prompt">{current.prompt}</h3>
              <div className="choice-grid">
                {current.choices.map((c) => (
                  <button
                    key={c.value}
                    className={`choice ${state.solved && c.value === current.answer ? 'correct' : ''}`}
                    disabled={state.solved}
                    onClick={() => choose(c.value)}
                  >
                    {c.label}
                    {state.solved && c.value === current.answer && (
                      <Check size={18} />
                    )}
                  </button>
                ))}
              </div>
              <output
                className={`feedback lesson-feedback ${state.solved ? 'success' : ''}`}
                aria-live="polite"
              >
                {state.solved ? <Check size={19} /> : <Lightbulb size={19} />}
                <span>
                  {state.feedback ||
                    'Prueba una idea. Si no encaja, la pista te ayudará a continuar.'}
                </span>
              </output>
              {!state.solved && (
                <div className="help-row">
                  <span>Sin vidas ni penalizaciones</span>
                  <button
                    className="hint-button"
                    onClick={() => setState(revealHint)}
                    disabled={state.hint === 2}
                  >
                    <Lightbulb size={16} />
                    {state.hint === 0
                      ? 'Dame una pista'
                      : state.hint === 1
                        ? 'Una pista más'
                        : 'Pistas visibles'}
                  </button>
                </div>
              )}
              {state.hint > 0 && !state.solved && (
                <div className="hint">
                  {current.hints.slice(0, state.hint).map((h, i) => (
                    <p key={h}>
                      <strong>{i + 1}.</strong> {h}
                    </p>
                  ))}
                </div>
              )}
              {state.solved && (
                <button
                  className="primary full"
                  onClick={() => setState((s) => nextStep(lesson, s))}
                >
                  {state.index === lesson.steps.length - 1
                    ? 'Probarlo en otro caso'
                    : 'Siguiente paso'}
                  <ArrowRight size={18} />
                </button>
              )}
            </>
          ) : (
            <div className="transfer">
              <span className="eyebrow">
                {state.mastered
                  ? '¡LO CONECTASTE!'
                  : 'CAMBIA EL EJEMPLO. CONSERVA LA IDEA.'}
              </span>
              <h3 className="step-prompt">{lesson.transfer.prompt}</h3>
              <div className="choice-grid">
                {lesson.transfer.choices.map((c, i) => (
                  <button
                    key={c}
                    className={`choice ${state.mastered && i === lesson.transfer.answer ? 'correct' : ''}`}
                    disabled={state.mastered}
                    onClick={() => transfer(i)}
                  >
                    {c}
                    {state.mastered && i === lesson.transfer.answer && (
                      <Check size={18} />
                    )}
                  </button>
                ))}
              </div>
              {state.feedback && (
                <output
                  className={`feedback lesson-feedback ${state.mastered ? 'success' : ''}`}
                  aria-live="polite"
                >
                  <Sparkles size={19} />
                  <span>{state.feedback}</span>
                </output>
              )}
              {state.mastered && (
                <>
                  <div className="takeaway">
                    <strong>La idea que te llevas</strong>
                    <p>{lesson.takeaway}</p>
                    {lesson.cost && <p className="cost">{lesson.cost}</p>}
                  </div>
                  <button
                    className="reset-lesson"
                    onClick={() => {
                      setState(initialLessonState());
                      setShowCode(false);
                    }}
                  >
                    <RotateCcw size={15} /> Volver a practicar
                  </button>
                </>
              )}
            </div>
          )}
        </div>
        <div className="reveal">
          <button
            onClick={() => setShowCode(!showCode)}
            aria-expanded={showCode}
            aria-controls={`${lesson.id}-code`}
          >
            <Code2 size={18} />
            <span>Conecta el reto con {languageInfo.label}</span>
            <span className="reveal-plus">{showCode ? '−' : '+'}</span>
          </button>
          {showCode && (
            <div className="explanation" id={`${lesson.id}-code`}>
              <div className="code-toolbar">
                <p className="code-note">
                  Fragmento guiado en {languageInfo.label} · la línea resaltada
                  corresponde al paso actual.
                </p>
                <LanguagePicker compact />
              </div>
              <CodeBlock
                lines={lesson.snippet.code[language]}
                language={language}
                activeLine={
                  state.transfer
                    ? undefined
                    : resolveLine(lesson.snippet, language, current.line)
                }
              />
              {(lesson.snippet.notes?.[language] || languageInfo.omitted) && (
                <p className="code-syntax-note">
                  {[lesson.snippet.notes?.[language], languageInfo.omitted]
                    .filter(Boolean)
                    .join(' ')}
                </p>
              )}
              <p>{lesson.takeaway}</p>
              {lesson.cost && <p className="small">{lesson.cost}</p>}
            </div>
          )}
        </div>
      </article>
      {nextHref && (
        <a className="next-challenge" href={nextHref}>
          Sigue con el próximo descubrimiento <ArrowDown size={16} />
        </a>
      )}
    </section>
  );
}
