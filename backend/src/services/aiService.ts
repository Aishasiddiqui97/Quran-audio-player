import { config } from "../config/env"
import Surah from "../models/Surah"
import Ayah from "../models/Ayah"
import Translation from "../models/Translation"
import Tafsir from "../models/Tafsir"

interface AIResponse {
  content: string
  metadata?: Record<string, unknown>
}

interface QuizQuestion {
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

const SYSTEM_PROMPTS: Record<string, string> = {
  ask: "You are a knowledgeable Islamic scholar assistant. Answer questions about the Quran, its teachings, history, and context. Reference specific verses where relevant. Be respectful, accurate, and balanced in your responses.",
  explain:
    "You are a Quranic exegesis (tafsir) expert. Provide clear explanations of Quranic verses, including context (asbab al-nuzul), linguistic insights, and practical lessons. Reference classical and contemporary scholarship.",
  topics:
    "You are a Quranic topics researcher. Help users find relevant Quranic verses on specific topics. List the verses with their references and brief explanations of relevance.",
  reflection:
    "You are a spiritual guide providing daily Quranic reflections. Offer a verse followed by thoughtful reflection points for personal growth and spiritual connection.",
  quiz:
    "You are a Quranic quiz generator. Create educational multiple-choice questions about the Quran covering: verses, stories, historical context, teachings, and terminology. Each question must be accurate and referenced.",
  memorize:
    "You are a Quran memorization (tahfiz) coach. Help users memorize verses by providing: verse text, transliteration, meaning,分段 (chunking), repetition patterns, and tips for retention.",
}

const MOCK_RESPONSES: Record<string, (input?: string) => string> = {
  ask: (input) => {
    const q = (input || "").toLowerCase()
    if (q.includes("basmalah") || q.includes("bismillah"))
      return `The Basmalah ("Bismillah ir-Rahman ir-Rahim" — In the Name of Allah, the Most Gracious, the Most Merciful) appears at the beginning of every surah except Surah At-Tawbah (9). It is also found within Surah An-Naml (27:30). It serves as a reminder to begin all actions with Allah's name, seeking His blessing and guidance. The phrase emphasizes two of Allah's most beautiful attributes: Ar-Rahman (The Most Gracious) and Ar-Rahim (The Most Merciful), encompassing His universal and specific mercy.`
    if (q.includes("first revelation") || q.includes("first revealed") || q.includes("iqra"))
      return `The first revelation received by Prophet Muhammad (peace be upon him) was the first five verses of Surah Al-Alaq (96:1-5), revealed in the Cave of Hira through Angel Jibril (Gabriel). The first word was "Iqra" (Read/Recite). These verses highlight: 1) The command to seek knowledge, 2) Allah's creative power, 3) The nobility of the pen and writing, 4) The generosity of Allah in teaching humans what they did not know. This event marked the beginning of Prophet Muhammad's prophethood.`
    if (q.includes("mercy") || q.includes("rahma"))
      return `Allah's mercy (Rahmah) is a central theme in the Quran. The most frequent phrase is "Bismillah ir-Rahman ir-Rahim." Allah describes Himself as "Ar-Rahman" (The Most Gracious) and "Ar-Rahim" (The Most Merciful). The Quran states: "My mercy encompasses all things" (Quran 7:156) and "Your Lord has prescribed mercy for Himself" (Quran 6:54). The Prophet (PBUH) said: "When Allah completed the creation, He wrote in His Book: 'My mercy prevails over My wrath'" (Sahih Bukhari). The Quran emphasizes that Allah's mercy is near to the righteous (7:56) and that He has ordained mercy for Himself (6:12).`
    if (q.includes("patience") || q.includes("sabr"))
      return `Patience (Sabr) is highly emphasized in the Quran. Allah says: "Indeed, Allah is with the patient" (Quran 2:153) and "And seek help through patience and prayer" (Quran 2:45). The Quran promises that "the patient will be given their reward without account" (Quran 39:10). Patience is mentioned over 90 times in the Quran, often paired with prayer (salah) as essential tools for facing life's challenges. The Quran also teaches that with hardship comes ease (94:5-6), providing comfort to those who are patient.`
    if (q.includes("charity") || q.includes("sadaqa") || q.includes("zakat"))
      return `Charity is strongly emphasized in the Quran. Zakat (obligatory charity) is one of the Five Pillars of Islam, mentioned alongside prayer (salah) in numerous verses. The Quran says: "The example of those who spend their wealth in the way of Allah is like a seed of grain which grows seven spikes; in each spike is a hundred grains" (Quran 2:261). Sadaqah (voluntary charity) is encouraged, and the Quran warns against showing off: "O you who believe, do not invalidate your charities with reminders or injury" (Quran 2:264). The Quran specifies that charity is for the poor, needy, and those in bondage (9:60).`
    if (q.includes("paradise") || q.includes("jannah") || q.includes("heaven"))
      return `Paradise (Jannah) is described in vivid detail in the Quran as a reward for the righteous. It is described as "gardens beneath which rivers flow" (2:25), where inhabitants will have pure spouses, enjoy delicious fruits, and drink pure water and milk. The highest level is Firdaws (18:107). The people of Paradise will be free from fear, grief, and fatigue. They will be greeted with "Salam" (peace) and will hear no idle speech — only "Salam" (56:25-26). The Quran emphasizes that entry to Paradise is by Allah's mercy, though facilitated by faith and good deeds.`
    if (q.includes("hell") || q.includes("jahannam"))
      return `Hell (Jahannam) is described in the Quran as a place of severe punishment for those who reject faith and persist in evil. It is described as having seven gates (15:44), with fire whose fuel is people and stones (2:24). The inhabitants will experience intense heat, boiling water to drink, and bitter cold (Zamhareer). The Quran uses these descriptions not to instill despair but as a warning to encourage righteousness and repentance. Allah emphasizes that He is Oft-Forgiving and that His mercy is vast — the descriptions of Hell are balanced with countless verses about Allah's forgiveness and mercy.`
    if (q.includes("prophet") && (q.includes("muhammad") || q.includes("mohammad")))
      return `Prophet Muhammad (peace be upon him) is the final messenger in Islam, mentioned by name 4 times in the Quran. The Quran describes him as "a mercy to all worlds" (21:107) and as having the highest moral character (68:4). Allah instructs believers to obey the Prophet (4:80) and send blessings upon him (33:56). The Prophet's role includes: reciting Allah's verses, purifying believers, teaching the Book and wisdom (62:2). The Quran also addresses him directly with guidance and comfort, such as in Surah Ad-Duha (93) when he was distressed.`
    const fallback = input || "your question"
    return `Thank you for your question about "${fallback.substring(0, 50)}...". The Quran provides comprehensive guidance on this subject. I recommend reading relevant verses and consulting authentic tafsir (commentary) works by scholars like Ibn Kathir, Al-Tabari, and Al-Qurtubi. Would you like me to search for specific verses related to this topic?`
  },

  topics: (_input) => {
    return `To find verses on a specific topic, please enter the topic you're interested in (e.g., patience, mercy, prayer, charity, forgiveness, justice, etc.). I'll search the Quran for relevant verses with references.`
  },

  explain: (_input) => {
    return `To explain a verse, please provide the surah number and verse number (e.g., surah 1, verse 1 for Al-Fatihah). I'll provide context, meaning, and insights from tafsir.`
  },

  reflection: (_input) => {
    const reflections = [
      {
        verse: "Surah Al-Inshirah (94:5-6) — 'For indeed, with hardship comes ease. Indeed, with hardship comes ease.'",
        text: `This beautiful reassurance is repeated twice for emphasis. Allah promises that every difficulty is accompanied by relief. The repetition suggests that just as hardship is certain, so too is ease. Take a moment to reflect on a challenge you're currently facing. How might this verse change your perspective? What "ease" can you already see emerging from your difficulty? This verse teaches us that trials are temporary and that Allah's mercy is always near.`,
      },
      {
        verse: "Surah Al-Asr (103:1-3) — 'By time, indeed mankind is in loss, except those who believe, do righteous deeds, advise each other to truth, and advise each other to patience.'",
        text: `This short surah encapsulates the entire message of the Quran. Imam Al-Shafi'i said that if people only pondered this single surah, it would suffice them. It identifies the four pillars of salvation: faith (iman), righteous action (amal salih), mutual encouragement of truth (tawasi bil-haqq), and mutual encouragement of patience (tawasi bil-sabr). Reflect: How are you investing your time today in these four areas?`,
      },
      {
        verse: "Surah Al-Baqarah (2:286) — 'Allah does not burden a soul more than it can bear...'",
        text: `This profound verse comes at the end of the longest surah of the Quran and serves as a powerful reminder of Allah's perfect justice and mercy. Whatever you are going through, Allah knows your capacity and has not given you more than you can handle. The verse also contains a beautiful supplication: 'Our Lord, do not impose blame upon us if we forget or make mistakes.' Today, trust in Allah's wisdom and have confidence in your own strength — He knows you better than you know yourself.`,
      },
      {
        verse: "Surah Ad-Duha (93:1-11) — 'By the morning brightness... Your Lord has not forsaken you, nor does He hate you...'",
        text: `This surah was revealed when the revelation paused for a period, and the Prophet (PBUH) became distressed. Allah reassures him with tender words. The surah acknowledges the past blessings: 'Did He not find you an orphan and give you shelter? Find you lost and guide you? Find you in need and enrich you?' Then it commands gratitude and care for others: 'So do not oppress the orphan, and do not repel the beggar, and proclaim the blessings of your Lord.' Reflect on times you felt Allah was distant. How did His mercy eventually manifest?`,
      },
    ]
    const r = reflections[Math.floor(Math.random() * reflections.length)]
    return `**${r.verse}**\n\n${r.text}`
  },

  quiz: (_input) => {
    return `Generate a new quiz question by typing "generate quiz" or "quiz me". I'll create multiple-choice questions about the Quran covering various topics.`
  },

  memorize: (_input) => {
    return `To help with memorization, please provide the surah number and verses you'd like to memorize (e.g., surah 1 verses 1-7 for Al-Fatihah). I'll help break it down with transliteration, meaning, and memorization tips.`
  },
}

function buildVerseRef(surahNumber: number, ayahNumber: number, surahName?: string): string {
  return `${surahName || `Surah ${surahNumber}`} (${surahNumber}:${ayahNumber})`
}

async function fetchAyatContext(
  surahNumber: number,
  ayahNumber: number
): Promise<{ ayah: string; translation: string; tafsir: string } | null> {
  try {
    const [ayah, translations, tafsirs] = await Promise.all([
      Ayah.findOne({ surahNumber, ayahNumber }).lean(),
      Translation.findOne({
        surahNumber,
        ayahNumber,
        language: "en",
      }).lean(),
      Tafsir.findOne({ surahNumber, ayahNumber, language: "en" }).lean(),
    ])
    if (!ayah) return null
    return {
      ayah: (ayah as any).textArabic,
      translation: (translations as any)?.text || "",
      tafsir: (tafsirs as any)?.text || "",
    }
  } catch {
    return null
  }
}

function buildQuizPrompt(): string {
  const topics = [
    "prophet stories",
    "verses about prayer",
    "Meccan surahs",
    "Medinan surahs",
    "names of Allah",
    "verses about justice",
    "verses about mercy",
    "scientific miracles",
    "stories of previous prophets",
    "descriptions of paradise",
  ]
  const topic = topics[Math.floor(Math.random() * topics.length)]
  return `Create a multiple-choice question about ${topic} in the Quran. Format as JSON with: question, options (4 items), correctIndex (0-3), explanation.`
}

async function generateMockQuiz(): Promise<QuizQuestion> {
  const quizBank: QuizQuestion[] = [
    {
      question: "How many surahs are in the Quran?",
      options: ["100", "114", "120", "99"],
      correctIndex: 1,
      explanation:
        "The Quran contains 114 surahs (chapters) of varying lengths, revealed over approximately 23 years.",
    },
    {
      question: "Which surah is known as 'The Opening'?",
      options: ["Surah Al-Ikhlas", "Surah Al-Fatihah", "Surah Yaseen", "Surah Al-Baqarah"],
      correctIndex: 1,
      explanation:
        "Surah Al-Fatihah (The Opening) is the first surah of the Quran and is recited in every unit of the Muslim prayer (salah).",
    },
    {
      question: "Which prophet is mentioned most frequently in the Quran?",
      options: ["Prophet Muhammad (PBUH)", "Prophet Musa (Moses)", "Prophet Ibrahim (Abraham)", "Prophet Nuh (Noah)"],
      correctIndex: 1,
      explanation:
        "Prophet Musa (Moses) is mentioned over 130 times in the Quran, more than any other prophet.",
    },
    {
      question: "What is the longest surah in the Quran?",
      options: ["Surah Al-Imran", "Surah Al-Baqarah", "Surah An-Nisa", "Surah Al-A'raf"],
      correctIndex: 1,
      explanation:
        "Surah Al-Baqarah (The Cow) is the longest surah with 286 verses. It was revealed in Medina and covers various legal and spiritual topics.",
    },
    {
      question: "How many verses (ayahs) are there in the Quran approximately?",
      options: ["6236", "5000", "7000", "4444"],
      correctIndex: 0,
      explanation:
        "The Quran contains approximately 6,236 verses (ayahs), though the exact count varies slightly based on different methods of calculation.",
    },
    {
      question: "Which surah is considered the 'Heart of the Quran'?",
      options: ["Surah Ar-Rahman", "Surah Yaseen", "Surah Al-Mulk", "Surah Al-Waqi'ah"],
      correctIndex: 1,
      explanation:
        "Surah Yaseen (36) is traditionally referred to as the 'Heart of the Quran' due to its profound themes of resurrection, divine signs, and the fate of nations.",
    },
    {
      question: "In which year did the first revelation come to Prophet Muhammad (PBUH)?",
      options: ["610 CE", "622 CE", "570 CE", "632 CE"],
      correctIndex: 0,
      explanation:
        "The first revelation (Surah Al-Alaq 96:1-5) came in 610 CE when Prophet Muhammad was 40 years old, while he was meditating in the Cave of Hira.",
    },
    {
      question: "What does 'Quran' literally mean?",
      options: ["The Book", "The Recitation", "The Law", "The Wisdom"],
      correctIndex: 1,
      explanation:
        "The word 'Quran' is derived from the Arabic root q-r-a (to read/recite) and literally means 'The Recitation' or 'That which is recited.'",
    },
  ]

  return quizBank[Math.floor(Math.random() * quizBank.length)]
}

export class AIService {
  private useAI(): boolean {
    return !!config.openAiKey
  }

  async ask(input: string, conversationHistory: { role: string; content: string }[] = []): Promise<AIResponse> {
    if (this.useAI()) {
      return this.callOpenAI("ask", input, conversationHistory)
    }
    const response = MOCK_RESPONSES.ask(input)
    return { content: response }
  }

  async topicFinder(topic: string): Promise<AIResponse> {
    if (!topic.trim()) {
      return { content: MOCK_RESPONSES.topics("") }
    }
    if (this.useAI()) {
      return this.callOpenAI("topics", `Find verses about: ${topic}`)
    }
    const topics = [
      { keywords: ["patience", "sabr"], surahs: [2, 3, 8, 11, 12, 16, 18, 31, 39, 42, 46, 50, 70, 76, 90, 103] },
      { keywords: ["mercy", "rahma", "forgive", "gracious"], surahs: [1, 2, 3, 4, 5, 6, 7, 9, 11, 15, 16, 17, 18, 19, 21, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114] },
      { keywords: ["prayer", "salah", "salat"], surahs: [2, 4, 5, 6, 7, 8, 9, 10, 11, 13, 14, 17, 19, 20, 21, 22, 23, 24, 27, 29, 30, 31, 33, 35, 37, 38, 39, 40, 42, 45, 48, 50, 51, 52, 53, 56, 57, 58, 60, 62, 70, 73, 74, 75, 87, 96, 98, 107, 108] },
      { keywords: ["charity", "zakat", "sadaqa", "give"], surahs: [2, 3, 4, 5, 7, 8, 9, 13, 14, 16, 17, 18, 19, 21, 22, 23, 24, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 38, 39, 40, 41, 42, 45, 47, 48, 49, 50, 51, 53, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 70, 73, 74, 76, 77, 78, 80, 82, 84, 85, 86, 89, 90, 91, 92, 93, 95, 96, 97, 98, 100, 102, 103, 104, 107, 108, 109, 110, 111, 112, 113, 114] },
      { keywords: ["justice", "fair", "equity"], surahs: [2, 3, 4, 5, 6, 7, 10, 11, 14, 15, 16, 17, 18, 21, 22, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114] },
    ]

    const matched = topics.find((t) => t.keywords.some((k) => topic.toLowerCase().includes(k)))
    if (matched) {
      try {
        const surahs = await Surah.find({ surahNumber: { $in: matched.surahs.slice(0, 5) } })
          .select("nameSimple surahNumber")
          .lean()
        let response = `Here are some Quranic verses related to "${topic}":\n\n`
        for (const s of surahs) {
          const ayah = await Ayah.findOne({ surahNumber: (s as any).surahNumber, ayahNumber: 1 }).lean()
          if (ayah) {
            response += `• ${(s as any).nameSimple} (${(s as any).surahNumber}:1)\n`
          }
        }
        response += `\nThe Quran extensively covers this topic. I recommend reading the verses with their translations and tafsir for deeper understanding. Would you like me to elaborate on any specific aspect?`
        return { content: response }
      } catch {
        return { content: MOCK_RESPONSES.ask(`I found some references about ${topic}`) }
      }
    }
    return { content: MOCK_RESPONSES.ask(topic) }
  }

  async explainVerse(surahNumber: number, ayahNumber: number): Promise<AIResponse> {
    const context = await fetchAyatContext(surahNumber, ayahNumber)
    if (!context) {
      return { content: `I couldn't find verse ${surahNumber}:${ayahNumber} in the database. Please verify the surah and verse numbers.` }
    }

    if (this.useAI()) {
      return this.callOpenAI("explain", `Explain Surah ${surahNumber}:${ayahNumber}\n\nArabic: ${context.ayah}\nTranslation: ${context.translation}\nTafsir: ${context.tafsir}`)
    }

    const surah = await Surah.findOne({ surahNumber }).select("nameSimple revelationType").lean()
    const ref = buildVerseRef(surahNumber, ayahNumber, (surah as any)?.nameSimple)
    let response = `**${ref}**\n\n`

    if (context.ayah) response += `**Arabic:**\n${context.ayah}\n\n`
    if (context.translation) response += `**Translation:**\n${context.translation}\n\n`
    if (context.tafsir) {
      response += `**Explanation (Tafsir):**\n${context.tafsir.substring(0, 500)}${context.tafsir.length > 500 ? "..." : ""}\n\n`
    }

    response += `This verse is from ${(surah as any)?.revelationType || "a revealed"} surah. For a more comprehensive tafsir, consider consulting Ibn Kathir or Al-Tabari.\n\nWould you like me to provide more context about this verse or explore related verses?`
    return { content: response, metadata: { surahNumber, ayahNumber } }
  }

  async dailyReflection(): Promise<AIResponse> {
    if (this.useAI()) {
      return this.callOpenAI("reflection", "Share a daily reflection verse and reflection points.")
    }
    return { content: MOCK_RESPONSES.reflection() }
  }

  async generateQuiz(): Promise<AIResponse> {
    if (this.useAI()) {
      return this.callOpenAI("quiz", buildQuizPrompt())
    }
    const quiz = await generateMockQuiz()
    return {
      content: JSON.stringify(quiz),
      metadata: { type: "quiz", question: quiz },
    }
  }

  async memorize(surahNumber: number, startAyah: number, endAyah: number): Promise<AIResponse> {
    if (this.useAI()) {
      return this.callOpenAI("memorize", `Help memorize Surah ${surahNumber} verses ${startAyah}-${endAyah}. Provide: verse text, transliteration, meaning, chunking, and tips.`)
    }

    const surah = await Surah.findOne({ surahNumber }).select("nameSimple nameArabic").lean()
    const ayahs = await Ayah.find({ surahNumber, ayahNumber: { $gte: startAyah, $lte: endAyah } })
      .sort({ ayahNumber: 1 })
      .lean()

    if (ayahs.length === 0) {
      return { content: `No verses found for Surah ${surahNumber} verses ${startAyah}-${endAyah}. Please check the range.` }
    }

    let response = `## Memorization Guide\n\n`
    response += `**Surah:** ${(surah as any)?.nameSimple || `Surah ${surahNumber}`} (${(surah as any)?.nameArabic || ""})\n`
    response += `**Verses:** ${startAyah}–${endAyah} (${ayahs.length} verses)\n\n`

    for (const ayah of ayahs) {
      const a = ayah as any
      response += `---\n### Verse ${a.ayahNumber}\n\n`
      response += `**Arabic:**\n${a.textArabic}\n\n`
    }

    response += `\n### Memorization Tips\n\n`
    response += `1. **Break it down:** Memorize 1-2 verses at a time\n`
    response += `2. **Repetition:** Repeat each verse 5-10 times\n`
    response += `3. **Listen:** Use audio recitations to reinforce\n`
    response += `4. **Connect:** Understand the meaning to improve retention\n`
    response += `5. **Review:** Revisit previously memorized verses daily\n`
    response += `6. **Pray:** Use memorized portions in your prayers\n\n`
    response += `Would you like audio recommendations or further breakdown of specific verses?`
    return { content: response, metadata: { surahNumber, startAyah, endAyah, totalAyahs: ayahs.length } }
  }

  private async callOpenAI(
    _feature: string,
    input: string,
    conversationHistory: { role: string; content: string }[] = []
  ): Promise<AIResponse> {
    if (!config.openAiKey) {
      return { content: "AI service is not configured. Please set OPENAI_API_KEY." }
    }

    try {
      const { default: OpenAI } = await import("openai")
      const openai = new OpenAI({ apiKey: config.openAiKey })

      const messages = [
        { role: "system", content: SYSTEM_PROMPTS[_feature] || SYSTEM_PROMPTS.ask },
        ...conversationHistory.slice(-10),
        { role: "user", content: input },
      ]

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: messages as any,
        max_tokens: 1024,
        temperature: 0.7,
      })

      const content = completion.choices[0]?.message?.content || "I couldn't generate a response. Please try again."
      return { content }
    } catch (error: any) {
      return { content: `AI service error: ${error.message || "Please try again later."}` }
    }
  }
}
