import type {Metadata, ResolvingMetadata} from 'next';
import {getTranslations, getMessages} from 'next-intl/server';

import type {Alternate} from '@/lib/pageMetadata';
import {generatePageMetadata} from '@/lib/pageMetadata';

import {landingPages, setLocale} from '@/lib/i18n/server';
import {LandingPageComponent, Locale, TranslationTypes} from '@/lib/i18n/types';
import {HomePage} from '@/components/pages/HomePage';

export async function generateStaticParams() {
    return landingPages;
}

type Params = {
    slug: string;
    locale: Locale;
};
type Props = {
    params: Promise<Params>;
};

const getComponentNameFromParams = (params: Params): LandingPageComponent => {
    const {locale, slug=''} = params;
    const component = landingPages.find((p) => p.locale === locale && p.slug === slug)?.component;
    if (!component) {
        throw new Error(`Unable to determine component for locale ${locale} and slug ${slug}`);
    }
    return component as LandingPageComponent;
};

const getAlternateUrls = (name: LandingPageComponent): Alternate[] => {
    return landingPages
        .filter((p) => p.component === name)
        .map((p) => {
            return {
                href: `/${p.locale}/${p.slug}`,
                hrefLang: p.locale,
            };
        });
};

const mapComponentNameToComponent = async (name: LandingPageComponent) => {
    const translations = await getMessages();
    console.log(translations);
    switch (name) {
        case 'Home':
            return <HomePage translations={translations} />;
        default:
            throw new Error('Unsupported component name');
    }
};

export async function generateMetadata(props: Props, parent: ResolvingMetadata): Promise<Metadata> {
    const params = await props.params;
    const component = getComponentNameFromParams(params);
    const t = await getTranslations();

    return generatePageMetadata(
        {
            title: `${t(`landing.${component}.title`, {defaultValue: ''})}`,
            description: `${t(`landing.${component}.description`, {defaultValue: ''})}`,
            alternates: getAlternateUrls(component),
        },
        parent,
    );
}

const Page = async (props: Props) => {
    const params = await props.params;
    const { locale } = params;
    setLocale(locale);
    const component = getComponentNameFromParams(params);
    return await mapComponentNameToComponent(component as keyof TranslationTypes['landing']);
};

export default Page;
