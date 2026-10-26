import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { getStoredAdminToken } from '../utils/portfolioApi';
import { PixelIcon } from './PixelIcon';

type Diary = { mood: string; note: string; learning: string; song: string; updatedAt?: number };
const MOODS = [
  { id: 'sparkles', vi: 'Đầy cảm hứng', en: 'Inspired' },
  { id: 'coffee', vi: 'Cần cà phê', en: 'Need coffee' },
  { id: 'computer', vi: 'Đang tập trung', en: 'Focused' },
  { id: 'moon', vi: 'Muốn nghỉ ngơi', en: 'Resting' },
  { id: 'heart', vi: 'Vui vẻ', en: 'Happy' },
  { id: 'confetti', vi: 'Có chuyện vui', en: 'Celebrating' },
];
const EMPTY: Diary = { mood: 'sparkles', note: '', learning: '', song: '' };
const fieldClass = 'w-full min-w-0 bg-[#120a21] border-2 border-[#5a3696] focus:border-[#f6c833] p-2 text-xs text-[#f3eeff] outline-none';
export function MiniDiary() {
  const { isAdmin } = useAuth();
  const { isVi } = useLanguage();
  const [diary, setDiary] = useState<Diary | null>(null);
  const [draft, setDraft] = useState<Diary>(EMPTY);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [notice, setNotice] = useState('');
  const revision = useRef(0);
  useEffect(() => {
    let active = true;
    let pending = false;
    const refresh = async () => {
      if (pending || document.hidden) return;
      pending = true;
      const version = revision.current;
      try {
        const res = await fetch('/api/diary', { cache: 'no-store' });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error();
        if (active && version === revision.current) { setDiary(data.diary); setLoaded(true); setNotice(''); }
      } catch {
        if (active && version === revision.current) setNotice(isVi ? 'Chưa tải được nhật ký. Thử tải lại nhé.' : 'Could not load the diary. Please refresh.');
      } finally { pending = false; }
    };
    void refresh();
    const timer = window.setInterval(refresh, 30000);
    window.addEventListener('focus', refresh);
    return () => { active = false; window.clearInterval(timer); window.removeEventListener('focus', refresh); };
  }, [isVi]);
  useEffect(() => { if (!isAdmin) setEditing(false); }, [isAdmin]);
  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (saving) return;
    revision.current++;
    setSaving(true); setNotice('');
    try {
      const res = await fetch('/api/diary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-token': getStoredAdminToken() || '' },
        body: JSON.stringify(draft),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || (isVi ? 'Chưa lưu được nhật ký.' : 'Could not save diary.'));
      revision.current++;
      setDiary(data.diary); setLoaded(true); setEditing(false);
      setNotice(isVi ? 'Đã đăng! Mọi người đều xem được cập nhật này.' : 'Published! Everyone can see this update.');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : (isVi ? 'Lỗi kết nối. Vui lòng thử lại.' : 'Connection failed. Please retry.'));
    } finally { setSaving(false); }
  };
  const mood = MOODS.find(item => item.id === diary?.mood) || MOODS[0];
  return <section aria-label={isVi ? 'Nhật ký mini' : 'Mini diary'} className="mt-4 w-full min-w-0 border-[3px] border-[#5a3696] bg-[#231b34] p-3 pixel-box-sm font-['Space_Mono']">
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#5a3696] pb-2">
      <h3 className="text-xs text-[#f6c833] font-bold"><PixelIcon name="book" /> {isVi ? 'HÔM NAY PHƯƠNG ANH…' : 'TODAY, PHUONG ANH…'}</h3>
      {isAdmin && !editing && <button type="button" disabled={!loaded} onClick={() => { setDraft(diary || EMPTY); setEditing(true); setNotice(''); }} className="text-[10px] text-[#45b7d1] border border-[#45b7d1] px-2 py-1 disabled:opacity-40"><PixelIcon name="edit" /> {isVi ? 'Cập nhật' : 'Edit'}</button>}
    </div>
    {editing && isAdmin ? <form onSubmit={save} className="mt-3 space-y-3">
      <fieldset disabled={saving} className="space-y-3 disabled:opacity-60">
        <legend className="text-[10px] text-[#d1c5ad] mb-2">{isVi ? 'Tâm trạng hôm nay' : "Today's mood"}</legend>
        <div className="grid grid-cols-2 gap-1">
          {MOODS.map(item => <button key={item.id} type="button" aria-pressed={draft.mood === item.id} onClick={() => setDraft(value => ({ ...value, mood: item.id }))} className={'border p-2 text-[10px] text-left ' + (draft.mood === item.id ? 'border-[#f6c833] bg-[#f6c833] text-[#120a21]' : 'border-[#5a3696] text-[#eaddff]')}><PixelIcon name={item.id} /> {isVi ? item.vi : item.en}</button>)}
        </div>
        <label className="block text-[10px] text-[#d1c5ad]">{isVi ? 'Một chút chia sẻ' : 'A little update'}
          <textarea maxLength={500} rows={3} value={draft.note} onChange={e => setDraft(value => ({ ...value, note: e.target.value }))} className={fieldClass + ' mt-1 resize-y'} />
          <span className="block text-right">{draft.note.length}/500</span>
        </label>
        <label className="block text-[10px] text-[#d1c5ad]">{isVi ? 'Đang học / khám phá' : 'Learning / exploring'}
          <input maxLength={120} value={draft.learning} onChange={e => setDraft(value => ({ ...value, learning: e.target.value }))} className={fieldClass + ' mt-1'} />
        </label>
        <label className="block text-[10px] text-[#d1c5ad]">{isVi ? 'Bài đang nghe' : 'On repeat'}
          <input maxLength={120} value={draft.song} onChange={e => setDraft(value => ({ ...value, song: e.target.value }))} className={fieldClass + ' mt-1'} />
        </label>
        <p className="text-[10px] text-[#45b7d1]">{isVi ? 'Nội dung được đăng công khai trên web.' : 'This update will be public on the website.'}</p>
        <div className="flex gap-2">
          <button type="submit" className="border border-black bg-[#f6c833] text-[#120a21] px-3 py-2 text-xs font-bold"><PixelIcon name="save" /> {saving ? (isVi ? 'Đang đăng…' : 'Publishing…') : (isVi ? 'Đăng cập nhật' : 'Publish')}</button>
          <button type="button" onClick={() => setEditing(false)} className="border border-[#5a3696] text-[#eaddff] px-3 py-2 text-xs">{isVi ? 'Hủy' : 'Cancel'}</button>
        </div>
      </fieldset>
    </form> : <div className="mt-3 space-y-3 text-xs text-[#eaddff] break-words">
      {!loaded ? <p className="text-[#d1c5ad] text-[11px]">{isVi ? 'Đang mở trang nhật ký…' : 'Opening the diary…'}</p>
        : !diary ? <p className="text-[#d1c5ad] text-[11px]">{isVi ? 'Trang nhật ký đang chờ câu chuyện đầu tiên.' : 'Waiting for the first little story.'}</p>
        : <>
          <p className="text-[#f6c833]"><PixelIcon name={mood.id} /> {isVi ? mood.vi : mood.en}</p>
          {diary.note && <p className="whitespace-pre-wrap leading-relaxed">{diary.note}</p>}
          {diary.learning && <p><PixelIcon name="book" className="text-[#45b7d1]" /> <span className="text-[#d1c5ad]">{isVi ? 'Đang khám phá: ' : 'Exploring: '}</span>{diary.learning}</p>}
          {diary.song && <p><PixelIcon name="music" className="text-[#ec4899]" /> <span className="text-[#d1c5ad]">{isVi ? 'Đang nghe: ' : 'Listening: '}</span>{diary.song}</p>}
          {diary.updatedAt && <time dateTime={new Date(diary.updatedAt).toISOString()} className="block text-[9px] text-[#d1c5ad]">{new Intl.DateTimeFormat(isVi ? 'vi-VN' : 'en-GB', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Ho_Chi_Minh' }).format(diary.updatedAt)}</time>}
        </>}
    </div>}
    {notice && <p role="status" aria-live="polite" className="mt-3 text-[11px] text-[#45b7d1]">{notice}</p>}
  </section>;
}
