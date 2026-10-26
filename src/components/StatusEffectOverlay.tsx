import { PixelIcon, pixelText } from "./PixelIcon";
import React, { useEffect, useState } from 'react';
import { playRetroBeep } from '../utils/audioSynth';
export type StatusEffectType = 'shield' | 'invincible' | 'regen' | 'berserk';
interface StatusEffectOverlayProps {
  active: boolean;
  effect: StatusEffectType;
  duration?: number; // milliseconds
  onComplete?: () => void;
  className?: string;
  showBadge?: boolean;
}
interface EffectConfig {
  name: string;
  labelVi: string;
  labelEn: string;
  icon: string;
  primaryColor: string;
  glowColor: string;
  borderColor: string;
  bgGrad: string;
  soundType: 'shield' | 'invincible' | 'regen' | 'berserk';
}
export const STATUS_EFFECT_CONFIGS: Record<StatusEffectType, EffectConfig> = {
  shield: {
    name: 'Pixel Shield',
    labelVi: '🛡️ LÁ CHẮN PIXEL +999 DEF',
    labelEn: '🛡️ PIXEL SHIELD +999 DEF',
    icon: 'shield',
    primaryColor: '#45b7d1',
    glowColor: 'rgba(69, 183, 209, 0.7)',
    borderColor: '#45b7d1',
    bgGrad: 'radial-gradient(circle, rgba(69, 183, 209, 0.25) 0%, rgba(18, 10, 33, 0) 70%)',
    soundType: 'shield'
  },
  invincible: {
    name: 'Invincibility Glow',
    labelVi: '★ HÀO QUANG BẤT TỬ (STAR GLOW) ★',
    labelEn: '★ INVINCIBILITY STAR GLOW ★',
    icon: 'star',
    primaryColor: '#f6c833',
    glowColor: 'rgba(246, 200, 51, 0.85)',
    borderColor: '#f6c833',
    bgGrad: 'radial-gradient(circle, rgba(246, 200, 51, 0.35) 0%, rgba(217, 56, 118, 0.15) 50%, rgba(18, 10, 33, 0) 80%)',
    soundType: 'invincible'
  },
  regen: {
    name: 'Vitality Blessing',
    labelVi: '💖 HỒI PHỤC SINH MỆNH +100 HP',
    labelEn: '💖 VITALITY BLESSING +100 HP',
    icon: 'favorite',
    primaryColor: '#26c281',
    glowColor: 'rgba(38, 194, 129, 0.8)',
    borderColor: '#26c281',
    bgGrad: 'radial-gradient(circle, rgba(38, 194, 129, 0.3) 0%, rgba(18, 10, 33, 0) 75%)',
    soundType: 'regen'
  },
  berserk: {
    name: 'Mana Burst',
    labelVi: '⚡ BÙNG NỔ MA LỰC (SPEED x2)',
    labelEn: '⚡ MANA BURST (SPEED x2)',
    icon: 'bolt',
    primaryColor: '#d93876',
    glowColor: 'rgba(217, 56, 118, 0.85)',
    borderColor: '#d93876',
    bgGrad: 'radial-gradient(circle, rgba(217, 56, 118, 0.35) 0%, rgba(108, 63, 181, 0.2) 60%, rgba(18, 10, 33, 0) 85%)',
    soundType: 'berserk'
  }
};
export const StatusEffectOverlay: React.FC<StatusEffectOverlayProps> = ({
  active,
  effect,
  duration = 3200,
  onComplete,
  className = '',
  showBadge = true
}) => {
  const [progress, setProgress] = useState(100);
  const config = STATUS_EFFECT_CONFIGS[effect] || STATUS_EFFECT_CONFIGS.shield;

  // Sound and countdown on trigger
  useEffect(() => {
    if (!active) {
      setProgress(100);
      return;
    }

    // Play retro status sound
    playRetroBeep(config.soundType);
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remainingPct = Math.max(0, 100 - elapsed / duration * 100);
      setProgress(remainingPct);
      if (elapsed >= duration) {
        clearInterval(interval);
        if (onComplete) onComplete();
      }
    }, 40);
    return () => clearInterval(interval);
  }, [active, effect, duration, onComplete, config.soundType]);
  if (!active) return null;
  return <div className={`absolute inset-0 pointer-events-none z-20 flex items-center justify-center overflow-visible select-none ${className}`} style={{
    filter: `drop-shadow(0 0 12px ${config.glowColor})`
  }} aria-live="polite">
      {/* Radial Energy Background Aura */}
      <div className="absolute -inset-4 rounded-full animate-pulse transition-opacity duration-300" style={{
      background: config.bgGrad,
      opacity: 0.85
    }} />

      {/* Retro Pixelated Hex / Octagon Shield Matrix */}
      {pixelText(effect === 'shield' && <div className="absolute inset-0 flex items-center justify-center">
          {/* Hexagonal / Octagonal Pixel Shield Grid */}
          <div className="w-[124%] h-[124%] border-[3px] border-dashed border-[#45b7d1] rounded-2xl animate-spin" style={{
        animationDuration: '6s',
        boxShadow: 'inset 0 0 16px rgba(69, 183, 209, 0.5), 0 0 14px rgba(69, 183, 209, 0.8)'
      }} />
          {/* Inner Counter-Rotating Hex Barrier */}
          <div className="absolute w-[112%] h-[112%] border-2 border-[#f3eeff]/80 rounded-xl" style={{
        transform: 'rotate(45deg)',
        boxShadow: '0 0 10px #45b7d1'
      }} />
          {/* Corner Shield Rivets */}
          <span className="absolute -top-1 -left-1 w-2 h-2 bg-[#f3eeff] border border-black shadow-[1px_1px_0px_#000]" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#f3eeff] border border-black shadow-[1px_1px_0px_#000]" />
          <span className="absolute -bottom-1 -left-1 w-2 h-2 bg-[#f3eeff] border border-black shadow-[1px_1px_0px_#000]" />
          <span className="absolute -bottom-1 -right-1 w-2 h-2 bg-[#f3eeff] border border-black shadow-[1px_1px_0px_#000]" />
        </div>)}

      {/* Invincibility Star Glow */}
      {pixelText(effect === 'invincible' && <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {/* Rotating Sunburst / Star Ray Aura */}
          <div className="w-[130%] h-[130%] rounded-full border-[3px] border-dotted border-[#f6c833] animate-spin" style={{
        animationDuration: '3s',
        boxShadow: '0 0 20px #f6c833, inset 0 0 15px rgba(246, 200, 51, 0.6)'
      }} />
          {/* Orbiting Sparkle Stars */}
          <span className="absolute -top-3 text-[#f6c833] text-sm animate-bounce">{pixelText("★")}</span>
          <span className="absolute -bottom-3 text-[#f6c833] text-sm animate-bounce" style={{
        animationDelay: '0.15s'
      }}>{pixelText("★")}</span>
          <span className="absolute -left-3 text-[#f6c833] text-sm animate-bounce" style={{
        animationDelay: '0.3s'
      }}>{pixelText("★")}</span>
          <span className="absolute -right-3 text-[#f6c833] text-sm animate-bounce" style={{
        animationDelay: '0.45s'
      }}>{pixelText("★")}</span>
          {/* Prismatic Shimmer */}
          <div className="absolute inset-0 rounded-lg animate-pulse" style={{
        background: 'linear-gradient(45deg, rgba(246,200,51,0.2), rgba(217,56,118,0.2), rgba(69,183,209,0.2))',
        mixBlendMode: 'screen'
      }} />
        </div>)}

      {/* Vitality Regen Effect */}
      {pixelText(effect === 'regen' && <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[120%] h-[120%] rounded-full border-2 border-dashed border-[#26c281] animate-pulse" style={{
        boxShadow: '0 0 18px rgba(38, 194, 129, 0.7)'
      }} />
          <span className="absolute -top-4 text-[#26c281] font-bold text-xs animate-bounce">{pixelText("💖 +100 HP")}</span>
          <span className="absolute -bottom-2 text-[#26c281] text-xs">{pixelText("▲")}</span>
        </div>)}

      {/* Berserk Mana Burst Effect */}
      {pixelText(effect === 'berserk' && <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[125%] h-[125%] border-[3px] border-[#d93876] rounded-lg animate-pulse" style={{
        boxShadow: '0 0 22px rgba(217, 56, 118, 0.8), inset 0 0 12px rgba(108, 63, 181, 0.6)',
        transform: 'rotate(2deg)'
      }} />
          <span className="absolute -top-3 text-[#f6c833] font-bold text-xs animate-ping">{pixelText("⚡")}</span>
          <span className="absolute -bottom-3 text-[#d93876] font-bold text-[10px]">SPEED x2</span>
        </div>)}

      {/* Floating Status Badge at top */}
      {pixelText(showBadge && <div className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap z-30">
          <div className="px-2 py-0.5 text-[9px] font-['Space_Mono'] font-bold rounded shadow-[2px_2px_0px_#000] border-2 flex items-center gap-1 animate-bounce" style={{
        backgroundColor: '#120a21',
        color: config.primaryColor,
        borderColor: config.borderColor,
        boxShadow: `0 0 8px ${config.glowColor}, 2px 2px 0px #0a0514`
      }}>
            <span className="w-1.5 h-1.5 rounded-full inline-block animate-ping" style={{
          backgroundColor: config.primaryColor
        }} />
            <span>{pixelText(config.labelVi)}</span>
          </div>
        </div>)}

      {/* Mini 8-Bit Countdown Bar at bottom */}
      <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-20 h-1.5 bg-[#120a21] border border-black p-[1px] shadow-[1px_1px_0px_#000]">
        <div className="h-full transition-all ease-linear duration-75" style={{
        width: `${progress}%`,
        backgroundColor: config.primaryColor,
        boxShadow: `0 0 6px ${config.primaryColor}`
      }} />
      </div>
    </div>;
};
