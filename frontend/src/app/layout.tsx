import type { Metadata, Viewport } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/ThemeProvider"
import { Toaster } from "@/components/ui/toaster"
import { SkipToContent } from "@/components/SkipToContent"
import { DynamicProviders } from "@/components/DynamicProviders"

export const metadata: Metadata = {
  title: {
    default: "Quran Audio - Listen & Read the Holy Quran",
    template: "%s | Quran Audio",
  },
  description:
    "A beautiful digital platform for reading, listening, and connecting with the Holy Quran.",
  keywords: [
    "Quran", "Holy Quran", "Quran audio", "Islamic", "Quran player",
    "quran recitation", "Mishary Alafasy",
  ],
  authors: [{ name: "Quran Audio" }],
  creator: "Quran Audio",
  publisher: "Quran Audio",
  metadataBase: new URL("https://noorulquran.com"),
  openGraph: {
    title: "Quran Audio - Listen & Read the Holy Quran",
    description:
      "A beautiful digital platform for reading, listening, and connecting with the Holy Quran.",
    url: "https://noorulquran.com",
    siteName: "Quran Audio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Quran Audio - Listen & Read the Holy Quran",
    description:
      "A beautiful digital platform for reading, listening, and connecting with the Holy Quran.",
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
    { media: "(prefers-color-scheme: light)", color: "#0B6B3A" },
    { media: "(prefers-color-scheme: dark)", color: "#0a1a10" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Quran Audio",
  url: "https://noorulquran.com",
  description:
    "A beautiful digital platform for reading, listening, and connecting with the Holy Quran.",
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
      <body className="font-poppins premium-bg">
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
          {children}
          <DynamicProviders />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
