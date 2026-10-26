import React, { useState, useEffect } from 'react';
import { VisitorJourney, HiddenStar, useVisitorJourney } from './components/VisitorJourney';
import { DuckGame } from './components/DuckGame';
import { InstallApp } from './components/InstallApp';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { HobbiesZone } from './components/HobbiesZone';
import { PolaroidPinboard } from './components/PolaroidPinboard';
import { QuestLog } from './components/QuestLog';
import { SkillInventory } from './components/SkillInventory';
import { ContactSection } from './components/ContactSection';
import { SocialModal } from './components/SocialModal';
import { TopNav } from './components/TopNav';
import { PixelCanvasBackground } from './components/PixelCanvasBackground';
import { AdminModals } from './components/AdminModals';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { COSMIC_BG_URL } from './data/portfolioData';
import { playRetroBeep } from './utils/audioSynth';
import { spawnPixelBurst } from './utils/fx';
import { SectionTab } from './types';

function MainAppContent() {
  const [activeSection, setActiveSection] = useState<SectionTab>('overview');
  const journey = useVisitorJourney(activeSection);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const { isVi } = useLanguage();

  // Global sound effect for interactive elements
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactiveElement = target.closest('button, a, [role="button"], input[type="file"], .pixel-slot, .dpad-btn');
      if (interactiveElement) {
        const text = interactiveElement.textContent?.toLowerCase() || '';
        if (text.includes('tim') || text.includes('love') || text.includes('tải') || text.includes('ghim')) {
          playRetroBeep('coin');
        } else if (text.includes('x') || text.includes('hủy') || text.includes('gỡ')) {
          playRetroBeep('pop');
        } else {
          playRetroBeep('beep');
        }
      }
    };

    window.addEventListener('click', handleGlobalClick, { capture: true });
    return () => window.removeEventListener('click', handleGlobalClick, { capture: true });
  }, []);

  const handleOpenContact = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsContactModalOpen(true);
  };

  const handleCloseContact = () => {
    setIsContactModalOpen(false);
  };

  const handleSelectSection = (section: SectionTab) => {
    setActiveSection(section);
    playRetroBeep('select');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="crt-scanlines text-[#eaddff] font-['Space_Mono'] antialiased min-h-screen flex flex-col relative overflow-x-hidden bg-[#0b0717]">
      {/* Full-Page Pixel Cosmic Space Background */}
      <div
        className="fixed inset-0 w-full h-full bg-cover bg-center opacity-45 pointer-events-none z-0 pixelated-render"
        style={{
          backgroundImage: `url('${COSMIC_BG_URL}')`,
          backgroundAttachment: 'fixed',
        }}
      />

      {/* Dynamic Animated Floating Pixel Canvas */}
      <PixelCanvasBackground />

      {/* Top HUD Nav */}
      <TopNav
        onOpenContact={handleOpenContact}
        activeSection={activeSection}
        onSelectSection={handleSelectSection}
      />

      {/* Main Canvas Content */}
      <main className="max-w-[1200px] w-full mx-auto px-4 md:px-6 py-6 relative z-10 flex-1">
        <InstallApp />
        <VisitorJourney journey={journey} onNavigate={handleSelectSection} />
        {/* Navigation Breadcrumb / Quick Back to Home */}
        {activeSection !== 'overview' && (
          <div className="mb-6 flex items-center justify-between bg-[#191127]/90 border-[2px] border-[#5a3696] px-4 py-2.5 pixel-box-sm backdrop-blur-md">
            <button
              type="button"
              onClick={() => handleSelectSection('overview')}
              className="px-3 py-1.5 bg-[#f6c833] hover:bg-[#e0b020] text-[#120a21] font-['Space_Mono'] text-xs font-bold uppercase pixel-btn-action flex items-center gap-2 cursor-pointer shadow-[2px_2px_0px_#0a0514] transition-all"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              <span>{isVi ? '← VỀ TRANG CHỦ' : '← BACK TO HOME'}</span>
            </button>

            <div className="text-xs font-['Space_Mono'] text-[#a798c4] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#f6c833] inline-block animate-pulse" />
              <span className="uppercase font-bold tracking-wider text-[#f6c833]">
                {activeSection === 'skills' && (isVi ? 'KHO KỸ NĂNG' : 'SKILLS')}
                {activeSection === 'questbook' && (isVi ? 'QUESTBOOK // NHIỆM VỤ' : 'QUESTBOOK')}
                {activeSection === 'hobbies' && (isVi ? 'GÓC SỞ THÍCH' : 'HOBBIES')}
                {activeSection === 'polaroid' && (isVi ? 'BẢNG GHIM KỶ NIỆM' : 'PINBOARD')}
                {activeSection === 'contact' && (isVi ? 'LIÊN HỆ' : 'CONTACT')}
              </span>
            </div>
          </div>
        )}

        {/* 1. OVERVIEW MODE: Condense the site with Hero + Quick Hub Cards */}
        {activeSection === 'overview' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Hero Profile with Chibi and Interactive Status Effect Overlay */}
            <HeroSection
              onOpenContact={handleOpenContact}
              onNavigateSection={handleSelectSection}
            />

            <DuckGame />

            {/* Streamlined Activity Hub / Module Cards Preview */}
            <div className="bg-[#191127]/90 border-[3px] border-[#5a3696] p-4 sm:p-6 pixel-box">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b-2 border-dashed border-[#5a3696] gap-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#f6c833] text-xl">
                    dashboard_customize
                  </span>
                  <h3 className="font-['Space_Grotesk'] text-lg sm:text-xl font-extrabold text-[#f6c833] uppercase tracking-wide">
                    {isVi ? 'TRUNG TÂM HOẠT ĐỘNG // SECTIONS HUB' : 'ACTIVITY HUB // SECTIONS HUB'}
                  </h3>
                </div>
                <div className="text-xs font-['Space_Mono'] text-[#26c281] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#26c281] inline-block animate-pulse" />
                  <span>{isVi ? '5 MÔ ĐUN SẴN SÀNG KHÁM PHÁ' : '5 MODULES READY TO EXPLORE'}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Module 1: Skill Inventory */}
                <div className="bg-[#231b34] border-[2px] border-[#5a3696] hover:border-[#f6c833] p-4 pixel-box-sm flex flex-col justify-between transition-all group">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">🎒</span>
                      <span className="text-[10px] bg-[#120a21] text-[#f6c833] px-2 py-0.5 border border-[#5a3696] font-mono">
                        8 SKILLS
                      </span>
                    </div>
                    <h4 className="font-['Space_Grotesk'] font-bold text-[#f6c833] text-base group-hover:text-white transition-colors">
                      {isVi ? 'Kho Kỹ Năng' : 'Skill Inventory'}
                    </h4>
                    <p className="text-xs text-[#d1c5ad] font-['Space_Mono'] mt-1 line-clamp-2">
                      {isVi
                        ? 'React, HTML5/CSS3, TypeScript, UI/UX Design, Canva sáng tạo & tư duy logic.'
                        : 'React, HTML5/CSS3, TypeScript, UI/UX Design, Canva & problem solving.'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSelectSection('skills')}
                    className="mt-4 w-full py-2 bg-[#120a21] hover:bg-[#5a3696] text-[#f6c833] border border-[#5a3696] text-xs font-bold uppercase font-['Space_Mono'] cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>{isVi ? 'MỞ KỸ NĂNG' : 'VIEW SKILLS'}</span>
                    <span>→</span>
                  </button>
                </div>

                {/* Module 2: Questbook */}
                <div className="bg-[#231b34] border-[2px] border-[#5a3696] hover:border-[#f6c833] p-4 pixel-box-sm flex flex-col justify-between transition-all group">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">📜</span>
                      <span className="text-[10px] bg-[#120a21] text-[#45b7d1] px-2 py-0.5 border border-[#5a3696] font-mono">
                        3 CLEARED
                      </span>
                    </div>
                    <h4 className="font-['Space_Grotesk'] font-bold text-[#45b7d1] text-base group-hover:text-white transition-colors">
                      {isVi ? 'Questbook (Nhiệm Vụ)' : 'Quest Log'}
                    </h4>
                    <p className="text-xs text-[#d1c5ad] font-['Space_Mono'] mt-1 line-clamp-2">
                      {isVi
                        ? 'Các dự án thực chiến, candy realm frontend, giao diện sáng tạo đã hoàn thành.'
                        : 'Real-world projects, candy realm frontend, and cleared creative missions.'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSelectSection('questbook')}
                    className="mt-4 w-full py-2 bg-[#120a21] hover:bg-[#5a3696] text-[#45b7d1] border border-[#5a3696] text-xs font-bold uppercase font-['Space_Mono'] cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>{isVi ? 'MỞ QUESTBOOK' : 'VIEW QUESTBOOK'}</span>
                    <span>→</span>
                  </button>
                </div>

                {/* Module 3: Hobbies & Chill Music */}
                <div className="bg-[#231b34] border-[2px] border-[#5a3696] hover:border-[#f6c833] p-4 pixel-box-sm flex flex-col justify-between transition-all group">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">🎧</span>
                      <span className="text-[10px] bg-[#120a21] text-[#d93876] px-2 py-0.5 border border-[#5a3696] font-mono">
                        8-BIT LOFI
                      </span>
                    </div>
                    <h4 className="font-['Space_Grotesk'] font-bold text-[#d93876] text-base group-hover:text-white transition-colors">
                      {isVi ? 'Góc Sở Thích' : 'Hobbies Zone'}
                    </h4>
                    <p className="text-xs text-[#d1c5ad] font-['Space_Mono'] mt-1 line-clamp-2">
                      {isVi
                        ? 'Chiptune radio, pixel art, gaming góc thư giãn và năng lượng tích cực ngoài giờ code.'
                        : 'Chiptune radio, pixel art, casual gaming, and cozy creative vibes.'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSelectSection('hobbies')}
                    className="mt-4 w-full py-2 bg-[#120a21] hover:bg-[#5a3696] text-[#d93876] border border-[#5a3696] text-xs font-bold uppercase font-['Space_Mono'] cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>{isVi ? 'MỞ SỞ THÍCH' : 'VIEW HOBBIES'}</span>
                    <span>→</span>
                  </button>
                </div>

                {/* Module 4: Polaroid Memory Pinboard */}
                <div className="bg-[#231b34] border-[2px] border-[#5a3696] hover:border-[#f6c833] p-4 pixel-box-sm flex flex-col justify-between transition-all group">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">📸</span>
                      <span className="text-[10px] bg-[#120a21] text-[#26c281] px-2 py-0.5 border border-[#5a3696] font-mono">
                        GALLERY
                      </span>
                    </div>
                    <h4 className="font-['Space_Grotesk'] font-bold text-[#26c281] text-base group-hover:text-white transition-colors">
                      {isVi ? 'Bảng Ghim Kỷ Niệm' : 'Polaroid Board'}
                    </h4>
                    <p className="text-xs text-[#d1c5ad] font-['Space_Mono'] mt-1 line-clamp-2">
                      {isVi
                        ? 'Bảng ghim ảnh cá nhân, sticker retro và những khoảnh khắc đáng nhớ trong cuộc sống.'
                        : 'Personal photo pinboard, retro stickers, and memorable journey snapshots.'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSelectSection('polaroid')}
                    className="mt-4 w-full py-2 bg-[#120a21] hover:bg-[#5a3696] text-[#26c281] border border-[#5a3696] text-xs font-bold uppercase font-['Space_Mono'] cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>{isVi ? 'MỞ BẢNG GHIM' : 'VIEW PINBOARD'}</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. SKILLS DEDICATED SECTION */}
        {activeSection === 'skills' && (
          <div className="space-y-6 animate-fadeIn">
            <SkillInventory />
          </div>
        )}

        {/* 3. QUESTBOOK DEDICATED SECTION */}
        {activeSection === 'questbook' && (
          <div className="space-y-6 animate-fadeIn">
            <QuestLog />
          </div>
        )}

        {/* 4. HOBBIES DEDICATED SECTION - Kept mounted continuously so Spotify audio playback continues across tab navigation */}
        <div
          className={
            activeSection === 'hobbies'
              ? 'space-y-6 animate-fadeIn'
              : 'fixed -left-[9999px] top-0 pointer-events-none opacity-0 w-0 h-0 overflow-hidden'
          }
          aria-hidden={activeSection !== 'hobbies'}
        >
          <HobbiesZone isActive={activeSection === 'hobbies'} />
        </div>

        {/* 5. POLAROID DEDICATED SECTION */}
        {activeSection === 'polaroid' && (
          <div className="space-y-6 animate-fadeIn">
            <PolaroidPinboard onOpenContact={handleOpenContact} />
          </div>
        )}

        {/* 6. CONTACT DEDICATED SECTION */}
        {activeSection === 'contact' && (
          <div className="space-y-6 animate-fadeIn">
            <ContactSection onOpenModal={handleOpenContact} />
          </div>
        )}
        <HiddenStar key={activeSection} section={activeSection} journey={journey} />
      </main>

      {/* Retro Social Popup Modal */}
      <SocialModal isOpen={isContactModalOpen} onClose={handleCloseContact} />

      {/* Admin Login & Password Modals */}
      <AdminModals />

      {/* Arcade Footer */}
      <Footer
        onOpenContact={handleOpenContact}
        onSelectSection={handleSelectSection}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <MainAppContent />
      </LanguageProvider>
    </AuthProvider>
  );
}
