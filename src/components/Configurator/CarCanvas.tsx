import React, { useState } from 'react';
import { 
  Eye, 
  Compass, 
  Zap, 
  Volume2, 
  Info
} from 'lucide-react';
import { Car, CarConfiguration, PaintColor } from '../../types';
import { audio } from '../../utils/audio';

interface CarCanvasProps {
  car: Car;
  config: CarConfiguration;
  onUpdateConfig: (partial: Partial<CarConfiguration>) => void;
  selectedColor: PaintColor;
}

interface Hotspot {
  id: string;
  x: number;
  y: number;
  title: string;
  description: string;
  tag: string;
}

const RUSSIAN_INTERIOR_HOTSPOTS: Hotspot[] = [
  {
    id: 'steering',
    x: 38,
    y: 58,
    title: 'Спортивный скошенный мультируль',
    description: 'Анатомический хват, перфорированная кожа Nappa, сенсорные клавиши управления и подрулевые лепестки из алюминия.',
    tag: 'Кокпит',
  },
  {
    id: 'infotainment',
    x: 58,
    y: 42,
    title: 'Изогнутый OLED-дисплей 17"',
    description: 'Дисплей сверхвысокого разрешения с голосовым AI-ассистентом, беспроводным Apple CarPlay/Android Auto и спутниковой 4K-навигацией.',
    tag: 'Мультимедиа',
  },
  {
    id: 'seats',
    x: 25,
    y: 72,
    title: 'Мультиконтурные кресла с массажем',
    description: '16 регулировок положения, активная боковая поддержка в поворотах, вентиляция и 8 режимов точечного массажа.',
    tag: 'Комфорт',
  },
  {
    id: 'roof',
    x: 65,
    y: 18,
    title: 'Электрохромная панорамная крыша',
    description: 'Стеклянная панель с переменной прозрачностью, блокировкой 99% ультрафиолета и контурной звездной подсветкой Starlight.',
    tag: 'Интерьер',
  },
];

export const CarCanvas: React.FC<CarCanvasProps> = ({
  car,
  config,
  onUpdateConfig,
  selectedColor,
}) => {
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);
  const [isRevving, setIsRevving] = useState(false);

  // Determine current image URL
  let currentImageUrl = car.images.exteriorFront;
  if (config.activeView === 'exterior') {
    if (config.exteriorAngle === 'front') currentImageUrl = car.images.exteriorFront;
    if (config.exteriorAngle === 'side') currentImageUrl = car.images.exteriorSide;
    if (config.exteriorAngle === 'rear') currentImageUrl = car.images.exteriorRear;
  } else {
    currentImageUrl = config.interiorAngle === 'cockpit' ? car.images.interiorCockpit : car.images.interiorCabin;
  }

  const handleRevEngine = () => {
    setIsRevving(true);
    audio.playEngineStart(car.fuelType === 'Электро' ? 'electric' : 'gasoline');
    setTimeout(() => setIsRevving(false), 900);
  };

  const handleToggleHeadlights = () => {
    const nextState = !config.headlightsOn;
    audio.playHeadlight(nextState);
    onUpdateConfig({ headlightsOn: nextState });
  };

  // Studio Lighting Background Style
  const getLightingBackground = () => {
    switch (config.studioLighting) {
      case 'neon':
        return 'from-neutral-950 via-cyan-950/30 to-purple-950/40';
      case 'sunset':
        return 'from-neutral-950 via-amber-950/30 to-rose-950/30';
      case 'stealth':
        return 'from-neutral-950 via-neutral-950 to-black';
      case 'studio':
      default:
        return 'from-neutral-950 via-neutral-900/60 to-neutral-950';
    }
  };

  return (
    <div className={`relative w-full rounded-2xl overflow-hidden border border-neutral-800 bg-gradient-to-b ${getLightingBackground()} p-4 sm:p-6 shadow-2xl transition-all duration-700 select-none`}>
      
      {/* Carbon Ambient Texture Overlay */}
      <div className="absolute inset-0 bg-carbon opacity-20 pointer-events-none" />

      {/* Dynamic Floor Spotlight / Underglow */}
      <div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-28 rounded-full blur-3xl pointer-events-none transition-all duration-500"
        style={{
          backgroundColor: config.activeView === 'exterior' ? selectedColor.glowColor : 'rgba(56, 189, 248, 0.15)',
        }}
      />

      {/* Top Controls Bar */}
      <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 mb-4">
        
        {/* View Switcher: Exterior vs Interior Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-neutral-950/80 border border-neutral-800/80 backdrop-blur-md">
          <button
            onClick={() => {
              audio.playClick(800);
              onUpdateConfig({ activeView: 'exterior' });
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
              config.activeView === 'exterior'
                ? 'bg-cyan-500 text-neutral-950 shadow-md shadow-cyan-500/25'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Экстерьер 360°</span>
          </button>

          <button
            onClick={() => {
              audio.playClick(800);
              onUpdateConfig({ activeView: 'interior' });
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
              config.activeView === 'interior'
                ? 'bg-cyan-500 text-neutral-950 shadow-md shadow-cyan-500/25'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Салон / Интерьер</span>
          </button>
        </div>

        {/* Dynamic Controls: Headlight, Sound Rev, Studio Lighting */}
        <div className="flex items-center gap-2">
          {/* Engine Sound Rev Button */}
          <button
            onClick={handleRevEngine}
            disabled={isRevving}
            title={car.fuelType === 'Электро' ? 'Звук электропривода' : 'Звук двигателя V8'}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer backdrop-blur-md ${
              isRevving
                ? 'bg-amber-500 text-neutral-950 border-amber-400 scale-105'
                : 'bg-neutral-950/80 border-neutral-800 text-neutral-300 hover:text-amber-400 hover:border-amber-500/50'
            }`}
          >
            <Volume2 className={`w-3.5 h-3.5 ${isRevving ? 'animate-bounce text-neutral-950' : 'text-amber-400'}`} />
            <span className="hidden sm:inline font-mono">
              {isRevving ? 'Обороты...' : car.fuelType === 'Электро' ? 'Звук мотора' : 'Звук выхлопа'}
            </span>
          </button>

          {/* Headlights Toggle (Exterior only) */}
          {config.activeView === 'exterior' && (
            <button
              onClick={handleToggleHeadlights}
              title={config.headlightsOn ? 'Выключить матричные фары' : 'Включить матричные фары'}
              className={`px-2.5 py-1.5 rounded-lg border text-xs font-mono transition-all cursor-pointer backdrop-blur-md flex items-center gap-1.5 ${
                config.headlightsOn
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-lg shadow-cyan-500/30'
                  : 'bg-neutral-950/80 border-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              <Zap className={`w-3.5 h-3.5 ${config.headlightsOn ? 'fill-cyan-400 text-cyan-400' : ''}`} />
              <span className="hidden sm:inline">{config.headlightsOn ? 'Фары ВКЛ' : 'Фары'}</span>
            </button>
          )}

          {/* Studio Lighting Environment Select */}
          <div className="flex items-center gap-1 p-1 rounded-lg bg-neutral-950/80 border border-neutral-800 text-xs">
            {([
              { id: 'studio', label: 'Шоурум' },
              { id: 'neon', label: 'Неон' },
              { id: 'sunset', label: 'Закат' },
              { id: 'stealth', label: 'Ночь' },
            ] as const).map((l) => (
              <button
                key={l.id}
                onClick={() => {
                  audio.playClick(700);
                  onUpdateConfig({ studioLighting: l.id });
                }}
                className={`px-2 py-1 rounded text-[11px] transition-colors cursor-pointer ${
                  config.studioLighting === l.id
                    ? 'bg-neutral-800 text-cyan-300 font-bold'
                    : 'text-neutral-500 hover:text-neutral-300'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Main Canvas Stage */}
      <div className="relative aspect-[16/9] w-full max-h-[520px] rounded-xl overflow-hidden flex items-center justify-center bg-black/40">
        
        {/* Matrix Headlight Beams Effect when enabled */}
        {config.activeView === 'exterior' && config.headlightsOn && (
          <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
            <div 
              className="absolute top-1/2 left-[15%] w-[450px] h-[160px] -translate-y-1/2 -rotate-12 bg-gradient-to-r from-cyan-400/35 via-sky-300/15 to-transparent blur-2xl animate-pulse"
              style={{ animationDuration: '3s' }}
            />
            <div 
              className="absolute top-[48%] left-[22%] w-12 h-12 rounded-full bg-cyan-200/80 blur-md"
            />
            <div 
              className="absolute top-[46%] left-[45%] w-8 h-8 rounded-full bg-cyan-200/60 blur-md"
            />
          </div>
        )}

        {/* The Live Interactive Car Image */}
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
          <img
            key={`${config.activeView}-${config.exteriorAngle}-${config.interiorAngle}`}
            src={currentImageUrl}
            alt={`${car.name} configured view`}
            className="w-full h-full object-contain transition-all duration-500 ease-out"
            style={{
              // Real-time paint dynamic CSS filter transformations for exterior view
              filter:
                config.activeView === 'exterior'
                  ? `hue-rotate(${selectedColor.filterStyle.hueRotate}) saturate(${selectedColor.filterStyle.saturate}) brightness(${selectedColor.filterStyle.brightness}) contrast(${selectedColor.filterStyle.contrast})`
                  : 'none',
            }}
          />

          {/* Window Tint Shade Overlay simulation */}
          {config.activeView === 'exterior' && config.selectedWindowTint !== 'none' && (
            <div
              className={`absolute inset-0 pointer-events-none transition-all duration-500 mix-blend-multiply ${
                config.selectedWindowTint === 'deep'
                  ? 'bg-neutral-950/30'
                  : 'bg-neutral-900/15'
              }`}
            />
          )}

          {/* Color Reflection Accent Blend Layer */}
          {config.activeView === 'exterior' && (
            <div
              className="absolute inset-0 pointer-events-none transition-all duration-500 mix-blend-color"
              style={{
                backgroundColor: selectedColor.hex,
                opacity: 0.18,
              }}
            />
          )}

          {/* Subtle Metallic Specular Lighting Overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/10 pointer-events-none" />

          {/* Interior Hotspots (when viewing cabin) */}
          {config.activeView === 'interior' &&
            RUSSIAN_INTERIOR_HOTSPOTS.map((spot) => (
              <div
                key={spot.id}
                style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
              >
                <button
                  onClick={() => {
                    audio.playClick(900);
                    setActiveHotspot(spot);
                  }}
                  className="relative group p-2 rounded-full cursor-pointer focus:outline-none"
                >
                  <span className="absolute inset-0 rounded-full bg-cyan-400/40 animate-ping" />
                  <span className="relative flex items-center justify-center w-6 h-6 rounded-full bg-cyan-500 text-neutral-950 font-bold shadow-lg shadow-cyan-500/50 group-hover:scale-125 transition-transform">
                    <Info className="w-3.5 h-3.5 stroke-[3]" />
                  </span>
                </button>
              </div>
            ))}
        </div>

        {/* Hotspot Info Modal Overlay */}
        {activeHotspot && (
          <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-xs z-30 p-4 rounded-xl bg-neutral-950/90 border border-cyan-500/60 shadow-2xl backdrop-blur-xl animate-fade-in">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
                {activeHotspot.tag}
              </span>
              <button
                onClick={() => setActiveHotspot(null)}
                className="text-xs text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <h4 className="font-display font-bold text-white text-sm mb-1">
              {activeHotspot.title}
            </h4>
            <p className="text-xs text-neutral-300 font-light leading-relaxed">
              {activeHotspot.description}
            </p>
          </div>
        )}

        {/* Realtime Config Spec Pill (Bottom Left) */}
        <div className="absolute bottom-4 left-4 z-20 hidden sm:flex items-center gap-2 p-2 rounded-xl bg-neutral-950/85 border border-neutral-800/80 backdrop-blur-md text-xs">
          <div
            className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
            style={{ backgroundColor: selectedColor.hex }}
          />
          <span className="font-medium text-white">{selectedColor.name}</span>
          <span className="text-neutral-500">•</span>
          <span className="text-neutral-300 font-mono text-[11px]">
            {car.wheels.find((w) => w.id === config.selectedWheelId)?.name.split(' ')[0]} {car.wheels.find((w) => w.id === config.selectedWheelId)?.name.split(' ')[1]}
          </span>
          <span className="text-neutral-500">•</span>
          <span className="text-cyan-400 font-mono text-[11px]">
            {config.selectedWindowTint === 'deep' ? 'Бункер 5%' : config.selectedWindowTint === 'light' ? 'Тонировка 35%' : 'Без тонировки'}
          </span>
        </div>

      </div>

      {/* Bottom Angle / Perspective Switcher Buttons */}
      <div className="relative z-20 mt-4 flex items-center justify-center gap-2">
        {config.activeView === 'exterior' ? (
          <>
            <button
              onClick={() => {
                audio.playClick(750);
                onUpdateConfig({ exteriorAngle: 'front' });
              }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                config.exteriorAngle === 'front'
                  ? 'bg-neutral-800 text-cyan-400 border border-cyan-500/40 shadow-md'
                  : 'bg-neutral-950/60 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              <span>Вид спереди 3/4</span>
            </button>

            <button
              onClick={() => {
                audio.playClick(750);
                onUpdateConfig({ exteriorAngle: 'side' });
              }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                config.exteriorAngle === 'side'
                  ? 'bg-neutral-800 text-cyan-400 border border-cyan-500/40 shadow-md'
                  : 'bg-neutral-950/60 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              <span>Вид сбоку (Профиль)</span>
            </button>

            <button
              onClick={() => {
                audio.playClick(750);
                onUpdateConfig({ exteriorAngle: 'rear' });
              }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                config.exteriorAngle === 'rear'
                  ? 'bg-neutral-800 text-cyan-400 border border-cyan-500/40 shadow-md'
                  : 'bg-neutral-950/60 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              <span>Вид сзади 3/4</span>
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => {
                audio.playClick(750);
                onUpdateConfig({ interiorAngle: 'cockpit' });
              }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                config.interiorAngle === 'cockpit'
                  ? 'bg-neutral-800 text-cyan-400 border border-cyan-500/40 shadow-md'
                  : 'bg-neutral-950/60 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              <span>Водительский кокпит</span>
            </button>

            <button
              onClick={() => {
                audio.playClick(750);
                onUpdateConfig({ interiorAngle: 'cabin' });
              }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                config.interiorAngle === 'cabin'
                  ? 'bg-neutral-800 text-cyan-400 border border-cyan-500/40 shadow-md'
                  : 'bg-neutral-950/60 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              <span>Пассажирский лаундж</span>
            </button>
          </>
        )}
      </div>

    </div>
  );
};
