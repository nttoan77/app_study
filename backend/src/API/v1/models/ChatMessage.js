import mongoose from "mongoose";

const ChatMessageSchema = new mongoose.Schema({
    sessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ChatSession",   // hoặc "Conversation" nếu bạn đổi tên
        required: true,
        index: true
    },
    role: {
        type: String,
        enum: ["user", "assistant", "system"],
        required: true
    },
    content: {
        type: String,
        required: true
    },
    // Thêm nếu cần
    metadata: {
        type: Object,
        default: {}
    }
}, {
    timestamps: true
});

// Index tối ưu query
ChatMessageSchema.index({ sessionId: 1, createdAt: -1 });

const ChatMessage = mongoose.model("ChatMessage", ChatMessageSchema);

export default ChatMessage;