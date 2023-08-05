'use client';

import { useTranslations } from 'next-intl';

export default function Test(): JSX.Element {
  const t = useTranslations('Test');
  return <p>{t('hello')}</p>;
}
