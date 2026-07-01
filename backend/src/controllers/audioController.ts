import { Request, Response, NextFunction } from "express"
import { AudioService } from "../services/audioService"

const audioService = new AudioService()

export async function getAllAudio(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await audioService.findAll(req.query as Record<string, string | undefined>)
    res.json(result)
  } catch (error) {
    next(error)
  }
}

export async function getAudioBySurah(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await audioService.findBySurah(
      parseInt(req.params.surahNumber as string, 10),
      req.query as Record<string, string | undefined>
    )
    res.json(result)
  } catch (error) {
    next(error)
  }
}

export async function getAudioByReciter(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await audioService.findByReciter(
      req.params.reciterId as string,
      req.query as Record<string, string | undefined>
    )
    res.json(result)
  } catch (error) {
    next(error)
  }
}

export async function getReciters(req: Request, res: Response, next: NextFunction) {
  try {
    const reciters = await audioService.getReciterList()
    res.json({ data: reciters })
  } catch (error) {
    next(error)
  }
}
