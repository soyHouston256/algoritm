'use client';
import { useSyncExternalStore } from 'react';
import type { CodeLanguage } from '../../lib/lesson-types';
import {
  codeLanguageInfo,
  codeLanguageStorageKey,
  codeLanguages,
  defaultCodeLanguage,
  isCodeLanguage,
} from '../../lib/code-language';

// Preferencia global: todos los fragmentos comparten el mismo lenguaje.
const listeners = new Set<() => void>();
let current: CodeLanguage | null = null;

function readLanguage(): CodeLanguage {
  if (current) return current;
  let stored: unknown = null;
  try {
    stored = window.localStorage.getItem(codeLanguageStorageKey);
  } catch {
    stored = null;
  }
  current = isCodeLanguage(stored) ? stored : defaultCodeLanguage;
  return current;
}

function emit() {
  for (const listener of listeners) listener();
}

function onStorage(event: StorageEvent) {
  if (event.key !== codeLanguageStorageKey) return;
  current = isCodeLanguage(event.newValue)
    ? event.newValue
    : defaultCodeLanguage;
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener('storage', onStorage);
  };
}

export function setCodeLanguage(language: CodeLanguage) {
  current = language;
  try {
    window.localStorage.setItem(codeLanguageStorageKey, language);
  } catch {
    // Sin almacenamiento disponible: la preferencia dura hasta recargar.
  }
  emit();
}

export function useCodeLanguage() {
  return useSyncExternalStore(
    subscribe,
    readLanguage,
    () => defaultCodeLanguage,
  );
}

export function LanguagePicker({
  compact = false,
  className = '',
}: {
  compact?: boolean;
  className?: string;
}) {
  const language = useCodeLanguage();
  return (
    <fieldset
      className={`language-picker ${compact ? 'compact' : ''} ${className}`}
    >
      <legend className="visually-hidden">
        Lenguaje de los fragmentos de código
      </legend>
      {codeLanguages.map((l) => (
        <button
          key={l.id}
          type="button"
          aria-pressed={language === l.id}
          className={language === l.id ? 'selected' : ''}
          onClick={() => setCodeLanguage(l.id)}
        >
          {l.label}
        </button>
      ))}
    </fieldset>
  );
}

export function CodeBlock({
  lines,
  activeLine,
  language,
}: {
  lines: string[];
  activeLine?: number;
  language: CodeLanguage;
}) {
  const info = codeLanguageInfo(language);
  return (
    <figure className="code-block">
      <figcaption className="code-block-bar">
        <span className="code-lang-badge">{info.label}</span>
        <span className="code-ext">fragmento{info.extension}</span>
      </figcaption>
      <pre>
        <code className={`language-${language}`}>
          {lines.map((line, i) => (
            <span
              className={`code-line ${i + 1 === activeLine ? 'active-line' : ''}`}
              key={i}
            >
              <span className="line-number" aria-hidden="true">
                {i + 1}
              </span>
              {line || ' '}
              {'\n'}
            </span>
          ))}
        </code>
      </pre>
    </figure>
  );
}
