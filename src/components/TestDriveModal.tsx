import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Sparkles, Printer, ArrowRight } from 'lucide-react';
import { Car, CarConfiguration } from '../types';
import { formatRuble, calculateCustomizationPrice, calculateMonthlyPayment } from '../utils/formatters';
import { audio } from '../utils/audio';

interface TestDriveModalProps {
  car: Car | null;
  config?: CarConfiguration | null;
  isOpen: boolean;
  onClose: () => void;
}

const RUSSIAN_DEALERSHIPS = [
  { id: 'msk', name: 'Москва-Сити Flagship Salon', address: 'г. Москва, Пресненская наб., 12 (Башня Федерация)' },
  { id: 'spb', name: 'Санкт-Петербург Невский Лаундж', address: 'г. Санкт-Петербург, Невский пр., 140' },
  { id: 'sochi', name: 'Сочи Ривьера Автоцентр', address: 'г. Сочи, ул. Виноградная, 20/2' },
  { id: 'ekb', name: 'Екатеринбург Высоцкий Павильон', address: 'г. Екатеринбург, ул. Малышева, 51' },
];

export const TestDriveModal: React.FC<TestDriveModalProps> = ({
  car,
  config,
  isOpen,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dealership: RUSSIAN_DEALERSHIPS[0].id,
    date: '2025-05-20',
    timeSlot: '14:00 - 15:30 (Дневная сессия)',
    deliveryMode: 'showroom' as 'showroom' | 'concierge',
    paymentMethod: 'credit' as 'cash' | 'credit' | 'leasing' | 'tradein',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [reservationCode, setReservationCode] = useState('');

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
  const monthlyEstimate = calculateMonthlyPayment({
    totalPrice: breakdown.totalPrice,
    downPayment: breakdown.totalPrice * 0.2,
    termMonths: 48,
    annualInterestRate: 7.9,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    audio.playSuccess();
    const code = `AUTOHUB-${Math.floor(100000 + Math.random() * 900000)}`;
    setReservationCode(code);
    setIsSubmitted(true);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6">
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden animate-scale-up">
        
        {/* Modal Close Button */}
        <button
          onClick={() => {
            audio.playClick(600);
            setIsSubmitted(false);
            onClose();
          }}
          className="absolute top-5 right-5 z-20 p-2 rounded-full bg-neutral-950/80 border border-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSubmitted ? (
          <div>
            {/* Modal Header */}
            <div className="p-6 sm:p-8 border-b border-neutral-800/80 bg-neutral-950/40">
              <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-widest mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                VIP Тест-драйв & Официальное бронирование
              </div>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
                Забронировать {car.name}
              </h2>
              <p className="text-neutral-400 text-xs sm:text-sm mt-1 font-light">
                Зафиксируйте индивидуальную комплектацию и запишитесь на персональный трековый тест-драйв с экспертом дилерского центра.
              </p>

              {/* Vehicle Specs Bar */}
              <div className="mt-4 p-3.5 rounded-xl bg-neutral-950/80 border border-neutral-800 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={car.images.exteriorFront}
                    alt={car.name}
                    className="w-16 h-10 object-cover rounded-lg border border-neutral-800"
                  />
                  <div>
                    <div className="font-display font-bold text-sm text-white">{car.name}</div>
                    <div className="text-[11px] text-neutral-400 font-mono">
                      {breakdown.selectedColorName} • {breakdown.selectedWheelName.split(' ')[0]} • {breakdown.selectedTintLabel.split(' ')[0]}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-display font-black text-base text-cyan-400">
                    {formatRuble(breakdown.totalPrice)}
                  </div>
                  <div className="text-[10px] text-neutral-400 font-mono">
                    Кредит от {formatRuble(monthlyEstimate.monthlyPayment)}/мес
                  </div>
                </div>
              </div>
            </div>

            {/* Lead Capture Form */}
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1.5 uppercase tracking-wider">
                    Имя *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="Александр"
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1.5 uppercase tracking-wider">
                    Фамилия *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="Волков"
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1.5 uppercase tracking-wider">
                    Контактный телефон *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+7 (999) 000-00-00"
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1.5 uppercase tracking-wider">
                    Электронная почта *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="client@autohub.ru"
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
              </div>

              {/* Dealership Location */}
              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1.5 uppercase tracking-wider">
                  Дилерский центр AUTO HUB *
                </label>
                <select
                  value={formData.dealership}
                  onChange={(e) => setFormData({ ...formData, dealership: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors cursor-pointer"
                >
                  {RUSSIAN_DEALERSHIPS.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} — {d.address}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date & Time Slot */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1.5 uppercase tracking-wider">
                    Желаемая дата визита *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1.5 uppercase tracking-wider">
                    Временной интервал *
                  </label>
                  <select
                    value={formData.timeSlot}
                    onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors cursor-pointer"
                  >
                    <option>11:00 - 12:30 (Утренняя сессия)</option>
                    <option>14:00 - 15:30 (Дневная сессия)</option>
                    <option>18:00 - 19:30 (Вечерняя сессия на закате)</option>
                  </select>
                </div>
              </div>

              {/* Format selection */}
              <div className="pt-2">
                <label className="block text-xs font-mono text-neutral-400 mb-2 uppercase tracking-wider">
                  Формат встречи и способ оплаты
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setFormData({ ...formData, deliveryMode: 'showroom' })}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      formData.deliveryMode === 'showroom'
                        ? 'bg-neutral-800 border-cyan-400 text-white'
                        : 'bg-neutral-950/60 border-neutral-800 text-neutral-400'
                    }`}
                  >
                    <div className="font-bold text-xs">Визит в VIP-шоурум</div>
                    <div className="text-[11px] font-light mt-0.5">Встреча с персональным менеджером и заезд на треке</div>
                  </div>

                  <div
                    onClick={() => setFormData({ ...formData, deliveryMode: 'concierge' })}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      formData.deliveryMode === 'concierge'
                        ? 'bg-neutral-800 border-cyan-400 text-white'
                        : 'bg-neutral-950/60 border-neutral-800 text-neutral-400'
                    }`}
                  >
                    <div className="font-bold text-xs">Доставка авто к резиденции</div>
                    <div className="text-[11px] font-light mt-0.5">Тест-драйв по вашему привычному городскому маршруту</div>
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-neutral-950 font-display font-black text-sm uppercase tracking-wider transition-all duration-300 shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Подтвердить запись и зафиксировать комплектацию</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>
                <div className="text-center text-[11px] text-neutral-500 mt-2 flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Услуга тест-драйва бесплатна. Никаких скрытых платежей.
                </div>
              </div>
            </form>
          </div>
        ) : (
          /* Success Screen */
          <div className="p-8 sm:p-12 text-center space-y-6 animate-fade-in">
            <div className="w-20 h-20 rounded-full bg-cyan-500/10 border border-cyan-500/40 text-cyan-400 mx-auto flex items-center justify-center shadow-2xl shadow-cyan-500/20">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
                Заявка успешно зарегистрирована
              </div>
              <h2 className="font-display font-extrabold text-3xl text-white mt-1">
                Ждем вас, {formData.firstName}!
              </h2>
              <p className="text-neutral-300 text-sm max-w-md mx-auto mt-2 font-light">
                Персональный менеджер дилерского центра AUTO HUB уже закрепил за вами автомобиль <strong className="text-white">{car.name}</strong> и свяжется в течение 10 минут для подтверждения времени встречи.
              </p>
            </div>

            {/* Certificate Box */}
            <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 text-left max-w-md mx-auto space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center border-b border-neutral-800 pb-2">
                <span className="text-neutral-500 uppercase">Номер бронирования:</span>
                <span className="text-cyan-400 font-bold tracking-wider">{reservationCode}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-500">Автомобиль:</span>
                <span className="text-white font-bold">{car.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-500">Итоговая стоимость:</span>
                <span className="text-white font-bold">{formatRuble(breakdown.totalPrice)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-500">Дата визита:</span>
                <span className="text-white">{formData.date}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-500">Время:</span>
                <span className="text-white">{formData.timeSlot.split(' ')[0]}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={handlePrint}
                className="px-5 py-2.5 rounded-xl border border-neutral-700 bg-neutral-800 hover:bg-neutral-750 text-neutral-200 text-xs font-mono flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Распечатать ваучер</span>
              </button>

              <button
                onClick={() => {
                  audio.playClick(600);
                  setIsSubmitted(false);
                  onClose();
                }}
                className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-display font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Вернуться в каталог
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
