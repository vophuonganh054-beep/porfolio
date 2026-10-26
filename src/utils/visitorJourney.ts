import { SectionTab } from '../types';
export const JOURNEY_KEY = 'pa_visitor_journey_v1';
export const WORLD_SECTIONS: SectionTab[] = ['overview', 'skills', 'questbook', 'hobbies', 'polaroid', 'contact'];
export const STAR_SECTIONS: SectionTab[] = WORLD_SECTIONS.filter(section => section !== 'overview');
export type Journey = { visited: SectionTab[]; stars: SectionTab[]; opened: boolean };
export const EMPTY_JOURNEY: Journey = { visited: [], stars: [], opened: false };
export function cleanJourney(input: unknown): Journey {
  const value = input && typeof input === 'object' ? input as Partial<Journey> : {};
  const filter = (items: unknown, allowed: SectionTab[]): SectionTab[] =>
    Array.isArray(items) ? [...new Set(items.filter((item): item is SectionTab => allowed.includes(item)))] : [];
  const stars = filter(value.stars, STAR_SECTIONS);
  return { visited: filter(value.visited, WORLD_SECTIONS), stars, opened: value.opened === true && stars.length === STAR_SECTIONS.length };
}
export type JourneyAction = { type: 'visit' | 'star'; section: SectionTab } | { type: 'open' };
export function advanceJourney(state: Journey, action: JourneyAction): Journey {
  if (action.type === 'open') return state.stars.length === STAR_SECTIONS.length ? { ...state, opened: true } : state;
  const key = action.type === 'visit' ? 'visited' : 'stars';
  const allowed = action.type === 'visit' ? WORLD_SECTIONS : STAR_SECTIONS;
  if (!allowed.includes(action.section) || state[key].includes(action.section)) return state;
  return { ...state, [key]: [...state[key], action.section] };
}
export const ACHIEVEMENTS = [
  { id: 'hello', icon: 'waving_hand', vi: 'Lời chào đầu tiên', en: 'Hello, traveler', descVi: 'Ghé thăm thế giới nhỏ này', descEn: 'Step into this little world', unlocked: (s: Journey) => s.visited.length >= 1 },
  { id: 'wanderer', icon: 'explore', vi: 'Nhà thám hiểm', en: 'Wanderer', descVi: 'Khám phá 3 mục khác nhau', descEn: 'Explore 3 different sections', unlocked: (s: Journey) => s.visited.length >= 3 },
  { id: 'world', icon: 'public', vi: 'Đi khắp MY WORLD', en: 'World explorer', descVi: 'Ghé đủ cả 6 mục trên web', descEn: 'Visit all 6 sections', unlocked: (s: Journey) => s.visited.length === WORLD_SECTIONS.length },
  { id: 'spark', icon: 'star', vi: 'Một vì sao nhỏ', en: 'A little star', descVi: 'Nhặt ngôi sao đầu tiên', descEn: 'Collect your first star', unlocked: (s: Journey) => s.stars.length >= 1 },
  { id: 'constellation', icon: 'auto_awesome', vi: 'Người gom ánh sao', en: 'Stargatherer', descVi: 'Tìm đủ 5 ngôi sao', descEn: 'Find all 5 stars', unlocked: (s: Journey) => s.stars.length === STAR_SECTIONS.length },
  { id: 'treasure', icon: 'redeem', vi: 'Bí mật được bật mí', en: 'Secret keeper', descVi: 'Mở rương bí mật', descEn: 'Open the secret chest', unlocked: (s: Journey) => s.opened },
] as const;
