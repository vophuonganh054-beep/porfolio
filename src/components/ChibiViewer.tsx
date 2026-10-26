import { PixelIcon, pixelText } from "./PixelIcon";
import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
const ACTIVITIES = [
  {
    "id": "01-idle",
    "vi": "Nghỉ ngơi",
    "en": "Idle",
    "icon": "sparkles"
  },
  {
    "id": "14-waving",
    "vi": "Vẫy tay",
    "en": "Waving",
    "icon": "heart"
  },
  {
    "id": "02-laptop",
    "vi": "Laptop",
    "en": "Laptop",
    "icon": "computer"
  },
  {
    "id": "04-coffee",
    "vi": "Uống cà phê",
    "en": "Coffee",
    "icon": "coffee"
  },
  {
    "id": "08-sleeping",
    "vi": "Ngủ",
    "en": "Sleeping",
    "icon": "moon"
  },
  {
    "id": "09-eating",
    "vi": "Ăn uống",
    "en": "Eating",
    "icon": "heart"
  },
  {
    "id": "10-computer",
    "vi": "Máy tính",
    "en": "Computer",
    "icon": "computer"
  },
  {
    "id": "11-thinking",
    "vi": "Suy nghĩ",
    "en": "Thinking",
    "icon": "info"
  },
  {
    "id": "12-celebrating",
    "vi": "Ăn mừng",
    "en": "Celebrating",
    "icon": "confetti"
  }
] as const;
const INTERACTIONS = [
  { id: '04-coffee', icon: 'coffee', vi: 'Mời cà phê', en: 'Give coffee', replyVi: 'Một ngụm cà phê, nạp lại năng lượng nào!', replyEn: 'A sip of coffee. Ready to recharge!' },
  { id: '02-laptop', icon: 'computer', vi: 'Mở laptop', en: 'Open laptop', replyVi: 'Laptop đã mở. Cùng tạo ra điều gì đó nhé!', replyEn: 'Laptop ready. Let’s create something!' },
  { id: '09-eating', icon: 'heart', vi: 'Mời ăn', en: 'Snack time', replyVi: 'Đến giờ ăn rồi! Cảm ơn vì bữa ngon nha.', replyEn: 'Snack time! Thanks for the treat.' },
  { id: '08-sleeping', icon: 'moon', vi: 'Chúc ngủ ngon', en: 'Good night', replyVi: 'Cất công việc lại, ngủ một giấc thật ngon…', replyEn: 'Work can wait. Time for a good rest…' },
  { id: '14-waving', icon: 'people', vi: 'Chào một cái', en: 'Say hello', replyVi: 'Chào mừng đến thế giới nhỏ của Phương Anh!', replyEn: 'Welcome to Phuong Anh’s little world!' },
  { id: '12-celebrating', icon: 'confetti', vi: 'Ăn mừng nào', en: 'Celebrate', replyVi: 'Dù là thành công nhỏ cũng xứng đáng ăn mừng!', replyEn: 'Even small wins deserve a celebration!' },
] as const;

export const ChibiViewer: React.FC = () => {
  const {
    isVi
  } = useLanguage();
  const [activityIndex, setActivityIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const [reaction, setReaction] = useState<{ vi: string; en: string } | null>(null);
  const activity = ACTIVITIES[activityIndex];
  const label = isVi ? activity.vi : activity.en;
  useEffect(() => {
    if (!autoPlay) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setActivityIndex(index => (index + 1) % ACTIVITIES.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, [autoPlay]);
  return <div className="mt-4 w-full bg-[#231b34] border-[3px] border-[#5a3696] p-3 pixel-box-sm relative overflow-hidden">
      <div className="flex items-center justify-between gap-2 border-b border-[#5a3696]/70 pb-2 text-[10px] font-['Space_Mono'] font-bold">
        <span className="text-[#f6c833]">{pixelText(isVi ? 'NHÂN VẬT CỦA PHƯƠNG ANH' : "PHUONG ANH'S CHARACTER")}</span>
        <span className="text-[#45b7d1] shrink-0">{ACTIVITIES.length} GIF</span>
      </div>

      <div className="mt-2 bg-[#120a21]/80 border border-[#5a3696]/60 flex flex-col items-center p-2">
        <span className="text-[11px] text-[#f6c833] font-bold min-h-5"><PixelIcon name={activity.icon} /> {pixelText(label)}</span>
        <button type="button" onClick={() => {
        setAutoPlay(false);
        setActivityIndex(index => (index + 1) % ACTIVITIES.length);
        setReaction(null);
      }} aria-label={isVi ? 'Hoạt động tiếp theo' : 'Next activity'} title={isVi ? 'Bấm để đổi hoạt động' : 'Click to change activity'} className="block w-48 h-48 shrink-0 cursor-pointer">
          <img key={activity.id} src={'/character/' + activity.id + '.gif'} alt={isVi ? 'Phương Anh: ' + activity.vi : 'Phuong Anh: ' + activity.en} width={256} height={256} decoding="async" className="block w-full h-full object-contain pixelated-render select-none" draggable={false} />
        </button>
        <span className="text-[9px] text-[#d1c5ad] text-center">
          {pixelText(isVi ? 'Chạm nhân vật hoặc chọn hoạt động bên dưới' : 'Tap the character or choose an activity below')}
        </span>
      </div>

      <div className="mt-3 border border-[#5a3696] bg-[#120a21] p-2">
        <p className="text-[10px] font-bold text-[#45b7d1] mb-2"><PixelIcon name="gamepad" /> {isVi ? 'CHƠI CÙNG NHÂN VẬT' : 'PLAY WITH ME'}</p>
        <div className="grid grid-cols-2 gap-1.5">
          {INTERACTIONS.map(item => <button key={item.id} type="button" onClick={() => {
            setAutoPlay(false);
            setActivityIndex(ACTIVITIES.findIndex(activity => activity.id === item.id));
            setReaction({ vi: item.replyVi, en: item.replyEn });
          }} className="border border-[#5a3696] hover:border-[#f6c833] focus-visible:outline-2 focus-visible:outline-[#f6c833] bg-[#2e263f] text-[#f3eeff] p-2 text-[10px] text-left">
            <PixelIcon name={item.icon} className="text-[#f6c833]" /> {isVi ? item.vi : item.en}
          </button>)}
        </div>
        <p role="status" aria-live="polite" className="mt-2 border-l-2 border-[#f6c833] pl-2 text-[11px] leading-relaxed text-[#eaddff]">
          {reaction ? (isVi ? reaction.vi : reaction.en) : (isVi ? 'Mời t một ly cà phê, hay cùng t mở laptop nào?' : 'A coffee together, or shall we open the laptop?')}
        </p>
      </div>
      <details className="mt-3">
      <summary className="text-[10px] text-[#d1c5ad] cursor-pointer">{isVi ? 'Chọn cả 9 hoạt động' : 'Choose from all 9 activities'}</summary>
      <div className="grid grid-cols-2 gap-1.5 mt-3" role="group" aria-label={isVi ? 'Chọn hoạt động' : 'Choose activity'}>
        {pixelText(ACTIVITIES.map((item, index) => <button key={item.id} type="button" aria-pressed={activityIndex === index} onClick={() => {
        setAutoPlay(false);
        setActivityIndex(index);
        setReaction(null);
      }} className={'min-w-0 py-2 px-1 border font-bold text-[10px] cursor-pointer focus-visible:outline-2 focus-visible:outline-[#f6c833] ' + (activityIndex === index ? 'bg-[#f6c833] border-[#f6c833] text-[#120a21]' : 'bg-[#2e263f] border-[#5a3696] text-[#f3eeff] hover:border-[#f6c833]')} title={isVi ? item.vi : item.en}>
            <span className="block truncate"><PixelIcon name={item.icon} /> {pixelText(isVi ? item.vi : item.en)}</span>
          </button>))}
      </div>

      </details>
      <button type="button" aria-pressed={autoPlay} onClick={() => { setAutoPlay(value => !value); setReaction(null); }} className="mt-3 w-full py-2 border border-[#5a3696] bg-[#120a21] text-[#45b7d1] font-bold text-[10px] cursor-pointer hover:border-[#45b7d1]">
        {pixelText(isVi ? 'TỰ ĐỔI HOẠT ĐỘNG: ' + (autoPlay ? 'BẬT' : 'TẮT') : 'AUTO CHANGE: ' + (autoPlay ? 'ON' : 'OFF'))}
      </button>
    </div>;
};
