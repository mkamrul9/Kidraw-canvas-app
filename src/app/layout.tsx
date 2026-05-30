import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/providers/SessionProvider";
import { Toaster } from "@/shared/components/ui/sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
    title: "Kidraw — Infinite Visual Workspace",
    description: "The infinite visual workspace for modern engineering teams. Map, wireframe, and collaborate on a blazing-fast canvas.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" className="dark">
            <body className={`${inter.variable} font-sans antialiased`}>
                <SessionProvider>
                    {children}
                    <Toaster richColors />
                </SessionProvider>
            </body>
        </html>
    );
}
