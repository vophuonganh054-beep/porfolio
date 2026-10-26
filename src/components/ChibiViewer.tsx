import React, { useEffect, useState } from 'react';
import { CHIBI_THUMBS } from '../data/portfolioData';
import { ChibiDirection } from '../types';
import { spawnPixelBurst } from '../utils/fx';
import { useLanguage } from '../context/LanguageContext';
import { getBilingualChibiData, TRANSLATIONS } from '../utils/translations';
import { StatusEffectOverlay, StatusEffectType, STATUS_EFFECT_CONFIGS } from './StatusEffectOverlay';

const DIR_KEYS: ChibiDirection[] = ['front', 'left', 'back', 'right'];
const STATUS_EFFECTS: StatusEffectType[] = ['shield', 'invincible', 'regen', 'berserk'];

export const ChibiViewer: React.FC = () => {
  const [direction, setDirection] = useState<ChibiDirection>('front');
  const [isAutoTurning, setIsAutoTurning] = useState(false);
  const [currentEffect, setCurrentEffect] = useState<StatusEffectType>('shield');
  const [isEffectActive, setIsEffectActive] = useState(false);
  const [effectKey, setEffectKey] = useState(0);
  const { language, isVi } = useLanguage();
  const t = TRANSLATIONS[language].chibi;

  useEffect(() => {
    if (!isAutoTurning) return;
    const interval = setInterval(() => {
      setDirection((prev) => {
        const nextIdx = (DIR_KEYS.indexOf(prev) + 1) % DIR_KEYS.length;
        return DIR_KEYS[nextIdx];
      });
    }, 2200);

    return () => clearInterval(interval);
  }, [isAutoTurning]);

  const currentInfo = getBilingualChibiData(direction, isVi);

  const handleSelectDirection = (dir: ChibiDirection, e?: React.MouseEvent) => {
    setDirection(dir);
    if (e) {
      spawnPixelBurst(e.clientX, e.clientY, 6);
    }
  };

  const triggerStatusEffect = (forcedType?: StatusEffectType, e?: React.MouseEvent) => {
    if (e) {
      spawnPixelBurst(e.clientX, e.clientY, 10);
    }
    const nextType = forcedType || (isEffectActive 
      ? STATUS_EFFECTS[(STATUS_EFFECTS.indexOf(currentEffect) + 1) % STATUS_EFFECTS.length]
      : currentEffect);

    setCurrentEffect(nextType);
    setIsEffectActive(true);
    setEffectKey((k) => k + 1);
  };

  const handleCycleDirectionAndEffect = (e: React.MouseEvent) => {
    const nextIdx = (DIR_KEYS.indexOf(direction) + 1) % DIR_KEYS.length;
    handleSelectDirection(DIR_KEYS[nextIdx], e);
    // Triggers the temporary Status Effect visual overlay!
    triggerStatusEffect(undefined, e);
  };

  const handleToggleAutoTurn = (e: React.MouseEvent) => {
    setIsAutoTurning((prev) => !prev);
    spawnPixelBurst(e.clientX, e.clientY, 6);
  };

  return (
    <div className="mt-4 w-full bg-[#231b34] border-[3px] border-[#5a3696] p-3 pixel-box-sm relative overflow-hidden flex flex-col items-center">
      {/* Header Bar */}
      <div className="w-full flex items-center justify-between pb-1.5 mb-2 border-b border-[#5a3696]/70 text-[10px] font-['Space_Mono']">
        <span className="text-[#f6c833] font-bold flex items-center gap-1.5">
          <span className="w-2 h-2 bg-[#26c281] rounded-full animate-ping" />
          {t.spriteHeader}
        </span>
        <span className="text-[#45b7d1] font-bold tracking-wider uppercase">
          {currentInfo.label}
        </span>
      </div>

      {/* Main Chibi Stage + D-Pad Controls */}
      <div className="w-full grid grid-cols-12 gap-3 items-center bg-[#120a21]/80 border border-[#5a3696]/60 p-2.5">
        {/* Left Stage: Character Sprite with Status Effect Overlay */}
        <div className="col-span-7 flex flex-col items-center justify-center relative min-h-[148px]">
          <div className="mb-1 bg-[#2e263f] border-2 border-[#f6c833] px-2 py-0.5 text-[10px] font-['Space_Mono'] text-[#f6c833] rounded shadow-[2px_2px_0px_#0a0514] font-bold text-center select-none max-w-full truncate">
            {currentInfo.quote}
          </div>

          <div
            className="relative cursor-pointer group flex flex-col items-center select-none mt-1 p-1 hover:scale-105 active:scale-95 transition-transform"
            onClick={handleCycleDirectionAndEffect}
            title={isVi ? "Nhấp nhân vật để kích hoạt Khiên Pixel / Hào Quang Bất Tử!" : "Click character to trigger Pixel Shield / Invincibility Glow!"}
          >
            {/* Status Effect Visual Overlay wrapping the character sprite */}
            <StatusEffectOverlay
              key={effectKey}
              active={isEffectActive}
              effect={currentEffect}
              duration={3200}
              onComplete={() => setIsEffectActive(false)}
            />

            <div className="w-[96px] h-[112px] relative overflow-hidden flex items-center justify-center">
              <img
                src={currentInfo.img}
                alt={`Phương Anh Chibi ${direction}`}
                className="pixelated-render w-full h-full object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]"
              />
            </div>
            <div className="w-16 h-2 bg-black/60 rounded-full mx-auto -mt-1 blur-[0.5px]" />
          </div>

          <span className="text-[9px] font-['Space_Mono'] text-[#f6c833] mt-1 text-center font-bold">
            {isEffectActive ? (
              <span className="text-[#45b7d1] animate-pulse">
                ⚡ {STATUS_EFFECT_CONFIGS[currentEffect].name} ACTIVE!
              </span>
            ) : (
              <span>✨ {isVi ? 'Chạm nhân vật: Bật Khiên / Hào Quang' : 'Click sprite: Shield / Star Glow'}</span>
            )}
          </span>
        </div>

        {/* Right Controls: D-Pad & Toggles */}
        <div className="col-span-5 flex flex-col items-center justify-center gap-2 border-l border-[#5a3696]/60 pl-2">
          {/* D-Pad Buttons */}
          <div className="grid grid-cols-3 gap-1 w-24">
            <div />
            <button
              type="button"
              onClick={(e) => handleSelectDirection('back', e)}
              className={`dpad-btn bg-[#2e263f] text-[#f3eeff] h-7 flex items-center justify-center text-xs font-bold ${
                direction === 'back' ? 'active-dpad' : ''
              }`}
              title={t.directions.back}
            >
              ▲
            </button>
            <div />
            <button
              type="button"
              onClick={(e) => handleSelectDirection('left', e)}
              className={`dpad-btn bg-[#2e263f] text-[#f3eeff] h-7 flex items-center justify-center text-xs font-bold ${
                direction === 'left' ? 'active-dpad' : ''
              }`}
              title={t.directions.left}
            >
              ◄
            </button>
            <button
              type="button"
              onClick={(e) => handleSelectDirection('front', e)}
              className={`dpad-btn bg-[#2e263f] text-[#f6c833] h-7 flex items-center justify-center text-[10px] font-bold ${
                direction === 'front' ? 'active-dpad' : ''
              }`}
              title={t.directions.front}
            >
              ●
            </button>
            <button
              type="button"
              onClick={(e) => handleSelectDirection('right', e)}
              className={`dpad-btn bg-[#2e263f] text-[#f3eeff] h-7 flex items-center justify-center text-xs font-bold ${
                direction === 'right' ? 'active-dpad' : ''
              }`}
              title={t.directions.right}
            >
              ►
            </button>
            <div />
            <button
              type="button"
              onClick={(e) => handleSelectDirection('front', e)}
              className="dpad-btn bg-[#2e263f] text-[#f3eeff] h-7 flex items-center justify-center text-xs font-bold"
              title={t.directions.front}
            >
              ▼
            </button>
            <div />
          </div>

          {/* Toggle Switches */}
          <div className="w-full flex flex-col gap-1.5 mt-1">
            <button
              type="button"
              onClick={handleToggleAutoTurn}
              className="w-full bg-[#2e263f] border border-[#5a3696] py-1 px-1.5 text-[9px] font-['Space_Mono'] text-[#45b7d1] font-bold flex items-center justify-center gap-1 pixel-btn-action cursor-pointer"
            >
              <span className="material-symbols-outlined text-[13px]">autorenew</span>
              <span>{isAutoTurning ? t.autoTurnOn : t.autoTurnOff}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Status Effect Quick Trigger Bar */}
      <div className="w-full mt-2 pt-1.5 border-t border-[#5a3696]/60 flex flex-col gap-1">
        <div className="flex items-center justify-between text-[8px] font-['Space_Mono'] font-bold text-[#f6c833] uppercase">
          <span>{isVi ? '⚡ HIỆU ỨNG TRẠNG THÁI (STATUS EFFECT):' : '⚡ STATUS EFFECT OVERLAY:'}</span>
          <span className="text-[#45b7d1]">{STATUS_EFFECT_CONFIGS[currentEffect].name}</span>
        </div>
        <div className="grid grid-cols-4 gap-1">
          <button
            type="button"
            onClick={(e) => triggerStatusEffect('shield', e)}
            className={`py-1 px-1 text-[8px] font-['Space_Mono'] font-bold border transition-all cursor-pointer flex items-center justify-center gap-0.5 ${
              isEffectActive && currentEffect === 'shield'
                ? 'bg-[#45b7d1] text-[#120a21] border-black scale-105 shadow-[0_0_8px_#45b7d1]'
                : 'bg-[#1f1730] text-[#45b7d1] border-[#45b7d1]/50 hover:border-[#45b7d1]'
            }`}
            title={isVi ? "Kích hoạt Lá Chắn Pixel (+999 DEF)" : "Trigger Pixel Shield"}
          >
            <span>🛡️</span>
            <span>SHIELD</span>
          </button>

          <button
            type="button"
            onClick={(e) => triggerStatusEffect('invincible', e)}
            className={`py-1 px-1 text-[8px] font-['Space_Mono'] font-bold border transition-all cursor-pointer flex items-center justify-center gap-0.5 ${
              isEffectActive && currentEffect === 'invincible'
                ? 'bg-[#f6c833] text-[#120a21] border-black scale-105 shadow-[0_0_8px_#f6c833]'
                : 'bg-[#1f1730] text-[#f6c833] border-[#f6c833]/50 hover:border-[#f6c833]'
            }`}
            title={isVi ? "Kích hoạt Hào Quang Bất Tử (Star Glow)" : "Trigger Invincibility Star Glow"}
          >
            <span>★</span>
            <span>GLOW</span>
          </button>

          <button
            type="button"
            onClick={(e) => triggerStatusEffect('regen', e)}
            className={`py-1 px-1 text-[8px] font-['Space_Mono'] font-bold border transition-all cursor-pointer flex items-center justify-center gap-0.5 ${
              isEffectActive && currentEffect === 'regen'
                ? 'bg-[#26c281] text-[#120a21] border-black scale-105 shadow-[0_0_8px_#26c281]'
                : 'bg-[#1f1730] text-[#26c281] border-[#26c281]/50 hover:border-[#26c281]'
            }`}
            title={isVi ? "Kích hoạt Hồi Phục Sinh Mệnh (+100 HP)" : "Trigger Vitality Regen"}
          >
            <span>💖</span>
            <span>REGEN</span>
          </button>

          <button
            type="button"
            onClick={(e) => triggerStatusEffect('berserk', e)}
            className={`py-1 px-1 text-[8px] font-['Space_Mono'] font-bold border transition-all cursor-pointer flex items-center justify-center gap-0.5 ${
              isEffectActive && currentEffect === 'berserk'
                ? 'bg-[#d93876] text-white border-black scale-105 shadow-[0_0_8px_#d93876]'
                : 'bg-[#1f1730] text-[#d93876] border-[#d93876]/50 hover:border-[#d93876]'
            }`}
            title={isVi ? "Kích hoạt Bùng Nổ Ma Lực (Speed x2)" : "Trigger Mana Burst"}
          >
            <span>⚡</span>
            <span>BURST</span>
          </button>
        </div>
      </div>

      {/* 4 Angle Thumbnails */}
      <div className="w-full mt-2 pt-2 border-t border-[#5a3696]/40">
        <div className="grid grid-cols-4 gap-1.5">
          {DIR_KEYS.map((key) => {
            const thumb = CHIBI_THUMBS[key];
            const isActive = direction === key;
            const dirLabel = t.directions[key];
            return (
              <button
                key={key}
                type="button"
                onClick={(e) => handleSelectDirection(key, e)}
                className={`bg-[#2e263f] p-1 flex flex-col items-center justify-center cursor-pointer transition-all ${
                  isActive
                    ? 'border-2 border-[#f6c833] scale-105'
                    : 'border border-[#5a3696] opacity-80 hover:opacity-100'
                }`}
              >
                <img
                  src={thumb.img}
                  alt={dirLabel}
                  className="pixelated-render w-9 h-9 object-contain"
                />
                <span
                  className={`text-[8px] font-['Space_Mono'] font-bold uppercase mt-0.5 ${
                    isActive ? 'text-[#f6c833]' : 'text-[#f3eeff]'
                  }`}
                >
                  {dirLabel}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
