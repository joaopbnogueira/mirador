import type {ReactNode} from 'react';

import clsx from 'clsx';

import type {Metadata, ResolvingMetadata, Viewport} from 'next';
import {getTranslations} from 'next-intl/server';

import preview from '@/public/side.webp';

import {AppConstants} from '@/lib/constants';
import {Inter} from "next/font/google";

import {ThemeProvider} from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

import "@/app/globals.css"

export function baseGenerateViewport(): Viewport {
    return {
        themeColor: '#ffffff',
        colorScheme: 'normal',
    };
}

// https://github.com/vercel/next.js/discussions/50189
const getPathnameFromMetadataState = (state: any): string => {
    const res = Object.getOwnPropertySymbols(state || {})
        .map((p) => state[p])
        // eslint-disable-next-line no-prototype-builtins
        .find((state) => state?.hasOwnProperty?.('urlPathname'));

    return res?.urlPathname.replace(/\?.+/, '') ?? '';
};

type MetadataProps = {
    locale: string;
};

export async function baseGenerateMetadata({locale}: MetadataProps, parent: ResolvingMetadata): Promise<Metadata> {
    const t = await getTranslations();

    const title = `${t(AppConstants.APP_NAME_SUFFIX)}`;
    const description = t(AppConstants.APP_DESCRIPTION);
    const images = [
        {
            url: preview.src,
            alt: `${t('navbar.home')}`,
        },
    ];
    const pathName = getPathnameFromMetadataState(parent);
    return {
        metadataBase: new URL(AppConstants.SITE_URL),
        title: `${title} - ${AppConstants.APP_NAME}`,
        description: description,
        applicationName: AppConstants.APP_NAME,
        robots: AppConstants.IS_PRODUCTION ? 'all' : 'noindex, nofollow',
        icons: ['/favicon.ico', '/favicon.svg', '/favicon-32x32.png', '/favicon-16x16.png'],
        manifest: '/site.webmanifest',
        appleWebApp: {
            capable: true,
            title: AppConstants.APP_NAME,
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
            url: pathName,
        },
        alternates: {
            canonical: pathName,
        },
    };
}

type LayoutProps = {
    children: ReactNode;
    locale: string;
};

export const RootLayout = async ({children, locale}: LayoutProps) => {
    return (
        <html dir="ltr" lang={locale} className={clsx(inter.className)}>
        {/* eslint-disable-next-line @next/next/no-head-element */}
        <head>
            <meta httpEquiv="Content-Language" content={locale}/>
            <meta httpEquiv="X-UA-Compatible" content="IE=edge"/>
            <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5"/>
        </head>
        <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <div className="flex min-h-screen flex-col">{children}</div>
        </ThemeProvider>
        </body>
        </html>
    );
};
