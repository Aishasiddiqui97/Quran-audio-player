import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "AI Quran Assistant",
  description:
    "Ask questions, find topics, get verse explanations, daily reflections, quizzes, and memorization help for the Holy Quran.",
  openGraph: {
    title: "AI Quran Assistant - Noor-ul-Quran",
    description:
      "Your intelligent Quran study companion. Ask questions, explore topics, get explanations, and more.",
  },
}

export default function AILayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
