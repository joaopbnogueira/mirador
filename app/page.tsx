import type React from "react"
import {HomePage} from "@/components/pages/HomePage";
import {getMessages, getTranslations} from 'next-intl/server';
import type {Metadata, ResolvingMetadata} from "next";
import {generatePageMetadata} from "@/lib/pageMetadata";

type Params = {
};
type Props = {
    params: Promise<Params>;
};

export async function generateMetadata(props: Props, parent: ResolvingMetadata): Promise<Metadata> {
    const t = await getTranslations();

    return generatePageMetadata(
        {
            title: `${t(`landing.Home.title`, {defaultValue: ''})}`,
            description: `${t(`landing.Home.description`, {defaultValue: ''})}`,
            imageSrc: '/media/sala/sala_1.jpeg',
        },
        parent,
    );
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
