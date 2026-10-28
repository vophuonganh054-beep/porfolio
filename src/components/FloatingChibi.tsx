import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '../context/LanguageContext';

const ACTIONS = [
  ['happy', 'Vui vẻ', 'Happy'], ['sad', 'Buồn', 'Sad'], ['shy', 'Ngại ngùng', 'Shy'],
  ['pleading', 'Năn nỉ', 'Pleading'], ['angry', 'Giận bốc lửa', 'Angry'],
  ['sleeping', 'Ngủ', 'Sleep'], ['studying', 'Học bài', 'Study'],
  ['thinking', 'Suy nghĩ', 'Think'], ['computer', 'Máy tính', 'Computer'],
  ['drinking', 'Uống nước', 'Drink'], ['eating', 'Ăn uống', 'Eat'],
] as const;
const SIZE = 128;
const HELD_SIZE = 176;
// The fall GIF has more transparent padding than the held GIF.
const RECOVERY_SIZE = 228;
const RECOVERY_MS = 4620;
// Visible foot positions, measured in the 128px source frames.
const RECOVERY_FOOT = { x: 64, y: 117 };
const HAPPY_FOOT = { x: 69, y: 95 };
const clamp = (value: number, max: number) => Math.max(0, Math.min(value, Math.max(0, max)));
const randomAction = (previous: string) => {
  const choices = ACTIONS.filter(([id]) => id !== previous);
  return choices[Math.floor(Math.random() * choices.length)][0];
};

export function FloatingChibi() {
  const { isVi } = useLanguage();
  const [activity, setActivity] = useState('walking');
  const [dropSequence, setDropSequence] = useState(0);
  const [menu, setMenu] = useState(false);
  const [panel, setPanel] = useState({ left: 8, top: 8 });
  const sprite = useRef<HTMLButtonElement>(null);
  const hoverTimer = useRef<number | undefined>(undefined);
  const state = useRef({ x: 24, y: 200, tx: 24, ty: 200, elapsed: 0, walking: true, hover: false, menu: false, dragging: false, recovering: false, recoveryLoaded: false, recoveryElapsed: 0, recoveryStartedAt: -1, reduced: false, direction: 1 });
  const pointer = useRef<{ id: number; x: number; y: number; originX: number; originY: number; moved: boolean } | null>(null);
  const displaySize = activity === 'recover' ? RECOVERY_SIZE : activity === 'lifted' ? HELD_SIZE : SIZE;
  const clearHover = () => window.clearTimeout(hoverTimer.current);
  const paint = () => {
    const s = state.current;
    if (sprite.current) {
      sprite.current.style.transform = `translate3d(${Math.round(s.x)}px,${Math.round(s.y)}px,0)`;
      const image = sprite.current.querySelector('img');
      if (image) image.style.transform = s.walking && s.direction < 0 ? 'scaleX(-1)' : '';
    }
  };
  const bounds = () => {
    const s = state.current;
    const size = s.recovering ? RECOVERY_SIZE : s.dragging ? HELD_SIZE : SIZE;
    s.x = clamp(s.x, window.innerWidth - size);
    s.y = clamp(s.y, window.innerHeight - size);
    s.tx = clamp(s.tx, window.innerWidth - SIZE);
    s.ty = clamp(s.ty, window.innerHeight - SIZE);
  };
  const target = () => {
    const s = state.current;
    s.tx = Math.random() * Math.max(0, window.innerWidth - SIZE);
    s.ty = 60 + Math.random() * Math.max(0, window.innerHeight - SIZE - 60);
    bounds();
    s.direction = s.tx < s.x ? -1 : 1;
  };
  const openMenu = () => {
    clearHover();
    if (state.current.dragging || state.current.recovering) return;
    state.current.menu = true;
    setMenu(true);
    const s = state.current;
    setPanel({ left: clamp(s.x - 60, window.innerWidth - 276), top: clamp(s.y > 300 ? s.y - 290 : s.y + SIZE, window.innerHeight - 300) });
  };
  const closeMenu = () => { state.current.menu = false; state.current.hover = false; setMenu(false); };
  const choose = (id: string) => {
    const s = state.current;
    s.walking = id === 'walking'; s.elapsed = 0;
    if (s.walking) target();
    setActivity(id); closeMenu();
  };

  useEffect(() => {
    const s = state.current;
    s.y = Math.max(0, window.innerHeight - SIZE - 30);
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    s.reduced = preference.matches;
    if (s.reduced) { s.walking = false; setActivity('happy'); }
    s.elapsed = 0; target(); paint();
    let frame = 0; let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(now - last, 80); last = now;
      if (!document.hidden && s.recovering && !pointer.current) {
        const recoveryImage = sprite.current?.querySelector('img');
        // Cached GIFs can finish loading before React observes the load event.
        if (recoveryImage?.complete && recoveryImage.naturalWidth > 0 && recoveryImage.getAttribute('src')?.includes('/recover.gif')) s.recoveryLoaded = true;
        if (s.recoveryLoaded) {
          if (s.recoveryStartedAt < 0) s.recoveryStartedAt = now;
          s.recoveryElapsed = now - s.recoveryStartedAt;
        }
        if (s.recoveryElapsed >= RECOVERY_MS) {
          // Keep the visible feet at the landing spot when the canvas shrinks.
          s.x += RECOVERY_FOOT.x * RECOVERY_SIZE / SIZE - HAPPY_FOOT.x;
          s.y += RECOVERY_FOOT.y * RECOVERY_SIZE / SIZE - HAPPY_FOOT.y;
          s.recovering = false; s.recoveryLoaded = false; s.elapsed = 0; s.hover = false;
          s.walking = false;
          paint();
          setActivity('happy');
        }
      } else if (!document.hidden && !s.hover && !s.menu && !pointer.current) {
        s.elapsed += dt;
        if (s.walking && !s.reduced) {
          const dx = s.tx - s.x; const dy = s.ty - s.y;
          const distance = Math.hypot(dx, dy);
          if (distance < 3) target();
          else { const step = Math.min(distance, dt * 0.065); s.x += dx / distance * step; s.y += dy / distance * step; paint(); }
        }
        if (s.elapsed >= (s.walking ? 7000 : 6000)) {
          s.elapsed = 0;
          s.walking = !s.walking && !s.reduced;
          if (s.walking) { target(); setActivity('walking'); }
          else setActivity(previous => randomAction(previous));
        }
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    const cancelDrag = () => {
      if (pointer.current) { pointer.current = null; s.dragging = false; s.walking = false; s.elapsed = 0; setActivity('happy'); }
      s.hover = false; clearHover();
    };
    const resize = () => { cancelDrag(); bounds(); paint(); closeMenu(); };
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') { closeMenu(); sprite.current?.focus(); } };
    const reduce = () => { s.reduced = preference.matches; if (s.reduced) { s.recovering = false; s.recoveryLoaded = false; s.walking = false; s.elapsed = 0; setActivity('happy'); } };
    window.addEventListener('blur', cancelDrag); window.addEventListener('resize', resize); window.addEventListener('keydown', escape); preference.addEventListener('change', reduce);
    return () => { cancelAnimationFrame(frame); clearHover(); window.removeEventListener('blur', cancelDrag); window.removeEventListener('resize', resize); window.removeEventListener('keydown', escape); preference.removeEventListener('change', reduce); };
  }, []);

  const release = (event: React.PointerEvent<HTMLButtonElement>) => {
    const p = pointer.current;
    if (!p || p.id !== event.pointerId) return;
    pointer.current = null;
    state.current.dragging = false;
    state.current.hover = false;
    if (p.moved) {
      state.current.elapsed = 0; state.current.walking = false;
      if (event.type === 'pointerup') {
        state.current.recovering = true; state.current.recoveryLoaded = false; state.current.recoveryElapsed = 0; state.current.recoveryStartedAt = -1;
        bounds(); paint();
        clearHover(); setDropSequence(value => value + 1); setActivity('recover');
      } else { state.current.recovering = false; setActivity('happy'); }
    }
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    // A tap also opens the picker on touch screens.
    if (!p.moved && event.type === 'pointerup') openMenu();
    else if (p.moved && !state.current.recovering && event.type === 'pointerup' && event.pointerType === 'mouse') {
      state.current.hover = true;
      hoverTimer.current = window.setTimeout(openMenu, 2000);
    }
  };

  return createPortal(<>
    <button ref={sprite} type="button" aria-label={isVi ? 'Chibi: kéo để di chuyển, rê chuột 2 giây hoặc nhấn để chọn hoạt động' : 'Chibi: drag to move, hover for 2 seconds or press to choose an activity'} aria-expanded={menu} aria-controls="chibi-activities"
      style={{ position: 'fixed', left: 0, top: 0, width: displaySize, height: displaySize, zIndex: 45, touchAction: 'none', padding: 0, border: 0, background: 'transparent', cursor: 'grab', userSelect: 'none' }}
      onPointerEnter={event => { if (event.pointerType === 'mouse') { state.current.hover = true; clearHover(); hoverTimer.current = window.setTimeout(openMenu, 2000); } }}
      onPointerLeave={() => { state.current.hover = false; clearHover(); }}
      onClick={event => { if (event.detail === 0) openMenu(); }}
      onPointerDown={event => {
        if (event.button !== 0) return;
        clearHover(); closeMenu();
        pointer.current = { id: event.pointerId, x: event.clientX, y: event.clientY, originX: state.current.x, originY: state.current.y, moved: false };
        event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerMove={event => {
        const p = pointer.current; if (!p || p.id !== event.pointerId) return;
        const dx = event.clientX - p.x; const dy = event.clientY - p.y;
        if (!p.moved && Math.hypot(dx, dy) > 4) { p.moved = true; state.current.dragging = true; state.current.walking = false; state.current.recovering = false; state.current.recoveryLoaded = false; setActivity('lifted'); }
        if (p.moved) { state.current.x = p.originX + dx; state.current.y = p.originY + dy; bounds(); paint(); }
      }} onPointerUp={release} onPointerCancel={release}
      onLostPointerCapture={event => { if (pointer.current?.id === event.pointerId) release(event); }}>
      <img key={activity === 'recover' ? 'recover-' + dropSequence : activity} src={activity === 'recover' ? `/companion/recover.gif?play=${dropSequence}` : `/companion/${activity}.gif`}
        onLoad={() => { if (activity === 'recover' && state.current.recovering) { state.current.recoveryLoaded = true; state.current.recoveryStartedAt = performance.now(); } }}
        onError={() => { if (activity === 'recover') { state.current.recovering = false; state.current.elapsed = 0; setActivity('happy'); } }} alt="" width={displaySize} height={displaySize} draggable={false} style={{ width: displaySize, height: displaySize, imageRendering: 'pixelated', pointerEvents: 'none', transform: activity === 'walking' && state.current.direction < 0 ? 'scaleX(-1)' : undefined }} />
    </button>
    {menu && <section id="chibi-activities" aria-label={isVi ? 'Biểu cảm và hoạt động' : 'Expressions and activities'} style={{ position: 'fixed', left: panel.left, top: panel.top, width: 'min(268px, calc(100vw - 16px))', maxHeight: 'min(290px, calc(100dvh - 16px))', overflowY: 'auto', zIndex: 46 }} className="border-2 border-[#f6c833] bg-[#191127] p-3 text-[#eaddff] shadow-lg font-mono"
      onPointerEnter={() => { state.current.hover = true; }} onPointerLeave={() => { state.current.hover = false; }}>
      <div className="flex justify-between items-center mb-2 text-xs"><strong>{isVi ? 'CHƠI CÙNG CHIBI' : 'PLAY WITH CHIBI'}</strong><button type="button" onClick={closeMenu} aria-label={isVi ? 'Đóng' : 'Close'} className="px-2 py-1">×</button></div>
      <div className="grid grid-cols-2 gap-1.5">{[...ACTIONS, ['walking', 'Đi dạo', 'Walk']].map(([id, vi, en]) => <button key={id} type="button" aria-pressed={activity === id} onClick={() => choose(id)} className="border border-[#5a3696] hover:border-[#f6c833] focus-visible:outline-2 focus-visible:outline-[#f6c833] p-2 text-xs">{isVi ? vi : en}</button>)}</div>
      <p className="text-[10px] mt-2 text-[#d1c5ad]">{isVi ? 'Kéo t đi chơi · Thả ra để t tự khám phá tiếp' : 'Drag me around · Release to keep exploring'}</p>
    </section>}
  </>, document.body);
}
