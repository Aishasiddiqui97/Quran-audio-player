import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import User, { IUser } from "../models/User"
import { config } from "../config/env"

export interface AuthRequest extends Request {
  user?: IUser
}

interface JwtPayload {
  id: string
}

export async function protect(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  let token: string | undefined

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1]
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token provided" })
    return
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload
    const user = await User.findById(decoded.id)

    if (!user) {
      res.status(401).json({ message: "User not found" })
      return
    }

    req.user = user
    next()
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token invalid" })
  }
}

export async function admin(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  if (!req.user || req.user.role !== "admin") {
    res.status(403).json({ message: "Access denied. Admin only." })
    return
  }
  next()
}
