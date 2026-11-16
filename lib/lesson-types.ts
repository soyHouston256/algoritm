export type Cell = {
  id: string;
  label: string;
  note?: string;
  state?: 'active' | 'done' | 'muted' | 'focus';
  x?: number;
  y?: number;
};
export type View = {
  kind?: 'cells' | 'chain' | 'tree' | 'graph' | 'stack';
  cells: Cell[];
  edges?: { from: string; to: string; label?: string; directed?: boolean }[];
  stats?: Record<string, string>;
  caption?: string;
};
export type Step = {
  prompt: string;
  choices: { value: string; label: string; feedback?: string }[];
  answer: string;
  hints: [string, string];
  success: string;
  before: View;
  after: View;
  /** Línea resaltada en el fragmento Python (1-based). Ver CodeSnippet.lineMap. */
  line?: number;
};
export type CodeLanguage = 'python' | 'cpp' | 'go';
export type CodeSnippet = {
  /** Fragmento guiado por lenguaje, una entrada por línea. */
  code: Record<CodeLanguage, string[]>;
  /**
   * Traduce la línea de un paso (numerada según Python) a la línea equivalente
   * en otro lenguaje. Si falta una entrada, la línea es la misma.
   */
  lineMap?: Partial<Record<CodeLanguage, Record<number, number>>>;
  /** Aclaración breve sobre la sintaxis de un lenguaje concreto. */
  notes?: Partial<Record<CodeLanguage, string>>;
};
export type Lesson = {
  id: string;
  module: string;
  concept: string;
  title: string;
  accent: string;
  description: string;
  takeaway: string;
  snippet: CodeSnippet;
  steps: Step[];
  transfer: {
    prompt: string;
    choices: string[];
    answer: number;
    explanation: string;
  };
  prerequisite?: string;
  cost?: string;
};
