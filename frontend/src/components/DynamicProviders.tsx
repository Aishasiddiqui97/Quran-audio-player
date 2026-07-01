"use client"

import dynamic from "next/dynamic"

const AudioPlayer = dynamic(
  () => import("@/components/audio/AudioPlayer").then((m) => m.AudioPlayer),
  { ssr: false }
)
const ServiceWorkerRegister = dynamic(
  () =>
    import("@/components/ServiceWorkerRegister").then((m) => m.ServiceWorkerRegister),
  { ssr: false }
)
const BottomNavigation = dynamic(
  () => import("@/components/BottomNavigation").then((m) => m.BottomNavigation),
  { ssr: false }
)

export function DynamicProviders() {
  return (
    <>
      <BottomNavigation />
      <AudioPlayer />
      <ServiceWorkerRegister />
    </>
  )
}
