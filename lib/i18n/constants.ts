import type {Locale} from "./types";

export const LOCALES_PATH = 'lib/i18n/locales';
export const DEFAULT_FILE = 'translation.json';
export const DEFAULT_LOCALE: Locale = 'pt';
export const DEFAULT_NS = DEFAULT_FILE.replace(/\.[^/.]+$/, '');
