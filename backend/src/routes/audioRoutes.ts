import { Router } from "express"
import {
  getAllAudio,
  getAudioBySurah,
  getAudioByReciter,
  getReciters,
} from "../controllers/audioController"

const router = Router()

router.get("/", getAllAudio)
router.get("/reciters", getReciters)
router.get("/reciter/:reciterId", getAudioByReciter)
router.get("/surah/:surahNumber", getAudioBySurah)

export default router
