import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

const ACTIVITIES = [
  { id: 'idle', vi: 'Nghỉ ngơi', en: 'Idle', icon: '✨' },
  { id: 'sleeping', vi: 'Ngủ', en: 'Sleeping', icon: '🌙' },
  { id: 'meditating', vi: 'Thiền', en: 'Meditating', icon: '🧘' },
  { id: 'celebrating', vi: 'Ăn mừng', en: 'Celebrating', icon: '🎉' },
] as const;

export const ChibiViewer: React.FC = () => {
  const { isVi } = useLanguage();
  const [activityIndex, setActivityIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const activity = ACTIVITIES[activityIndex];
  const label = isVi ? activity.vi : activity.en;

  useEffect(() => {
    if (!autoPlay) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setActivityIndex(index => (index + 1) % ACTIVITIES.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, [autoPlay]);

  return (
    <div className="mt-4 w-full bg-[#231b34] border-[3px] border-[#5a3696] p-3 pixel-box-sm relative overflow-hidden">
      <div className="flex items-center justify-between gap-2 border-b border-[#5a3696]/70 pb-2 text-[10px] font-['Space_Mono'] font-bold">
        <span className="text-[#f6c833]">{isVi ? 'NHÂN VẬT CỦA PHƯƠNG ANH' : "PHUONG ANH'S CHARACTER"}</span>
        <span className="text-[#45b7d1] shrink-0">4 GIF</span>
      </div>

      <div className="mt-2 bg-[#120a21]/80 border border-[#5a3696]/60 flex flex-col items-center p-2">
        <span className="text-[11px] text-[#f6c833] font-bold min-h-5">{activity.icon} {label}</span>
        <button
          type="button"
          onClick={() => { setAutoPlay(false); setActivityIndex(index => (index + 1) % ACTIVITIES.length); }}
          aria-label={isVi ? 'Hoạt động tiếp theo' : 'Next activity'}
          title={isVi ? 'Bấm để đổi hoạt động' : 'Click to change activity'}
          className="block w-48 h-48 shrink-0 cursor-pointer"
        >
          <img
            key={activity.id}
            src={'/character/' + activity.id + '.gif'}
            alt={isVi ? 'Phương Anh: ' + activity.vi : 'Phuong Anh: ' + activity.en}
            width={256}
            height={256}
            decoding="async"
            className="block w-full h-full object-contain pixelated-render select-none"
            draggable={false}
          />
        </button>
        <span className="text-[9px] text-[#d1c5ad] text-center">
          {isVi ? 'Chạm nhân vật hoặc chọn hoạt động bên dưới' : 'Tap the character or choose an activity below'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-1.5 mt-3" role="group" aria-label={isVi ? 'Chọn hoạt động' : 'Choose activity'}>
        {ACTIVITIES.map((item, index) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={activityIndex === index}
            onClick={() => { setAutoPlay(false); setActivityIndex(index); }}
            className={'min-w-0 py-2 px-1 border font-bold text-[10px] cursor-pointer focus-visible:outline-2 focus-visible:outline-[#f6c833] ' +
              (activityIndex === index
                ? 'bg-[#f6c833] border-[#f6c833] text-[#120a21]'
                : 'bg-[#2e263f] border-[#5a3696] text-[#f3eeff] hover:border-[#f6c833]')}
            title={isVi ? item.vi : item.en}
          >
            <span className="block truncate">{item.icon} {isVi ? item.vi : item.en}</span>
          </button>
        ))}
      </div>

      <button
        type="button"
        aria-pressed={autoPlay}
        onClick={() => setAutoPlay(value => !value)}
        className="mt-3 w-full py-2 border border-[#5a3696] bg-[#120a21] text-[#45b7d1] font-bold text-[10px] cursor-pointer hover:border-[#45b7d1]"
      >
        {isVi
          ? 'TỰ ĐỔI HOẠT ĐỘNG: ' + (autoPlay ? 'BẬT' : 'TẮT')
          : 'AUTO CHANGE: ' + (autoPlay ? 'ON' : 'OFF')}
      </button>
    </div>
  );
};
