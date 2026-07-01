import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/ThemeProvider"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { Toaster } from "@/components/ui/toaster"
import { SkipToContent } from "@/components/SkipToContent"
import { DynamicProviders } from "@/components/DynamicProviders"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Noor-ul-Quran - Your Digital Quran Companion",
    template: "%s | Noor-ul-Quran",
  },
  description:
    "A modern digital platform for reading, studying, and connecting with the Holy Quran. Read with translations, word-by-word analysis, and audio recitations.",
  keywords: [
    "Quran",
    "Holy Quran",
    "Islamic",
    "reading",
    "study",
    "Noor-ul-Quran",
    "digital quran",
    "quran reader",
  ],
  authors: [{ name: "Noor-ul-Quran" }],
  creator: "Noor-ul-Quran",
  publisher: "Noor-ul-Quran",
  metadataBase: new URL("https://noorulquran.com"),
  openGraph: {
    title: "Noor-ul-Quran - Your Digital Quran Companion",
    description:
      "A modern digital platform for reading, studying, and connecting with the Holy Quran.",
    url: "https://noorulquran.com",
    siteName: "Noor-ul-Quran",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Noor-ul-Quran - Your Digital Quran Companion",
    description:
      "A modern digital platform for reading, studying, and connecting with the Holy Quran.",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/icons/icon-192x192.svg",
  },
  manifest: "/manifest.json",
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Noor-ul-Quran",
  url: "https://noorulquran.com",
  description:
    "A modern digital platform for reading, studying, and connecting with the Holy Quran.",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://noorulquran.com/search?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <SkipToContent />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main id="main-content" className="flex-1 pb-16 md:pb-16">{children}</main>
            <Footer />
          </div>
          <DynamicProviders />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
