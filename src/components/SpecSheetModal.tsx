import React from 'react';
import { X, Printer, FileText } from 'lucide-react';
import { Car, CarConfiguration } from '../types';
import { formatRuble, calculateCustomizationPrice } from '../utils/formatters';
import { audio } from '../utils/audio';

interface SpecSheetModalProps {
  car: Car | null;
  config: CarConfiguration | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SpecSheetModal: React.FC<SpecSheetModalProps> = ({
  car,
  config,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !car) return null;

  const effectiveConfig: CarConfiguration = config || {
    carId: car.id,
    selectedColorId: car.colors[0].id,
    selectedWheelId: car.wheels[0].id,
    selectedInteriorId: car.interiors[0].id,
    selectedWindowTint: 'none',
    selectedPackageIds: [],
    activeView: 'exterior',
    exteriorAngle: 'front',
    interiorAngle: 'cockpit',
    headlightsOn: false,
    studioLighting: 'studio',
  };

  const breakdown = calculateCustomizationPrice(car, effectiveConfig);

  const handlePrint = () => {
    audio.playClick(600);
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 print:p-0 print:bg-white print:text-black">
      <div className="relative w-full max-w-3xl bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden print:border-none print:shadow-none print:bg-white print:text-black">
        
        {/* Top Action Bar (hidden in print) */}
        <div className="p-4 sm:p-6 border-b border-neutral-800 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase">
            <FileText className="w-4 h-4" />
            <span>Официальная спецификация комплектации и выписка из ЭПТС</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Печать / Сохранить в PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Window Sticker Document Body */}
        <div className="p-6 sm:p-10 space-y-6 text-neutral-100 print:text-neutral-900 bg-neutral-950/50 print:bg-white">
          
          {/* Header Banner */}
          <div className="border-4 border-cyan-500/80 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-mono text-cyan-400 tracking-widest uppercase font-bold">
                ДИЛЕРСКИЙ ЦЕНТР AUTO HUB RUSSIA
              </div>
              <h1 className="font-display font-black text-2xl sm:text-3xl text-white print:text-black">
                {car.year} {car.name}
              </h1>
              <div className="text-xs font-mono text-neutral-400 mt-1">
                ЭПТС №: 16430{car.id.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10)}RU2025
              </div>
            </div>

            <div className="text-right border-t sm:border-t-0 sm:border-l border-neutral-800 sm:pl-6 pt-3 sm:pt-0">
              <div className="text-[10px] font-mono uppercase text-neutral-400">Итоговая стоимость с НДС</div>
              <div className="font-display font-black text-3xl text-cyan-400 print:text-black">
                {formatRuble(breakdown.totalPrice)}
              </div>
            </div>
          </div>

          {/* Technical Specs & Fuel Economy Block */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/60 print:bg-neutral-100 print:border-neutral-300 space-y-2 text-xs font-mono">
              <div className="font-bold text-white print:text-black uppercase text-sm border-b border-neutral-800 pb-1">
                Силовая установка и трансмиссия
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400 print:text-neutral-600">Двигатель:</span>
                <span>{car.specs.engine}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400 print:text-neutral-600">Мощность:</span>
                <span>{car.specs.horsepower} л.с.</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400 print:text-neutral-600">Разгон 0-100 км/ч:</span>
                <span>{car.specs.acceleration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400 print:text-neutral-600">Тип привода:</span>
                <span>{car.specs.drivetrain}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400 print:text-neutral-600">Коробка передач:</span>
                <span>{car.specs.transmission}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/60 print:bg-neutral-100 print:border-neutral-300 space-y-2 text-xs font-mono">
              <div className="font-bold text-white print:text-black uppercase text-sm border-b border-neutral-800 pb-1">
                Экономичность и габариты
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400 print:text-neutral-600">Расход / Запас хода:</span>
                <span className="font-bold text-cyan-400 print:text-black">{car.specs.rangeOrMpg}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400 print:text-neutral-600">Количество мест:</span>
                <span>{car.specs.seating} мест</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400 print:text-neutral-600">Объем багажника:</span>
                <span>{car.specs.cargoVolume}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400 print:text-neutral-600">Гарантия:</span>
                <span>3 года или 100 000 км пробега</span>
              </div>
            </div>
          </div>

          {/* Itemized Custom Installed Equipment */}
          <div className="p-5 rounded-xl border border-neutral-800 bg-neutral-900/60 print:bg-neutral-100 print:border-neutral-300 space-y-3">
            <h3 className="font-display font-bold text-base text-white print:text-black uppercase">
              Установленное заводское и дополнительное оборудование
            </h3>
            
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-neutral-800/80">
                <span>Базовая комплектация:</span>
                <span className="font-bold">{formatRuble(breakdown.basePrice)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-800/80">
                <span>Цвет кузова: {breakdown.selectedColorName}</span>
                <span>{breakdown.colorPrice === 0 ? 'ВКЛЮЧЕНО' : formatRuble(breakdown.colorPrice)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-800/80">
                <span>Колесные диски: {breakdown.selectedWheelName}</span>
                <span>{breakdown.wheelPrice === 0 ? 'ВКЛЮЧЕНО' : formatRuble(breakdown.wheelPrice)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-800/80">
                <span>Отделка интерьера: {breakdown.selectedInteriorName}</span>
                <span>{breakdown.interiorPrice === 0 ? 'ВКЛЮЧЕНО' : formatRuble(breakdown.interiorPrice)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-800/80">
                <span>Тонировка стёкол: {breakdown.selectedTintLabel}</span>
                <span>{breakdown.tintPrice === 0 ? 'ВКЛЮЧЕНО' : formatRuble(breakdown.tintPrice)}</span>
              </div>
              {breakdown.itemizedPackages.map((pkg, idx) => (
                <div key={idx} className="flex justify-between py-1 border-b border-neutral-800/80 text-cyan-400 print:text-black">
                  <span>+ Пакет оснащения: {pkg.name}</span>
                  <span>{formatRuble(pkg.price)}</span>
                </div>
              ))}
              <div className="flex justify-between py-1 border-b border-neutral-800/80 text-neutral-400">
                <span>Предпродажная подготовка и оформление в ГИБДД:</span>
                <span>БЕСПЛАТНО</span>
              </div>
            </div>

            <div className="pt-3 flex justify-between items-center text-sm font-mono font-bold">
              <span className="uppercase text-white print:text-black">Итоговая стоимость автомобиля со всеми опциями:</span>
              <span className="font-display text-2xl text-cyan-400 print:text-black">
                {formatRuble(breakdown.totalPrice)}
              </span>
            </div>
          </div>

          <div className="text-[10px] text-neutral-500 font-mono text-center">
            Документ сформирован в автоматизированной информационной системе AUTO HUB. Действителен для оформления кредитного договора и договора купли-продажи.
          </div>
        </div>

      </div>
    </div>
  );
};
