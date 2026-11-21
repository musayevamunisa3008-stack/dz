import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, ShieldCheck, Check } from 'lucide-react';
import { CartItem, Car } from '../types';
import { formatRuble } from '../utils/formatters';
import { audio } from '../utils/audio';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (cartItemId: string, delta: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout,
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoMessage, setPromoMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const totalRawSum = items.reduce((acc, item) => acc + item.itemTotalPrice * item.quantity, 0);
  const discountAmount = Math.round((totalRawSum * discountPercent) / 100);
  const finalSum = Math.max(0, totalRawSum - discountAmount);

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (code === 'AUTOHUB5' || code === 'VIP5') {
      setDiscountPercent(5);
      setPromoMessage('Скидка 5% успешно применена!');
      audio.playSuccess();
    } else if (code === 'APEX10') {
      setDiscountPercent(10);
      setPromoMessage('Специальная клиентская скидка 10% применена!');
      audio.playSuccess();
    } else {
      setPromoMessage('Неверный промокод. Попробуйте AUTOHUB5');
      audio.playClick(400);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-neutral-950/80 backdrop-blur-md flex justify-end">
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Slide-over Drawer */}
      <aside aria-label="Корзина покупок" className="relative z-10 w-full max-w-lg bg-neutral-900 border-l border-neutral-800 h-full flex flex-col shadow-2xl animate-slide-left">
        {/* Drawer Header */}
        <div className="p-5 sm:p-6 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-lg text-white">
                Корзина покупок
              </h3>
              <p className="text-xs text-neutral-400 font-mono">
                {items.length === 0 ? 'Нет товаров' : `${items.length} ${items.length === 1 ? 'позиция' : 'позиции'}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                onClick={onClearCart}
                title="Очистить корзину"
                className="text-xs text-neutral-400 hover:text-rose-400 transition-colors p-2"
              >
                Очистить
              </button>
            )}
            <button
              onClick={() => {
                audio.playClick(600);
                onClose();
              }}
              className="p-2 rounded-xl bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Items List Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-20 px-4 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-neutral-800/80 border border-neutral-700 mx-auto flex items-center justify-center text-neutral-500">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-display font-bold text-white text-base">
                  Ваша корзина пуста
                </h4>
                <p className="text-xs text-neutral-400 mt-1 max-w-xs mx-auto">
                  Выберите автомобиль или тюнинг-аксессуары в каталоге для оформления бронирования
                </p>
              </div>
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Перейти в каталог
              </button>
            </div>
          ) : (
            items.map((item) => {
              const isCar = item.product.type === 'car';
              const carProduct = isCar ? (item.product as Car) : null;
              const imageUrl = isCar && carProduct
                ? carProduct.images.exteriorFront
                : (item.product as any).imageUrl;

              return (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl border border-neutral-800 bg-neutral-950/70 space-y-3 relative group"
                >
                  <div className="flex gap-3.5 items-start">
                    {/* Item Image */}
                    <div className="w-20 h-16 rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 flex-shrink-0">
                      <img
                        src={imageUrl}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="text-[10px] font-mono text-cyan-400 uppercase">
                            {item.product.brand}
                          </div>
                          <h4 className="font-display font-bold text-sm text-white truncate">
                            {item.product.name}
                          </h4>
                        </div>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-neutral-500 hover:text-rose-400 transition-colors p-1"
                          title="Удалить"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Config summary for cars */}
                      {isCar && carProduct && item.configuration && (
                        <div className="mt-1 text-[11px] text-neutral-400 font-mono space-y-0.5">
                          <div>
                            Цвет:{' '}
                            <span className="text-white">
                              {carProduct.colors?.find((c: any) => c.id === item.configuration?.selectedColorId)?.name || 'Обсидиан'}
                            </span>
                          </div>
                          <div>
                            Тонировка:{' '}
                            <span className="text-cyan-400">
                              {item.configuration.selectedWindowTint === 'deep' ? 'Бункер 5%' : item.configuration.selectedWindowTint === 'light' ? 'Атермальная 35%' : 'Без тонировки'}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Compatibility for accessories */}
                      {!isCar && (item.product as any).compatibility && (
                        <div className="mt-0.5 text-[10px] text-neutral-400 line-clamp-1 font-mono">
                          Совместимость: {(item.product as any).compatibility}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quantity & Item Subtotal */}
                  <div className="flex items-center justify-between pt-2 border-t border-neutral-800/70">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center border border-neutral-700 rounded-lg bg-neutral-900 p-0.5">
                        <button
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="p-1 text-neutral-400 hover:text-white transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-mono font-bold text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="p-1 text-neutral-400 hover:text-white transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <div className="font-display font-bold text-sm text-cyan-400">
                      {formatRuble(item.itemTotalPrice * item.quantity)}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Checkout Summary */}
        {items.length > 0 && (
          <div className="p-5 sm:p-6 border-t border-neutral-800 bg-neutral-950/90 space-y-4">
            {/* Promo Code Input */}
            <div className="space-y-1.5">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Промокод (напр. AUTOHUB5)"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white uppercase placeholder-neutral-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <button
                  onClick={handleApplyPromo}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-750 text-xs text-neutral-200 font-mono transition-colors cursor-pointer"
                >
                  Применить
                </button>
              </div>
              {promoMessage && (
                <div className={`text-[11px] font-mono flex items-center gap-1 ${discountPercent > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {discountPercent > 0 && <Check className="w-3 h-3" />}
                  <span>{promoMessage}</span>
                </div>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex justify-between text-neutral-400">
                <span>Сумма заказа:</span>
                <span>{formatRuble(totalRawSum)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Скидка по промокоду ({discountPercent}%):</span>
                  <span>- {formatRuble(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-neutral-400">
                <span>Предпродажная подготовка:</span>
                <span className="text-cyan-400 font-bold">БЕСПЛАТНО</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-neutral-800">
                <span>Итого к оплате:</span>
                <span className="font-display text-xl text-cyan-400">
                  {formatRuble(finalSum)}
                </span>
              </div>
            </div>

            {/* Primary Order Button */}
            <button
              onClick={() => {
                audio.playClick(900);
                onProceedToCheckout();
              }}
              className="w-full py-4 px-4 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-neutral-950 font-display font-black text-sm uppercase tracking-wider transition-all duration-300 shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Оформить заказ / Записаться на выдачу</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>

            <div className="text-[11px] text-neutral-500 text-center flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Фиксация дилерской цены на 7 дней без предоплаты</span>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
};
