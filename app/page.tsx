import type React from "react"
import {HomePage} from "@/components/pages/HomePage";
import {getMessages, getTranslations} from 'next-intl/server';
import type {Metadata, ResolvingMetadata} from "next";
import {generatePageMetadata} from "@/lib/pageMetadata";
import {AppConstants} from "@/lib/constants";
import {getPathnameFromMetadataState} from "@/components/RootLayout";
import {getLocale} from "@/lib/i18n/server";
import {defaultsDeep} from "lodash";

type Params = unknown;

type Props = {
    params: Promise<Params>;
};

export async function generateMetadata(props: Props, parent: ResolvingMetadata): Promise<Metadata> {
    const t = await getTranslations();

    const title = `${t(`landing.Home.title`, {defaultValue: ''})}`;
    const description = `${t(`landing.Home.description`, {defaultValue: ''})}`;
    const imageSrc = '/media/sala/sala_1.jpeg';
    const locale = getLocale();
    const images = [
        {
            url: imageSrc,
            alt: `${t('navbar.home')}`,
        },
    ];
    const pathName = getPathnameFromMetadataState(parent);

    const parentx = {
        metadataBase: new URL(AppConstants.SITE_URL),
        title: `${title}`,
        description: description,
        applicationName: `${title}`,
        robots: AppConstants.IS_PRODUCTION ? 'all' : 'noindex, nofollow',
        icons: ['/favicon.ico', '/favicon.svg', '/favicon-32x32.png', '/favicon-16x16.png'],
        manifest: '/site.webmanifest',
        appleWebApp: {
            capable: true,
            title: `${title}`,
            statusBarStyle: 'default',
        },
        other: {'msapplication-TileColor': ['#ffffff'], 'msapplication-TileImage': ['/mstile-150x150.png']},
        formatDetection: {telephone: true, date: true, address: true, email: true, url: true},
        twitter: {
            card: 'summary_large_image',
            title: title,
            description: description,
            images: images,
        },
        openGraph: {
            type: 'website',
            title: title,
            description: description,
            locale: locale,
            images: images,
            url: AppConstants.SITE_URL,
        },
        alternates: {
            canonical: pathName,
        },
    }

    return defaultsDeep(parentx, generatePageMetadata(
        {
            title: `${t(`landing.Home.title`, {defaultValue: ''})}`,
            description: `${t(`landing.Home.description`, {defaultValue: ''})}`,
            imageSrc: '/media/sala/sala_1.jpeg',
        }, parent));
}

const PropertyLandingPage = async () => {
    const locale = 'pt';
    const translations = await getMessages({locale});
    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground antialiased overflow-x-hidden">
            <HomePage translations={translations} currentLanguage={locale}/>
        </div>
    )
};

export default PropertyLandingPage;
