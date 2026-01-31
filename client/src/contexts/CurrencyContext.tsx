import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';

export type CurrencyCode = 'GBP' | 'USD' | 'EUR' | 'NGN' | 'CAD' | 'AUD' | 'JPY' | 'CNY' | 'INR' | 'AED';

export interface Currency {
  code: CurrencyCode;
  symbol: string;
  rate: number; // Rate relative to GBP
  name: string;
}

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (code: CurrencyCode) => void;
  convertPrice: (priceInCents: number) => string;
  formatPrice: (priceInCents: number) => string;
  currencies: Currency[];
}

const currencies: Currency[] = [
  { code: 'GBP', symbol: '£', rate: 1, name: 'British Pound' },
  { code: 'USD', symbol: '$', rate: 1.27, name: 'US Dollar' },
  { code: 'EUR', symbol: '€', rate: 1.17, name: 'Euro' },
  { code: 'NGN', symbol: '₦', rate: 1950, name: 'Nigerian Naira' },
  { code: 'CAD', symbol: 'C$', rate: 1.72, name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', rate: 1.93, name: 'Australian Dollar' },
  { code: 'JPY', symbol: '¥', rate: 190, name: 'Japanese Yen' },
  { code: 'CNY', symbol: '¥', rate: 9.15, name: 'Chinese Yuan' },
  { code: 'INR', symbol: '₹', rate: 105, name: 'Indian Rupee' },
  { code: 'AED', symbol: 'د.إ', rate: 4.66, name: 'UAE Dirham' },
];

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currentCode, setCurrentCode] = useState<CurrencyCode>(() => {
    const saved = localStorage.getItem('currency');
    return (saved as CurrencyCode) || 'GBP';
  });

  const currentCurrency = useMemo(() => 
    currencies.find(c => c.code === currentCode) || currencies[0],
    [currentCode]
  );

  useEffect(() => {
    localStorage.setItem('currency', currentCode);
  }, [currentCode]);

  const setCurrency = useCallback((code: CurrencyCode) => {
    setCurrentCode(code);
  }, []);

  const convertPrice = useCallback((priceInCents: number) => {
    const converted = (priceInCents / 100) * currentCurrency.rate;
    return converted.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }, [currentCurrency]);

  const formatPrice = useCallback((priceInCents: number) => {
    const converted = (priceInCents / 100) * currentCurrency.rate;
    
    // For high-value currencies like NGN, we might want to avoid decimals if they are too large
    const fractionDigits = currentCurrency.code === 'NGN' || currentCurrency.code === 'JPY' ? 0 : 2;
    
    return `${currentCurrency.symbol}${converted.toLocaleString(undefined, {
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    })}`;
  }, [currentCurrency]);

  const contextValue = useMemo(() => ({
    currency: currentCurrency,
    setCurrency,
    convertPrice,
    formatPrice,
    currencies,
  }), [currentCurrency, setCurrency, convertPrice, formatPrice]);

  return (
    <CurrencyContext.Provider value={contextValue}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within CurrencyProvider');
  }
  return context;
}
