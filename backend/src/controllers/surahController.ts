import { Request, Response, NextFunction } from "express"
import { SurahService } from "../services/surahService"

const surahService = new SurahService()

export async function getAllSurahs(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await surahService.findAll(req.query as Record<string, string | undefined>)
    res.json(result)
  } catch (error) {
    next(error)
  }
}

export async function getSurahById(req: Request, res: Response, next: NextFunction) {
  try {
    const surah = await surahService.findById(req.params.id as string)
    res.json({ data: surah })
  } catch (error) {
    next(error)
  }
}

export async function getSurahByNumber(req: Request, res: Response, next: NextFunction) {
  try {
    const surah = await surahService.findByNumber(parseInt(req.params.number as string, 10))
    res.json({ data: surah })
  } catch (error) {
    next(error)
  }
}

export async function getSurahSummary(req: Request, res: Response, next: NextFunction) {
  try {
    const surahs = await surahService.getSurahSummary()
    res.json({ data: surahs })
  } catch (error) {
    next(error)
  }
}

export async function getJuzList(req: Request, res: Response, next: NextFunction) {
  try {
    const juzList = await surahService.getJuzList()
    res.json({ data: juzList })
  } catch (error) {
    next(error)
  }
}
