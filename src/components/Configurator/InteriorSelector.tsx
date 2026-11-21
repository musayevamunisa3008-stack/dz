import React from 'react';
import { Check } from 'lucide-react';
import { InteriorOption } from '../../types';
import { formatRuble } from '../../utils/formatters';
import { audio } from '../../utils/audio';

interface InteriorSelectorProps {
  interiors: InteriorOption[];
  selectedInteriorId: string;
  onSelectInterior: (interiorId: string) => void;
  onSwitchToInteriorView: () => void;
}

export const InteriorSelector: React.FC<InteriorSelectorProps> = ({
  interiors,
  selectedInteriorId,
  onSelectInterior,
  onSwitchToInteriorView,
}) => {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display font-bold text-white text-base">
            Отделка салона и материалы интерьера
          </h3>
          <p className="text-xs text-neutral-400">
            Премиальная кожа ручной выделки и контрастная декоративная прострочка
          </p>
        </div>
        <button
          onClick={() => {
            audio.playClick(800);
            onSwitchToInteriorView();
          }}
          className="text-xs text-cyan-400 hover:text-cyan-300 font-mono underline cursor-pointer"
        >
          Смотреть салон →
        </button>
      </div>

      {/* Interior Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {interiors.map((interior) => {
          const isSelected = interior.id === selectedInteriorId;
          return (
            <button
              key={interior.id}
              onClick={() => {
                audio.playClick(850);
                onSelectInterior(interior.id);
              }}
              className={`p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer flex items-start gap-3 ${
                isSelected
                  ? 'bg-neutral-800/90 border-cyan-400 ring-2 ring-cyan-500/40 shadow-lg shadow-cyan-500/20'
                  : 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-850'
              }`}
            >
              {/* Material swatch square */}
              <div
                className="w-10 h-10 rounded-lg border border-white/20 shadow-md flex-shrink-0 flex items-center justify-center relative overflow-hidden"
                style={{ backgroundColor: interior.hex }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/50" />
                {isSelected && (
                  <Check className="relative z-10 w-4 h-4 text-white drop-shadow stroke-[3]" />
                )}
              </div>

              {/* Text content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <div className="font-display font-bold text-sm text-white truncate">
                    {interior.name}
                  </div>
                  <div className="text-xs font-mono text-cyan-400 flex-shrink-0">
                    {interior.price === 0 ? 'В базе' : `+${formatRuble(interior.price)}`}
                  </div>
                </div>
                <p className="text-[11px] text-neutral-400 line-clamp-2 mt-0.5 font-light leading-relaxed">
                  {interior.material}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
