import { Router } from "express"
import { protect, admin } from "../middleware/authMiddleware"
import {
  getAnalytics,
  getUsers,
  updateUserRole,
  deleteUser,
  getSurahs,
  updateSurah,
  deleteSurah,
  getTafsirList,
  deleteTafsirEntry,
  getTranslationList,
  deleteTranslationEntry,
  getAudioList,
  deleteAudioEntry,
  seedDatabase,
  sendNotification,
} from "../controllers/adminController"

const router = Router()

router.use(protect, admin)

router.get("/analytics", getAnalytics)

router.get("/users", getUsers)
router.patch("/users/:id/role", updateUserRole)
router.delete("/users/:id", deleteUser)

router.get("/surahs", getSurahs)
router.put("/surahs/:surahNumber", updateSurah)
router.delete("/surahs/:surahNumber", deleteSurah)

router.get("/tafsir", getTafsirList)
router.delete("/tafsir/:id", deleteTafsirEntry)

router.get("/translations", getTranslationList)
router.delete("/translations/:id", deleteTranslationEntry)

router.get("/audio", getAudioList)
router.delete("/audio/:id", deleteAudioEntry)

router.post("/seed", seedDatabase)
router.post("/notifications", sendNotification)

export default router
