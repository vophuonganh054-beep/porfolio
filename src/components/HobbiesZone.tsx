import { PixelIcon, pixelText } from "./PixelIcon";
import React, { useState } from 'react';
import { spawnPixelBurst } from '../utils/fx';
import { useLanguage } from '../context/LanguageContext';
import { getBilingualHobbyItems, TRANSLATIONS } from '../utils/translations';
import { HobbyItem } from '../types';
interface HobbiesZoneProps {
  friendshipHearts?: number;
  onSendLove?: (e?: React.MouseEvent) => void;
}
export const HobbiesZone: React.FC<HobbiesZoneProps> = () => {
  const {
    language,
    isVi
  } = useLanguage();
  const t = TRANSLATIONS[language].hobbies;
  const hobbyItems = getBilingualHobbyItems(isVi);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isReelsSpinning, setIsReelsSpinning] = useState(true);
  const handleHobbyClick = (e: React.MouseEvent) => {
    spawnPixelBurst(e.clientX, e.clientY, 6);
  };
  const toggleReels = (e: React.MouseEvent) => {
    setIsReelsSpinning(!isReelsSpinning);
    spawnPixelBurst(e.clientX, e.clientY, 8);
  };
  return <section className="space-y-6" id="hobbies">
      {/* Header */}
      <div className="flex items-center justify-between border-b-[3px] border-[#5a3696] pb-2">
        <div className="flex items-center gap-2">
          <PixelIcon className="text-[#f6c833] text-2xl">
            stadia_controller
          </PixelIcon>
          <h2 className="text-xl md:text-2xl font-['Space_Grotesk'] text-[#f6c833] arcade-glow-gold uppercase font-bold">
            {pixelText(t.sectionTitle)}
          </h2>
        </div>
        <span className="font-['Space_Mono'] text-xs text-[#f3eeff] font-bold">
          {pixelText(t.subtitle)}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Spotify Cassette Player Widget (5 cols) */}
        <div className="md:col-span-5 bg-[#1f1730]/95 border-[3px] border-[#5a3696] p-4 sm:p-5 pixel-box-md flex flex-col justify-between">
          <div>
            {/* Widget Top Bar */}
            <div className="flex items-center justify-between mb-3 border-b-2 border-[#5a3696] pb-2">
              <div className="flex items-center gap-2">
                <PixelIcon className="text-[#1db954] text-lg">
                  album
                </PixelIcon>
                <span className="font-['Space_Mono'] text-xs text-[#f6c833] font-bold uppercase truncate max-w-[200px]">
                  {pixelText(t.tapePlayerTitle)}
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-0.5 bg-[#120a21] border border-[#1db954] text-[#1db954] font-['Space_Mono'] text-[10px] font-bold">
                <span className="w-2 h-2 rounded-full bg-[#1db954] animate-ping" />
                <span className="hidden sm:inline">SPOTIFY</span>
              </div>
            </div>

            {/* Cassette Header Bar */}
            <div className="bg-[#231b34] border-[3px] border-[#5a3696] p-3 mb-3 relative">
              <div className="flex justify-between items-center bg-[#120a21] text-[#f3eeff] border border-[#5a3696] px-3 py-1 font-['Space_Mono'] text-xs mb-3">
                <span className="truncate font-bold text-[#f6c833] text-xs flex items-center gap-1.5">
                  <PixelIcon className="text-sm text-[#1db954]">graphic_eq</PixelIcon>
                  <span className="truncate">SPOTIFY: 1KGpZGGvjnfgWeypHjuvpb</span>
                </span>
                <button type="button" onClick={toggleReels} title={isReelsSpinning ? 'Tạm dừng hiệu ứng quay băng' : 'Bật hiệu ứng quay băng'} className="text-[#1db954] hover:text-white font-bold shrink-0 ml-2 text-[10px] cursor-pointer flex items-center gap-1 bg-[#120a21] px-1.5 py-0.5 border border-[#1db954]/50">
                  <PixelIcon className="text-[13px]">
                    {pixelText(isReelsSpinning ? 'motion_photos_on' : 'motion_photos_off')}
                  </PixelIcon>
                  <span>{pixelText(isReelsSpinning ? 'SPINNING' : 'IDLE')}</span>
                </button>
              </div>

              {/* Tape Reels Visual */}
              <div className="flex justify-around items-center py-3 bg-[#2e263f] border-[2px] border-[#5a3696]">
                {/* Left Reel */}
                <div className={`w-11 h-11 rounded-full border-[3px] border-[#5a3696] bg-[#231b34] flex items-center justify-center ${isReelsSpinning ? 'spinning-reel' : ''}`}>
                  <div className="w-4 h-4 bg-[#1db954] rounded-full border border-black" />
                </div>

                {/* Equalizer Bars & Cassette Center */}
                <div className="flex flex-col items-center gap-1 w-28">
                  <div className="flex items-end gap-1 h-4 mb-0.5">
                    <div className={`w-1 bg-[#1db954] transition-all ${isReelsSpinning ? 'h-3 animate-pulse' : 'h-1.5'}`} />
                    <div className={`w-1 bg-[#f6c833] transition-all ${isReelsSpinning ? 'h-4 animate-bounce' : 'h-2'}`} style={{
                    animationDuration: '320ms'
                  }} />
                    <div className={`w-1 bg-[#26c281] transition-all ${isReelsSpinning ? 'h-3.5 animate-pulse' : 'h-1.5'}`} style={{
                    animationDuration: '420ms'
                  }} />
                    <div className={`w-1 bg-[#45b7d1] transition-all ${isReelsSpinning ? 'h-2.5 animate-bounce' : 'h-1'}`} style={{
                    animationDuration: '380ms'
                  }} />
                  </div>

                  <div className="h-1.5 w-full bg-[#120a21] border border-[#5a3696] p-0.5">
                    <div className="h-full bg-[#1db954] w-full" />
                  </div>
                  <span className="text-[9px] font-['Space_Mono'] uppercase font-bold tracking-tight text-[#1db954] text-center">
                    SPOTIFY PLAYLIST LIVE
                  </span>
                </div>

                {/* Right Reel */}
                <div className={`w-11 h-11 rounded-full border-[3px] border-[#5a3696] bg-[#231b34] flex items-center justify-center ${isReelsSpinning ? 'spinning-reel' : ''}`}>
                  <div className="w-4 h-4 bg-[#1db954] rounded-full border border-black" />
                </div>
              </div>
            </div>

            {/* Spotify Embed Player Container */}
            <div className="space-y-2.5">
              <div className="bg-[#120a21] border-2 border-[#1db954]/60 p-1 pixel-box-sm shadow-inner transition-all duration-300">
                <iframe style={{
                borderRadius: '6px'
              }} src="https://open.spotify.com/embed/playlist/1KGpZGGvjnfgWeypHjuvpb?utm_source=generator&theme=0" width="100%" height={isExpanded ? '352' : '152'} frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="eager" title="Spotify Playlist 1KGpZGGvjnfgWeypHjuvpb" className="w-full block transition-all duration-300" />
              </div>

              {/* Expand / Collapse Tracklist Toggle */}
              <div className="flex items-center justify-between gap-2">
                <button type="button" onClick={() => setIsExpanded(!isExpanded)} className="text-[11px] font-['Space_Mono'] font-bold text-[#f6c833] hover:text-white bg-[#120a21] border border-[#5a3696] hover:border-[#f6c833] px-2.5 py-1.5 flex items-center gap-1.5 cursor-pointer transition-all">
                  <PixelIcon className="text-[15px]">
                    {pixelText(isExpanded ? 'unfold_less' : 'format_list_bulleted')}
                  </PixelIcon>
                  <span>
                    {pixelText(isExpanded ? isVi ? 'THU GỌN MÁY TAPE' : 'COMPACT DECK' : isVi ? 'XEM TOÀN BỘ DANH SÁCH BÀI' : 'EXPAND TRACKLIST')}
                  </span>
                </button>

                <div className="text-[10px] text-[#26c281] font-['Space_Mono'] font-bold flex items-center gap-1">
                  <PixelIcon className="text-xs">all_inclusive</PixelIcon>
                  <span>{pixelText(isVi ? 'PHÁT LIÊN TỤC' : 'CONTINUOUS')}</span>
                </div>
              </div>

              {/* Open in Spotify App / Web Button */}
              <a href="https://open.spotify.com/playlist/1KGpZGGvjnfgWeypHjuvpb" target="_blank" rel="noopener noreferrer" className="w-full bg-[#1db954] hover:bg-[#1aa34a] text-[#120a21] font-extrabold font-['Space_Mono'] text-xs py-2.5 px-3 pixel-btn-action flex items-center justify-center gap-2 uppercase tracking-wide cursor-pointer transition-colors shadow-[2px_2px_0px_#0a0514]">
                <PixelIcon name="spotify" className="w-4 h-4  shrink-0" />
                <span>{pixelText(t.openSpotify || (isVi ? 'MỞ TRỰC TIẾP TRÊN SPOTIFY ↗' : 'OPEN DIRECTLY ON SPOTIFY ↗'))}</span>
              </a>
            </div>

            <p className="font-['Space_Mono'] text-[11px] text-[#d1c5ad] text-center mt-3 leading-relaxed">
              {pixelText(isVi ? '🎧 Nhạc phát trực tiếp từ Spotify và tiếp tục phát ngay cả khi bạn chuyển sang các tab khác của website!' : '🎧 Music plays directly from Spotify and keeps playing even when you navigate to other tabs!')}
            </p>
          </div>
        </div>

        {/* Hobbies Chips (7 cols) */}
        <div className="md:col-span-7 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {pixelText(hobbyItems.map((hobby: HobbyItem) => <div key={hobby.id} onClick={handleHobbyClick} className={`bg-[#1f1730]/95 border-[2px] border-[#5a3696] p-3 pixel-box-sm flex items-center gap-2 cursor-pointer ${hobby.hoverColor} transition-colors`}>
                <PixelIcon className="text-lg text-[#f6c833]">
                  {pixelText(hobby.icon)}
                </PixelIcon>
                <span className="font-['Space_Mono'] text-xs text-[#f3eeff] font-bold">
                  {pixelText(hobby.label)}
                </span>
              </div>))}
          </div>
        </div>
      </div>
    </section>;
};
