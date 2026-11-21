import React from 'react';
import { Check, Shield } from 'lucide-react';
import { PaintColor, WindowTint } from '../../types';
import { formatRuble } from '../../utils/formatters';
import { audio } from '../../utils/audio';

interface ColorSelectorProps {
  colors: PaintColor[];
  selectedColorId: string;
  onSelectColor: (colorId: string) => void;
  selectedWindowTint: WindowTint;
  onSelectWindowTint: (tint: WindowTint) => void;
}

export const ColorSelector: React.FC<ColorSelectorProps> = ({
  colors,
  selectedColorId,
  onSelectColor,
  selectedWindowTint,
  onSelectWindowTint,
}) => {
  const selectedColor = colors.find((c) => c.id === selectedColorId) || colors[0];

  const TINT_OPTIONS: { id: WindowTint; label: string; desc: string; price: number }[] = [
    { id: 'none', label: 'Без тонировки', desc: 'Заводское атермальное прозрачное остекление', price: 0 },
    { id: 'light', label: 'Лёгкая тонировка (35%)', desc: 'Атермальная солнцезащитная плёнка премиум-класса', price: 25000 },
    { id: 'deep', label: 'Бункер (5%)', desc: 'Глубокая защита от солнца и приватность салона', price: 45000 },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Paint Color Selection */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold text-white text-base">
              Цвет кузова и тип покрытия
            </h3>
            <p className="text-xs text-neutral-400">
              Многослойная электростатическая окраска с керамическим лаком
            </p>
          </div>
          <div className="text-right">
            <div className="text-xs font-mono font-bold text-white">
              {selectedColor.name}
            </div>
            <div className="text-[11px] font-mono text-cyan-400">
              {selectedColor.price === 0 ? 'Входит в стоимость' : `+${formatRuble(selectedColor.price)}`}
            </div>
          </div>
        </div>

        {/* Swatches Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-4 gap-3">
          {colors.map((color) => {
            const isSelected = color.id === selectedColorId;
            return (
              <button
                key={color.id}
                onClick={() => {
                  audio.playClick(900);
                  onSelectColor(color.id);
                }}
                title={`${color.name} (${color.type}) - ${color.price === 0 ? 'В базе' : formatRuble(color.price)}`}
                className={`group relative flex flex-col items-center p-2.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-neutral-800/90 border-cyan-400 ring-2 ring-cyan-500/40 shadow-lg shadow-cyan-500/20 scale-[1.03]'
                    : 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-850'
                }`}
              >
                {/* Swatch circle with metallic reflection */}
                <div
                  className="relative w-10 h-10 rounded-full border border-white/20 shadow-inner flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105"
                  style={{ backgroundColor: color.hex }}
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/60 pointer-events-none" />
                  {isSelected && (
                    <Check className="relative z-10 w-4 h-4 text-white drop-shadow-md stroke-[3]" />
                  )}
                </div>

                {/* Swatch Label */}
                <span className="text-[11px] font-medium text-neutral-300 mt-2 text-center line-clamp-1 group-hover:text-white">
                  {color.name.split(' ')[0]}
                </span>

                {/* Price badge */}
                <span className="text-[10px] font-mono text-neutral-400">
                  {color.price === 0 ? 'База' : `+${color.price / 1000}k`}
                </span>

                {color.type !== 'Металлик' && (
                  <span className="absolute -top-1.5 -right-1 px-1.5 py-0.2 rounded-full bg-cyan-950 border border-cyan-500/50 text-[9px] text-cyan-300 font-mono">
                    {color.type}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Window Tint Selection (Тонировка стёкол) */}
      <div className="space-y-3 pt-4 border-t border-neutral-800/80">
        <div>
          <h4 className="font-display font-bold text-white text-sm flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan-400" />
            Тонировка стёкол и солнцезащита
          </h4>
          <p className="text-xs text-neutral-400">
            Оригинальная атермальная плёнка с защитой от выгорания салона
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {TINT_OPTIONS.map((opt) => {
            const isSelected = selectedWindowTint === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => {
                  audio.playClick(800);
                  onSelectWindowTint(opt.id);
                }}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-neutral-800/90 border-cyan-400 ring-1 ring-cyan-500/40 text-white'
                    : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-white">{opt.label}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400 stroke-[3]" />}
                </div>
                <div className="text-[11px] text-neutral-400 mt-1 line-clamp-2">
                  {opt.desc}
                </div>
                <div className="mt-2 text-xs font-mono text-cyan-400">
                  {opt.price === 0 ? 'Входит в базу' : `+${formatRuble(opt.price)}`}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
