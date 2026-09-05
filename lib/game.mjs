export function initialGame(max, target) {
  return { low: 1, high: max, target, attempts: [], won: false };
}
export function guessNumber(state, value) {
  if (state.won) throw new Error('Este reto ya está resuelto.');
  if (!Number.isInteger(value) || value < state.low || value > state.high) throw new Error(`Elige un número entero entre ${state.low} y ${state.high}.`);
  const direction = value === state.target ? 'equal' : value < state.target ? 'higher' : 'lower';
  return { ...state, won: direction === 'equal', low: direction === 'higher' ? value + 1 : direction === 'equal' ? value : state.low, high: direction === 'lower' ? value - 1 : direction === 'equal' ? value : state.high, attempts: [...state.attempts, { value, direction }] };
}
