import { Router } from "express"
import {
  getAllSurahs,
  getSurahById,
  getSurahByNumber,
  getSurahSummary,
  getJuzList,
} from "../controllers/surahController"

const router = Router()

router.get("/", getAllSurahs)
router.get("/summary", getSurahSummary)
router.get("/juz", getJuzList)
router.get("/number/:number", getSurahByNumber)
router.get("/:id", getSurahById)

export default router
