import nodemailer from "nodemailer"
import { config } from "../config/env"

const transporter = nodemailer.createTransport({
  host: config.smtp.host,
  port: config.smtp.port,
  secure: config.smtp.port === 465,
  auth: {
    user: config.smtp.user,
    pass: config.smtp.pass,
  },
})

interface EmailOptions {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: EmailOptions): Promise<void> {
  if (config.nodeEnv === "development") {
    console.log(`\n[DEV EMAIL] To: ${to}`)
    console.log(`[DEV EMAIL] Subject: ${subject}`)
    console.log(`[DEV EMAIL] Body: ${html}\n`)
    return
  }

  await transporter.sendMail({
    from: `"Noor-ul-Quran" <${config.smtp.user}>`,
    to,
    subject,
    html,
  })
}

export function getVerificationEmailHtml(token: string): string {
  const url = `${config.clientUrl}/verify-email?token=${token}`
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #1a365d;">Welcome to Noor-ul-Quran!</h1>
      <p>Thank you for registering. Please verify your email address by clicking the link below:</p>
      <a href="${url}" 
         style="display: inline-block; padding: 12px 24px; background-color: #1a365d; color: white; text-decoration: none; border-radius: 6px;">
        Verify Email
      </a>
      <p style="margin-top: 20px; color: #718096;">This link expires in 24 hours.</p>
    </div>
  `
}

export function getResetPasswordEmailHtml(token: string): string {
  const url = `${config.clientUrl}/forgot-password?token=${token}`
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #1a365d;">Reset Your Password</h1>
      <p>Click the link below to reset your password. This link expires in 1 hour.</p>
      <a href="${url}" 
         style="display: inline-block; padding: 12px 24px; background-color: #1a365d; color: white; text-decoration: none; border-radius: 6px;">
        Reset Password
      </a>
      <p style="margin-top: 20px; color: #718096;">If you did not request this, please ignore this email.</p>
    </div>
  `
}
