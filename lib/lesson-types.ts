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
  line?: number;
};
export type Lesson = {
  id: string;
  module: string;
  concept: string;
  title: string;
  accent: string;
  description: string;
  takeaway: string;
  code: string;
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
