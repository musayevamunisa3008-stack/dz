import React from 'react';
import { Search, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { ItemCategory, CarBodyType } from '../types';
import { formatRuble } from '../utils/formatters';
import { audio } from '../utils/audio';

interface FilterBarProps {
  selectedCategory: ItemCategory;
  onSelectCategory: (category: ItemCategory) => void;
  selectedBodyType: CarBodyType;
  onSelectBodyType: (body: CarBodyType) => void;
  selectedBrand: string;
  onSelectBrand: (brand: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  maxPrice: number;
  onMaxPriceChange: (price: number) => void;
  minPriceFloor: number;
  maxPriceCeiling: number;
  sortBy: 'popular' | 'price-asc' | 'price-desc' | 'power-desc';
  onSortChange: (sort: 'popular' | 'price-asc' | 'price-desc' | 'power-desc') => void;
  totalResultsCount: number;
  onResetFilters: () => void;
}

const CATEGORIES: { id: ItemCategory; label: string }[] = [
  { id: 'all', label: 'Все позиции (14+)' },
  { id: 'cars', label: 'Автомобили в наличии' },
  { id: 'tuning', label: 'Тюнинг и диски' },
  { id: 'accessories', label: 'Автоэлектроника & Аксессуары' },
];

const BODY_TYPES: CarBodyType[] = ['Все', 'Седан', 'Внедорожник', 'Спорткар', 'Электро'];

const BRANDS = ['Все бренды', 'BMW', 'Mercedes-Benz', 'Porsche', 'Tesla', 'Toyota', 'Zeekr', 'Audi'];

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedBodyType,
  onSelectBodyType,
  selectedBrand,
  onSelectBrand,
  searchQuery,
  onSearchChange,
  maxPrice,
  onMaxPriceChange,
  minPriceFloor,
  maxPriceCeiling,
  sortBy,
  onSortChange,
  totalResultsCount,
  onResetFilters,
}) => {
  return (
    <div className="w-full bg-neutral-900/75 border border-neutral-800 rounded-2xl p-4 sm:p-6 backdrop-blur-xl shadow-xl space-y-4">
      {/* Top Row: Categories Tabs */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  audio.playClick(750);
                  onSelectCategory(cat.id);
                }}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-cyan-500 text-neutral-950 font-bold shadow-md shadow-cyan-500/25 scale-[1.02]'
                    : 'bg-neutral-800/60 text-neutral-300 hover:bg-neutral-750 hover:text-white border border-neutral-700/50'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Search Input Box */}
        <div className="relative min-w-[260px] sm:min-w-[320px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Поиск по марке, модели, товару..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-950/80 border border-neutral-800 text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-200"
            >
              Сброс
            </button>
          )}
        </div>
      </div>

      {/* Middle Row: Subfilters (Body Type & Brand) */}
      {(selectedCategory === 'all' || selectedCategory === 'cars') && (
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-neutral-800/60">
          {/* Body Type Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <span className="text-xs font-mono text-neutral-400 mr-1 hidden sm:inline">Кузов:</span>
            {BODY_TYPES.map((bt) => (
              <button
                key={bt}
                onClick={() => {
                  audio.playClick(800);
                  onSelectBodyType(bt);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  selectedBodyType === bt
                    ? 'bg-neutral-800 text-cyan-300 border border-cyan-500/40 font-bold'
                    : 'bg-neutral-950/60 text-neutral-400 border border-neutral-800/80 hover:text-white'
                }`}
              >
                {bt}
              </button>
            ))}
          </div>

          {/* Brand Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-neutral-400">Марка:</span>
            <select
              value={selectedBrand}
              onChange={(e) => onSelectBrand(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-neutral-950/90 border border-neutral-800 text-xs text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              {BRANDS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Bottom Row: Price Slider & Sort Dropdown */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center pt-2 border-t border-neutral-800/70">
        
        {/* Price Slider */}
        <div className="md:col-span-6 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-400 font-mono">Бюджет (до):</span>
            <span className="font-display font-bold text-cyan-400 text-sm">
              {maxPrice >= maxPriceCeiling ? 'Без ограничений (35 млн ₽+)' : formatRuble(maxPrice)}
            </span>
          </div>
          <input
            type="range"
            min={minPriceFloor}
            max={maxPriceCeiling}
            step={250000}
            value={maxPrice}
            onChange={(e) => onMaxPriceChange(Number(e.target.value))}
            className="w-full accent-cyan-400 bg-neutral-800 h-1.5 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
            <span>{formatRuble(minPriceFloor)}</span>
            <span>15 000 000 ₽</span>
            <span>35 000 000 ₽+</span>
          </div>
        </div>

        {/* Sort & Reset */}
        <div className="md:col-span-6 flex items-center justify-start md:justify-end gap-3">
          {/* Sort By Select */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as any)}
              className="appearance-none pl-3 pr-8 py-2 rounded-xl bg-neutral-950/80 border border-neutral-800 text-xs text-neutral-200 focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value="popular">По популярности</option>
              <option value="price-asc">Сначала дешевле</option>
              <option value="price-desc">Сначала дороже</option>
              <option value="power-desc">По мощности (л.с.)</option>
            </select>
            <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Reset Filters Button */}
          <button
            onClick={() => {
              audio.playClick(600);
              onResetFilters();
            }}
            title="Сбросить все фильтры"
            className="p-2 rounded-xl border border-neutral-800 hover:border-neutral-700 bg-neutral-950/60 hover:bg-neutral-850 text-neutral-400 hover:text-cyan-400 transition-colors cursor-pointer flex items-center gap-1.5 text-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Сброс</span>
          </button>
        </div>
      </div>

      {/* Results Count Line */}
      <div className="flex items-center justify-between text-xs text-neutral-400 pt-1">
        <div>
          Найдено <span className="font-bold text-white">{totalResultsCount}</span> позиций в наличии
        </div>
        {searchQuery && (
          <span className="text-cyan-400 font-mono">
            По запросу: "{searchQuery}"
          </span>
        )}
      </div>
    </div>
  );
};
