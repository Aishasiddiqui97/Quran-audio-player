import { Request, Response, NextFunction } from "express"
import { WordByWordService } from "../services/wordByWordService"

const wordByWordService = new WordByWordService()

export async function getAllWordByWord(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await wordByWordService.findAll(req.query as Record<string, string | undefined>)
    res.json(result)
  } catch (error) {
    next(error)
  }
}

export async function getWordByWordByAyah(req: Request, res: Response, next: NextFunction) {
  try {
    const words = await wordByWordService.findByAyah(
      parseInt(req.params.surahNumber as string, 10),
      parseInt(req.params.ayahNumber as string, 10)
    )
    res.json({ data: words })
  } catch (error) {
    next(error)
  }
}

export async function getWordByWordBySurah(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await wordByWordService.findBySurah(
      parseInt(req.params.surahNumber as string, 10),
      req.query as Record<string, string | undefined>
    )
    res.json(result)
  } catch (error) {
    next(error)
  }
}
