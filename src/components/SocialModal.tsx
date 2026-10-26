import { PixelIcon, pixelText } from "./PixelIcon";
import React, { useEffect } from 'react';
import { SOCIAL_LINKS } from '../data/portfolioData';
import { spawnPixelBurst } from '../utils/fx';
import { useLanguage } from '../context/LanguageContext';
import { TRANSLATIONS } from '../utils/translations';
interface SocialModalProps {
  isOpen: boolean;
  onClose: () => void;
}
export const SocialModal: React.FC<SocialModalProps> = ({
  isOpen,
  onClose
}) => {
  const {
    language,
    isVi
  } = useLanguage();
  const t = TRANSLATIONS[language].social;
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);
  if (!isOpen) return null;
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  const handleLinkClick = (e: React.MouseEvent) => {
    spawnPixelBurst(e.clientX, e.clientY, 8);
  };
  return <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" onClick={handleOverlayClick}>
      <div role="dialog" aria-labelledby="modalTitle" aria-modal="true" className="w-full max-w-lg bg-[#1f1730]/98 border-[4px] border-[#f6c833] shadow-[10px_10px_0px_#0a0514] pixel-box-lg relative overflow-hidden modal-enter-active">
        {/* Retro Window Top Header Bar */}
        <div className="bg-[#39304a] border-b-[3px] border-[#f6c833] px-4 py-2.5 flex items-center justify-between select-none">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-[#ef4444] border border-black inline-block animate-pulse" />
            <span className="w-3 h-3 bg-[#f6c833] border border-black inline-block" />
            <span className="w-3 h-3 bg-[#26c281] border border-black inline-block" />
            <span className="font-['Space_Mono'] text-xs text-[#f6c833] font-extrabold uppercase tracking-wider ml-1" id="modalTitle">
              COMMUNICATION_LINK.EXE
            </span>
          </div>
          <button type="button" onClick={onClose} className="w-8 h-8 bg-[#ef4444] hover:bg-red-600 text-white font-bold flex items-center justify-center border-[2px] border-black shadow-[2px_2px_0px_#0a0514] active:translate-x-0.5 active:translate-y-0.5 transition-transform text-sm cursor-pointer" title="Đóng (ESC)">{pixelText("✕")}</button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Title Banner */}
          <div className="text-center space-y-2 border-b-2 border-dashed border-[#5a3696]/80 pb-4">
            <div className="inline-flex items-center gap-2 bg-[#231b34] border-2 border-[#5a3696] px-3 py-1 text-[#f6c833] font-['Space_Mono'] text-xs font-bold shadow-[2px_2px_0px_#0a0514]">
              <span>{pixelText(t.badge)}</span>
              <span>•</span>
              <span className="text-[#26c281]">{pixelText(t.status)}</span>
            </div>
            <h3 className="text-xl md:text-2xl font-['Space_Grotesk'] text-[#f6c833] arcade-title-shadow uppercase font-extrabold">
              {pixelText(t.title)}
            </h3>
            <p className="text-xs text-[#f3eeff] font-['Space_Mono'] max-w-sm mx-auto">
              {pixelText(t.desc)}
            </p>
          </div>

          {/* 3 Rich Social Links */}
          <div className="space-y-3">
            {pixelText(SOCIAL_LINKS.map(link => {
            const btnLabel = isVi ? link.btnText : link.type === 'telegram' ? t.chatNow : t.visit;
            return <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" onClick={handleLinkClick} className="group bg-[#231b34] hover:bg-[#2e263f] border-[3px] border-[#5a3696] p-3.5 pixel-btn-action flex items-center justify-between transition-all duration-150 block text-decoration-none">
                  <div className="flex items-center gap-3.5">
                    {/* Icon Logo */}
                    {pixelText(link.type === 'instagram' && <div className="w-12 h-12 rounded-none bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] border-[2px] border-black flex items-center justify-center shadow-[3px_3px_0px_#0a0514] group-hover:scale-110 group-hover:rotate-3 transition-transform shrink-0">
                        <PixelIcon name="instagram" className="w-7 h-7 text-white" />
                      </div>)}
                    {pixelText(link.type === 'facebook' && <div className="w-12 h-12 rounded-none bg-[#1877f2] border-[2px] border-black flex items-center justify-center shadow-[3px_3px_0px_#0a0514] group-hover:scale-110 group-hover:rotate-3 transition-transform shrink-0">
                        <PixelIcon name="facebook" className="w-7 h-7 text-white" />
                      </div>)}
                    {pixelText(link.type === 'telegram' && <div className="w-12 h-12 rounded-none bg-[#229ed9] border-[2px] border-black flex items-center justify-center shadow-[3px_3px_0px_#0a0514] group-hover:scale-110 group-hover:rotate-3 transition-transform shrink-0">
                        <PixelIcon name="telegram" className="w-7 h-7 text-white" />
                      </div>)}

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-['Space_Grotesk'] text-sm text-[#f6c833] font-bold">
                          {pixelText(link.name)}
                        </h4>
                        <span className={`text-[9px] font-['Space_Mono'] ${link.badgeBg} px-1.5 py-0.2 font-bold uppercase`}>
                          {pixelText(link.subtitle)}
                        </span>
                      </div>
                      <p className="font-['Space_Mono'] text-xs text-[#f3eeff]">{pixelText(link.handle)}</p>
                    </div>
                  </div>

                  <span className={`inline-flex items-center gap-1.5 ${link.btnBg} text-white font-['Space_Mono'] text-xs font-extrabold px-3.5 py-1.5 border-2 border-black shadow-[3px_3px_0px_#0a0514] group-hover:scale-105 group-hover:brightness-110 transition-all uppercase tracking-wider shrink-0`}>
                    <span>{pixelText(btnLabel)}</span>
                    <PixelIcon className="text-[14px]">north_east</PixelIcon>
                  </span>
                </a>;
          }))}
          </div>

          {/* Modal Footer */}
          <div className="pt-3 border-t-2 border-[#5a3696] flex items-center justify-between text-xs font-['Space_Mono']">
            <span className="text-[#d1c5ad] flex items-center gap-1 font-bold">
              <PixelIcon className="text-[#f6c833] text-[15px]">info</PixelIcon>
              {pixelText(t.newTabInfo)}
            </span>
            <button type="button" onClick={onClose} className="bg-[#2e263f] hover:bg-[#39304a] text-[#f6c833] px-3 py-1.5 border border-[#5a3696] font-bold uppercase pixel-btn-action text-[10px]">
              {pixelText(t.closeBtn)}
            </button>
          </div>
        </div>
      </div>
    </div>;
};
