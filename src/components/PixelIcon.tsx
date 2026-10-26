import React from 'react';
const ICONS: Record<string, string> = {
  sparkles: 'auto_awesome', coffee: 'coffee', computer: 'computer', moon: 'bedtime',
  heart: 'favorite', confetti: 'celebration', people: 'waving_hand', info: 'psychology',
  book: 'menu_book', edit: 'edit', save: 'save', music: 'music_note', gamepad: 'sports_esports'
};
export function PixelIcon({ name, children, className = '', label, ...props }: {
  name?: string; children?: React.ReactNode; className?: string; label?: string;
} & Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'>) {
  const key = name || String(children || '');
  return <span {...props} className={'material-symbols-outlined align-middle ' + className}
    style={{ fontSize: '1em', ...props.style }} aria-hidden={label ? undefined : true}
    aria-label={label} role={label ? 'img' : undefined}>{ICONS[key] || key}</span>;
}
export function pixelText(value: React.ReactNode): React.ReactNode { return value; }
