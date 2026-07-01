import { Router } from "express"
import {
  getAllWordByWord,
  getWordByWordByAyah,
  getWordByWordBySurah,
} from "../controllers/wordByWordController"

const router = Router()

router.get("/", getAllWordByWord)
router.get("/surah/:surahNumber", getWordByWordBySurah)
router.get("/surah/:surahNumber/ayah/:ayahNumber", getWordByWordByAyah)

export default router
