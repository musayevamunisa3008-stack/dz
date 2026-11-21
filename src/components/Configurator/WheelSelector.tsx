import React from 'react';
import { Check, Disc3 } from 'lucide-react';
import { WheelOption } from '../../types';
import { formatRuble } from '../../utils/formatters';
import { audio } from '../../utils/audio';

interface WheelSelectorProps {
  wheels: WheelOption[];
  selectedWheelId: string;
  onSelectWheel: (wheelId: string) => void;
}

export const WheelSelector: React.FC<WheelSelectorProps> = ({
  wheels,
  selectedWheelId,
  onSelectWheel,
}) => {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display font-bold text-white text-base">
            Колёсные диски и резина
          </h3>
          <p className="text-xs text-neutral-400">
            Легкосплавные и кованые диски с эффективным охлаждением тормозной системы
          </p>
        </div>
      </div>

      {/* Wheels List Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {wheels.map((wheel) => {
          const isSelected = wheel.id === selectedWheelId;
          return (
            <button
              key={wheel.id}
              onClick={() => {
                audio.playClick(850);
                onSelectWheel(wheel.id);
              }}
              className={`p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-neutral-800/90 border-cyan-400 ring-2 ring-cyan-500/40 shadow-lg shadow-cyan-500/20'
                  : 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-850'
              }`}
            >
              {/* Top row with Size pill and selection status */}
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded bg-neutral-950 border border-neutral-700 text-xs font-mono font-bold text-white flex items-center gap-1">
                  <Disc3 className="w-3.5 h-3.5 text-cyan-400" />
                  R{wheel.size}
                </span>
                {isSelected ? (
                  <span className="w-5 h-5 rounded-full bg-cyan-500 text-neutral-950 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </span>
                ) : (
                  <span className="text-xs font-mono text-neutral-400">
                    {wheel.price === 0 ? 'В базе' : `+${formatRuble(wheel.price)}`}
                  </span>
                )}
              </div>

              {/* Wheel Name and Description */}
              <div className="space-y-1">
                <div className="font-display font-bold text-sm text-white">
                  {wheel.name}
                </div>
                <p className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed font-light">
                  {wheel.style}
                </p>
              </div>

              {/* Bottom Price confirmation if selected */}
              {isSelected && (
                <div className="mt-2 pt-2 border-t border-neutral-700/60 text-[11px] font-mono text-cyan-400 flex items-center justify-between">
                  <span>Выбрано</span>
                  <span>{wheel.price === 0 ? 'Базовая комплектация' : `+${formatRuble(wheel.price)}`}</span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
