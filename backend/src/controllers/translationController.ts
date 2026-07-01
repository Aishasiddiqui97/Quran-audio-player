import { Request, Response, NextFunction } from "express"
import { TranslationService } from "../services/translationService"

const translationService = new TranslationService()

export async function getAllTranslations(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await translationService.findAll(req.query as Record<string, string | undefined>)
    res.json(result)
  } catch (error) {
    next(error)
  }
}

export async function getTranslationByAyah(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await translationService.findByAyah(
      parseInt(req.params.surahNumber as string, 10),
      parseInt(req.params.ayahNumber as string, 10),
      req.query as Record<string, string | undefined>
    )
    res.json(result)
  } catch (error) {
    next(error)
  }
}

export async function getTranslationBySurah(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await translationService.findBySurah(
      parseInt(req.params.surahNumber as string, 10),
      req.params.language as string || "en",
      req.query as Record<string, string | undefined>
    )
    res.json(result)
  } catch (error) {
    next(error)
  }
}

export async function getAvailableEditions(req: Request, res: Response, next: NextFunction) {
  try {
    const editions = await translationService.getAvailableEditions()
    res.json({ data: editions })
  } catch (error) {
    next(error)
  }
}

export async function getLanguages(req: Request, res: Response, next: NextFunction) {
  try {
    const languages = await translationService.getLanguages()
    res.json({ data: languages })
  } catch (error) {
    next(error)
  }
}
