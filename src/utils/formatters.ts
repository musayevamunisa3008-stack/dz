import { Car, CarConfiguration, WindowTint } from '../types';

export function formatRuble(amount: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('ru-RU').format(num);
}

export function getTintPrice(tint: WindowTint): number {
  switch (tint) {
    case 'light':
      return 25000; // 25 000 руб
    case 'deep':
      return 45000; // 45 000 руб (Бункер)
    case 'none':
    default:
      return 0;
  }
}

export function getTintLabel(tint: WindowTint): string {
  switch (tint) {
    case 'light':
      return 'Лёгкая атермальная (35%)';
    case 'deep':
      return 'Глубокая тонировка "Бункер" (5%)';
    case 'none':
    default:
      return 'Без тонировки (Заводское стекло)';
  }
}

export interface PricingBreakdown {
  basePrice: number;
  colorPrice: number;
  wheelPrice: number;
  interiorPrice: number;
  tintPrice: number;
  packagesPrice: number;
  totalPrice: number;
  itemizedPackages: { name: string; price: number }[];
  selectedColorName: string;
  selectedWheelName: string;
  selectedInteriorName: string;
  selectedTintLabel: string;
}

export function calculateCustomizationPrice(car: Car, config: CarConfiguration): PricingBreakdown {
  const selectedColor = car.colors.find((c) => c.id === config.selectedColorId) || car.colors[0];
  const selectedWheel = car.wheels.find((w) => w.id === config.selectedWheelId) || car.wheels[0];
  const selectedInterior = car.interiors.find((i) => i.id === config.selectedInteriorId) || car.interiors[0];
  const tintPrice = getTintPrice(config.selectedWindowTint);

  const itemizedPackages = car.packages
    .filter((pkg) => config.selectedPackageIds.includes(pkg.id))
    .map((pkg) => ({ name: pkg.name, price: pkg.price }));

  const packagesPrice = itemizedPackages.reduce((sum, item) => sum + item.price, 0);

  const basePrice = car.basePrice;
  const colorPrice = selectedColor ? selectedColor.price : 0;
  const wheelPrice = selectedWheel ? selectedWheel.price : 0;
  const interiorPrice = selectedInterior ? selectedInterior.price : 0;

  const totalPrice = basePrice + colorPrice + wheelPrice + interiorPrice + tintPrice + packagesPrice;

  return {
    basePrice,
    colorPrice,
    wheelPrice,
    interiorPrice,
    tintPrice,
    packagesPrice,
    totalPrice,
    itemizedPackages,
    selectedColorName: selectedColor?.name || '',
    selectedWheelName: selectedWheel?.name || '',
    selectedInteriorName: selectedInterior?.name || '',
    selectedTintLabel: getTintLabel(config.selectedWindowTint),
  };
}

export function calculateMonthlyPayment({
  totalPrice,
  downPayment,
  termMonths,
  annualInterestRate = 7.9,
  isLease = false,
}: {
  totalPrice: number;
  downPayment: number;
  termMonths: number;
  annualInterestRate?: number;
  isLease?: boolean;
}): {
  monthlyPayment: number;
  loanAmount: number;
  totalInterest: number;
  totalCost: number;
} {
  const safeDown = Math.min(downPayment, totalPrice * 0.95);
  const loanAmount = Math.max(0, totalPrice - safeDown);

  if (isLease) {
    const residualFactor = Math.max(0.4, 0.65 - (termMonths / 12) * 0.05);
    const residualValue = totalPrice * residualFactor;
    const depreciation = loanAmount - residualValue;
    const monthlyDepreciation = depreciation / termMonths;
    const moneyFactor = (annualInterestRate / 100) / 24;
    const monthlyFinanceFee = (loanAmount + residualValue) * moneyFactor;
    const monthlyPayment = Math.max(5000, Math.round(monthlyDepreciation + monthlyFinanceFee));

    return {
      monthlyPayment,
      loanAmount,
      totalInterest: Math.round(monthlyFinanceFee * termMonths),
      totalCost: Math.round(safeDown + monthlyPayment * termMonths),
    };
  }

  const monthlyRate = (annualInterestRate / 100) / 12;
  let monthlyPayment = 0;

  if (monthlyRate === 0 || loanAmount === 0) {
    monthlyPayment = Math.round(loanAmount / termMonths);
  } else {
    const factor = Math.pow(1 + monthlyRate, termMonths);
    monthlyPayment = Math.round((loanAmount * monthlyRate * factor) / (factor - 1));
  }

  const totalCost = Math.round(safeDown + monthlyPayment * termMonths);
  const totalInterest = Math.max(0, totalCost - totalPrice);

  return {
    monthlyPayment,
    loanAmount,
    totalInterest,
    totalCost,
  };
}
