import 'server-only';

import fs from 'fs';
import { isEmpty } from 'lodash';
import path from 'path';

import { serverContext } from '@/lib/server/context';

import { isNotEmpty } from '@/lib/types';

import type {LandingPageComponent, Locale} from './types';
import {DEFAULT_FILE, DEFAULT_LOCALE, LOCALES_PATH} from "./constants";

const localesDir = path.join(process.cwd(), LOCALES_PATH);
export const availableLanguages = fs.readdirSync(localesDir);

export type LandingPage = {
    slug: string;
    locale: Locale;
    component: LandingPageComponent;
};

const isLocale = (lng: string): lng is Locale => {
    return lng === 'en' || lng === 'pt';
};

const invalidLocales = availableLanguages.filter((lng) => !isLocale(lng));
if (!isEmpty(invalidLocales)) {
    throw new Error('Invalid locales detected: ' + invalidLocales.join(', '));
}

export const landingPages: LandingPage[] = availableLanguages
    .filter(isLocale)
    .map((lng) => {
        try {
            const filePath = path.join(localesDir, lng, DEFAULT_FILE);
            const content = fs.readFileSync(filePath, 'utf8');
            const parsedContent = JSON.parse(content)['landing'] ?? {};
            return Object.keys(parsedContent).map((p) => {
                return { slug: parsedContent[p]?.slug ?? p, locale: lng as Locale, component: p as LandingPageComponent };
            });
        } catch (error) {
            return null;
        }
    })
    .filter(isNotEmpty)
    .reduce((acc, val) => acc.concat(val), [])
    .filter(isNotEmpty);

export const [getLocale, setLocale] = serverContext(DEFAULT_LOCALE);

