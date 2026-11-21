import React from 'react';
import { ShoppingBag, Sparkles } from 'lucide-react';
import { AccessoryProduct } from '../types';
import { formatRuble } from '../utils/formatters';
import { audio } from '../utils/audio';

interface ProductCardProps {
  product: AccessoryProduct;
  onAddToCart: (product: AccessoryProduct) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
}) => {
  return (
    <div className="group relative rounded-2xl border border-neutral-800/80 bg-neutral-900/60 hover:border-cyan-500/50 transition-all duration-300 flex flex-col overflow-hidden backdrop-blur-md hover:shadow-xl hover:-translate-y-1">
      {/* Product Image */}
      <div className="relative aspect-[16/11] w-full overflow-hidden bg-neutral-950">
        <img
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Badge */}
        {product.badge && (
          <div className="absolute top-3 left-3 z-10">
            <span className="px-2.5 py-1 rounded-full bg-cyan-950/90 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold flex items-center gap-1 backdrop-blur-md">
              <Sparkles className="w-3 h-3" />
              {product.badge}
            </span>
          </div>
        )}

        <div className="absolute bottom-3 left-3 z-10">
          <span className="px-2.5 py-0.5 rounded-md bg-neutral-950/80 text-[11px] font-mono text-neutral-300 border border-neutral-800">
            {product.categoryName}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="text-[11px] font-mono uppercase text-cyan-400 font-semibold">
            {product.brand}
          </div>
          <h3 className="font-display font-bold text-base text-white group-hover:text-cyan-300 transition-colors mt-0.5">
            {product.name}
          </h3>
          <p className="text-xs text-neutral-400 line-clamp-2 mt-1 font-light leading-relaxed">
            {product.shortDesc}
          </p>

          {/* Compatibility info */}
          <div className="mt-2.5 p-2 rounded-lg bg-neutral-950/60 border border-neutral-800 text-[11px] font-mono text-neutral-300">
            <span className="text-neutral-500">Применяемость: </span>
            {product.compatibility}
          </div>
        </div>

        {/* Price & Add to Cart */}
        <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between gap-3">
          <div>
            <div className="text-[10px] uppercase font-mono text-neutral-500">Цена</div>
            <div className="font-display font-black text-xl text-white">
              {formatRuble(product.basePrice)}
            </div>
          </div>

          <button
            onClick={() => {
              audio.playClick(900);
              onAddToCart(product);
            }}
            className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-display font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-md shadow-cyan-500/20 hover:shadow-cyan-400/40 flex items-center gap-1.5 cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>В корзину</span>
          </button>
        </div>
      </div>
    </div>
  );
};
