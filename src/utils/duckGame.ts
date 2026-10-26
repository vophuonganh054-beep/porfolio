export const DUCK_BEST_KEY = 'pa_duck_best_v1';
export const DUCK_DURATION = 20000;
export type DuckGame = { phase: 'idle' | 'playing' | 'done'; score: number; best: number; target: number; deadline: number; seconds: number };
export function cleanBest(value: unknown): number { return typeof value === 'number' && Number.isInteger(value) && value >= 0 && value <= 1000 ? value : 0; }
export function initialDuck(best = 0): DuckGame { return { phase: 'idle', score: 0, best: cleanBest(best), target: -1, deadline: 0, seconds: 20 }; }
type Action = { type: 'start'; now: number; target: number } | { type: 'tick'; now: number } | { type: 'spawn'; now: number; target: number } | { type: 'hit'; now: number; cell: number };
export function duckReducer(state: DuckGame, action: Action): DuckGame {
  if (action.type === 'start') return { ...initialDuck(state.best), phase: 'playing', target: action.target, deadline: action.now + DUCK_DURATION };
  if (state.phase !== 'playing') return state;
  if (action.now >= state.deadline) return { ...state, phase: 'done', seconds: 0, target: -1, best: Math.max(state.best, state.score) };
  if (action.type === 'hit') return action.cell === state.target ? { ...state, score: state.score + 1, target: -1 } : state;
  if (action.type === 'spawn') return { ...state, target: action.target === state.target ? (action.target + 1) % 9 : action.target };
  const seconds = Math.ceil((state.deadline - action.now) / 1000);
  return seconds === state.seconds ? state : { ...state, seconds };
}
