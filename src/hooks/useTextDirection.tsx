import { isRtlLang } from 'rtl-detect';
import { useLocale } from 'next-intl';

export default function useTextDirection(locale?: string): string {
  const defaultLocale = useLocale();
  const rtl = 'rtl';
  const ltr = 'ltr';

  if (!locale) {
    locale = defaultLocale;
  }

  return isRtlLang(locale) ? rtl : ltr;
}
