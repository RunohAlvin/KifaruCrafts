import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getUserCurrency, setUserCurrency, type Currency } from './currency';

interface CartState {
  cartCount: number;
  updateCartCount: (count: number) => void;
}

interface CurrencyState {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cartCount: 0,
      updateCartCount: (count) => set({ cartCount: count }),
    }),
    {
      name: 'cart-storage',
    }
  )
);

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set) => ({
      currency: getUserCurrency(),
      setCurrency: (currency) => {
        setUserCurrency(currency);
        set({ currency });
      },
    }),
    {
      name: 'currency-storage',
    }
  )
);
