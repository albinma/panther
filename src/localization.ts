import { Formats } from 'next-intl';

export const DEFAULT_LOCALE = 'en';
export const SUPPORTED_LOCALES = [DEFAULT_LOCALE, 'fr'];
export const NEXT_INTL_FORMATS: Formats = {
  dateTime: {
    short: {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    },
  },
  number: {
    precise: {
      maximumFractionDigits: 5,
    },
  },
  list: {
    enumeration: {
      style: 'long',
      type: 'conjunction',
    },
  },
};
