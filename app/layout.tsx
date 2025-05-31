import type React from "react"
import type {Metadata} from "next"
import { RootLayout } from "@/components/RootLayout";

export const metadata: Metadata = {
    title: "Mirador Business Center",
    description: "Luxury 3-Bedroom Apartment in Aveiro",
}

const Layout = ({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode
}>) => (
    <RootLayout locale={'pt'}>
        {children}
    </RootLayout>
);


export default Layout;