import React from 'react';
import { Phone, Mail, ShieldCheck, Clock, Award, Globe } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-neutral-800 bg-neutral-950 text-neutral-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">

        {/* Top 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Col 1: Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-display font-black">
                A
              </div>
              <span className="font-display font-black text-lg tracking-wider text-white">AUTO HUB</span>
            </div>
            <p className="text-neutral-400 font-light leading-relaxed">
              Флагманский автомобильный маркетплейс и дилерский центр. Продажа новых автомобилей с действующим ЭПТС, оригинального тюнинга и аксессуаров.
            </p>
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-[11px]">
              <Award className="w-4 h-4" />
              <span>Дилер года в премиальном сегменте 2024–2025</span>
            </div>
          </div>

          {/* Col 2: Showroom Locations */}
          <div className="space-y-3 font-mono">
            <h4 className="font-display font-bold text-white uppercase tracking-wider text-sm">
              Дилерские центры
            </h4>
            <div className="space-y-2">
              <div>
                <div className="text-white font-medium">Москва-Сити Flagship</div>
                <div className="text-neutral-500">Пресненская наб., 12 (Башня Федерация)</div>
              </div>
              <div>
                <div className="text-white font-medium">Санкт-Петербург Лаундж</div>
                <div className="text-neutral-500">Невский проспект, 140</div>
              </div>
              <div>
                <div className="text-white font-medium">Сочи Ривьера Павильон</div>
                <div className="text-neutral-500">ул. Виноградная, 20/2</div>
              </div>
            </div>
          </div>

          {/* Col 3: VIP Concierge & Hours */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-white uppercase tracking-wider text-sm">
              Отдел продаж и сервис
            </h4>
            <div className="space-y-2 font-mono text-[11px]">
              <div className="flex items-center gap-2 text-neutral-300">
                <Phone className="w-3.5 h-3.5 text-cyan-400" />
                <span>+7 (800) 700-AUTO (28-86)</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-300">
                <Mail className="w-3.5 h-3.5 text-cyan-400" />
                <span>vip-sales@autohub.ru</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-300">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Ежедневно: с 09:00 до 21:00 МСК</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-300">
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span>Доставка закрытым автовозом по всей РФ</span>
              </div>
            </div>
          </div>

          {/* Col 4: Trust & Guarantees */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-white uppercase tracking-wider text-sm">
              Гарантии AUTO HUB
            </h4>
            <ul className="space-y-2 text-neutral-400 font-light">
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Юридическая чистота и действующий ЭПТС</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Полная диагностика по 160 пунктам регламента</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Автокредитование от ведущих банков РФ</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Бесплатное первое ТО и детейлинг-мойка</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-neutral-500 font-mono text-[11px]">
          <div>
            © 2025 AUTO HUB Motors Group Russia. Все права защищены. Все цены указаны в рублях с учетом НДС 20%.
          </div>
          <div className="flex items-center gap-4">
            <a href="#privacy" className="hover:text-cyan-400 transition-colors">Конфиденциальность</a>
            <a href="#terms" className="hover:text-cyan-400 transition-colors">Условия бронирования</a>
            <a href="#compliance" className="hover:text-cyan-400 transition-colors">Лицензия автодилера</a>
          </div>
        </div>

      </div>
    </footer>
  );
};
