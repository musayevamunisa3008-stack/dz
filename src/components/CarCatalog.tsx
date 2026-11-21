import React, { useMemo, useState } from 'react';
import { FilterBar } from './FilterBar';
import { CarCard } from './CarCard';
import { ProductCard } from './ProductCard';
import { Car, AccessoryProduct, Product, ItemCategory, CarBodyType } from '../types';
import { GitCompare, ArrowRight, X } from 'lucide-react';
import { audio } from '../utils/audio';

interface CarCatalogProps {
  cars: Car[];
  accessories: AccessoryProduct[];
  onCustomizeCar: (car: Car) => void;
  onAddToCart: (product: Product) => void;
  comparedCars: Car[];
  onToggleCompare: (car: Car) => void;
  onClearCompare: () => void;
  onOpenCompareModal: () => void;
  favoriteIds: string[];
  onToggleFavorite: (carId: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const CarCatalog: React.FC<CarCatalogProps> = ({
  cars,
  accessories,
  onCustomizeCar,
  onAddToCart,
  comparedCars,
  onToggleCompare,
  onClearCompare,
  onOpenCompareModal,
  favoriteIds,
  onToggleFavorite,
  searchQuery,
  onSearchChange,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory>('all');
  const [selectedBodyType, setSelectedBodyType] = useState<CarBodyType>('Все');
  const [selectedBrand, setSelectedBrand] = useState('Все бренды');
  const [maxPrice, setMaxPrice] = useState<number>(36000000);
  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc' | 'power-desc'>('popular');

  // Filter cars
  const filteredCars = useMemo(() => {
    if (selectedCategory === 'tuning' || selectedCategory === 'accessories') {
      return [];
    }

    return cars
      .filter((car) => {
        // Body Type check
        if (selectedBodyType !== 'Все' && car.bodyType !== selectedBodyType) {
          return false;
        }
        // Brand check
        if (selectedBrand !== 'Все бренды' && car.brand !== selectedBrand) {
          return false;
        }
        // Price check
        if (maxPrice < 35000000 && car.basePrice > maxPrice) {
          return false;
        }
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = car.name.toLowerCase().includes(q);
          const matchBrand = car.brand.toLowerCase().includes(q);
          const matchTag = car.tagline.toLowerCase().includes(q);
          const matchSpecs = `${car.specs.horsepower} л.с. ${car.specs.engine} ${car.specs.drivetrain}`.toLowerCase().includes(q);
          if (!matchName && !matchBrand && !matchTag && !matchSpecs) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'price-asc':
            return a.basePrice - b.basePrice;
          case 'price-desc':
            return b.basePrice - a.basePrice;
          case 'power-desc':
            return b.specs.horsepower - a.specs.horsepower;
          case 'popular':
          default:
            return 0;
        }
      });
  }, [cars, selectedCategory, selectedBodyType, selectedBrand, maxPrice, searchQuery, sortBy]);

  // Filter accessories
  const filteredAccessories = useMemo(() => {
    if (selectedCategory === 'cars') {
      return [];
    }

    return accessories
      .filter((item) => {
        if (selectedCategory === 'tuning' && item.type !== 'tuning') {
          return false;
        }
        if (selectedCategory === 'accessories' && item.type !== 'accessories') {
          return false;
        }
        if (maxPrice < 35000000 && item.basePrice > maxPrice) {
          return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = item.name.toLowerCase().includes(q);
          const matchBrand = item.brand.toLowerCase().includes(q);
          const matchDesc = item.shortDesc.toLowerCase().includes(q);
          const matchCompat = item.compatibility.toLowerCase().includes(q);
          if (!matchName && !matchBrand && !matchDesc && !matchCompat) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'price-asc':
            return a.basePrice - b.basePrice;
          case 'price-desc':
            return b.basePrice - a.basePrice;
          default:
            return 0;
        }
      });
  }, [accessories, selectedCategory, maxPrice, searchQuery, sortBy]);

  const totalResultsCount = filteredCars.length + filteredAccessories.length;

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedBodyType('Все');
    setSelectedBrand('Все бренды');
    setMaxPrice(36000000);
    setSortBy('popular');
    onSearchChange('');
  };

  return (
    <section id="showroom-catalog" className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 scroll-mt-20 space-y-12">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-widest mb-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            Маркетплейс AUTO HUB
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
            Каталог автомобилей и аксессуаров
          </h2>
        </div>
        <p className="text-neutral-400 text-sm max-w-md font-light leading-relaxed">
          Все представленные автомобили имеют действующий электронный ПТС (ЭПТС) и готовы к выдаче в день обращения.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div>
        <FilterBar
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          selectedBodyType={selectedBodyType}
          onSelectBodyType={setSelectedBodyType}
          selectedBrand={selectedBrand}
          onSelectBrand={setSelectedBrand}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          maxPrice={maxPrice}
          onMaxPriceChange={setMaxPrice}
          minPriceFloor={30000}
          maxPriceCeiling={36000000}
          sortBy={sortBy}
          onSortChange={setSortBy}
          totalResultsCount={totalResultsCount}
          onResetFilters={handleResetFilters}
        />
      </div>

      {/* Cars Grid Section */}
      {filteredCars.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <h3 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              Автомобили в наличии ({filteredCars.length})
            </h3>
            <span className="text-xs text-neutral-400 font-mono">
              Гарантия 3 года или 100 000 км
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCars.map((car) => (
              <CarCard
                key={car.id}
                car={car}
                onCustomize={onCustomizeCar}
                onAddToCart={onAddToCart}
                onToggleCompare={onToggleCompare}
                isCompared={comparedCars.some((c) => c.id === car.id)}
                onToggleFavorite={onToggleFavorite}
                isFavorite={favoriteIds.includes(car.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Accessories & Tuning Grid Section */}
      {filteredAccessories.length > 0 && (
        <div id="tuning-section" className="space-y-6 pt-6">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <h3 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
              Оригинальный тюнинг, кованые диски и аксессуары ({filteredAccessories.length})
            </h3>
            <span className="text-xs text-neutral-400 font-mono">
              Оригинальная продукция с установкой в дилерском центре
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAccessories.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {totalResultsCount === 0 && (
        <div className="text-center py-20 px-4 rounded-2xl border border-neutral-800 bg-neutral-900/40 backdrop-blur-md space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-neutral-800 flex items-center justify-center text-neutral-400">
            <GitCompare className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold font-display text-white">
            По вашему запросу ничего не найдено
          </h3>
          <p className="text-neutral-400 text-sm max-w-md mx-auto">
            Попробуйте скорректировать поисковый запрос, расширить диапазон цен или сбросить фильтры.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
          >
            Сбросить все фильтры
          </button>
        </div>
      )}

      {/* Floating Comparison Bar */}
      {comparedCars.length > 0 && (
        <aside aria-label="Сравнение автомобилей" className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-2xl px-4 animate-bounce-in">
          <div className="bg-neutral-900/90 border border-cyan-500/50 rounded-2xl p-3 sm:p-4 shadow-2xl backdrop-blur-xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 overflow-x-auto">
              <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-400 font-bold whitespace-nowrap">
                <GitCompare className="w-4 h-4" />
                <span>Сравнение ({comparedCars.length}/3):</span>
              </div>
              <div className="flex items-center gap-2">
                {comparedCars.map((c) => (
                  <span
                    key={c.id}
                    className="px-2.5 py-1 rounded-lg bg-neutral-800 text-xs text-neutral-200 border border-neutral-700 flex items-center gap-1.5 whitespace-nowrap"
                  >
                    {c.name.split(' ')[0]} {c.name.split(' ')[1]}
                    <button
                      onClick={() => onToggleCompare(c)}
                      className="text-neutral-400 hover:text-white"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={onClearCompare}
                className="text-xs text-neutral-400 hover:text-white underline cursor-pointer"
              >
                Очистить
              </button>
              <button
                onClick={() => {
                  audio.playClick(900);
                  onOpenCompareModal();
                }}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <span>Сравнить</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </aside>
      )}
    </section>
  );
};
