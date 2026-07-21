import mongoose from "mongoose";


const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["user", "assistant", "system"],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const conversationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      default: "Cuộc trò chuyện mới",
    },
    messages: [messageSchema],
    context: {
      cvId: String,
      cvSummary: String,
      jobDescription: String,
      lastUpdated: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Index cho query nhanh
conversationSchema.index({ userId: 1, updatedAt: -1 });

const Conversation = mongoose.model("Conversation", conversationSchema);


export default Conversation;
