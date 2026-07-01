import { Request, Response, NextFunction } from "express"
import { AIService } from "../services/aiService"
import type { AuthRequest } from "../middleware/authMiddleware"
import Conversation from "../models/Conversation"

const aiService = new AIService()

function extractUser(req: Request): string | null {
  const authReq = req as AuthRequest
  return authReq.user?._id?.toString() || authReq.user?.id?.toString() || null
}

export async function askQuestion(req: Request, res: Response, next: NextFunction) {
  try {
    const { question, conversationId } = req.body
    if (!question?.trim()) {
      res.status(400).json({ message: "Question is required" })
      return
    }

    const userId = extractUser(req)
    let history: { role: string; content: string }[] = []

    if (userId && conversationId) {
      const conv = await Conversation.findById(conversationId)
      if (conv) {
        history = conv.messages.map((m) => ({ role: m.role, content: m.content }))
      }
    }

    const response = await aiService.ask(question, history)

    if (userId) {
      const title = conversationId ? undefined : question.substring(0, 60)
      const update = {
        $push: {
          messages: {
            $each: [
              { role: "user", content: question, timestamp: new Date() },
              { role: "assistant", content: response.content, timestamp: new Date(), metadata: response.metadata },
            ],
          },
        },
        $setOnInsert: { userId, title: title || "New conversation", feature: "ask" },
      }
      if (conversationId) {
        await Conversation.findByIdAndUpdate(conversationId, update)
      } else {
        const conv = await Conversation.create({
          userId,
          title: question.substring(0, 60),
          messages: [
            { role: "user", content: question, timestamp: new Date() },
            { role: "assistant", content: response.content, timestamp: new Date(), metadata: response.metadata },
          ],
          feature: "ask",
        })
        res.json({ data: response, conversationId: conv._id })
        return
      }
      res.json({ data: response, conversationId })
      return
    }

    res.json({ data: response })
  } catch (error) {
    next(error)
  }
}

export async function findTopics(req: Request, res: Response, next: NextFunction) {
  try {
    const { topic, conversationId } = req.body
    if (!topic?.trim()) {
      res.status(400).json({ message: "Topic is required" })
      return
    }

    const response = await aiService.topicFinder(topic)
    const userId = extractUser(req)

    if (userId) {
      const update = {
        $push: {
          messages: {
            $each: [
              { role: "user", content: `Find verses about: ${topic}`, timestamp: new Date() },
              { role: "assistant", content: response.content, timestamp: new Date(), metadata: response.metadata },
            ],
          },
        },
        $setOnInsert: { userId, title: `Topic: ${topic.substring(0, 50)}`, feature: "topics" },
      }
      if (conversationId) {
        await Conversation.findByIdAndUpdate(conversationId, update)
        res.json({ data: response, conversationId })
      } else {
        const conv = await Conversation.create({
          userId,
          title: `Topic: ${topic.substring(0, 50)}`,
          messages: [
            { role: "user", content: `Find verses about: ${topic}`, timestamp: new Date() },
            { role: "assistant", content: response.content, timestamp: new Date(), metadata: response.metadata },
          ],
          feature: "topics",
        })
        res.json({ data: response, conversationId: conv._id })
      }
      return
    }

    res.json({ data: response })
  } catch (error) {
    next(error)
  }
}

export async function explainVerse(req: Request, res: Response, next: NextFunction) {
  try {
    const { surahNumber, ayahNumber, conversationId } = req.body
    if (!surahNumber || !ayahNumber) {
      res.status(400).json({ message: "surahNumber and ayahNumber are required" })
      return
    }

    const response = await aiService.explainVerse(Number(surahNumber), Number(ayahNumber))
    const userId = extractUser(req)
    const input = `Explain ${surahNumber}:${ayahNumber}`

    if (userId) {
      const update = {
        $push: {
          messages: {
            $each: [
              { role: "user", content: input, timestamp: new Date() },
              { role: "assistant", content: response.content, timestamp: new Date(), metadata: response.metadata },
            ],
          },
        },
        $setOnInsert: { userId, title: `Explanation: ${surahNumber}:${ayahNumber}`, feature: "explain" },
      }
      if (conversationId) {
        await Conversation.findByIdAndUpdate(conversationId, update)
        res.json({ data: response, conversationId })
      } else {
        const conv = await Conversation.create({
          userId,
          title: `Explanation: Surah ${surahNumber}:${ayahNumber}`,
          messages: [
            { role: "user", content: input, timestamp: new Date() },
            { role: "assistant", content: response.content, timestamp: new Date(), metadata: response.metadata },
          ],
          feature: "explain",
        })
        res.json({ data: response, conversationId: conv._id })
      }
      return
    }

    res.json({ data: response })
  } catch (error) {
    next(error)
  }
}

export async function dailyReflection(_req: Request, res: Response, next: NextFunction) {
  try {
    const response = await aiService.dailyReflection()
    res.json({ data: response })
  } catch (error) {
    next(error)
  }
}

export async function generateQuiz(req: Request, res: Response, next: NextFunction) {
  try {
    const response = await aiService.generateQuiz()
    res.json({ data: response })
  } catch (error) {
    next(error)
  }
}

export async function memorize(req: Request, res: Response, next: NextFunction) {
  try {
    const { surahNumber, startAyah, endAyah, conversationId } = req.body
    if (!surahNumber || !startAyah || !endAyah) {
      res.status(400).json({ message: "surahNumber, startAyah, and endAyah are required" })
      return
    }

    const response = await aiService.memorize(Number(surahNumber), Number(startAyah), Number(endAyah))
    const userId = extractUser(req)
    const input = `Memorize Surah ${surahNumber}:${startAyah}-${endAyah}`

    if (userId) {
      const update = {
        $push: {
          messages: {
            $each: [
              { role: "user", content: input, timestamp: new Date() },
              { role: "assistant", content: response.content, timestamp: new Date(), metadata: response.metadata },
            ],
          },
        },
        $setOnInsert: { userId, title: `Memorize: ${surahNumber}:${startAyah}-${endAyah}`, feature: "memorize" },
      }
      if (conversationId) {
        await Conversation.findByIdAndUpdate(conversationId, update)
        res.json({ data: response, conversationId })
      } else {
        const conv = await Conversation.create({
          userId,
          title: `Memorize: Surah ${surahNumber} verses ${startAyah}-${endAyah}`,
          messages: [
            { role: "user", content: input, timestamp: new Date() },
            { role: "assistant", content: response.content, timestamp: new Date(), metadata: response.metadata },
          ],
          feature: "memorize",
        })
        res.json({ data: response, conversationId: conv._id })
      }
      return
    }

    res.json({ data: response })
  } catch (error) {
    next(error)
  }
}

export async function getConversations(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = extractUser(req)
    if (!userId) {
      res.status(401).json({ message: "Authentication required" })
      return
    }

    const conversations = await Conversation.find({ userId })
      .select("title feature updatedAt createdAt")
      .sort({ updatedAt: -1 })
      .lean()

    res.json({ data: conversations })
  } catch (error) {
    next(error)
  }
}

export async function getConversation(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = extractUser(req)
    if (!userId) {
      res.status(401).json({ message: "Authentication required" })
      return
    }

    const conversation = await Conversation.findOne({ _id: req.params.id, userId }).lean()
    if (!conversation) {
      res.status(404).json({ message: "Conversation not found" })
      return
    }

    res.json({ data: conversation })
  } catch (error) {
    next(error)
  }
}

export async function deleteConversation(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = extractUser(req)
    if (!userId) {
      res.status(401).json({ message: "Authentication required" })
      return
    }

    const conversation = await Conversation.findOneAndDelete({ _id: req.params.id, userId })
    if (!conversation) {
      res.status(404).json({ message: "Conversation not found" })
      return
    }

    res.json({ message: "Conversation deleted successfully" })
  } catch (error) {
    next(error)
  }
}
