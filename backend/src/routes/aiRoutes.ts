import { Router } from "express"
import {
  askQuestion,
  findTopics,
  explainVerse,
  dailyReflection,
  generateQuiz,
  memorize,
  getConversations,
  getConversation,
  deleteConversation,
} from "../controllers/aiController"
import { protect } from "../middleware/authMiddleware"

const router = Router()

router.post("/ask", protect, askQuestion)
router.post("/topics", protect, findTopics)
router.post("/explain", protect, explainVerse)
router.get("/reflection", dailyReflection)
router.post("/quiz", generateQuiz)
router.post("/memorize", protect, memorize)
router.get("/conversations", protect, getConversations)
router.get("/conversations/:id", protect, getConversation)
router.delete("/conversations/:id", protect, deleteConversation)

export default router
