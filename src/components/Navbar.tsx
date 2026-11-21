import React from 'react';
import { Volume2, VolumeX, GitCompare, Bookmark, ShoppingBag, Search, Sparkles, Compass, Wrench, ShieldCheck, Car as CarIcon } from 'lucide-react';
import { audio } from '../utils/audio';

interface NavbarProps {
  onScrollToCars: () => void;
  onScrollToTuning: () => void;
  onOpenConfiguratorDefault: () => void;
  onOpenCompare: () => void;
  onOpenCart: () => void;
  onOpenTestDrive: () => void;
  compareCount: number;
  favoritesCount: number;
  cartCount: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onScrollToCars,
  onScrollToTuning,
  onOpenConfiguratorDefault,
  onOpenCompare,
  onOpenCart,
  onOpenTestDrive,
  compareCount,
  favoritesCount,
  cartCount,
  searchQuery,
  onSearchChange,
}) => {
  const [isMuted, setIsMuted] = React.useState(audio.getIsMuted());

  const handleToggleSound = () => {
    const muted = audio.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      audio.playClick(600);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800/80 bg-neutral-950/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-3 cursor-pointer group flex-shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-sky-600 to-blue-700 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all duration-300">
            <CarIcon className="w-5 h-5 text-neutral-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-black text-xl tracking-wider text-white">AUTO</span>
              <span className="font-display font-medium text-xl tracking-widest text-cyan-400">HUB</span>
            </div>
            <p className="text-[10px] tracking-widest text-neutral-400 uppercase font-mono">Автоцентр & Маркетплейс</p>
          </div>
        </div>

        {/* Global Search Bar (Center-Left) */}
        <div className="hidden lg:flex items-center relative flex-1 max-w-xs xl:max-w-sm">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Поиск по марке, модели или товару..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-neutral-900/90 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-medium">
          <button
            onClick={() => {
              audio.playClick();
              onScrollToCars();
            }}
            className="text-neutral-300 hover:text-cyan-400 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Compass className="w-4 h-4 text-cyan-400" />
            Автомобили
          </button>
          
          <button
            onClick={() => {
              audio.playClick(900);
              onOpenConfiguratorDefault();
            }}
            className="text-neutral-300 hover:text-cyan-400 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            Конфигуратор
          </button>

          <button
            onClick={() => {
              audio.playClick();
              onScrollToTuning();
            }}
            className="text-neutral-300 hover:text-cyan-400 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Wrench className="w-4 h-4 text-sky-400" />
            Запчасти и тюнинг
          </button>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* Sound Toggle */}
          <button
            onClick={handleToggleSound}
            title={isMuted ? 'Включить звук мотора' : 'Выключить звук'}
            className="p-2.5 rounded-xl border border-neutral-800 bg-neutral-900/60 hover:bg-neutral-800 text-neutral-300 hover:text-cyan-400 transition-all cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-neutral-500" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>

          {/* Comparison Trigger */}
          <button
            onClick={() => {
              audio.playClick();
              onOpenCompare();
            }}
            className="relative p-2.5 rounded-xl border border-neutral-800 bg-neutral-900/60 hover:bg-neutral-800 text-neutral-300 hover:text-cyan-400 transition-all cursor-pointer"
            title="Сравнение автомобилей"
          >
            <GitCompare className="w-4 h-4" />
            {compareCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-cyan-500 text-neutral-950 rounded-full text-xs font-bold flex items-center justify-center animate-pulse">
                {compareCount}
              </span>
            )}
          </button>

          {/* Favorites Pill */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl border border-neutral-800 bg-neutral-900/60 text-xs text-neutral-300" title="В избранном">
            <Bookmark className={`w-3.5 h-3.5 ${favoritesCount > 0 ? 'text-amber-400 fill-amber-400' : 'text-neutral-500'}`} />
            <span>{favoritesCount}</span>
          </div>

          {/* Shopping Cart Drawer Trigger */}
          <button
            onClick={() => {
              audio.playClick(850);
              onOpenCart();
            }}
            className="relative p-2.5 rounded-xl border border-neutral-800 bg-neutral-900/60 hover:bg-neutral-800 text-neutral-300 hover:text-cyan-400 transition-all cursor-pointer"
            title="Корзина покупок"
          >
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gradient-to-r from-cyan-400 to-blue-500 text-neutral-950 rounded-full text-xs font-black flex items-center justify-center shadow-md shadow-cyan-500/50">
                {cartCount}
              </span>
            )}
          </button>

          {/* Reserve / Test Drive CTA */}
          <button
            onClick={() => {
              audio.playClick();
              onOpenTestDrive();
            }}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-neutral-950 font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-md shadow-cyan-500/20 hover:shadow-cyan-500/40 flex items-center gap-2 cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="hidden sm:inline">Тест-драйв</span>
            <span className="sm:hidden">Запись</span>
          </button>
        </div>
      </div>
    </header>
  );
};
