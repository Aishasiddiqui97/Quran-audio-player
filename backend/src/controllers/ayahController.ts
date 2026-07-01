import { Request, Response, NextFunction } from "express"
import { AyahService } from "../services/ayahService"

const ayahService = new AyahService()

export async function getAllAyahs(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await ayahService.findAll(req.query as Record<string, string | undefined>)
    res.json(result)
  } catch (error) {
    next(error)
  }
}

export async function getAyahById(req: Request, res: Response, next: NextFunction) {
  try {
    const ayah = await ayahService.findById(req.params.id as string)
    res.json({ data: ayah })
  } catch (error) {
    next(error)
  }
}

export async function getAyahsBySurah(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await ayahService.findBySurah(
      parseInt(req.params.surahNumber as string, 10),
      req.query as Record<string, string | undefined>
    )
    res.json(result)
  } catch (error) {
    next(error)
  }
}

export async function getAyahsByJuz(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await ayahService.findByJuz(
      parseInt(req.params.juz as string, 10),
      req.query as Record<string, string | undefined>
    )
    res.json(result)
  } catch (error) {
    next(error)
  }
}

export async function getAyahsByPage(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await ayahService.findByPage(
      parseInt(req.params.page as string, 10),
      req.query as Record<string, string | undefined>
    )
    res.json(result)
  } catch (error) {
    next(error)
  }
}

export async function getSingleAyah(req: Request, res: Response, next: NextFunction) {
  try {
    const ayah = await ayahService.findOneAyah(
      parseInt(req.params.surahNumber as string, 10),
      parseInt(req.params.ayahNumber as string, 10)
    )
    res.json({ data: ayah })
  } catch (error) {
    next(error)
  }
}

export async function getSajdaAyahs(req: Request, res: Response, next: NextFunction) {
  try {
    const ayahs = await ayahService.getSajdaAyahs()
    res.json({ data: ayahs })
  } catch (error) {
    next(error)
  }
}
