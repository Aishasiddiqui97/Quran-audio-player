import { Request, Response, NextFunction } from "express"
import crypto from "crypto"
import User from "../models/User"
import { generateToken } from "../utils/generateToken"
import {
  sendEmail,
  getVerificationEmailHtml,
  getResetPasswordEmailHtml,
} from "../utils/sendEmail"
import { AuthRequest } from "../middleware/authMiddleware"

function createTokenResponse(user: any, statusCode: number, res: Response) {
  const token = generateToken(user._id)
  res.status(statusCode).json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role || "user",
      isVerified: user.isVerified,
    },
  })
}

export async function signup(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { name, email, password } = req.body

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      res.status(400).json({ message: "Email already registered" })
      return
    }

    const verificationToken = crypto.randomBytes(32).toString("hex")
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000)

    const user = await User.create({
      name,
      email,
      password,
      verificationToken,
      verificationTokenExpires,
    })

    await sendEmail({
      to: email,
      subject: "Verify your email - Noor-ul-Quran",
      html: getVerificationEmailHtml(verificationToken),
    })

    createTokenResponse(user, 201, res)
  } catch (error) {
    next(error)
  }
}

export async function login(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email }).select("+password")
    if (!user) {
      res.status(401).json({ message: "Invalid email or password" })
      return
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      res.status(401).json({ message: "Invalid email or password" })
      return
    }

    createTokenResponse(user, 200, res)
  } catch (error) {
    next(error)
  }
}

export async function verifyEmail(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { token } = req.query

    if (!token) {
      res.status(400).json({ message: "Verification token is required" })
      return
    }

    const user = await User.findOne({
      verificationToken: token as string,
      verificationTokenExpires: { $gt: Date.now() },
    })

    if (!user) {
      res.status(400).json({ message: "Invalid or expired verification token" })
      return
    }

    user.isVerified = true
    user.verificationToken = undefined
    user.verificationTokenExpires = undefined
    await user.save()

    res.json({ message: "Email verified successfully" })
  } catch (error) {
    next(error)
  }
}

export async function forgotPassword(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      res.status(404).json({ message: "User not found with this email" })
      return
    }

    const resetToken = crypto.randomBytes(32).toString("hex")
    user.resetPasswordToken = resetToken
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000)
    await user.save()

    await sendEmail({
      to: email,
      subject: "Reset your password - Noor-ul-Quran",
      html: getResetPasswordEmailHtml(resetToken),
    })

    res.json({ message: "Password reset email sent" })
  } catch (error) {
    next(error)
  }
}

export async function resetPassword(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { token } = req.query
    const { password } = req.body

    if (!token || !password) {
      res.status(400).json({ message: "Token and password are required" })
      return
    }

    const user = await User.findOne({
      resetPasswordToken: token as string,
      resetPasswordExpires: { $gt: Date.now() },
    })

    if (!user) {
      res.status(400).json({ message: "Invalid or expired reset token" })
      return
    }

    user.password = password
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined
    await user.save()

    res.json({ message: "Password reset successfully" })
  } catch (error) {
    next(error)
  }
}

export async function getMe(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    res.json({
      user: {
        id: req.user!._id,
        name: req.user!.name,
        email: req.user!.email,
        role: req.user!.role || "user",
        isVerified: req.user!.isVerified,
        createdAt: req.user!.createdAt,
      },
    })
  } catch (error) {
    next(error)
  }
}

export async function updateProfile(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { name, email } = req.body
    const user = req.user!

    if (name) user.name = name
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email })
      if (existingUser) {
        res.status(400).json({ message: "Email already in use" })
        return
      }
      user.email = email
      user.isVerified = false
    }

    await user.save()

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || "user",
        isVerified: user.isVerified,
      },
    })
  } catch (error) {
    next(error)
  }
}

export async function updatePassword(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { currentPassword, newPassword } = req.body
    const user = await User.findById(req.user!._id).select("+password")

    if (!user) {
      res.status(404).json({ message: "User not found" })
      return
    }

    const isMatch = await user.comparePassword(currentPassword)
    if (!isMatch) {
      res.status(401).json({ message: "Current password is incorrect" })
      return
    }

    user.password = newPassword
    await user.save()

    res.json({ message: "Password updated successfully" })
  } catch (error) {
    next(error)
  }
}
