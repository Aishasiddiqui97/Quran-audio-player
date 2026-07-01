import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Authentication",
  description: "Sign in, sign up, or manage your Noor-ul-Quran account.",
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
