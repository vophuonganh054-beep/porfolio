import { PixelIcon, pixelText } from "./PixelIcon";
import React, { useState } from 'react';
import { spawnPixelBurst } from '../utils/fx';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { TRANSLATIONS } from '../utils/translations';
import { SectionTab } from '../types';
interface TopNavProps {
  onOpenContact: (e?: React.MouseEvent) => void;
  activeSection?: SectionTab;
  onSelectSection?: (section: SectionTab) => void;
}
export const TopNav: React.FC<TopNavProps> = ({
  onOpenContact,
  activeSection = 'overview',
  onSelectSection
}) => {
  const {
    isAdmin,
    openLoginModal,
    openPasswordModal,
    openMessagesModal,
    logout
  } = useAuth();
  const {
    language,
    toggleLanguage,
    isVi
  } = useLanguage();
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const t = TRANSLATIONS[language].nav;
  const handleGoToSpotify = (e: React.MouseEvent) => {
    onSelectSection?.('hobbies');
    spawnPixelBurst(e.clientX, e.clientY, 8);
  };
  const handleToggleLanguage = (e: React.MouseEvent) => {
    toggleLanguage();
    spawnPixelBurst(e.clientX, e.clientY, 10);
  };
  return <header className="bg-[#1f1730]/95 backdrop-blur-md border-b-[3px] border-[#5a3696] shadow-[0px_4px_0px_#0a0514] sticky top-0 z-50">
      <div className="w-full px-4 sm:px-6 py-2.5 max-w-[1200px] mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <button type="button" onClick={() => onSelectSection?.('overview')} className="flex items-center gap-2.5 group cursor-pointer text-left">
          <div className="w-9 h-9 bg-[#120a21] border-[2px] border-[#f6c833] shadow-[2px_2px_0px_#0a0514] flex items-center justify-center p-1 group-hover:rotate-6 transition-transform overflow-hidden">
            <img src="/favicon.svg" alt="Logo MY WORLD" className="w-full h-full object-contain" />
          </div>
          <span className="text-lg font-['Space_Grotesk'] font-extrabold text-[#f6c833] arcade-glow-gold tracking-wider">
            MY WORLD
          </span>
        </button>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-4 lg:gap-6">
          <button type="button" onClick={() => onSelectSection?.('overview')} className={`font-['Space_Mono'] text-xs py-1 uppercase font-bold cursor-pointer transition-all duration-150 relative ${activeSection === 'overview' ? 'text-[#f6c833] border-b-[3px] border-[#f6c833] shadow-[0px_2px_0px_rgba(246,200,51,0.3)]' : 'text-[#d1c5ad] hover:text-[#f6c833] hover:border-b-[2px] hover:border-[#f6c833]/50'}`}>
            {pixelText(t.home)}
          </button>
          <button type="button" onClick={() => onSelectSection?.('skills')} className={`font-['Space_Mono'] text-xs py-1 uppercase font-bold cursor-pointer transition-all duration-150 relative ${activeSection === 'skills' ? 'text-[#f6c833] border-b-[3px] border-[#f6c833] shadow-[0px_2px_0px_rgba(246,200,51,0.3)]' : 'text-[#d1c5ad] hover:text-[#f6c833] hover:border-b-[2px] hover:border-[#f6c833]/50'}`}>
            {pixelText(t.skills)}
          </button>
          <button type="button" onClick={() => onSelectSection?.('questbook')} className={`font-['Space_Mono'] text-xs py-1 uppercase font-bold cursor-pointer transition-all duration-150 relative ${activeSection === 'questbook' ? 'text-[#f6c833] border-b-[3px] border-[#f6c833] shadow-[0px_2px_0px_rgba(246,200,51,0.3)]' : 'text-[#d1c5ad] hover:text-[#f6c833] hover:border-b-[2px] hover:border-[#f6c833]/50'}`}>
            {pixelText(t.questbook)}
          </button>
          <button type="button" onClick={() => onSelectSection?.('hobbies')} className={`font-['Space_Mono'] text-xs py-1 uppercase font-bold cursor-pointer transition-all duration-150 relative ${activeSection === 'hobbies' ? 'text-[#f6c833] border-b-[3px] border-[#f6c833] shadow-[0px_2px_0px_rgba(246,200,51,0.3)]' : 'text-[#d1c5ad] hover:text-[#f6c833] hover:border-b-[2px] hover:border-[#f6c833]/50'}`}>
            {pixelText(t.hobbies)}
          </button>
          <button type="button" onClick={() => onSelectSection?.('polaroid')} className={`font-['Space_Mono'] text-xs py-1 uppercase font-bold cursor-pointer transition-all duration-150 relative ${activeSection === 'polaroid' ? 'text-[#f6c833] border-b-[3px] border-[#f6c833] shadow-[0px_2px_0px_rgba(246,200,51,0.3)]' : 'text-[#d1c5ad] hover:text-[#f6c833] hover:border-b-[2px] hover:border-[#f6c833]/50'}`}>
            {pixelText(t.polaroid || (isVi ? 'BẢNG GHIM' : 'PINBOARD'))}
          </button>
          <button type="button" className={`font-['Space_Mono'] text-xs py-1 uppercase font-bold flex items-center gap-1 cursor-pointer transition-all duration-150 relative ${activeSection === 'contact' ? 'text-[#f6c833] border-b-[3px] border-[#f6c833] shadow-[0px_2px_0px_rgba(246,200,51,0.3)]' : 'text-[#45b7d1] hover:text-[#f6c833] hover:border-b-[2px] hover:border-[#f6c833]/50'}`} onClick={() => onSelectSection?.('contact')}>
            {pixelText(t.contact)}
          </button>
        </nav>

        {/* Trailing Action Clusters */}
        <div className="flex items-center gap-2 md:gap-2.5">
          {/* Language Switcher (VI / EN) */}
          <button type="button" onClick={handleToggleLanguage} className="h-8 md:h-9 px-2 md:px-2.5 bg-[#120a21] hover:bg-[#2e263f] text-[#f6c833] border-[2px] border-[#f6c833] flex items-center gap-1 shadow-[2px_2px_0px_#0a0514] font-['Space_Mono'] text-[11px] font-bold cursor-pointer transition-all hover:scale-105 active:translate-x-[1px] active:translate-y-[1px]" title={t.langToggleTooltip}>
            <span className="text-xs leading-none">{pixelText(isVi ? '🇻🇳' : '🇬🇧')}</span>
            <span className="font-extrabold tracking-wider">{pixelText(isVi ? 'VI' : 'EN')}</span>
            <span className="text-[9px] text-[#45b7d1] font-mono">{pixelText("⇄")}</span>
          </button>

          {/* Admin / Viewer Role Status Button */}
          {pixelText(isAdmin ? <div className="relative">
              <button type="button" onClick={() => setShowAdminMenu(!showAdminMenu)} className="h-8 md:h-9 px-2.5 md:px-3 bg-[#f6c833] hover:bg-[#e0b020] text-[#120a21] border-[2px] border-black flex items-center gap-1.5 shadow-[2px_2px_0px_#0a0514] font-['Space_Mono'] text-[11px] font-bold cursor-pointer" title={t.adminBadge}>
                <span>{pixelText(t.adminBadge)}</span>
                <PixelIcon className="text-xs">arrow_drop_down</PixelIcon>
              </button>

              {pixelText(showAdminMenu && <div className="absolute right-0 top-full mt-1.5 w-48 bg-[#1f1730] border-2 border-[#f6c833] pixel-box-sm shadow-[4px_4px_0px_#0a0514] font-['Space_Mono'] z-50 text-xs py-1" onClick={() => setShowAdminMenu(false)}>
                  <div className="px-3 py-1.5 border-b border-[#5a3696] text-[10px] text-[#f6c833] font-bold">
                    {pixelText(t.ownerTitle)}
                  </div>
                  <button type="button" onClick={openMessagesModal} className="w-full text-left px-3 py-2 hover:bg-[#2e263f] text-[#26c281] flex items-center gap-1.5 font-bold cursor-pointer">
                    <PixelIcon className="text-sm">forward_to_inbox</PixelIcon>
                    <span>{pixelText(isVi ? 'Hộp thư Bồ câu' : 'Pigeon Inbox')}</span>
                  </button>
                  <button type="button" onClick={openPasswordModal} className="w-full text-left px-3 py-2 hover:bg-[#2e263f] text-[#45b7d1] flex items-center gap-1.5 font-bold cursor-pointer border-t border-[#5a3696]">
                    <PixelIcon className="text-sm">lock_reset</PixelIcon>
                    <span>{pixelText(t.changePassword)}</span>
                  </button>
                  <button type="button" onClick={logout} className="w-full text-left px-3 py-2 hover:bg-[#2e263f] text-[#ef4444] flex items-center gap-1.5 font-bold cursor-pointer border-t border-[#5a3696]">
                    <PixelIcon className="text-sm">logout</PixelIcon>
                    <span>{pixelText(t.logout)}</span>
                  </button>
                </div>)}
            </div> : <button type="button" onClick={openLoginModal} className="h-8 md:h-9 px-2.5 md:px-3 bg-[#120a21] hover:bg-[#2e263f] text-[#eaddff] hover:text-[#f6c833] border-[2px] border-[#5a3696] flex items-center gap-1.5 shadow-[2px_2px_0px_#0a0514] font-['Space_Mono'] text-[11px] font-bold cursor-pointer transition-all" title={t.viewerBadge}>
              <PixelIcon className="text-[#45b7d1] text-sm">visibility</PixelIcon>
              <span className="hidden sm:inline">{pixelText(t.viewerBadge)}</span>
              <span className="text-[#f6c833] underline">{pixelText(t.login)}</span>
            </button>)}

          {/* Spotify Cassette Player Quick Link */}
          <button type="button" onClick={handleGoToSpotify} className={`h-8 md:h-9 px-2 md:px-2.5 bg-[#120a21] border-[2px] ${activeSection === 'hobbies' ? 'border-[#1db954] text-[#1db954] shadow-[0px_0px_8px_rgba(29,185,84,0.4)]' : 'border-[#5a3696] text-[#eaddff] hover:border-[#1db954] hover:text-[#1db954]'} flex items-center gap-1.5 shadow-[2px_2px_0px_#0a0514] hover:-translate-y-0.5 active:translate-x-[2px] active:translate-y-[2px] transition-all cursor-pointer`} title="Spotify Cassette Deck: Blue & You Playlist">
            <PixelIcon name="spotify" className="w-3.5 h-3.5 text-[#1db954] shrink-0" />
            <span className="font-['Space_Mono'] text-[10px] uppercase font-bold tracking-wider hidden lg:inline text-[#1db954]">
              SPOTIFY ♫
            </span>
          </button>

          {/* Contact Button */}
          <button type="button" onClick={onOpenContact} className="hidden sm:inline-flex items-center gap-1.5 bg-[#26c281] text-[#120a21] font-['Space_Mono'] text-xs px-3 py-2 pixel-btn-action font-bold uppercase tracking-wider">
            <span>{pixelText(t.contact)}</span>
            <PixelIcon className="text-[16px]">forward_to_inbox</PixelIcon>
          </button>
        </div>
      </div>

      {/* Mobile Screen Horizontal Tab Strip */}
      <div className="md:hidden flex items-center gap-1.5 overflow-x-auto px-3 py-1.5 bg-[#140c24] border-t border-[#5a3696]/70 no-scrollbar">
        <button type="button" onClick={() => onSelectSection?.('overview')} className={`font-['Space_Mono'] text-[11px] whitespace-nowrap px-2.5 py-1 uppercase font-bold cursor-pointer transition-all ${activeSection === 'overview' ? 'bg-[#5a3696] text-[#f6c833] border border-[#f6c833]' : 'text-[#d1c5ad] hover:text-[#f6c833]'}`}>
          {pixelText(t.home)}
        </button>
        <button type="button" onClick={() => onSelectSection?.('skills')} className={`font-['Space_Mono'] text-[11px] whitespace-nowrap px-2.5 py-1 uppercase font-bold cursor-pointer transition-all ${activeSection === 'skills' ? 'bg-[#5a3696] text-[#f6c833] border border-[#f6c833]' : 'text-[#d1c5ad] hover:text-[#f6c833]'}`}>
          {pixelText(t.skills)}
        </button>
        <button type="button" onClick={() => onSelectSection?.('questbook')} className={`font-['Space_Mono'] text-[11px] whitespace-nowrap px-2.5 py-1 uppercase font-bold cursor-pointer transition-all ${activeSection === 'questbook' ? 'bg-[#5a3696] text-[#f6c833] border border-[#f6c833]' : 'text-[#d1c5ad] hover:text-[#f6c833]'}`}>
          {pixelText(t.questbook)}
        </button>
        <button type="button" onClick={() => onSelectSection?.('hobbies')} className={`font-['Space_Mono'] text-[11px] whitespace-nowrap px-2.5 py-1 uppercase font-bold cursor-pointer transition-all ${activeSection === 'hobbies' ? 'bg-[#5a3696] text-[#f6c833] border border-[#f6c833]' : 'text-[#d1c5ad] hover:text-[#f6c833]'}`}>
          {pixelText(t.hobbies)}
        </button>
        <button type="button" onClick={() => onSelectSection?.('polaroid')} className={`font-['Space_Mono'] text-[11px] whitespace-nowrap px-2.5 py-1 uppercase font-bold cursor-pointer transition-all ${activeSection === 'polaroid' ? 'bg-[#5a3696] text-[#f6c833] border border-[#f6c833]' : 'text-[#d1c5ad] hover:text-[#f6c833]'}`}>
          {pixelText(t.polaroid || (isVi ? 'BẢNG GHIM' : 'PINBOARD'))}
        </button>
        <button type="button" onClick={() => onSelectSection?.('contact')} className={`font-['Space_Mono'] text-[11px] whitespace-nowrap px-2.5 py-1 uppercase font-bold cursor-pointer transition-all ${activeSection === 'contact' ? 'bg-[#5a3696] text-[#f6c833] border border-[#f6c833]' : 'text-[#45b7d1] hover:text-[#f6c833]'}`}>
          {pixelText(t.contact)}
        </button>
      </div>
    </header>;
};
