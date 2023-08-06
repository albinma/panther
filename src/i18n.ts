import { Formats } from 'next-intl';

export const DEFAULT_LOCALE = 'en';
export const LOCALES = ['en', 'fr'];
export const FORMATS: Formats = {
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
