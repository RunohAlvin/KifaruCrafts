// Currency conversion utilities for Kifaru Crafts
// Primary currency is KES (Kenyan Shillings)

export type Currency = 'KES' | 'USD' | 'EUR' | 'GBP';

export interface CurrencyRates {
  [key: string]: number;
}

// Exchange rates (KES as base currency)
// In a real application, these would come from a live API
const EXCHANGE_RATES: CurrencyRates = {
  KES: 1,
  USD: 0.0078, // 1 KES = 0.0078 USD
  EUR: 0.0071, // 1 KES = 0.0071 EUR
  GBP: 0.0061, // 1 KES = 0.0061 GBP
};

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  KES: 'KSh',
  USD: '$',
  EUR: '€',
  GBP: '£',
};

export const CURRENCY_NAMES: Record<Currency, string> = {
  KES: 'Kenyan Shilling',
  USD: 'US Dollar',
  EUR: 'Euro',
  GBP: 'British Pound',
};

/**
 * Format price in KES to display currency
 */
export function formatKESPrice(price: string | number): string {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return `KSh ${numPrice.toLocaleString('en-KE', { 
    minimumFractionDigits: 0,
    maximumFractionDigits: 0 
  })}`;
}

/**
 * Convert KES price to another currency
 */
export function convertFromKES(kesPrice: string | number, targetCurrency: Currency): number {
  const numPrice = typeof kesPrice === 'string' ? parseFloat(kesPrice) : kesPrice;
  const rate = EXCHANGE_RATES[targetCurrency];
  return numPrice * rate;
}

/**
 * Convert from another currency to KES
 */
export function convertToKES(price: number, fromCurrency: Currency): number {
  const rate = EXCHANGE_RATES[fromCurrency];
  return price / rate;
}

/**
 * Format price in any currency
 */
export function formatPrice(price: number, currency: Currency): string {
  const symbol = CURRENCY_SYMBOLS[currency];
  
  if (currency === 'KES') {
    return `${symbol} ${price.toLocaleString('en-KE', { 
      minimumFractionDigits: 0,
      maximumFractionDigits: 0 
    })}`;
  }
  
  return `${symbol}${price.toLocaleString('en-US', { 
    minimumFractionDigits: 2,
    maximumFractionDigits: 2 
  })}`;
}

/**
 * Get user's preferred currency from localStorage or detect from location
 */
export function getUserCurrency(): Currency {
  // Check localStorage first
  const stored = localStorage.getItem('preferred-currency') as Currency;
  if (stored && Object.keys(CURRENCY_SYMBOLS).includes(stored)) {
    return stored;
  }
  
  // Try to detect from browser/location
  const userLocale = navigator.language || 'en-KE';
  
  if (userLocale.includes('KE') || userLocale.includes('ke')) return 'KES';
  if (userLocale.includes('US') || userLocale.includes('us')) return 'USD';
  if (userLocale.includes('GB') || userLocale.includes('gb')) return 'GBP';
  if (userLocale.includes('EU') || userLocale.includes('eu')) return 'EUR';
  
  // Default to KES for Kenya-based marketplace
  return 'KES';
}

/**
 * Set user's preferred currency
 */
export function setUserCurrency(currency: Currency): void {
  localStorage.setItem('preferred-currency', currency);
}

/**
 * Display price with currency conversion tooltip
 */
export function getPriceWithConversion(kesPrice: string | number, userCurrency: Currency) {
  const formattedKES = formatKESPrice(kesPrice);
  
  if (userCurrency === 'KES') {
    return {
      primary: formattedKES,
      secondary: null,
    };
  }
  
  const convertedPrice = convertFromKES(kesPrice, userCurrency);
  const formattedConverted = formatPrice(convertedPrice, userCurrency);
  
  return {
    primary: formattedConverted,
    secondary: formattedKES,
  };
}