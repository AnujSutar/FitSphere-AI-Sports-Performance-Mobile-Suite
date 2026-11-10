export interface CountryCurrencyConfig {
  countryCode: string;
  countryName: string;
  currencyName: string;
  flag: string;
  currencyCode: string;
  currencySymbol: string;
  rateFromUsd: number; // Conversion: 1 USD = rateFromUsd in local currency
  locale: string;
}

export const COUNTRIES_CURRENCIES: CountryCurrencyConfig[] = [
  {
    countryCode: 'IN',
    countryName: 'India',
    currencyName: 'Indian Rupee',
    flag: '🇮🇳',
    currencyCode: 'INR',
    currencySymbol: '₹',
    rateFromUsd: 86.50,
    locale: 'en-IN',
  },
  {
    countryCode: 'US',
    countryName: 'United States',
    currencyName: 'US Dollar',
    flag: '🇺🇸',
    currencyCode: 'USD',
    currencySymbol: '$',
    rateFromUsd: 1.00,
    locale: 'en-US',
  },
  {
    countryCode: 'GB',
    countryName: 'United Kingdom',
    currencyName: 'British Pound',
    flag: '🇬🇧',
    currencyCode: 'GBP',
    currencySymbol: '£',
    rateFromUsd: 0.79,
    locale: 'en-GB',
  },
  {
    countryCode: 'EU',
    countryName: 'European Union (Germany/France)',
    currencyName: 'Euro',
    flag: '🇪🇺',
    currencyCode: 'EUR',
    currencySymbol: '€',
    rateFromUsd: 0.92,
    locale: 'de-DE',
  },
  {
    countryCode: 'JP',
    countryName: 'Japan',
    currencyName: 'Japanese Yen',
    flag: '🇯🇵',
    currencyCode: 'JPY',
    currencySymbol: '¥',
    rateFromUsd: 154.50,
    locale: 'ja-JP',
  },
  {
    countryCode: 'AU',
    countryName: 'Australia',
    currencyName: 'Australian Dollar',
    flag: '🇦🇺',
    currencyCode: 'AUD',
    currencySymbol: 'A$',
    rateFromUsd: 1.53,
    locale: 'en-AU',
  },
  {
    countryCode: 'CA',
    countryName: 'Canada',
    currencyName: 'Canadian Dollar',
    flag: '🇨🇦',
    currencyCode: 'CAD',
    currencySymbol: 'C$',
    rateFromUsd: 1.39,
    locale: 'en-CA',
  },
  {
    countryCode: 'AE',
    countryName: 'United Arab Emirates',
    currencyName: 'UAE Dirham',
    flag: '🇦🇪',
    currencyCode: 'AED',
    currencySymbol: 'AED',
    rateFromUsd: 3.67,
    locale: 'ar-AE',
  },
  {
    countryCode: 'BR',
    countryName: 'Brazil',
    currencyName: 'Brazilian Real',
    flag: '🇧🇷',
    currencyCode: 'BRL',
    currencySymbol: 'R$',
    rateFromUsd: 5.75,
    locale: 'pt-BR',
  },
  {
    countryCode: 'SG',
    countryName: 'Singapore',
    currencyName: 'Singapore Dollar',
    flag: '🇸🇬',
    currencyCode: 'SGD',
    currencySymbol: 'S$',
    rateFromUsd: 1.34,
    locale: 'en-SG',
  },
  {
    countryCode: 'ZA',
    countryName: 'South Africa',
    currencyName: 'South African Rand',
    flag: '🇿🇦',
    currencyCode: 'ZAR',
    currencySymbol: 'R',
    rateFromUsd: 18.25,
    locale: 'en-ZA',
  },
];

export const DEFAULT_COUNTRY = COUNTRIES_CURRENCIES[0]; // India (INR)

export function getCurrencyConfig(currencyCodeOrCountry?: string): CountryCurrencyConfig {
  if (!currencyCodeOrCountry) return DEFAULT_COUNTRY;
  const match = COUNTRIES_CURRENCIES.find(
    (c) =>
      c.currencyCode.toLowerCase() === currencyCodeOrCountry.toLowerCase() ||
      c.countryName.toLowerCase() === currencyCodeOrCountry.toLowerCase() ||
      c.countryCode.toLowerCase() === currencyCodeOrCountry.toLowerCase()
  );
  return match || DEFAULT_COUNTRY;
}

export function convertFromUsd(priceUsd: number, currencyCode: string): number {
  const config = getCurrencyConfig(currencyCode);
  return priceUsd * config.rateFromUsd;
}

export function convertToUsd(localPrice: number, currencyCode: string): number {
  const config = getCurrencyConfig(currencyCode);
  if (config.rateFromUsd === 0) return localPrice;
  return localPrice / config.rateFromUsd;
}

export function formatCurrencyPrice(priceUsd: number, currencyCode: string): string {
  const config = getCurrencyConfig(currencyCode);
  const converted = priceUsd * config.rateFromUsd;

  if (config.currencyCode === 'JPY') {
    return `${config.currencySymbol}${Math.round(converted).toLocaleString('ja-JP')}`;
  }

  if (config.currencyCode === 'INR') {
    return `${config.currencySymbol}${converted.toLocaleString('en-IN', {
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    })}`;
  }

  return `${config.currencySymbol}${converted.toLocaleString(config.locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
