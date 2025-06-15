import type {ReactNode} from 'react';

import type {Metadata, ResolvingMetadata, Viewport} from 'next';

import {getLocale, setLocale} from '@/lib/i18n/server';
import {baseGenerateMetadata, baseGenerateViewport, RootLayout} from '@/components/RootLayout';
import {Locale} from "@/lib/i18n/types";

export const revalidate = 86400;

type Params = {
    locale: Locale;
};

type LayoutProps = {
    children: ReactNode;
    params: Promise<Params>;
};

export function generateViewport(): Viewport {
    return baseGenerateViewport();
}

export async function generateMetadata(_: any, parent: ResolvingMetadata): Promise<Metadata> {
    const locale = getLocale();
    return baseGenerateMetadata({locale}, parent);
}

// Making the Layout component async to match Next.js expectations
const Layout = async (props: LayoutProps) => {
    const params = await props.params;

    const {children} = props;

    const {locale} = params;
    setLocale(locale);
    return <RootLayout locale={locale}>{children}</RootLayout>;
};

export default Layout;
