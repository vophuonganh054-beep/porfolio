import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
const GAME_URL = 'https://www.crazygames.com/vn/game/syntaxia';
const EMBED_URL = 'https://www.crazygames.com/embed/syntaxia';
export function SyntaxiaPlayer({ active = true }: { active?: boolean }) {
  const { isVi } = useLanguage();
  const [playing, setPlaying] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [version, setVersion] = useState(0);
  useEffect(() => {
    if (!active) { setPlaying(false); setExpanded(false); }
  }, [active]);
  useEffect(() => {
    setShowHelp(false);
    if (!playing || !active) return;
    const timer = window.setTimeout(() => setShowHelp(true), 20000);
    return () => window.clearTimeout(timer);
  }, [playing, active, version]);
  return <section aria-labelledby="syntaxia-title" className={'border-[3px] border-[#5a3696] bg-[#191127] p-3 sm:p-4 pixel-box-sm ' + (expanded ? 'fixed inset-3 sm:inset-8 z-[70] overflow-y-auto' : 'w-full max-w-[640px]')}>
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#5a3696] pb-3">
      <div><p className="text-[9px] text-[#26c281] font-bold">GAME CORNER // CRAZYGAMES</p><h3 id="syntaxia-title" className="text-lg text-[#f6c833] font-bold mt-1">SYNTAXIA <span className="text-[10px] text-[#a798c4]">DEMO</span></h3></div>
      {playing && <div className="flex gap-2 text-[10px]">
        <button type="button" aria-pressed={expanded} onClick={() => setExpanded(value => !value)} className="border border-[#5a3696] px-2 py-2 text-[#45b7d1]">{expanded ? (isVi ? 'Thu nhỏ' : 'Shrink') : (isVi ? 'Mở rộng' : 'Expand')}</button>
        <button type="button" onClick={() => { setPlaying(false); setExpanded(false); }} className="border border-[#5a3696] px-2 py-2 text-[#f78da7]">{isVi ? 'Đóng game' : 'Close game'}</button>
      </div>}
    </div>
    <div className={'mt-3 w-full bg-black border-2 border-[#5a3696] ' + (expanded ? 'h-[70dvh] min-h-64' : 'aspect-video')}>
      {playing && active ? <iframe key={version} src={EMBED_URL} title="SYNTAXIA — CrazyGames" className="w-full h-full border-0" allow="autoplay; fullscreen; gamepad" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />
        : <div className="w-full h-full flex flex-col items-center justify-center gap-3 px-4 text-center bg-[#120a21]">
          <span aria-hidden="true" className="material-symbols-outlined text-4xl text-[#f6c833]">sports_esports</span>
          <p className="text-[11px] text-[#eaddff]">{isVi ? 'Một chiếc laptop. Những dòng chữ thay đổi thực tại.' : 'One laptop. Words that rewrite reality.'}</p>
          <button type="button" onClick={() => setPlaying(true)} className="border-2 border-black bg-[#f6c833] text-[#120a21] px-4 py-2 text-xs font-bold pixel-btn-action">{isVi ? 'Chơi trong khung nhỏ' : 'Play in this window'}</button>
        </div>}
    </div>
    <p className="mt-3 text-[10px] leading-5 text-[#d1c5ad]">{isVi ? 'Bấm vào màn hình game để điều khiển. Game tải từ CrazyGames và có thể mất một lúc. Chuyển mục sẽ đóng game.' : 'Click inside the game to control it. Loading from CrazyGames may take a moment. Leaving this section closes the game.'}</p>
    <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[10px]">
      <a href={GAME_URL} target="_blank" rel="noopener noreferrer" className="text-[#45b7d1] underline underline-offset-4">{isVi ? 'Mở trên CrazyGames ↗' : 'Open on CrazyGames ↗'}</a>
      {playing && <button type="button" onClick={() => setVersion(value => value + 1)} className="border border-[#5a3696] text-[#eaddff] px-2 py-1">{isVi ? 'Tải lại game' : 'Reload game'}</button>}
    </div>
    {showHelp && <p role="status" className="mt-2 text-[10px] text-[#f6c833] leading-5">{isVi ? 'Nếu khung vẫn trống hoặc báo lỗi, hãy thử mở rộng hoặc dùng liên kết CrazyGames bên trên. Khả năng chơi trong khung phụ thuộc vào CrazyGames và trình duyệt.' : 'If the frame stays blank or shows an error, try expanding it or use the CrazyGames link above. Embedded play depends on CrazyGames and your browser.'}</p>}
  </section>;
}
