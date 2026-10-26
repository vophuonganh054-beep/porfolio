import React, { useEffect, useReducer, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { cleanBest, DUCK_BEST_KEY, duckReducer, initialDuck } from '../utils/duckGame';
export function DuckGame() {
  const { isVi } = useLanguage();
  const [game, dispatch] = useReducer(duckReducer, undefined, () => {
    try { return initialDuck(cleanBest(JSON.parse(localStorage.getItem(DUCK_BEST_KEY) || '0'))); }
    catch { return initialDuck(); }
  });
  const [canSave, setCanSave] = useState(true);
  useEffect(() => {
    if (game.phase !== 'playing') return;
    const tick = window.setInterval(() => dispatch({ type: 'tick', now: Date.now() }), 100);
    const spawn = window.setInterval(() => dispatch({ type: 'spawn', now: Date.now(), target: Math.floor(Math.random() * 9) }), 850);
    return () => { window.clearInterval(tick); window.clearInterval(spawn); };
  }, [game.phase, game.deadline]);
  useEffect(() => {
    if (game.phase !== 'done') return;
    try { localStorage.setItem(DUCK_BEST_KEY, JSON.stringify(game.best)); setCanSave(true); }
    catch { setCanSave(false); }
  }, [game.phase, game.best]);
  const playing = game.phase === 'playing';
  const message = game.score >= 15 ? (isVi ? 'Cao thủ bắt vịt! Không chú nào thoát được bạn.' : 'Duck-catching champion! No duck can escape you.')
    : game.score >= 8 ? (isVi ? 'Nhanh tay quá! Đàn vịt đã về gần đủ rồi.' : 'Quick hands! Almost the whole flock is home.')
    : (isVi ? 'Vịt hơi lanh nha. Thử thêm ván nữa nào!' : 'These ducks are sneaky. Try another round!');
  return <section aria-labelledby="duck-game-title" className="duck-window bg-[#191127]/95 border-[3px] border-[#5a3696] p-4 sm:p-6 pixel-box">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8 items-center">
      <div>
        <p className="text-[10px] font-bold tracking-widest text-[#26c281]">MINI GAME // DUCK RESCUE</p>
        <h2 id="duck-game-title" className="mt-2 text-xl sm:text-2xl text-[#f6c833] font-bold">{isVi ? 'BẮT VỊT LẠC' : 'CATCH THE DUCK'}</h2>
        <p className="mt-3 text-xs leading-6 text-[#eaddff]">{isVi ? 'Đàn vịt đang trốn trong 9 ô cửa. Trong 20 giây, chạm vào chú vịt vừa ló đầu để đưa bạn ấy về nhà. Mỗi chú vịt được 1 điểm!' : 'The ducks are hiding behind 9 little windows. Tap each duck as it appears to bring it home. You have 20 seconds. Each duck earns 1 point!'}</p>
        <div className="flex flex-wrap gap-2 mt-4 text-xs">
          <span className="border-2 border-[#5a3696] bg-[#120a21] px-3 py-2 text-[#45b7d1]">{isVi ? 'Điểm: ' : 'Score: '}<strong>{game.score}</strong></span>
          <span className="border-2 border-[#5a3696] bg-[#120a21] px-3 py-2 text-[#f6c833]">{isVi ? 'Kỷ lục: ' : 'Best: '}<strong>{game.best}</strong></span>
          <span role="timer" aria-label={isVi ? 'Thời gian còn lại' : 'Time remaining'} className={'border-2 border-[#5a3696] bg-[#120a21] px-3 py-2 ' + (game.seconds <= 5 ? 'text-[#f78da7]' : 'text-[#26c281]')}>{game.seconds}s</span>
        </div>
        <button type="button" disabled={playing} onClick={() => dispatch({ type: 'start', now: Date.now(), target: Math.floor(Math.random() * 9) })} className="mt-4 border-2 border-black bg-[#f6c833] text-[#120a21] px-5 py-3 text-xs font-bold pixel-btn-action disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-white">
          {playing ? (isVi ? 'Đang tìm vịt…' : 'Catching ducks…') : game.phase === 'done' ? (isVi ? 'Chơi lại · phá kỷ lục' : 'Play again · beat your best') : (isVi ? 'Bắt đầu · 20 giây' : 'Start · 20 seconds')}
        </button>
        <p role="status" aria-live="polite" className="mt-3 min-h-12 text-xs leading-6 text-[#f6c833]">{game.phase === 'done' ? (isVi ? 'Hết giờ! Bạn đưa về ' + game.score + ' chú vịt. ' : "Time’s up! You rescued " + game.score + ' ducks. ') + message : (isVi ? 'Không trừ điểm khi bấm hụt. Cứ vui thôi!' : 'No penalty for misses. Just have fun!')}</p>
        <p className="text-[9px] text-[#a798c4]">{canSave ? (isVi ? 'Kỷ lục lưu riêng trên trình duyệt này.' : 'Your best score is saved in this browser.') : (isVi ? 'Không lưu được kỷ lục; bạn vẫn chơi bình thường.' : 'Best score could not be saved. You can still play.')}</p>
      </div>
      <div className="relative mx-auto w-full max-w-sm border-[3px] border-[#5a3696] bg-[#120a21] p-3">
        <div className="grid grid-cols-3 gap-2" role="group" aria-label={isVi ? 'Sân chơi 9 ô vịt' : 'Nine-window duck playground'}>
          {Array.from({ length: 9 }, (_, index) => {
            const hasDuck = playing && game.target === index;
            return <button key={index} type="button" disabled={!playing}
              aria-label={(isVi ? 'Ô ' : 'Cell ') + (index + 1) + (hasDuck ? (isVi ? ': Có vịt, bấm để bắt' : ': Duck here, tap to catch') : (isVi ? ': Trống' : ': Empty'))}
              onClick={() => dispatch({ type: 'hit', now: Date.now(), cell: index })}
              className={'aspect-square min-w-0 border-2 flex items-center justify-center text-4xl sm:text-5xl select-none touch-manipulation focus-visible:outline-4 focus-visible:outline-[#45b7d1] focus-visible:outline-offset-2 ' + (hasDuck ? 'bg-[#f6c833]/15 border-[#f6c833] hover:bg-[#f6c833]/30' : 'bg-[#231b34] border-[#5a3696]')}>
              <span aria-hidden="true">{hasDuck ? '🦆' : <span className="text-lg text-[#5a3696]">·</span>}</span>
            </button>;
          })}
        </div>
        {!playing && <div className="pointer-events-none absolute inset-3 flex items-center justify-center bg-[#120a21]/85 p-3">
          <div className="text-center"><span aria-hidden="true" className="text-5xl">🦆</span><p className="mt-3 text-xs font-bold text-[#f6c833]">{game.phase === 'done' ? (isVi ? 'Đàn vịt cảm ơn bạn!' : 'The ducks thank you!') : (isVi ? 'Sẵn sàng bắt vịt chưa?' : 'Ready to catch some ducks?')}</p></div>
        </div>}
      </div>
    </div>
  </section>;
}

