import express from "express"
import cors from "cors"
import helmet from "helmet"
import rateLimit from "express-rate-limit"
import { config } from "./config/env"
import { connectDB } from "./config/db"
import authRoutes from "./routes/authRoutes"
import surahRoutes from "./routes/surahRoutes"
import ayahRoutes from "./routes/ayahRoutes"
import translationRoutes from "./routes/translationRoutes"
import wordByWordRoutes from "./routes/wordByWordRoutes"
import tafsirRoutes from "./routes/tafsirRoutes"
import audioRoutes from "./routes/audioRoutes"
import adminRoutes from "./routes/adminRoutes"
import aiRoutes from "./routes/aiRoutes"
import { errorHandler } from "./middleware/errorMiddleware"

const app = express()

connectDB()

app.use(helmet())
app.use(
  cors({
    origin: config.clientUrl,
    credentials: true,
  })
)
app.use(express.json({ limit: "1mb" }))

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: "Too many requests, please try again later" },
})
app.use("/api/", limiter)

app.use("/api/auth", authRoutes)
app.use("/api/surahs", surahRoutes)
app.use("/api/ayahs", ayahRoutes)
app.use("/api/translations", translationRoutes)
app.use("/api/word-by-word", wordByWordRoutes)
app.use("/api/tafsir", tafsirRoutes)
app.use("/api/audio", audioRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/ai", aiRoutes)

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() })
})

app.use(errorHandler)

const PORT = config.port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
