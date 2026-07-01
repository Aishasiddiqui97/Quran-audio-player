"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Book, CheckCircle, XCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import api from "@/lib/api"

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  )
  const [message, setMessage] = useState("")

  useEffect(() => {
    const token = searchParams.get("token")
    if (!token) {
      setStatus("error")
      setMessage("No verification token provided")
      return
    }

    async function verify() {
      try {
        const { data } = await api.get(`/auth/verify-email?token=${token}`)
        setStatus("success")
        setMessage(data.message)
      } catch (err: unknown) {
        const error = err as { response?: { data?: { message?: string } } }
        setStatus("error")
        setMessage(
          error.response?.data?.message || "Verification failed"
        )
      }
    }

    verify()
  }, [searchParams])

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card>
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Book className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Email Verification</CardTitle>
            <CardDescription>
              {status === "loading" && "Verifying your email..."}
              {status === "success" && "Email verified successfully"}
              {status === "error" && "Verification failed"}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            {status === "loading" && (
              <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
            )}
            {status === "success" && (
              <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
            )}
            {status === "error" && (
              <XCircle className="mx-auto h-12 w-12 text-destructive" />
            )}
            <p className="text-sm text-muted-foreground">{message}</p>
          </CardContent>
          <CardFooter className="flex justify-center gap-4">
            {status === "success" && (
              <Button onClick={() => router.push("/profile")}>
                Go to Profile
              </Button>
            )}
            {status === "error" && (
              <Link href="/">
                <Button variant="outline">Back to Home</Button>
              </Link>
            )}
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  )
}
