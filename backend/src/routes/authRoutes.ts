import { Router } from "express"
import { protect } from "../middleware/authMiddleware"
import {
  signup,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getMe,
  updateProfile,
  updatePassword,
} from "../controllers/authController"

const router = Router()

router.post("/signup", signup)
router.post("/login", login)
router.get("/verify-email", verifyEmail)
router.post("/forgot-password", forgotPassword)
router.post("/reset-password", resetPassword)
router.get("/me", protect, getMe)
router.put("/profile", protect, updateProfile)
router.put("/password", protect, updatePassword)

export default router
