import React from 'react';
import { Check } from 'lucide-react';
import { PackageOption } from '../../types';
import { formatRuble } from '../../utils/formatters';
import { audio } from '../../utils/audio';

interface PackagesSelectorProps {
  packages: PackageOption[];
  selectedPackageIds: string[];
  onTogglePackage: (pkgId: string) => void;
}

export const PackagesSelector: React.FC<PackagesSelectorProps> = ({
  packages,
  selectedPackageIds,
  onTogglePackage,
}) => {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h3 className="font-display font-bold text-white text-base">
          Пакеты опций и интеллектуальные ассистенты
        </h3>
        <p className="text-xs text-neutral-400">
          Заводские пакеты технологического оснащения и аэродинамических доработок
        </p>
      </div>

      {/* Package Items */}
      <div className="space-y-3">
        {packages.map((pkg) => {
          const isSelected = selectedPackageIds.includes(pkg.id);
          return (
            <div
              key={pkg.id}
              onClick={() => {
                audio.playClick(isSelected ? 600 : 950);
                onTogglePackage(pkg.id);
              }}
              className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer ${isSelected
                  ? 'bg-neutral-800/80 border-cyan-400 ring-1 ring-cyan-500/30 shadow-lg shadow-cyan-500/10'
                  : 'bg-neutral-900/50 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-850'
                }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  {/* Checkbox button */}
                  <div
                    className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${isSelected
                        ? 'bg-cyan-500 border-cyan-400 text-neutral-950'
                        : 'border-neutral-700 bg-neutral-950/80 text-transparent'
                      }`}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>

                  <div>
                    <h4 className="font-display font-bold text-sm text-white flex items-center gap-2">
                      {pkg.name}
                    </h4>
                    <p className="text-xs text-neutral-300 font-light mt-0.5">
                      {pkg.description}
                    </p>

                    {/* Features checklist bullets */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 mt-2.5 pt-2 border-t border-neutral-800/60">
                      {pkg.features.map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-[11px] text-neutral-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/80" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div className="text-right flex-shrink-0">
                  <div className="font-display font-bold text-sm text-white">
                    +{formatRuble(pkg.price)}
                  </div>
                  <span className="text-[10px] font-mono text-neutral-400">
                    {isSelected ? 'Добавлено' : 'Опция'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
