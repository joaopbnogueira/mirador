import type common from './locales/en/translation.json';

import type { UnionMapper } from '@/lib/types';

export type TranslationKey = UnionMapper<typeof common>;

export type TranslationTypes = typeof common;

export type Locale = 'en' | 'pt';

export type LandingPageComponent = keyof TranslationTypes['landing'];