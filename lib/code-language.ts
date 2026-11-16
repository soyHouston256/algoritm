import type { CodeLanguage, CodeSnippet } from './lesson-types';

export const codeLanguages: {
  id: CodeLanguage;
  label: string;
  extension: string;
  omitted?: string;
}[] = [
  { id: 'python', label: 'Python', extension: '.py' },
  {
    id: 'cpp',
    label: 'C++',
    extension: '.cpp',
    omitted: 'Se omiten #include y main().',
  },
  {
    id: 'go',
    label: 'Go',
    extension: '.go',
    omitted: 'Se omiten package, import y func main().',
  },
];

export const defaultCodeLanguage: CodeLanguage = 'python';
export const codeLanguageStorageKey = 'algo:code-language';

export function isCodeLanguage(value: unknown): value is CodeLanguage {
  return codeLanguages.some((l) => l.id === value);
}

export function codeLanguageInfo(id: CodeLanguage) {
  return codeLanguages.find((l) => l.id === id) ?? codeLanguages[0];
}

/** Traduce una línea numerada según Python a la línea equivalente en `language`. */
export function resolveLine(
  snippet: CodeSnippet,
  language: CodeLanguage,
  line: number | undefined,
) {
  if (line === undefined) return undefined;
  return snippet.lineMap?.[language]?.[line] ?? line;
}
