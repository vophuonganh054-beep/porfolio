import React, { useEffect, useReducer, useRef, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { SectionTab } from '../types';
import { ACHIEVEMENTS, advanceJourney, cleanJourney, EMPTY_JOURNEY, JOURNEY_KEY, Journey, STAR_SECTIONS, WORLD_SECTIONS } from '../utils/visitorJourney';

const NAMES: Record<SectionTab, { vi: string; en: string }> = {
  overview: { vi: 'Trang chủ', en: 'Home' }, skills: { vi: 'Kỹ năng', en: 'Skills' },
  questbook: { vi: 'Questbook', en: 'Questbook' }, hobbies: { vi: 'Sở thích', en: 'Hobbies' },
  polaroid: { vi: 'Bảng ghim', en: 'Pinboard' }, contact: { vi: 'Liên hệ', en: 'Contact' },
};
export function useVisitorJourney(activeSection: SectionTab) {
  const [progress, dispatch] = useReducer(advanceJourney, EMPTY_JOURNEY, () => {
    try { return cleanJourney(JSON.parse(localStorage.getItem(JOURNEY_KEY) || 'null')); }
    catch { return EMPTY_JOURNEY; }
  });
  const [saved, setSaved] = useState(true);
  useEffect(() => { dispatch({ type: 'visit', section: activeSection }); }, [activeSection]);
  useEffect(() => {
    try { localStorage.setItem(JOURNEY_KEY, JSON.stringify(progress)); setSaved(true); }
    catch { setSaved(false); }
  }, [progress]);
  return { progress, dispatch, saved };
}
type JourneyControl = ReturnType<typeof useVisitorJourney>;
function Icon({ children, className = '' }: { children: string; className?: string }) {
  return <span aria-hidden="true" className={'material-symbols-outlined align-middle ' + className}>{children}</span>;
}
export function VisitorJourney({ journey, onNavigate }: { journey: JourneyControl; onNavigate: (section: SectionTab) => void }) {
  const { isVi } = useLanguage();
  const { progress, dispatch, saved } = journey;
  const [toast, setToast] = useState<string[]>([]);
  const previous = useRef(new Set(ACHIEVEMENTS.filter(item => item.unlocked(progress)).map(item => item.id)));
  const dialog = useRef<HTMLDialogElement>(null);
  const unlocked = ACHIEVEMENTS.filter(item => item.unlocked(progress));
  const ready = progress.stars.length === STAR_SECTIONS.length;
  useEffect(() => {
    const fresh = ACHIEVEMENTS.filter(item => item.unlocked(progress) && !previous.current.has(item.id));
    previous.current = new Set(ACHIEVEMENTS.filter(item => item.unlocked(progress)).map(item => item.id));
    if (fresh.length) setToast(fresh.map(item => item.id));
  }, [progress]);
  useEffect(() => {
    if (!toast.length) return;
    const timer = window.setTimeout(() => setToast([]), 5500);
    return () => window.clearTimeout(timer);
  }, [toast]);
  const openChest = () => {
    if (!ready) return;
    dispatch({ type: 'open' });
    dialog.current?.showModal();
  };
  return <section aria-label={isVi ? 'Hành trình của khách' : 'Visitor journey'} className="mb-6 border-[3px] border-[#5a3696] bg-[#191127]/95 p-3 sm:p-4 pixel-box-sm">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="min-w-0">
        <h2 className="text-sm text-[#f6c833] font-bold"><Icon className="text-lg">military_tech</Icon> {isVi ? 'HÀNH TRÌNH CỦA BẠN' : 'YOUR LITTLE ADVENTURE'}</h2>
        <p className="mt-1 text-[10px] text-[#d1c5ad]">{isVi ? 'Khám phá, gom sao và mở một điều bí mật.' : 'Explore, collect stars, and uncover a little secret.'}</p>
      </div>
      <div className="flex flex-wrap items-center gap-2 text-[11px]">
        <span className="border border-[#5a3696] px-2 py-1 text-[#45b7d1]"><Icon>military_tech</Icon> {unlocked.length}/6</span>
        <span className="border border-[#5a3696] px-2 py-1 text-[#f6c833]"><Icon>star</Icon> {progress.stars.length}/5</span>
        <button type="button" onClick={openChest} disabled={!ready}
          className="border-2 border-[#f6c833] bg-[#f6c833] text-[#120a21] disabled:bg-[#2e263f] disabled:border-[#5a3696] disabled:text-[#a798c4] px-3 py-2 font-bold focus-visible:outline-2 focus-visible:outline-white">
          <Icon>{ready ? 'redeem' : 'lock'}</Icon> {isVi ? (progress.opened ? 'Đọc lại thư' : ready ? 'Mở rương bí mật' : 'Rương bí mật · ' + progress.stars.length + '/5') : (progress.opened ? 'Read letter again' : ready ? 'Open secret chest' : 'Secret chest · ' + progress.stars.length + '/5')}
        </button>
      </div>
    </div>
    <details className="mt-3 border-t border-[#5a3696] pt-2">
      <summary className="cursor-pointer text-[11px] font-bold text-[#45b7d1] py-1">{isVi ? 'Xem thành tựu & gợi ý tìm sao' : 'Achievements & star hints'}</summary>
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {ACHIEVEMENTS.map(item => {
          const achieved = item.unlocked(progress);
          return <div key={item.id} className={'border-2 p-3 ' + (achieved ? 'border-[#f6c833]/70 bg-[#f6c833]/10' : 'border-[#5a3696] bg-[#120a21]')}>
            <div className={'flex items-center gap-2 text-xs font-bold ' + (achieved ? 'text-[#f6c833]' : 'text-[#a798c4]')}>
              <Icon className="text-xl">{achieved ? item.icon : 'lock'}</Icon><span>{isVi ? item.vi : item.en}</span>
            </div>
            <p className="mt-1 text-[10px] text-[#d1c5ad]">{isVi ? item.descVi : item.descEn}</p>
            <p className={'mt-2 text-[9px] ' + (achieved ? 'text-[#26c281]' : 'text-[#a798c4]')}>{achieved ? (isVi ? 'ĐÃ MỞ KHÓA' : 'UNLOCKED') : (isVi ? 'CHƯA MỞ KHÓA' : 'LOCKED')}</p>
          </div>;
        })}
      </div>
      <p className="mt-3 text-[11px] text-[#eaddff]">{isVi ? 'Mỗi mục bên dưới có một ngôi sao nhỏ. Lướt tới cuối mục và chạm vào sao để nhặt.' : 'Each section below holds a little star. Scroll to the end and tap it to collect.'}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {STAR_SECTIONS.map(section => <button type="button" key={section} onClick={() => onNavigate(section)} className="border border-[#5a3696] hover:border-[#f6c833] bg-[#231b34] px-2 py-1.5 text-[10px] text-[#eaddff]">
          <Icon>{progress.stars.includes(section) ? 'check_circle' : 'search'}</Icon> {isVi ? NAMES[section].vi : NAMES[section].en}
        </button>)}
      </div>
      <p className="mt-3 text-[10px] text-[#d1c5ad]">{isVi ? 'Đã khám phá: ' : 'Explored: '}{progress.visited.length}/{WORLD_SECTIONS.length} · {saved ? (isVi ? 'Tiến độ lưu trên trình duyệt này, không cần tài khoản.' : 'Progress saved in this browser. No account needed.') : (isVi ? 'Trình duyệt không cho lưu. Tiến độ chỉ giữ trong lần mở này.' : 'Storage unavailable. Progress lasts for this visit only.')}</p>
    </details>
    {toast.length > 0 && <aside role="status" aria-live="polite" className="fixed bottom-4 right-4 left-4 sm:left-auto sm:w-80 z-[80] border-[3px] border-[#f6c833] bg-[#231b34] p-3 shadow-[4px_4px_0px_#0a0514]">
      <div className="flex justify-between items-start gap-3"><div>
        <p className="text-[10px] text-[#26c281] font-bold">{isVi ? 'THÀNH TỰU MỚI!' : 'ACHIEVEMENT UNLOCKED!'}</p>
        {ACHIEVEMENTS.filter(item => toast.includes(item.id)).map(item => <p key={item.id} className="mt-1 text-xs text-[#f6c833]"><Icon>{item.icon}</Icon> {isVi ? item.vi : item.en}</p>)}
      </div><button type="button" onClick={() => setToast([])} aria-label={isVi ? 'Đóng thông báo' : 'Close notification'} className="text-[#eaddff] p-1"><Icon>close</Icon></button></div>
    </aside>}
    <dialog ref={dialog} aria-labelledby="secret-letter-title" className="m-auto w-[calc(100%_-_2rem)] max-w-lg max-h-[85dvh] overflow-y-auto border-[4px] border-[#f6c833] bg-[#231b34] p-5 sm:p-7 text-[#eaddff] shadow-[8px_8px_0px_#0a0514] backdrop:bg-black/80">
      <div className="flex items-start justify-between gap-3">
        <div><p className="text-[10px] text-[#26c281] font-bold">{isVi ? 'RƯƠNG BÍ MẬT ĐÃ MỞ' : 'SECRET CHEST UNLOCKED'}</p>
        <h2 id="secret-letter-title" className="text-xl font-bold text-[#f6c833] mt-2"><Icon>mail</Icon> {isVi ? 'Gửi người gom ánh sao' : 'To the stargatherer'}</h2></div>
        <button type="button" onClick={() => dialog.current?.close()} aria-label={isVi ? 'Đóng thư' : 'Close letter'} className="border border-[#5a3696] p-1"><Icon>close</Icon></button>
      </div>
      <div className="mt-5 border border-[#5a3696] bg-[#120a21] p-4 text-sm leading-7 space-y-4">
        <p>{isVi ? 'Bạn đã tìm thấy đủ 5 ngôi sao rồi!' : 'You found all 5 stars!'}</p>
        <p>{isVi ? 'Cảm ơn bạn đã dành thời gian ghé qua từng góc nhỏ của MY WORLD. Mong rằng chuyến khám phá này đã mang đến cho bạn một chút niềm vui.' : 'Thank you for taking the time to explore every little corner of MY WORLD. I hope this adventure brought you a little joy.'}</p>
        <p className="text-[#f6c833]">{isVi ? 'Một bước nhỏ cũng là một bước tiến. Hãy giữ lại một chút tò mò, một chút can đảm và tiếp tục viết câu chuyện của riêng mình nhé.' : 'A small step is still a step forward. Keep a little curiosity, a little courage, and keep writing your own story.'}</p>
        <p className="text-[#d1c5ad]">— MY WORLD</p>
      </div>
      <div className="mt-4 border-2 border-dashed border-[#f6c833] p-3 text-center">
        <Icon className="text-3xl text-[#f6c833]">workspace_premium</Icon>
        <p className="text-xs font-bold text-[#f6c833] mt-1">{isVi ? 'NGƯỜI GOM ÁNH SAO' : 'STARGATHERER'}</p>
        <p className="text-[10px] mt-1 text-[#d1c5ad]">{isVi ? 'Kỷ niệm chuyến khám phá của bạn' : 'A keepsake from your adventure'}</p>
      </div>
      <button type="button" onClick={() => dialog.current?.close()} className="mt-5 w-full border-2 border-black bg-[#f6c833] p-3 text-xs text-[#120a21] font-bold">{isVi ? 'Cất thư & tiếp tục khám phá' : 'Keep the letter & keep exploring'}</button>
    </dialog>
  </section>;
}
const STAR_NOTES: Record<string, { vi: string; en: string }> = {
  skills: { vi: 'Một tia sáng giữa những kỹ năng…', en: 'A little sparkle among the skills…' },
  questbook: { vi: 'Phần thưởng nhỏ sau trang nhiệm vụ…', en: 'A little reward after the quests…' },
  hobbies: { vi: 'Có ngôi sao đang chill ở đây…', en: 'A star is chilling here…' },
  polaroid: { vi: 'Một vì sao rơi giữa những kỷ niệm…', en: 'A star tucked among the memories…' },
  contact: { vi: 'Lá thư mang theo một ánh sao…', en: 'A letter carrying a little starlight…' },
};
export function HiddenStar({ section, journey }: { section: SectionTab; journey: JourneyControl }) {
  const { isVi } = useLanguage();
  if (!STAR_SECTIONS.includes(section)) return null;
  const collected = journey.progress.stars.includes(section);
  return <div className={'mt-8 mb-3 flex ' + (section === 'questbook' || section === 'polaroid' ? 'justify-start' : 'justify-end')}>
    <div className="flex items-center gap-2 border border-dashed border-[#5a3696] bg-[#191127]/90 px-3 py-2 max-w-full">
      <p className="text-[10px] text-[#a798c4]">{collected ? (isVi ? 'Ngôi sao đã nằm trong túi của bạn.' : 'This star is in your pocket.') : (isVi ? STAR_NOTES[section].vi : STAR_NOTES[section].en)}</p>
      <button type="button" disabled={collected} onClick={() => journey.dispatch({ type: 'star', section })}
        aria-label={isVi ? (collected ? 'Đã nhặt sao tại ' : 'Nhặt ngôi sao tại ') + NAMES[section].vi : (collected ? 'Star collected in ' : 'Collect star in ') + NAMES[section].en}
        className="shrink-0 w-11 h-11 border-2 border-[#f6c833] bg-[#f6c833]/10 text-[#f6c833] hover:bg-[#f6c833] hover:text-[#120a21] focus-visible:outline-2 focus-visible:outline-white disabled:border-[#5a3696] disabled:text-[#26c281] disabled:bg-[#231b34]">
        <Icon className="text-2xl">{collected ? 'check' : 'star'}</Icon>
      </button>
    </div>
  </div>;
}
