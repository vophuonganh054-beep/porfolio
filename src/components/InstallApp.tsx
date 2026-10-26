import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
type InstallEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }> };
export function InstallApp() {
  const { isVi } = useLanguage();
  const [prompt, setPrompt] = useState<InstallEvent | null>(null);
  const [installed, setInstalled] = useState(() => window.matchMedia('(display-mode: standalone)').matches);
  const [help, setHelp] = useState(false);
  useEffect(() => {
    const ready = (event: Event) => { event.preventDefault(); setPrompt(event as InstallEvent); };
    const done = () => { setInstalled(true); setPrompt(null); setHelp(false); };
    window.addEventListener('beforeinstallprompt', ready);
    window.addEventListener('appinstalled', done);
    return () => { window.removeEventListener('beforeinstallprompt', ready); window.removeEventListener('appinstalled', done); };
  }, []);
  if (installed) return null;
  const install = async () => {
    if (!prompt) { setHelp(value => !value); return; }
    try {
      await prompt.prompt();
      const result = await prompt.userChoice;
      if (result.outcome === 'accepted') setHelp(false);
    } catch { setHelp(true); }
    finally { setPrompt(null); }
  };
  return <div className="mb-4 text-[11px]">
    <div className="flex flex-wrap items-center justify-end gap-2">
      <span className="text-[#d1c5ad]">{isVi ? 'Mang MY WORLD ra màn hình máy tính' : 'Bring MY WORLD to your desktop'}</span>
      <button type="button" onClick={install} className="border-2 border-[#f6c833] text-[#f6c833] bg-[#231b34] px-3 py-2 font-bold"><span aria-hidden="true" className="material-symbols-outlined text-sm align-middle">install_desktop</span> {isVi ? 'Cài ứng dụng' : 'Install app'}</button>
    </div>
    {help && <div role="status" className="mt-2 border border-[#5a3696] bg-[#191127] p-3 text-[#eaddff] leading-6">
      <p>{isVi ? 'Trên Chrome máy tính: bấm ⋮ → Truyền, lưu và chia sẻ → Cài đặt trang dưới dạng ứng dụng → Cài đặt.' : 'In desktop Chrome: ⋮ → Cast, save and share → Install page as app → Install.'}</p>
      <p className="text-[#a798c4]">{isVi ? 'App mở bằng cửa sổ riêng và cần kết nối mạng. Nếu menu chưa hiện, tải lại trang sau vài giây.' : 'The app opens in its own window and needs internet. If the option is missing, reload after a few seconds.'}</p>
    </div>}
  </div>;
}
