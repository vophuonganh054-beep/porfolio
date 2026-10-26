import React from 'react';

// Each filled cell is one pixel. No curves, smoothing, or external icon font.
const GLYPHS: Record<string, string[]> = {
  canva: ['00111110','01100011','11000000','11000000','11000000','11000000','01100011','00111110'],
  star: ['00011000','00011000','11111111','01111110','00111100','01111110','01100110','11000011'],
  sparkles: ['00100000','01110010','11111010','01110111','00100010','00010000','00111000','00010000'],
  heart: ['01100110','11111111','11111111','11111111','01111110','00111100','00011000','00000000'],
  shield: ['11111111','10000001','10111101','10111101','01011010','01011010','00100100','00011000'],
  mail: ['01111110','11000011','10100101','10011001','10000001','10000001','01111110','00000000'],
  camera: ['00111100','01100110','11111111','11011011','10100101','10100101','11011011','11111111'],
  book: ['11100111','10011001','10011001','10111011','10011001','10111011','11111111','00011000'],
  file: ['01111100','01000110','01000011','01000001','01011101','01000001','01011101','01111111'],
  backpack: ['00111100','01100110','01111110','11000011','11011011','11000011','11011011','01111110'],
  headphones: ['00111100','01100110','11000011','10000001','11100111','11100111','11100111','01100110'],
  gamepad: ['00011000','01111110','11000011','10100101','11101011','10100001','11000011','01100110'],
  computer: ['11111111','10000001','10110001','10011001','10000001','11111111','00011000','00111100'],
  palette: ['00111100','01100010','11010101','10000001','10100111','10001100','01000100','00111000'],
  pigeon: ['00000110','00001111','10011110','11111100','01111100','00111000','01110000','11000000'],
  moon: ['00011100','00111000','01110000','11100000','11100001','11100011','01111110','00111100'],
  meditate: ['00011000','00011000','00000000','00111100','01111110','11011011','00100100','01111110'],
  confetti: ['10010001','01000100','00010010','10011000','00111100','01111010','11110000','11100001'],
  clock: ['00111100','01100110','11011011','10011001','10011101','11000011','01100110','00111100'],
  coffee: ['01111110','01000011','01000001','01000011','01000010','00111100','00000000','11111111'],
  key: ['01110000','11011000','10001000','11011000','01111000','00011100','00001110','00001101'],
  lock: ['00111100','01100110','01000010','11111111','10011001','10011001','10000001','11111111'],
  upload: ['00011000','00111100','01111110','11011011','00011000','10011001','10000001','11111111'],
  download: ['00011000','00011000','11011011','01111110','00111100','10011001','10000001','11111111'],
  trash: ['00111100','11111111','01000010','01011010','01011010','01011010','01000010','01111110'],
  eye: ['00000000','00111100','01100110','11011011','11011011','01100110','00111100','00000000'],
  pin: ['00111110','00111110','00011100','00111110','01111110','00011000','00010000','00100000'],
  location: ['00111100','01111110','11000011','11011011','11000011','01111110','00111100','00011000'],
  people: ['01100110','01100110','00000000','11111111','11111111','01100110','01100110','01100110'],
  cat: ['10000001','11000011','11111111','10100101','11111111','11011011','01111110','00111100'],
  rocket: ['00011000','00111100','00111100','01100110','01100110','11111111','10111101','00100100'],
  bolt: ['00001110','00011100','00111000','01111110','00011100','00111000','01110000','11000000'],
  trophy: ['00111100','11111111','10111101','11111111','00111100','00011000','00111100','01111110'],
  globe: ['00111100','01111110','11011011','11111111','11011011','11011011','01111110','00111100'],
  folder: ['11110000','10011111','10000001','11111111','10000001','10000001','10000001','11111111'],
  edit: ['00000110','00001111','00011110','00111100','01111000','11110000','11100000','11000000'],
  save: ['11111110','10111011','10111001','11111001','10000001','10111101','10100101','11111111'],
  check: ['00000000','00000001','00000011','10000110','11001100','01111000','00110000','00000000'],
  cross: ['11000011','11100111','01111110','00111100','00111100','01111110','11100111','11000011'],
  warning: ['00011000','00011000','00111100','00100100','01100110','11111111','11011011','11111111'],
  info: ['00111100','01100110','11011011','11000011','11011011','11011011','01100110','00111100'],
  arrow_right: ['00010000','00011000','00011100','11111110','11111110','00011100','00011000','00010000'],
  arrow_left: ['00001000','00011000','00111000','01111111','01111111','00111000','00011000','00001000'],
  arrow_up: ['00011000','00111100','01111110','11111111','00011000','00011000','00011000','00011000'],
  arrow_down: ['00011000','00011000','00011000','00011000','11111111','01111110','00111100','00011000'],
  arrow_ne: ['01111111','00000111','00001111','00011111','00111011','01110011','11100001','11000000'],
  play: ['11000000','11110000','11111100','11111111','11111111','11111100','11110000','11000000'],
  pause: ['01100110','01100110','01100110','01100110','01100110','01100110','01100110','01100110'],
  music: ['00111111','00100001','00100001','00100001','00100111','11100111','11100000','00000000'],
  sound: ['00110000','01110100','11110010','11110101','11110101','11110010','01110100','00110000'],
  loop: ['00111100','01100010','11000011','10000111','11100001','11000011','01000110','00111100'],
  grid: ['11101110','10101010','11101110','00000000','11101110','10101010','11101110','00000000'],
  menu: ['00000000','11111111','11111111','00000000','11111111','11111111','00000000','11111111'],
  sun: ['10011001','01011010','00111100','11111111','11111111','00111100','01011010','10011001'],
  bug: ['01000010','00111100','11111111','01111110','11111111','01111110','11111111','01000010'],
  flag: ['11111110','10111110','11101110','10111110','11111110','10000000','10000000','10000000'],
  tag: ['00111111','01110001','11110001','11111111','01111110','00111100','00011000','00000000'],
  instagram: ['01111110','11000011','10000001','10011011','10100101','10100101','11011011','01111110'],
  facebook: ['00011110','00110000','00110000','11111100','00110000','00110000','00110000','00110000'],
  telegram: ['00000011','00011111','11111110','01111110','00111100','00011100','00101000','00100000'],
  spotify: ['00111100','01111110','11000011','11111011','11000111','11110111','01111110','00111100'],
};
const ALIASES: Record<string, string> = {
  hub:'grid', send:'pigeon', link:'loop', unfold_less:'arrow_up',
  arrow_back:'arrow_left', reply:'arrow_left', logout:'arrow_right', north_east:'arrow_ne', open_in_new:'arrow_ne',
  arrow_drop_down:'arrow_down', dashboard_customize:'grid', inventory_2:'backpack',
  menu_book:'book', photo_camera:'camera', photo_library:'camera', add_photo_alternate:'camera',
  forward_to_inbox:'mail', alternate_email:'mail', record_voice_over:'sound', headphones:'headphones',
  admin_panel_settings:'shield', lock_reset:'key', check_circle:'check', error:'warning',
  progress_activity:'loop', hourglass_top:'clock', schedule:'clock', autorenew:'loop', sync:'loop',
  upload_file:'upload', delete_sweep:'trash', delete:'trash', visibility:'eye', visibility_off:'eye',
  push_pin:'pin', location_on:'location', stars:'star', token:'star', favorite:'heart',
  military_tech:'trophy', rocket_launch:'rocket', auto_fix_high:'sparkles', auto_awesome:'sparkles',
  smart_toy:'computer', groups:'people', sports_esports:'gamepad', stadia_controller:'gamepad',
  pets:'cat', album:'music', graphic_eq:'sound', all_inclusive:'loop', motion_photos_on:'play',
  motion_photos_off:'pause', format_list_bulleted:'menu', edit_note:'edit',
  code:'computer', javascript:'computer', html:'file', css:'palette', psychology:'sparkles',
  terminal:'computer', design_services:'palette', draw:'edit', brush:'palette', lightbulb:'sun',
  language:'globe', public:'globe', extension:'grid', view_in_ar:'grid', deployed_code:'computer',
};
const EMOJI: Record<string, string> = {
  '🎒':'backpack','📜':'file','🎧':'headphones','📸':'camera','📷':'camera','🕊️':'pigeon','🕊':'pigeon',
  '📭':'mail','📧':'mail','✨':'sparkles','🌙':'moon','🧘':'meditate','🎉':'confetti','🛡️':'shield','🛡':'shield',
  '⏳':'clock','⚠️':'warning','⚠':'warning','👑':'trophy','✅':'check','🌐':'globe','🌍':'globe',
  '✈️':'rocket','✈':'rocket','☀️':'sun','☀':'sun','🏷️':'tag','🏷':'tag','🔖':'tag','⭐':'star','★':'star',
  '💖':'heart','⚡':'bolt','🍬':'heart','💻':'computer','🐞':'bug','🤓':'people','🔄':'loop',
  '▶':'play','⏸':'pause','🎵':'music','🟢':'check','🔑':'key','💾':'save','↗':'arrow_ne',
  '→':'arrow_right','←':'arrow_left','▲':'arrow_up','▼':'arrow_down','◄':'arrow_left','►':'arrow_right',
  '⇄':'loop','✕':'cross','✖':'cross','✓':'check','✔':'check','🇻🇳':'flag','🇬🇧':'flag','🇺🇸':'flag',
};
export function PixelIcon({ name, children, label, className = '', style, ...props }:
  Omit<React.SVGProps<SVGSVGElement>, 'children' | 'name'> & { name?: string; children?: React.ReactNode; label?: string }) {
  const raw = String(name ?? children ?? 'sparkles').trim();
  const key = EMOJI[raw] || ALIASES[raw] || raw;
  const rows = GLYPHS[key] || GLYPHS.sparkles;
  const d = rows.flatMap((row,y) => [...row].flatMap((pixel,x) => pixel === '1' ? ['M'+x+' '+y+'h1v1h-1z'] : [])).join('');
  return <svg {...props} className={'pixel-icon ' + className.replace('material-symbols-outlined', '')}
    width="1em" height="1em" viewBox="0 0 8 8" fill="currentColor" shapeRendering="crispEdges"
    role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true} focusable="false"
    style={{ display: 'inline-block', verticalAlign: '-0.125em', flexShrink: 0, ...style }}>
    <path d={d} />
  </svg>;
}

const SYMBOLS = /(?:\p{Regional_Indicator}{2}|\p{Extended_Pictographic}(?:\uFE0F|\p{Emoji_Modifier})?(?:\u200D\p{Extended_Pictographic}\uFE0F?)*|[★✓✔✕✖→←▲▼◄►⇄↗])/gu;

/** Render decorative symbols in any site text using the same pixel glyphs. */
export function pixelText(value: React.ReactNode): React.ReactNode {
  if (Array.isArray(value)) return value.map(part => pixelText(part));
  if (typeof value !== 'string') return value;
  const pieces: React.ReactNode[] = [];
  let offset = 0;
  for (const match of value.matchAll(SYMBOLS)) {
    const key = EMOJI[match[0]];
    if (!key) continue;
    const index = match.index!;
    if (index > offset) pieces.push(value.slice(offset, index));
    pieces.push(<PixelIcon key={'icon-'+index} name={key} label={key.replaceAll('_',' ')} />);
    offset = index + match[0].length;
  }
  if (!pieces.length) return value;
  if (offset < value.length) pieces.push(value.slice(offset));
  return pieces;
}

