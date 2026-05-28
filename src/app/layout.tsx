import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { I18nProvider } from "@/i18n/I18nProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Editor de Invitaciones",
  description: "Crea invitaciones interactivas para tus eventos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <I18nProvider>
          <AuthProvider>
          {children}
        </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
