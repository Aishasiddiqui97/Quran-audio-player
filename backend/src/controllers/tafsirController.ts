import { Request, Response, NextFunction } from "express"
import { TafsirService } from "../services/tafsirService"

const tafsirService = new TafsirService()

export async function getAllTafsir(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await tafsirService.findAll(req.query as Record<string, string | undefined>)
    res.json(result)
  } catch (error) {
    next(error)
  }
}

export async function getTafsirByAyah(req: Request, res: Response, next: NextFunction) {
  try {
    const tafsir = await tafsirService.findByAyah(
      parseInt(req.params.surahNumber as string, 10),
      parseInt(req.params.ayahNumber as string, 10)
    )
    res.json({ data: tafsir })
  } catch (error) {
    next(error)
  }
}

export async function getTafsirBySurah(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await tafsirService.findBySurah(
      parseInt(req.params.surahNumber as string, 10),
      req.query as Record<string, string | undefined>
    )
    res.json(result)
  } catch (error) {
    next(error)
  }
}

export async function getAvailableSources(req: Request, res: Response, next: NextFunction) {
  try {
    const sources = await tafsirService.getAvailableSources()
    res.json({ data: sources })
  } catch (error) {
    next(error)
  }
}
