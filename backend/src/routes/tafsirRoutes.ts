import { Router } from "express"
import {
  getAllTafsir,
  getTafsirByAyah,
  getTafsirBySurah,
  getAvailableSources,
} from "../controllers/tafsirController"

const router = Router()

router.get("/", getAllTafsir)
router.get("/sources", getAvailableSources)
router.get("/surah/:surahNumber", getTafsirBySurah)
router.get("/surah/:surahNumber/ayah/:ayahNumber", getTafsirByAyah)

export default router
