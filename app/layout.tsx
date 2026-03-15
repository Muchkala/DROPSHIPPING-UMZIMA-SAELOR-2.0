import type { Metadata } from "next";
import { Lato, Roboto } from "next/font/google";
import "./globals.css";
import { ChildProps } from "./types";
import { ThemeProvider } from "./@components/providers/theme-provider";
import { AuthProvider } from "./@components/providers/auth-provider";
import { KeyboardShortcutsProvider } from "@/components/keyboard-shortcuts-provider";
import { FloatingShortcutsHint } from "@/components/floating-shortcuts-hint";
import { Toaster } from "sonner";
const roboto = Roboto({
  weight: ['100', '200', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  variable: '--font-roboto'
})

const lato = Lato({
  weight: ['400', '700', '900'],
  subsets: ['latin'],
  variable: '--font-lato'
})

export const metadata: Metadata = {
  title: "Freexit - Dropshipping Muvaffaqiyat Platformangiz",
  description: "Freexit bilan dropshipping safariyangizni boshlang! Elektron savdo uchun to'liq asboblar, mahsulotlar va strategiyalar.",
};

export default function RootLayout({ children }: ChildProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${roboto.variable} ${lato.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <KeyboardShortcutsProvider>
            <AuthProvider>
              {children}
              <Toaster position="top-right" />
              <FloatingShortcutsHint />
            </AuthProvider>
          </KeyboardShortcutsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
