import { Router } from "express"
import {
  getAllTranslations,
  getTranslationByAyah,
  getTranslationBySurah,
  getAvailableEditions,
  getLanguages,
} from "../controllers/translationController"

const router = Router()

router.get("/", getAllTranslations)
router.get("/editions", getAvailableEditions)
router.get("/languages", getLanguages)
router.get("/surah/:surahNumber/language/:language", getTranslationBySurah)
router.get("/surah/:surahNumber/ayah/:ayahNumber", getTranslationByAyah)

export default router
