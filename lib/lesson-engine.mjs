export function initialLessonState() {
  return {
    index: 0,
    solved: false,
    hint: 0,
    mistakes: 0,
    feedback: '',
    transfer: false,
    mastered: false,
  };
}
export function answerStep(lesson, state, value) {
  const step = lesson.steps[state.index];
  if (state.transfer || state.mastered || state.solved) return state;
  if (typeof value !== 'string' || !step.choices.some((c) => c.value === value))
    throw new Error('Elige una de las acciones disponibles.');
  if (value !== step.answer)
    return {
      ...state,
      mistakes: state.mistakes + 1,
      feedback:
        step.choices.find((c) => c.value === value)?.feedback ||
        `Todavía no. ${step.hints[0]} Puedes volver a intentarlo.`,
    };
  return { ...state, solved: true, feedback: step.success };
}
export function nextStep(lesson, state) {
  if (!state.solved || state.transfer || state.mastered) return state;
  if (state.index === lesson.steps.length - 1)
    return { ...state, transfer: true, feedback: '', hint: 0 };
  return {
    ...state,
    index: state.index + 1,
    solved: false,
    feedback: '',
    hint: 0,
  };
}
export function answerTransfer(lesson, state, index) {
  if (!state.transfer || state.mastered) return state;
  if (
    !Number.isInteger(index) ||
    index < 0 ||
    index >= lesson.transfer.choices.length
  )
    throw new Error('Elige una respuesta disponible.');
  if (index !== lesson.transfer.answer)
    return {
      ...state,
      mistakes: state.mistakes + 1,
      feedback: `Revisemos la idea: ${lesson.transfer.explanation} Inténtalo otra vez.`,
    };
  return { ...state, mastered: true, feedback: lesson.transfer.explanation };
}
export function revealHint(state) {
  return state.solved || state.mastered
    ? state
    : { ...state, hint: Math.min(state.hint + 1, 2) };
}
