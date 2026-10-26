import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { TRANSLATIONS } from '../utils/translations';

import { SectionTab } from '../types';

interface FooterProps {
  onOpenContact: (e?: React.MouseEvent) => void;
  onSelectSection?: (section: SectionTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenContact, onSelectSection }) => {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language].footer;

  return (
    <footer className="bg-[#120a21]/95 backdrop-blur-md border-t-[3px] border-[#5a3696] mt-auto relative z-10 w-full shrink-0">
      <div className="w-full py-8 px-4 sm:px-6 max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
          <span className="text-lg font-bold text-[#f6c833] font-['Space_Grotesk']">MY WORLD</span>
          <span className="hidden sm:inline text-[#5a3696]">|</span>
          <div className="flex flex-col">
            <span className="text-xs font-['Space_Mono'] text-[#d1c5ad]">
              {t.copyright}
            </span>
            <span className="text-[10px] font-['Space_Mono'] text-[#45b7d1]/80 mt-0.5">
              🛡️ Không thương mại hóa • Phi lợi nhuận • Tôn trọng bản quyền tác giả
            </span>
          </div>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
          <button
            type="button"
            onClick={() => onSelectSection?.('overview')}
            className="text-[#d1c5ad] font-['Space_Mono'] text-xs hover:text-[#f6c833] uppercase font-bold transition-colors cursor-pointer"
          >
            {t.worldMap}
          </button>
          <button
            type="button"
            onClick={() => onSelectSection?.('skills')}
            className="text-[#d1c5ad] font-['Space_Mono'] text-xs hover:text-[#f6c833] uppercase font-bold transition-colors cursor-pointer"
          >
            {language === 'vi' ? 'KỸ NĂNG' : 'SKILLS'}
          </button>
          <button
            type="button"
            onClick={() => onSelectSection?.('questbook')}
            className="text-[#d1c5ad] font-['Space_Mono'] text-xs hover:text-[#f6c833] uppercase font-bold transition-colors cursor-pointer"
          >
            {language === 'vi' ? 'NHIỆM VỤ' : 'QUESTS'}
          </button>
          <button
            type="button"
            onClick={() => onSelectSection?.('hobbies')}
            className="text-[#d1c5ad] font-['Space_Mono'] text-xs hover:text-[#f6c833] uppercase font-bold transition-colors cursor-pointer"
          >
            {language === 'vi' ? 'SỞ THÍCH' : 'HOBBIES'}
          </button>
          <button
            type="button"
            onClick={() => onSelectSection?.('polaroid')}
            className="text-[#d1c5ad] font-['Space_Mono'] text-xs hover:text-[#f6c833] uppercase font-bold transition-colors cursor-pointer"
          >
            {language === 'vi' ? 'BẢNG GHIM' : 'PINBOARD'}
          </button>
          <button
            type="button"
            onClick={() => onSelectSection ? onSelectSection('contact') : onOpenContact()}
            className="text-[#45b7d1] font-['Space_Mono'] text-xs hover:text-[#f6c833] uppercase font-bold cursor-pointer transition-colors"
          >
            {t.contact}
          </button>
        </nav>
      </div>
    </footer>
  );
};
