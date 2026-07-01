import { Request, Response, NextFunction } from "express"

interface AppError extends Error {
  statusCode?: number
  code?: number
  keyValue?: Record<string, string>
}

export function errorHandler(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  let statusCode = err.statusCode || 500
  let message = err.message || "Internal Server Error"

  if (err.name === "ValidationError") {
    statusCode = 400
    message = Object.values((err as any).errors)
      .map((e: any) => e.message)
      .join(", ")
  }

  if (err.code === 11000) {
    statusCode = 400
    const field = Object.keys(err.keyValue!)[0]
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`
  }

  if (err.name === "CastError") {
    statusCode = 400
    message = "Resource not found"
  }

  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  })
}
