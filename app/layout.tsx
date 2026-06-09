
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
    title: "Rethinking Broken: Overcome Childhood Trauma",
    description: "Childhood trauma didn't break you, it trained you. Find and use your hard-won skills — you don't need to fix yourself. You're not broken.",
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
