import type { Metadata } from "next";
import { Lato, Roboto } from "next/font/google";
import "./globals.css";
import { ChildProps } from "./types";
import { ThemeProvider } from "./@components/providers/theme-provider";
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
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
