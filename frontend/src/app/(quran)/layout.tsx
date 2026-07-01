import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Read the Quran",
  description:
    "Browse and read the Holy Quran with translations, word-by-word analysis, and audio recitations.",
  openGraph: {
    title: "Read the Quran - Noor-ul-Quran",
    description:
      "Browse and read the Holy Quran with translations, word-by-word analysis, and audio recitations.",
  },
}

export default function QuranLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
