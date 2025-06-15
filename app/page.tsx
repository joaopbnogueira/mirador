import type React from "react"
import {HomePage} from "@/components/pages/HomePage";
import {getMessages} from 'next-intl/server';

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
