import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@fontsource/noto-serif";
import "@fontsource/public-sans";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { I18nProvider } from "@/i18n/I18nProvider";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });

export const metadata: Metadata = {
  title: "EventaCanvas",
  description: "Crea invitaciones interactivas para tus eventos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} font-sans bg-background text-on-surface antialiased`}>
        <I18nProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
