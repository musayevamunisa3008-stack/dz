import React, { useState } from 'react';
import { X, ArrowLeft, RotateCcw } from 'lucide-react';
import { Car, CarConfiguration } from '../../types';
import { CarCanvas } from './CarCanvas';
import { ColorSelector } from './ColorSelector';
import { WheelSelector } from './WheelSelector';
import { InteriorSelector } from './InteriorSelector';
import { PackagesSelector } from './PackagesSelector';
import { PricingCalculator } from './PricingCalculator';
import { audio } from '../../utils/audio';

interface ConfiguratorModalProps {
  car: Car;
  isOpen: boolean;
  onClose: () => void;
  onOpenTestDrive: (configuredCar: Car, config: CarConfiguration) => void;
  onOpenSpecSheet: (configuredCar: Car, config: CarConfiguration) => void;
  onAddToCart: (configuredCar: Car, config: CarConfiguration, totalPrice: number) => void;
}

export const ConfiguratorModal: React.FC<ConfiguratorModalProps> = ({
  car,
  isOpen,
  onClose,
  onOpenTestDrive,
  onOpenSpecSheet,
  onAddToCart,
}) => {
  const [config, setConfig] = useState<CarConfiguration>({
    carId: car.id,
    selectedColorId: car.colors[0]?.id || '',
    selectedWheelId: car.wheels[0]?.id || '',
    selectedInteriorId: car.interiors[0]?.id || '',
    selectedWindowTint: 'none',
    selectedPackageIds: [],
    activeView: 'exterior',
    exteriorAngle: 'front',
    interiorAngle: 'cockpit',
    headlightsOn: false,
    studioLighting: 'studio',
  });

  const [activeTab, setActiveTab] = useState<'paint' | 'wheels' | 'interior' | 'packages'>('paint');

  if (!isOpen) return null;

  const selectedColor = car.colors.find((c) => c.id === config.selectedColorId) || car.colors[0];

  const handleUpdateConfig = (partial: Partial<CarConfiguration>) => {
    setConfig((prev) => ({ ...prev, ...partial }));
  };

  const handleResetConfig = () => {
    audio.playClick(600);
    setConfig({
      carId: car.id,
      selectedColorId: car.colors[0]?.id || '',
      selectedWheelId: car.wheels[0]?.id || '',
      selectedInteriorId: car.interiors[0]?.id || '',
      selectedWindowTint: 'none',
      selectedPackageIds: [],
      activeView: 'exterior',
      exteriorAngle: 'front',
      interiorAngle: 'cockpit',
      headlightsOn: false,
      studioLighting: 'studio',
    });
  };

  const handleTogglePackage = (pkgId: string) => {
    setConfig((prev) => {
      const exists = prev.selectedPackageIds.includes(pkgId);
      return {
        ...prev,
        selectedPackageIds: exists
          ? prev.selectedPackageIds.filter((id) => id !== pkgId)
          : [...prev.selectedPackageIds, pkgId],
      };
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/95 backdrop-blur-2xl flex flex-col justify-start">
      {/* Top Sticky Navigation Bar */}
      <div className="sticky top-0 z-30 w-full border-b border-neutral-800 bg-neutral-950/90 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              audio.playClick(700);
              onClose();
            }}
            className="p-2 rounded-xl border border-neutral-800 bg-neutral-900 text-neutral-300 hover:text-white hover:border-neutral-700 transition-colors cursor-pointer flex items-center gap-1.5 text-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Вернуться в шоурум</span>
          </button>

          <div className="h-4 w-px bg-neutral-800" />

          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-cyan-400">
              3D Студия конфигуратора
            </div>
            <h2 className="font-display font-extrabold text-base sm:text-lg text-white">
              {car.name} <span className="text-neutral-500 font-normal">({car.year})</span>
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Reset configuration */}
          <button
            onClick={handleResetConfig}
            title="Сбросить до заводской комплектации"
            className="p-2 rounded-xl border border-neutral-800 bg-neutral-900/80 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Close button */}
          <button
            onClick={() => {
              audio.playClick(700);
              onClose();
            }}
            className="p-2 rounded-xl border border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Studio Body Container */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left / Center Column: Visual Car Canvas & Config Tabs (8 cols) */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            
            {/* Real-time Car Stage */}
            <CarCanvas
              car={car}
              config={config}
              onUpdateConfig={handleUpdateConfig}
              selectedColor={selectedColor}
            />

            {/* Customization Navigation Tabs */}
            <div className="border-b border-neutral-800 pb-px">
              <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto">
                <button
                  onClick={() => {
                    audio.playClick(800);
                    setActiveTab('paint');
                    handleUpdateConfig({ activeView: 'exterior' });
                  }}
                  className={`pb-3 text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer relative whitespace-nowrap ${
                    activeTab === 'paint'
                      ? 'text-cyan-400 border-b-2 border-cyan-400 font-bold'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  1. Цвет и тонировка
                </button>

                <button
                  onClick={() => {
                    audio.playClick(800);
                    setActiveTab('wheels');
                    handleUpdateConfig({ activeView: 'exterior' });
                  }}
                  className={`pb-3 text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer relative whitespace-nowrap ${
                    activeTab === 'wheels'
                      ? 'text-cyan-400 border-b-2 border-cyan-400 font-bold'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  2. Диски и колёса
                </button>

                <button
                  onClick={() => {
                    audio.playClick(800);
                    setActiveTab('interior');
                    handleUpdateConfig({ activeView: 'interior' });
                  }}
                  className={`pb-3 text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer relative whitespace-nowrap ${
                    activeTab === 'interior'
                      ? 'text-cyan-400 border-b-2 border-cyan-400 font-bold'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  3. Отделка салона
                </button>

                <button
                  onClick={() => {
                    audio.playClick(800);
                    setActiveTab('packages');
                  }}
                  className={`pb-3 text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer relative whitespace-nowrap ${
                    activeTab === 'packages'
                      ? 'text-cyan-400 border-b-2 border-cyan-400 font-bold'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  4. Пакеты оснащения
                </button>
              </div>
            </div>

            {/* Customization Options Content Card */}
            <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-5 sm:p-6 backdrop-blur-xl shadow-xl">
              {activeTab === 'paint' && (
                <ColorSelector
                  colors={car.colors}
                  selectedColorId={config.selectedColorId}
                  onSelectColor={(id) => handleUpdateConfig({ selectedColorId: id })}
                  selectedWindowTint={config.selectedWindowTint}
                  onSelectWindowTint={(tint) => handleUpdateConfig({ selectedWindowTint: tint })}
                />
              )}

              {activeTab === 'wheels' && (
                <WheelSelector
                  wheels={car.wheels}
                  selectedWheelId={config.selectedWheelId}
                  onSelectWheel={(id) => handleUpdateConfig({ selectedWheelId: id })}
                />
              )}

              {activeTab === 'interior' && (
                <InteriorSelector
                  interiors={car.interiors}
                  selectedInteriorId={config.selectedInteriorId}
                  onSelectInterior={(id) => handleUpdateConfig({ selectedInteriorId: id })}
                  onSwitchToInteriorView={() => handleUpdateConfig({ activeView: 'interior' })}
                />
              )}

              {activeTab === 'packages' && (
                <PackagesSelector
                  packages={car.packages}
                  selectedPackageIds={config.selectedPackageIds}
                  onTogglePackage={handleTogglePackage}
                />
              )}
            </div>

          </div>

          {/* Right Column: Dynamic Pricing & Financing Calculator (4 cols) */}
          <div className="lg:col-span-5 xl:col-span-4">
            <PricingCalculator
              car={car}
              config={config}
              onOpenTestDrive={() => onOpenTestDrive(car, config)}
              onOpenSpecSheet={() => onOpenSpecSheet(car, config)}
              onAddToCart={onAddToCart}
            />
          </div>

        </div>
      </div>
    </div>
  );
};
