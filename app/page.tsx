'use client';
import { useState } from 'react';
import { ArrowRight, Check, Code2, Compass, Terminal, Zap } from 'lucide-react';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '../components/ui/tabs';
import { Progress } from '../components/ui/progress';
import { LessonCard } from '../components/course/lesson-card';
import { LanguagePicker } from '../components/course/code-snippet';
import {
  BinaryChallenge,
  Books,
  challenges,
} from '../components/course/classic';
import { allLessonIds, lessons, moduleLessonIds, modules } from '../lib/course';

export default function Home() {
  const [active, setActive] = useState('basics');
  const [completed, setCompleted] = useState<string[]>([]);
  const finish = (id: string) =>
    setCompleted((prev) => (prev.includes(id) ? prev : [...prev, id]));
  const current = modules.find((m) => m.id === active)!;
  const ids = moduleLessonIds(active);
  const currentDone = ids.filter((id) => completed.includes(id)).length;
  const nextId = ids.find((id) => !completed.includes(id));
  function changeModule(value: unknown) {
    if (typeof value === 'string' && modules.some((m) => m.id === value)) {
      setActive(value);
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }
  return (
    <Tabs value={active} onValueChange={changeModule} className="course-root">
      <header className="app-header">
        <a
          className="brand"
          href="#course-start"
          onClick={() => changeModule('basics')}
        >
          <span className="brand-symbol">
            <Terminal size={22} />
          </span>
          algo<span className="brand-period">.</span>
        </a>
        <div className="header-center">
          DE TU PRIMER <span>FOR</span> A TU PRIMER <span>GRAFO.</span>
        </div>
        <div className="header-actions">
          <div className="header-language">
            <Code2 size={16} aria-hidden="true" />
            <LanguagePicker />
          </div>
          <span className="session-progress">
            <Zap size={16} />
            {completed.length}/{allLessonIds.length}
            <span>descubiertos</span>
          </span>
        </div>
      </header>
      <div className="course-nav">
        <TabsList className="course-tabs" aria-label="Etapas de aprendizaje">
          {modules.map((m) => (
            <TabsTrigger className="course-tab" key={m.id} value={m.id}>
              <span className="module-number">
                {moduleLessonIds(m.id).every((id) => completed.includes(id)) ? (
                  <Check size={14} />
                ) : (
                  m.level
                )}
              </span>
              {m.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      <main className="layout course-layout" id="course-start">
        <aside className="intro course-intro">
          <div className="eyebrow">ETAPA {current.level} / 06</div>
          <h2>
            {current.name}
            <br />
            <span>
              Una pista
              <br />a la vez.
            </span>
          </h2>
          <p>{current.subtitle}</p>
          <div className="module-prerequisite">
            <Compass size={16} />
            <span>{current.requires}</span>
          </div>
          <div className="module-progress-label">
            <span>Tu avance aquí</span>
            <strong>
              {currentDone}/{ids.length}
            </strong>
          </div>
          <Progress
            className="module-progress"
            value={(currentDone / ids.length) * 100}
            aria-label="Retos descubiertos en la etapa"
          />
          {nextId ? (
            <a className="continue-link" href={`#${nextId}`}>
              Siguiente pendiente <ArrowRight size={16} />
            </a>
          ) : (
            <p className="module-done">
              <Check size={17} /> Etapa recorrida
            </p>
          )}
          <p className="session-note">
            Avance de esta sesión. Puedes cambiar de etapa sin perder tus pasos;
            al recargar se reinicia.
          </p>
          <div className="learning-note">
            <strong>Entender → practicar → construir</strong>
            <p>
              Estos retos te dan la intuición. Para dominarla, vuelve al código
              y construye tus propias soluciones.
            </p>
          </div>
        </aside>
        <div className="feed course-feed">
          {modules.map((m, mi) => {
            const items = lessons.filter((l) => l.module === m.id);
            return (
              <TabsContent
                key={m.id}
                value={m.id}
                keepMounted
                className="course-panel"
              >
                <div className="module-heading">
                  <div>
                    <span className="eyebrow">
                      ETAPA {m.level} · {moduleLessonIds(m.id).length} RETOS
                    </span>
                    <h2>{m.subtitle}</h2>
                  </div>
                  <p>
                    {mi === 0
                      ? 'Empieza aquí. No necesitas saber escribir código.'
                      : `Antes de esta etapa: ${m.requires.toLowerCase()}`}
                  </p>
                </div>
                {items.map((l, i) => (
                  <LessonCard
                    key={l.id}
                    lesson={l}
                    index={i}
                    onComplete={finish}
                    nextHref={
                      items[i + 1]
                        ? `#${items[i + 1].id}`
                        : m.id === 'strategies'
                          ? '#number'
                          : undefined
                    }
                  />
                ))}
                {m.id === 'strategies' && (
                  <>
                    <div className="classic-intro">
                      <span className="eyebrow">
                        TUS PRIMEROS RETOS, DE VUELTA
                      </span>
                      <h2>Ahora sabes por qué funcionan.</h2>
                      <p>
                        Aplica las ideas de búsqueda y ordenamiento en los tres
                        retos originales.
                      </p>
                    </div>
                    {challenges.map((c, i) => (
                      <BinaryChallenge
                        key={c.id}
                        config={c}
                        index={items.length + i}
                        onComplete={finish}
                      />
                    ))}
                    <Books onComplete={finish} index={items.length + 2} />
                  </>
                )}
                <div className="module-end">
                  <span className="eyebrow">
                    {mi < modules.length - 1
                      ? 'LA RUTA CONTINÚA'
                      : 'SIGUE HACIENDO PREGUNTAS'}
                  </span>
                  <h2>
                    {mi < modules.length - 1
                      ? modules[mi + 1].name
                      : 'De la intuición a tus proyectos.'}
                  </h2>
                  <p>
                    {mi < modules.length - 1
                      ? 'Puedes avanzar, volver y practicar cualquier reto. No hay etapas bloqueadas.'
                      : 'Una ruta amplia de fundamentos, estructuras y algoritmos. Cada tema admite problemas más grandes: vuelve a practicar y escribe tus propias implementaciones.'}
                  </p>
                  <button
                    className="primary"
                    onClick={() =>
                      changeModule(modules[(mi + 1) % modules.length].id)
                    }
                  >
                    {mi < modules.length - 1
                      ? 'Explorar siguiente etapa'
                      : 'Volver a los fundamentos'}
                    <ArrowRight size={17} />
                  </button>
                </div>
              </TabsContent>
            );
          })}
          <footer>Una pista útil vale más que una respuesta memorizada.</footer>
        </div>
        <aside className="right-note">
          <span>{current.level} / 06</span>
          <div className="vertical-line" />
          <span>
            PRUEBA
            <br />
            DESCUBRE
            <br />
            CONECTA
          </span>
        </aside>
      </main>
    </Tabs>
  );
}
