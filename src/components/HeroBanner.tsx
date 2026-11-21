import React from 'react';
import { ArrowRight, Sparkles, Gauge, Zap, ShieldCheck } from 'lucide-react';
import { audio } from '../utils/audio';

interface HeroBannerProps {
  onExploreClick: () => void;
  onCustomizeFeatured: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onExploreClick,
  onCustomizeFeatured,
}) => {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 border-b border-neutral-800/60 bg-gradient-to-b from-neutral-950 via-neutral-900/40 to-neutral-950">
      {/* Background Decorative Grid and Glow */}
      <div className="absolute inset-0 bg-carbon opacity-35 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-cyan-500/15 via-blue-600/10 to-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-950/40 text-cyan-400 text-xs font-mono uppercase tracking-wider backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
              <span>Флагманская линейка 2025 года в наличии с ЭПТС</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              СКОРОСТЬ. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500">
                ТЕХНОЛОГИИ.
              </span> <br />
              ПРЕВОСХОДСТВО.
            </h1>

            <p className="text-base sm:text-lg text-neutral-300 max-w-xl mx-auto lg:mx-0 font-light leading-relaxed">
              Официальный автоцентр и маркетплейс премиальных автомобилей, оригинального тюнинга и аксессуаров. Соберите индивидуальную конфигурацию в реальном времени.
            </p>

            {/* Quick Metrics Bar */}
            <div className="pt-2 grid grid-cols-3 gap-4 border-y border-neutral-800/80 py-4 max-w-lg mx-auto lg:mx-0">
              <div>
                <div className="font-display text-2xl font-bold text-white flex items-center justify-center lg:justify-start gap-1">
                  1 265 <span className="text-xs text-cyan-400 font-mono">Л.С.</span>
                </div>
                <div className="text-xs text-neutral-400 mt-0.5">Максимальная отдача</div>
              </div>
              <div>
                <div className="font-display text-2xl font-bold text-white flex items-center justify-center lg:justify-start gap-1">
                  2.07 с <span className="text-xs text-cyan-400 font-mono">0-100</span>
                </div>
                <div className="text-xs text-neutral-400 mt-0.5">Взрывной разгон</div>
              </div>
              <div>
                <div className="font-display text-2xl font-bold text-white flex items-center justify-center lg:justify-start gap-1">
                  600+ <span className="text-xs text-cyan-400 font-mono">КМ</span>
                </div>
                <div className="text-xs text-neutral-400 mt-0.5">Запас хода на заряде</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={() => {
                  audio.playClick(900);
                  onCustomizeFeatured();
                }}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-neutral-950 font-display font-bold text-sm tracking-wide uppercase transition-all duration-300 shadow-xl shadow-cyan-500/25 hover:shadow-cyan-400/40 hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Запустить 3D-конфигуратор</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  audio.playClick();
                  onExploreClick();
                }}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-neutral-700 bg-neutral-900/60 hover:bg-neutral-800 hover:border-neutral-500 text-neutral-200 font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Каталог автомобилей</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-4 text-xs text-neutral-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Официальная гарантия 3 года</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Льготный автокредит от 6.9%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Gauge className="w-4 h-4 text-cyan-400" />
                <span>Trade-in с выгодой до 500 000 ₽</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Featured Car Teaser */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900/60 p-2 shadow-2xl group">
              {/* Highlight vehicle badge */}
              <div className="absolute top-5 left-5 z-20 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-cyan-500/90 text-neutral-950 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                  Флагман года
                </span>
                <span className="px-2.5 py-1 rounded-full bg-neutral-950/80 border border-neutral-700 text-neutral-300 text-xs font-mono">
                  Porsche Taycan Turbo S
                </span>
              </div>

              {/* Image with subtle hover zoom */}
              <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-neutral-950">
                <img
                  src="https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=85"
                  alt="Porsche Taycan Turbo S"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />
                
                {/* Floating Price Pill */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between p-3 rounded-lg bg-neutral-950/85 border border-neutral-800 backdrop-blur-md">
                  <div>
                    <div className="text-[11px] text-neutral-400 font-mono uppercase">Цена в наличии</div>
                    <div className="font-display font-bold text-lg text-white">21 800 000 ₽</div>
                  </div>
                  <button
                    onClick={() => {
                      audio.playClick(950);
                      onCustomizeFeatured();
                    }}
                    className="px-3.5 py-1.5 rounded-md bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Настроить сборку
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
