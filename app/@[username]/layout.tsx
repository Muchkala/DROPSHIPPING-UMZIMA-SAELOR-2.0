import type { Metadata } from "next"
import { Lato, Roboto } from "next/font/google"
import "../globals.css"

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
  title: "Creator Storefront | Freexit",
  description: "Shop products from your favorite creators",
}

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${roboto.variable} ${lato.variable} antialiased bg-background`}
      >
        {children}
      </body>
    </html>
  )
}
