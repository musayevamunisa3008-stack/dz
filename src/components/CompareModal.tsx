import React from 'react';
import { X, ArrowRight } from 'lucide-react';
import { Car } from '../types';
import { formatRuble } from '../utils/formatters';
import { audio } from '../utils/audio';

interface CompareModalProps {
  cars: Car[];
  isOpen: boolean;
  onClose: () => void;
  onRemoveCar: (car: Car) => void;
  onCustomizeCar: (car: Car) => void;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  cars,
  isOpen,
  onClose,
  onRemoveCar,
  onCustomizeCar,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6">
      <div className="relative w-full max-w-5xl bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-cyan-400">
              Сравнительная таблица характеристик
            </div>
            <h2 className="font-display font-black text-2xl text-white">
              Сравнение автомобилей
            </h2>
          </div>

          <button
            onClick={() => {
              audio.playClick(600);
              onClose();
            }}
            className="p-2 rounded-full bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Table / Cards */}
        <div className="p-6 overflow-x-auto">
          {cars.length === 0 ? (
            <div className="text-center py-12 text-neutral-400">
              Нет выбранных автомобилей для сравнения. Нажмите кнопку "Сравнить" на карточке любого авто в каталоге.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {cars.map((car) => (
                <div
                  key={car.id}
                  className="rounded-2xl border border-neutral-800 bg-neutral-950/80 p-5 flex flex-col justify-between space-y-4"
                >
                  {/* Top Image + Remove */}
                  <div className="relative aspect-[16/10] rounded-xl overflow-hidden">
                    <img
                      src={car.images.exteriorFront}
                      alt={car.name}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => onRemoveCar(car)}
                      className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-neutral-950/80 text-neutral-400 hover:text-white border border-neutral-700 cursor-pointer"
                      title="Удалить из сравнения"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Title & Price */}
                  <div>
                    <div className="text-xs font-mono text-cyan-400 uppercase">{car.brand}</div>
                    <h3 className="font-display font-bold text-lg text-white">{car.name}</h3>
                    <div className="font-display font-black text-xl text-white mt-1">
                      {formatRuble(car.basePrice)}
                    </div>
                  </div>

                  {/* Specifications Grid */}
                  <div className="space-y-2 text-xs border-y border-neutral-800/80 py-3 font-mono">
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Мощность:</span>
                      <span className="text-white font-bold">{car.specs.horsepower} л.с.</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Разгон 0-100:</span>
                      <span className="text-white font-bold">{car.specs.acceleration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Макс. скорость:</span>
                      <span className="text-white">{car.specs.topSpeed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Запас/Расход:</span>
                      <span className="text-cyan-400">{car.specs.rangeOrMpg}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Привод:</span>
                      <span className="text-white">{car.specs.drivetrain}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Трансмиссия:</span>
                      <span className="text-neutral-300 truncate max-w-[140px]">{car.specs.transmission}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Объем багажника:</span>
                      <span className="text-white">{car.specs.cargoVolume}</span>
                    </div>
                  </div>

                  {/* Select CTA */}
                  <button
                    onClick={() => {
                      audio.playClick(900);
                      onCustomizeCar(car);
                      onClose();
                    }}
                    className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Настроить в 3D</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
