import React, { useState } from 'react';
import { 
  Calculator, 
  Share2, 
  FileText, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck, 
  ArrowRight,
  ShoppingBag
} from 'lucide-react';
import { Car, CarConfiguration } from '../../types';
import { 
  formatRuble, 
  calculateCustomizationPrice, 
  calculateMonthlyPayment 
} from '../../utils/formatters';
import { audio } from '../../utils/audio';

interface PricingCalculatorProps {
  car: Car;
  config: CarConfiguration;
  onOpenTestDrive: () => void;
  onOpenSpecSheet: () => void;
  onAddToCart: (configuredCar: Car, config: CarConfiguration, totalPrice: number) => void;
}

export const PricingCalculator: React.FC<PricingCalculatorProps> = ({
  car,
  config,
  onOpenTestDrive,
  onOpenSpecSheet,
  onAddToCart,
}) => {
  const [paymentType, setPaymentType] = useState<'finance' | 'lease' | 'cash'>('finance');
  const [termMonths, setTermMonths] = useState<12 | 24 | 36 | 48 | 60 | 72>(36);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);
  const [showItemized, setShowItemized] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const breakdown = calculateCustomizationPrice(car, config);
  const downPaymentAmount = Math.round((breakdown.totalPrice * downPaymentPercent) / 100);

  const financeCalculation = calculateMonthlyPayment({
    totalPrice: breakdown.totalPrice,
    downPayment: downPaymentAmount,
    termMonths,
    annualInterestRate: 7.9,
    isLease: paymentType === 'lease',
  });

  const handleShare = () => {
    audio.playClick(950);
    navigator.clipboard?.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  const handleAddToCart = () => {
    audio.playSuccess();
    onAddToCart(car, config, breakdown.totalPrice);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2500);
  };

  return (
    <div className="bg-neutral-900/85 border border-neutral-800 rounded-2xl p-5 sm:p-6 backdrop-blur-xl shadow-2xl space-y-6 sticky top-24">
      {/* Top Header: Vehicle and Live Total Price */}
      <div className="border-b border-neutral-800/80 pb-4">
        <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
          {car.brand} • Индивидуальная комплектация
        </div>
        <h3 className="font-display font-extrabold text-2xl text-white mt-0.5">
          {car.name}
        </h3>

        {/* Live Total Price Display */}
        <div className="mt-3 flex items-baseline justify-between">
          <span className="text-xs text-neutral-400 uppercase font-mono tracking-wider">
            Итоговая стоимость
          </span>
          <div className="text-right">
            <span className="font-display font-black text-2xl sm:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400">
              {formatRuble(breakdown.totalPrice)}
            </span>
          </div>
        </div>

        {/* Quick Itemized Price Toggle */}
        <button
          onClick={() => setShowItemized(!showItemized)}
          className="mt-2.5 text-xs text-neutral-400 hover:text-cyan-300 flex items-center gap-1 transition-colors cursor-pointer"
        >
          <span>{showItemized ? 'Скрыть детализацию расчета' : 'Показать детализацию опций'}</span>
          {showItemized ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {/* Itemized List */}
        {showItemized && (
          <div className="mt-3 pt-3 border-t border-neutral-800 space-y-1.5 text-xs animate-fade-in font-mono">
            <div className="flex justify-between text-neutral-300">
              <span>Базовая стоимость:</span>
              <span>{formatRuble(breakdown.basePrice)}</span>
            </div>
            <div className="flex justify-between text-neutral-300">
              <span>Цвет ({breakdown.selectedColorName}):</span>
              <span>{breakdown.colorPrice === 0 ? 'В базе' : formatRuble(breakdown.colorPrice)}</span>
            </div>
            <div className="flex justify-between text-neutral-300">
              <span>Диски ({breakdown.selectedWheelName}):</span>
              <span>{breakdown.wheelPrice === 0 ? 'В базе' : formatRuble(breakdown.wheelPrice)}</span>
            </div>
            <div className="flex justify-between text-neutral-300">
              <span>Салон ({breakdown.selectedInteriorName}):</span>
              <span>{breakdown.interiorPrice === 0 ? 'В базе' : formatRuble(breakdown.interiorPrice)}</span>
            </div>
            <div className="flex justify-between text-neutral-300">
              <span>Тонировка ({breakdown.selectedTintLabel}):</span>
              <span>{breakdown.tintPrice === 0 ? 'В базе' : formatRuble(breakdown.tintPrice)}</span>
            </div>
            {breakdown.itemizedPackages.map((pkg, i) => (
              <div key={i} className="flex justify-between text-cyan-400">
                <span>+ {pkg.name}:</span>
                <span>{formatRuble(pkg.price)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Financing Calculator Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-mono text-neutral-300">
            <Calculator className="w-4 h-4 text-cyan-400" />
            <span>Кредит и лизинг</span>
          </div>
          <span className="text-[11px] text-emerald-400 font-mono">Ставка от 7.9%</span>
        </div>

        {/* Payment Type Tabs: Finance vs Lease vs Cash */}
        <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-neutral-950/80 border border-neutral-800">
          {(['finance', 'lease', 'cash'] as const).map((type) => (
            <button
              key={type}
              onClick={() => {
                audio.playClick(800);
                setPaymentType(type);
              }}
              className={`py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                paymentType === type
                  ? 'bg-cyan-500 text-neutral-950 shadow-md font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {type === 'finance' ? 'Кредит' : type === 'lease' ? 'Лизинг' : 'Наличные'}
            </button>
          ))}
        </div>

        {paymentType !== 'cash' ? (
          <>
            {/* Down Payment Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-neutral-400">Первый взнос ({downPaymentPercent}%):</span>
                <span className="font-bold text-white">{formatRuble(downPaymentAmount)}</span>
              </div>
              <input
                type="range"
                min={0}
                max={50}
                step={5}
                value={downPaymentPercent}
                onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                className="w-full accent-cyan-400 bg-neutral-800 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
                <button onClick={() => setDownPaymentPercent(0)} className="hover:text-cyan-400 cursor-pointer">0%</button>
                <button onClick={() => setDownPaymentPercent(10)} className="hover:text-cyan-400 cursor-pointer">10%</button>
                <button onClick={() => setDownPaymentPercent(20)} className="hover:text-cyan-400 cursor-pointer">20%</button>
                <button onClick={() => setDownPaymentPercent(30)} className="hover:text-cyan-400 cursor-pointer">30%</button>
                <button onClick={() => setDownPaymentPercent(50)} className="hover:text-cyan-400 cursor-pointer">50%</button>
              </div>
            </div>

            {/* Loan Term Selector (12, 36, 60 months etc.) */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-neutral-400">Срок кредитования:</span>
                <span className="font-bold text-white">{termMonths} месяцев</span>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5">
                {([12, 24, 36, 48, 60, 72] as const).map((months) => (
                  <button
                    key={months}
                    onClick={() => {
                      audio.playClick(750);
                      setTermMonths(months);
                    }}
                    className={`py-1.5 text-xs rounded-lg font-mono transition-colors cursor-pointer ${
                      termMonths === months
                        ? 'bg-neutral-800 text-cyan-400 border border-cyan-500/50 font-bold'
                        : 'bg-neutral-950/70 text-neutral-400 border border-neutral-800 hover:text-white'
                    }`}
                  >
                    {months}м
                  </button>
                ))}
              </div>
            </div>

            {/* Monthly Payment Result Card */}
            <div className="p-3.5 rounded-xl bg-neutral-950/80 border border-cyan-500/30 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                  {paymentType === 'lease' ? 'Ежемесячный лизинговый платеж' : 'Платеж по автокредиту'}
                </div>
                <div className="text-xs text-neutral-400 font-light mt-0.5">
                  Одобрение за 15 минут онлайн
                </div>
              </div>
              <div className="text-right">
                <span className="font-display font-black text-xl sm:text-2xl text-cyan-400">
                  {formatRuble(financeCalculation.monthlyPayment)}
                </span>
                <span className="text-xs text-neutral-400 font-mono">/мес</span>
              </div>
            </div>
          </>
        ) : (
          <div className="p-3.5 rounded-xl bg-neutral-950/80 border border-neutral-800 text-xs text-neutral-300 font-light leading-relaxed">
            Прямая безналичная оплата или наличный расчет в кассе дилерского центра при получении автомобиля.
          </div>
        )}
      </div>

      {/* Primary Action Buttons */}
      <div className="space-y-2.5 pt-2 border-t border-neutral-800/80">
        {/* Add configured car to cart */}
        <button
          onClick={handleAddToCart}
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-neutral-950 font-display font-black text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer"
        >
          {addedSuccess ? (
            <>
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Сборка добавлена в корзину!</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" />
              <span>Добавить сборку в корзину</span>
            </>
          )}
        </button>

        {/* Book Test Drive Button */}
        <button
          onClick={() => {
            audio.playClick(900);
            onOpenTestDrive();
          }}
          className="w-full py-3 px-4 rounded-xl border border-cyan-500/40 bg-neutral-950/90 hover:bg-neutral-850 text-cyan-300 hover:text-white font-display font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Записаться на тест-драйв</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        {/* Secondary Buttons: Spec Sheet & Share */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              audio.playClick(750);
              onOpenSpecSheet();
            }}
            className="py-2.5 px-3 rounded-xl border border-neutral-800 bg-neutral-950/60 hover:bg-neutral-800 text-neutral-300 hover:text-white text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span>Паспорт (ЭПТС)</span>
          </button>

          <button
            onClick={handleShare}
            className="py-2.5 px-3 rounded-xl border border-neutral-800 bg-neutral-950/60 hover:bg-neutral-800 text-neutral-300 hover:text-white text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {copiedShare ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Скопировано!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Поделиться</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Trust reassurance */}
      <div className="pt-2 text-[11px] text-neutral-400 flex items-center justify-center gap-1.5 text-center">
        <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
        <span>Бронирование автомобиля онлайн без скрытых комиссий</span>
      </div>
    </div>
  );
};
