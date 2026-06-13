
import type { Metadata } from "next";
import { Cinzel, Lato } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
    subsets: ["latin"],
    variable: "--font-cinzel",
    weight: ["400", "700", "900"],
});

const lato = Lato({
    subsets: ["latin"],
    variable: "--font-lato",
    weight: ["300", "400", "700"],
});

export const metadata: Metadata = {
    metadataBase: new URL(
        process.env.NEXT_PUBLIC_SITE_URL ?? 'https://rethinkingbroken.com'
    ),
    title: {
        default: 'Rethinking Broken | A Book by Owl Medicine',
        template: '%s | Rethinking Broken',
    },
    description: 'Rethinking Broken by Owl — a healing journey through childhood trauma and the path to wholeness. Available in paperback, hardcover, eBook, and audiobook.',
    openGraph: {
        type: 'website',
        siteName: 'Rethinking Broken',
        locale: 'en_US',
        images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Rethinking Broken by Owl' }],
    },
    twitter: {
        card: 'summary_large_image',
        images: ['/og-image.png']
    },
};


const RootLayout = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    return (
        <html lang="en" className={`${cinzel.variable} ${lato.variable}`}>
            <body className='antialiased'>
                {children}
            </body>
        </html>
    );
};

export default RootLayout;
