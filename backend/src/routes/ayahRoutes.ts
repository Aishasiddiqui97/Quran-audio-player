import { Router } from "express"
import {
  getAllAyahs,
  getAyahById,
  getAyahsBySurah,
  getAyahsByJuz,
  getAyahsByPage,
  getSingleAyah,
  getSajdaAyahs,
} from "../controllers/ayahController"

const router = Router()

router.get("/", getAllAyahs)
router.get("/sajda", getSajdaAyahs)
router.get("/surah/:surahNumber", getAyahsBySurah)
router.get("/surah/:surahNumber/ayah/:ayahNumber", getSingleAyah)
router.get("/juz/:juz", getAyahsByJuz)
router.get("/page/:page", getAyahsByPage)
router.get("/:id", getAyahById)

export default router
