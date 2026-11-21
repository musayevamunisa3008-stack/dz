export type ItemCategory = 'all' | 'cars' | 'tuning' | 'accessories';
export type CarBodyType = 'Все' | 'Седан' | 'Внедорожник' | 'Спорткар' | 'Электро';
export type WindowTint = 'none' | 'light' | 'deep';

export interface PaintColor {
  id: string;
  name: string;
  hex: string;
  price: number;
  type: 'Металлик' | 'Перламутр' | 'Матовый' | 'Глянец';
  filterStyle: {
    hueRotate: string;
    saturate: string;
    brightness: string;
    contrast: string;
  };
  glowColor: string;
}

export interface WheelOption {
  id: string;
  name: string;
  size: number; // e.g. 20, 21
  style: string;
  price: number;
  imageUrl: string;
  rimColor: string;
}

export interface InteriorOption {
  id: string;
  name: string;
  material: string;
  accentColor: string;
  hex: string;
  price: number;
  imageUrl: string;
}

export interface PackageOption {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
}

export interface CarSpecs {
  horsepower: number; // л.с.
  acceleration: string; // e.g. "2.8 с до 100"
  topSpeed: string; // e.g. "305 км/ч"
  rangeOrMpg: string; // e.g. "620 км" или "11.2 л/100 км"
  drivetrain: 'Полный привод (AWD)' | 'Задний привод (RWD)' | 'Передний привод (FWD)' | 'Полный xDrive' | 'Полный 4MATIC+' | 'Полный Quattro';
  transmission: string; // e.g. "Робот 8-ст. PDK", "Автомат 9G-Tronic"
  engine: string; // e.g. "4.4L V8 TwinPower Turbo", "Двухмоторный электропривод"
  seating: number;
  cargoVolume: string; // e.g. "495 л"
}

export interface CarAngles {
  exteriorFront: string;
  exteriorSide: string;
  exteriorRear: string;
  interiorCockpit: string;
  interiorCabin: string;
}

export interface Car {
  id: string;
  type: 'car';
  name: string;
  tagline: string;
  brand: 'BMW' | 'Mercedes-Benz' | 'Porsche' | 'Tesla' | 'Toyota' | 'Zeekr' | 'Audi' | 'Range Rover';
  year: number;
  bodyType: CarBodyType;
  basePrice: number; // in Rubles ₽
  mileage: string; // e.g. "15 км (Новый)"
  fuelType: 'Электро' | 'Бензин' | 'Гибрид';
  condition: 'Новый в наличии' | 'Под заказ (3-4 недели)';
  badge?: 'Хит продаж' | 'Новинка 2025' | 'В наличии' | 'Спеццена';
  specs: CarSpecs;
  images: CarAngles;
  colors: PaintColor[];
  wheels: WheelOption[];
  interiors: InteriorOption[];
  packages: PackageOption[];
}

export interface AccessoryProduct {
  id: string;
  type: 'tuning' | 'accessories';
  name: string;
  brand: string;
  categoryName: string;
  basePrice: number; // in Rubles ₽
  imageUrl: string;
  badge?: 'Хит продаж' | 'Новинка' | 'Оригинал';
  shortDesc: string;
  compatibility: string;
  features: string[];
  inStock: boolean;
}

export type Product = Car | AccessoryProduct;

export interface CarConfiguration {
  carId: string;
  selectedColorId: string;
  selectedWheelId: string;
  selectedInteriorId: string;
  selectedWindowTint: WindowTint;
  selectedPackageIds: string[];
  activeView: 'exterior' | 'interior';
  exteriorAngle: 'front' | 'side' | 'rear';
  interiorAngle: 'cockpit' | 'cabin';
  headlightsOn: boolean;
  studioLighting: 'studio' | 'neon' | 'sunset' | 'stealth';
}

export interface CartItem {
  id: string; // unique cart line id
  product: Product;
  quantity: number;
  configuration?: CarConfiguration;
  itemTotalPrice: number;
}

export interface OrderReservation {
  orderId: string;
  customerName: string;
  phone: string;
  email: string;
  dealershipCity: string;
  appointmentDate: string;
  appointmentTime: string;
  deliveryType: 'salon' | 'carrier';
  paymentMethod: 'cash' | 'credit' | 'leasing' | 'tradein';
  totalSum: number;
  items: CartItem[];
  comment?: string;
}
