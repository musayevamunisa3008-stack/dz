import React from 'react';
import { Sparkles, Gauge, Zap, Flame, GitCompare, Bookmark, Check, ShoppingBag, Palette } from 'lucide-react';
import { Car } from '../types';
import { formatRuble, calculateMonthlyPayment } from '../utils/formatters';
import { audio } from '../utils/audio';

interface CarCardProps {
  car: Car;
  onCustomize: (car: Car) => void;
  onAddToCart: (car: Car) => void;
  onToggleCompare: (car: Car) => void;
  isCompared: boolean;
  onToggleFavorite: (carId: string) => void;
  isFavorite: boolean;
}

export const CarCard: React.FC<CarCardProps> = ({
  car,
  onCustomize,
  onAddToCart,
  onToggleCompare,
  isCompared,
  onToggleFavorite,
  isFavorite,
}) => {
  const monthlyEstimate = calculateMonthlyPayment({
    totalPrice: car.basePrice,
    downPayment: car.basePrice * 0.2,
    termMonths: 48,
    annualInterestRate: 7.9,
  });

  return (
    <div className="group relative rounded-2xl border border-neutral-800/80 bg-neutral-900/60 hover:border-cyan-500/50 transition-all duration-300 flex flex-col overflow-hidden backdrop-blur-md hover:shadow-2xl hover:shadow-cyan-500/10 hover:-translate-y-1">
      {/* Top Image Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-950">
        <img
          src={car.images.exteriorFront}
          alt={car.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Ambient Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent opacity-80" />

        {/* Top Badges */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10">
          <div className="flex items-center gap-1.5">
            <span className="px-2.5 py-1 rounded-full bg-neutral-950/80 border border-neutral-700/60 text-xs font-mono font-semibold text-white backdrop-blur-md">
              {car.year}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-medium backdrop-blur-md">
              {car.bodyType}
            </span>
            {car.badge && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500/90 text-neutral-950 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> {car.badge}
              </span>
            )}
          </div>

          {/* Quick Actions (Favorite & Compare) */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                audio.playClick(900);
                onToggleFavorite(car.id);
              }}
              title={isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
              className="p-2 rounded-full bg-neutral-950/70 border border-neutral-700/60 text-neutral-300 hover:text-amber-400 hover:border-amber-400/50 backdrop-blur-md transition-colors cursor-pointer"
            >
              <Bookmark className={`w-3.5 h-3.5 ${isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                audio.playClick(650);
                onToggleCompare(car);
              }}
              title={isCompared ? 'Удалить из сравнения' : 'Сравнить автомобиль'}
              className={`p-2 rounded-full border backdrop-blur-md transition-colors cursor-pointer ${
                isCompared
                  ? 'bg-cyan-500 text-neutral-950 border-cyan-400'
                  : 'bg-neutral-950/70 border-neutral-700/60 text-neutral-300 hover:text-cyan-400 hover:border-cyan-400/50'
              }`}
            >
              {isCompared ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <GitCompare className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Mileage / Condition Floor Pill */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2 text-[11px] font-mono text-neutral-300 bg-neutral-950/80 px-2.5 py-1 rounded-md border border-neutral-800 backdrop-blur-md">
          <span>{car.mileage}</span>
          <span>•</span>
          <span className="text-cyan-400">{car.fuelType}</span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        
        {/* Title & Brand */}
        <div>
          <div className="text-xs uppercase tracking-wider text-cyan-400 font-mono font-medium">
            {car.brand}
          </div>
          <h3 className="font-display text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
            {car.name}
          </h3>
          <p className="text-xs text-neutral-400 line-clamp-1 mt-1 font-light">
            {car.tagline}
          </p>
        </div>

        {/* Specs Highlights Grid */}
        <div className="grid grid-cols-3 gap-2 py-3 px-3.5 rounded-xl bg-neutral-950/60 border border-neutral-800/80 text-center font-mono">
          <div>
            <div className="text-[10px] text-neutral-500 flex items-center justify-center gap-1">
              <Zap className="w-3 h-3 text-cyan-400" /> Мощность
            </div>
            <div className="text-sm font-bold text-white font-display mt-0.5">
              {car.specs.horsepower} л.с.
            </div>
          </div>

          <div className="border-x border-neutral-800">
            <div className="text-[10px] text-neutral-500 flex items-center justify-center gap-1">
              <Gauge className="w-3 h-3 text-amber-400" /> 0-100
            </div>
            <div className="text-sm font-bold text-white font-display mt-0.5">
              {car.specs.acceleration.replace(' до 100', '')}
            </div>
          </div>

          <div>
            <div className="text-[10px] text-neutral-500 flex items-center justify-center gap-1">
              {car.fuelType === 'Электро' ? (
                <Zap className="w-3 h-3 text-emerald-400" />
              ) : (
                <Flame className="w-3 h-3 text-orange-400" />
              )}
              Запас/Расход
            </div>
            <div className="text-sm font-bold text-white font-display mt-0.5 truncate">
              {car.specs.rangeOrMpg.split(' ')[0]} {car.specs.rangeOrMpg.split(' ')[1]}
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div>
          <div className="text-[10px] uppercase font-mono tracking-wider text-neutral-400">
            Стоимость в салоне
          </div>
          <div className="font-display text-xl sm:text-2xl font-black text-white">
            {formatRuble(car.basePrice)}
          </div>
          <div className="text-[11px] text-neutral-400 font-light">
            В кредит от <span className="text-cyan-400 font-medium">{formatRuble(monthlyEstimate.monthlyPayment)}/мес</span>
          </div>
        </div>

        {/* Action Buttons: Customize & Add to Cart */}
        <div className="pt-2 border-t border-neutral-800/80 flex items-center gap-2">
          {/* Customize Color & Photos CTA */}
          <button
            onClick={() => {
              audio.playClick(900);
              onCustomize(car);
            }}
            className="flex-1 py-2.5 px-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-display font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-md shadow-cyan-500/20 hover:shadow-cyan-400/40 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Настроить цвет / Фото</span>
          </button>

          {/* Quick Add to Cart button */}
          <button
            onClick={() => {
              audio.playClick(800);
              onAddToCart(car);
            }}
            title="Добавить автомобиль в корзину"
            className="p-2.5 rounded-xl border border-neutral-700 bg-neutral-800 hover:bg-neutral-750 hover:border-cyan-500 text-neutral-200 hover:text-cyan-400 transition-colors cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
