import { getRequestConfig } from 'next-intl/server';

import { getLocale } from './server';

import { DEFAULT_NS } from './constants';

export default getRequestConfig(async () => {
  const locale = getLocale();
  return {
    locale,
    messages: (await import(`@/lib/i18n/locales/${locale}/${DEFAULT_NS}.json`)).default,
  };
});
