import React, { useState, useEffect } from 'react';
import { CARS_DATA, ACCESSORIES_DATA } from './data/cars';
import { Car, Product, CarConfiguration, CartItem } from './types';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { CarCatalog } from './components/CarCatalog';
import { ConfiguratorModal } from './components/Configurator/ConfiguratorModal';
import { CartDrawer } from './components/CartDrawer';
import { TestDriveModal } from './components/TestDriveModal';
import { CompareModal } from './components/CompareModal';
import { SpecSheetModal } from './components/SpecSheetModal';
import { Footer } from './components/Footer';
import { audio } from './utils/audio';

export const App: React.FC = () => {
  // Configurator state
  const [activeConfiguratorCar, setActiveConfiguratorCar] = useState<Car | null>(null);

  // Global search input state
  const [searchQuery, setSearchQuery] = useState('');

  // Comparison drawer state
  const [comparedCars, setComparedCars] = useState<Car[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // Favorites state (persisted in localStorage)
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('autohub_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Shopping Cart state (persisted in localStorage)
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('autohub_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Test drive reservation & checkout modal state
  const [isTestDriveOpen, setIsTestDriveOpen] = useState(false);
  const [testDriveCar, setTestDriveCar] = useState<Car | null>(null);
  const [testDriveConfig, setTestDriveConfig] = useState<CarConfiguration | null>(null);

  // Spec Sheet Window Sticker modal state
  const [isSpecSheetOpen, setIsSpecSheetOpen] = useState(false);
  const [specSheetCar, setSpecSheetCar] = useState<Car | null>(null);
  const [specSheetConfig, setSpecSheetConfig] = useState<CarConfiguration | null>(null);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Persist favorites
  useEffect(() => {
    try {
      localStorage.setItem('autohub_favorites', JSON.stringify(favoriteIds));
    } catch {
      // Ignore
    }
  }, [favoriteIds]);

  // Persist shopping cart
  useEffect(() => {
    try {
      localStorage.setItem('autohub_cart', JSON.stringify(cartItems));
    } catch {
      // Ignore
    }
  }, [cartItems]);

  // Scroll to cars section
  const handleScrollToCars = () => {
    const el = document.getElementById('showroom-catalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Scroll to tuning section
  const handleScrollToTuning = () => {
    const el = document.getElementById('tuning-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      handleScrollToCars();
    }
  };

  // Toggle favorite car
  const handleToggleFavorite = (carId: string) => {
    setFavoriteIds((prev) => {
      const exists = prev.includes(carId);
      const next = exists ? prev.filter((id) => id !== carId) : [...prev, carId];
      showToast(exists ? 'Удалено из избранного' : 'Добавлено в избранное');
      return next;
    });
  };

  // Toggle compare car
  const handleToggleCompare = (car: Car) => {
    setComparedCars((prev) => {
      const exists = prev.some((c) => c.id === car.id);
      if (exists) {
        showToast(`Автомобиль ${car.name} удален из сравнения`);
        return prev.filter((c) => c.id !== car.id);
      }
      if (prev.length >= 3) {
        showToast('Максимум 3 автомобиля в сравнении');
        return [...prev.slice(1), car];
      }
      showToast(`Автомобиль ${car.name} добавлен в сравнение`);
      return [...prev, car];
    });
  };

  // Add Item to Cart
  const handleAddToCart = (product: Product, config?: CarConfiguration, customPrice?: number) => {
    audio.playSuccess();
    const isCar = product.type === 'car';
    const finalPrice = customPrice !== undefined ? customPrice : product.basePrice;

    // Unique cart line ID
    const cartItemId = isCar && config
      ? `${product.id}-${config.selectedColorId}-${config.selectedWheelId}-${config.selectedWindowTint}-${config.selectedPackageIds.join('_')}`
      : product.id;

    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.id === cartItemId ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [
          ...prev,
          {
            id: cartItemId,
            product,
            quantity: 1,
            configuration: config,
            itemTotalPrice: finalPrice,
          },
        ];
      }
    });

    showToast(`Товар "${product.name}" добавлен в корзину`);
  };

  const handleUpdateCartQuantity = (cartItemId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === cartItemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const handleRemoveCartItem = (cartItemId: string) => {
    audio.playClick(500);
    setCartItems((prev) => prev.filter((item) => item.id !== cartItemId));
    showToast('Товар удален из корзины');
  };

  const handleClearCart = () => {
    audio.playClick(500);
    setCartItems([]);
    showToast('Корзина очищена');
  };

  // Open test drive from configurator or navbar
  const handleOpenTestDrive = (car?: Car, config?: CarConfiguration) => {
    const targetCar = car || CARS_DATA[0];
    setTestDriveCar(targetCar);
    setTestDriveConfig(config || null);
    setIsTestDriveOpen(true);
  };

  // Open spec sheet from configurator
  const handleOpenSpecSheet = (car: Car, config: CarConfiguration) => {
    setSpecSheetCar(car);
    setSpecSheetConfig(config);
    setIsSpecSheetOpen(true);
  };

  // Proceed from cart to test drive / checkout modal
  const handleProceedFromCart = () => {
    setIsCartOpen(false);
    const carInCart = cartItems.find((item) => item.product.type === 'car');
    if (carInCart) {
      handleOpenTestDrive(carInCart.product as Car, carInCart.configuration);
    } else {
      handleOpenTestDrive(CARS_DATA[0]);
    }
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-neutral-950">

      {/* Top Fixed / Sticky Navigation Bar */}
      <Navbar
        onScrollToCars={handleScrollToCars}
        onScrollToTuning={handleScrollToTuning}
        onOpenConfiguratorDefault={() => setActiveConfiguratorCar(CARS_DATA[0])}
        onOpenCompare={() => setIsCompareModalOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenTestDrive={() => handleOpenTestDrive(CARS_DATA[0])}
        compareCount={comparedCars.length}
        favoritesCount={favoriteIds.length}
        cartCount={totalCartCount}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Hero Section */}
      <main className="flex-1">
        <HeroBanner
          onExploreClick={handleScrollToCars}
          onCustomizeFeatured={() => setActiveConfiguratorCar(CARS_DATA[0])}
        />

        {/* Catalog & Filter Section */}
        <CarCatalog
          cars={CARS_DATA}
          accessories={ACCESSORIES_DATA}
          onCustomizeCar={(car) => setActiveConfiguratorCar(car)}
          onAddToCart={(product) => handleAddToCart(product)}
          comparedCars={comparedCars}
          onToggleCompare={handleToggleCompare}
          onClearCompare={() => setComparedCars([])}
          onOpenCompareModal={() => setIsCompareModalOpen(true)}
          favoriteIds={favoriteIds}
          onToggleFavorite={handleToggleFavorite}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </main>

      {/* Interactive 3D Car Configurator Modal */}
      {activeConfiguratorCar && (
        <ConfiguratorModal
          car={activeConfiguratorCar}
          isOpen={!!activeConfiguratorCar}
          onClose={() => setActiveConfiguratorCar(null)}
          onOpenTestDrive={(car, config) => handleOpenTestDrive(car, config)}
          onOpenSpecSheet={(car, config) => handleOpenSpecSheet(car, config)}
          onAddToCart={(configuredCar, config, price) => handleAddToCart(configuredCar, config, price)}
        />
      )}

      {/* Shopping Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onProceedToCheckout={handleProceedFromCart}
      />

      {/* Test Drive / Lead Capture Reservation Modal */}
      <TestDriveModal
        car={testDriveCar}
        config={testDriveConfig}
        isOpen={isTestDriveOpen}
        onClose={() => setIsTestDriveOpen(false)}
      />

      {/* Side-by-Side Comparison Modal */}
      <CompareModal
        cars={comparedCars}
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        onRemoveCar={handleToggleCompare}
        onCustomizeCar={(car) => {
          setIsCompareModalOpen(false);
          setActiveConfiguratorCar(car);
        }}
      />

      {/* Printable Spec Sheet Window Sticker Modal */}
      <SpecSheetModal
        car={specSheetCar}
        config={specSheetConfig}
        isOpen={isSpecSheetOpen}
        onClose={() => setIsSpecSheetOpen(false)}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-neutral-900 border border-cyan-500/60 shadow-2xl backdrop-blur-xl text-white text-xs font-mono flex items-center gap-2 animate-bounce-in">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Footer */}
      <Footer />

    </div>
  );
};

export default App;
