import mongoose, { Document, Schema } from "mongoose"

export interface IMessage {
  role: "user" | "assistant"
  content: string
  timestamp: Date
  metadata?: Record<string, unknown>
}

export interface IConversation extends Document {
  userId: mongoose.Types.ObjectId
  title: string
  messages: IMessage[]
  feature: "ask" | "explain" | "topics" | "reflection" | "quiz" | "memorize"
}

const messageSchema = new Schema<IMessage>(
  {
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    metadata: { type: Schema.Types.Mixed },
  },
  { _id: false }
)

const conversationSchema = new Schema<IConversation>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true, trim: true },
    messages: [messageSchema],
    feature: {
      type: String,
      enum: ["ask", "explain", "topics", "reflection", "quiz", "memorize"],
      required: true,
    },
  },
  { timestamps: true }
)

conversationSchema.index({ userId: 1, updatedAt: -1 })

export default mongoose.model<IConversation>("Conversation", conversationSchema)
