import jwt from "jsonwebtoken"
import { config } from "../config/env"

export function generateToken(userId: string): string {
  return jwt.sign({ id: userId }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  } as jwt.SignOptions)
}

export function generateVerificationToken(): string {
  const crypto = require("crypto")
  return crypto.randomBytes(32).toString("hex")
}
