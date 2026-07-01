import { Request, Response, NextFunction } from "express"
import User from "../models/User"
import Surah from "../models/Surah"
import Ayah from "../models/Ayah"
import Translation from "../models/Translation"
import Tafsir from "../models/Tafsir"
import Audio from "../models/Audio"
import WordByWord from "../models/WordByWord"
import { AuthRequest } from "../middleware/authMiddleware"

export async function getAnalytics(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const [
      totalUsers,
      totalAdmins,
      totalSurahs,
      totalAyahs,
      totalTranslations,
      totalTafsir,
      totalAudio,
      totalWordByWord,
      recentUsers,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "admin" }),
      Surah.countDocuments(),
      Ayah.countDocuments(),
      Translation.countDocuments(),
      Tafsir.countDocuments(),
      Audio.countDocuments(),
      WordByWord.countDocuments(),
      User.find().sort({ createdAt: -1 }).limit(5).select("name email role createdAt"),
    ])

    res.json({
      data: {
        users: { total: totalUsers, admins: totalAdmins },
        surahs: totalSurahs,
        ayahs: totalAyahs,
        translations: totalTranslations,
        tafsir: totalTafsir,
        audio: totalAudio,
        wordByWord: totalWordByWord,
        recentUsers,
      },
    })
  } catch (error) {
    next(error)
  }
}

export async function getUsers(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const page = Math.max(1, parseInt(req.query.page as string, 10) || 1)
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string, 10) || 20))
    const search = (req.query.search as string) || ""
    const skip = (page - 1) * limit

    const filter: Record<string, any> = {}
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ]
    }

    const [users, total] = await Promise.all([
      User.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("-password"),
      User.countDocuments(filter),
    ])

    res.json({
      data: users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
    })
  } catch (error) {
    next(error)
  }
}

export async function updateUserRole(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { role } = req.body

    if (!role || !["user", "admin"].includes(role)) {
      res.status(400).json({ message: "Invalid role. Must be 'user' or 'admin'" })
      return
    }

    const user = await User.findById(req.params.id)
    if (!user) {
      res.status(404).json({ message: "User not found" })
      return
    }

    user.role = role
    await user.save()

    res.json({
      message: "User role updated",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    })
  } catch (error) {
    next(error)
  }
}

export async function deleteUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) {
      res.status(404).json({ message: "User not found" })
      return
    }
    res.json({ message: "User deleted successfully" })
  } catch (error) {
    next(error)
  }
}

export async function getSurahs(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const page = Math.max(1, parseInt(req.query.page as string, 10) || 1)
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string, 10) || 50))
    const search = (req.query.search as string) || ""
    const skip = (page - 1) * limit

    const filter: Record<string, any> = {}
    if (search) {
      filter.$or = [
        { nameSimple: { $regex: search, $options: "i" } },
        { nameEnglish: { $regex: search, $options: "i" } },
        { nameArabic: { $regex: search } },
      ]
    }

    const [surahs, total] = await Promise.all([
      Surah.find(filter).sort({ surahNumber: 1 }).skip(skip).limit(limit),
      Surah.countDocuments(filter),
    ])

    res.json({
      data: surahs,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
    })
  } catch (error) {
    next(error)
  }
}

export async function updateSurah(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const allowedFields = ["nameArabic", "nameSimple", "nameEnglish", "revelationType", "audioUrl"]
    const updates: Record<string, any> = {}

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field]
      }
    }

    const surah = await Surah.findOneAndUpdate(
      { surahNumber: parseInt(req.params.surahNumber as string, 10) },
      { $set: updates },
      { new: true, runValidators: true }
    )

    if (!surah) {
      res.status(404).json({ message: "Surah not found" })
      return
    }

    res.json({ data: surah })
  } catch (error) {
    next(error)
  }
}

export async function deleteSurah(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const surahNumber = parseInt(req.params.surahNumber as string, 10)

    const surah = await Surah.findOneAndDelete({ surahNumber })
    if (!surah) {
      res.status(404).json({ message: "Surah not found" })
      return
    }

    await Promise.all([
      Ayah.deleteMany({ surahNumber }),
      Translation.deleteMany({ surahNumber }),
      Tafsir.deleteMany({ surahNumber }),
      Audio.deleteMany({ surahNumber }),
      WordByWord.deleteMany({ surahNumber }),
    ])

    res.json({ message: "Surah and all related data deleted successfully" })
  } catch (error) {
    next(error)
  }
}

export async function getTafsirList(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const page = Math.max(1, parseInt(req.query.page as string, 10) || 1)
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string, 10) || 50))
    const skip = (page - 1) * limit

    const filter: Record<string, any> = {}
    if (req.query.source) filter.source = req.query.source as string

    const [entries, total] = await Promise.all([
      Tafsir.find(filter).sort({ surahNumber: 1, ayahNumber: 1 }).skip(skip).limit(limit),
      Tafsir.countDocuments(filter),
    ])

    res.json({
      data: entries,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
      sources: await Tafsir.distinct("source"),
    })
  } catch (error) {
    next(error)
  }
}

export async function deleteTafsirEntry(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const entry = await Tafsir.findByIdAndDelete(req.params.id)
    if (!entry) {
      res.status(404).json({ message: "Tafsir entry not found" })
      return
    }
    res.json({ message: "Tafsir entry deleted" })
  } catch (error) {
    next(error)
  }
}

export async function getTranslationList(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const page = Math.max(1, parseInt(req.query.page as string, 10) || 1)
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string, 10) || 50))
    const skip = (page - 1) * limit

    const filter: Record<string, any> = {}
    if (req.query.language) filter.language = req.query.language as string

    const [entries, total] = await Promise.all([
      Translation.find(filter)
        .sort({ surahNumber: 1, ayahNumber: 1 })
        .skip(skip)
        .limit(limit),
      Translation.countDocuments(filter),
    ])

    res.json({
      data: entries,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
      languages: await Translation.distinct("language"),
      editions: await Translation.distinct("translationEdition"),
    })
  } catch (error) {
    next(error)
  }
}

export async function deleteTranslationEntry(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const entry = await Translation.findByIdAndDelete(req.params.id)
    if (!entry) {
      res.status(404).json({ message: "Translation entry not found" })
      return
    }
    res.json({ message: "Translation entry deleted" })
  } catch (error) {
    next(error)
  }
}

export async function getAudioList(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const page = Math.max(1, parseInt(req.query.page as string, 10) || 1)
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string, 10) || 50))
    const skip = (page - 1) * limit

    const filter: Record<string, any> = {}
    if (req.query.reciter) filter.reciter = req.query.reciter as string
    if (req.query.reciterId) filter.reciterId = req.query.reciterId as string

    const [entries, total] = await Promise.all([
      Audio.find(filter).sort({ surahNumber: 1, ayahNumber: 1 }).skip(skip).limit(limit),
      Audio.countDocuments(filter),
    ])

    res.json({
      data: entries,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
      reciters: await Audio.distinct("reciter"),
      reciterIds: await Audio.distinct("reciterId"),
    })
  } catch (error) {
    next(error)
  }
}

export async function deleteAudioEntry(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const entry = await Audio.findByIdAndDelete(req.params.id)
    if (!entry) {
      res.status(404).json({ message: "Audio entry not found" })
      return
    }
    res.json({ message: "Audio entry deleted" })
  } catch (error) {
    next(error)
  }
}

export async function seedDatabase(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { execSync } = require("child_process")
    execSync("npm run seed", {
      cwd: __dirname + "/../..",
      stdio: "inherit",
    })
    res.json({ message: "Database seeded successfully" })
  } catch (error) {
    next(error)
  }
}

export async function sendNotification(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { title, message, type } = req.body

    if (!title || !message) {
      res.status(400).json({ message: "Title and message are required" })
      return
    }

    res.json({
      message: "Notification sent",
      notification: {
        title,
        message,
        type: type || "info",
        sentBy: req.user?.name,
        sentAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    next(error)
  }
}
