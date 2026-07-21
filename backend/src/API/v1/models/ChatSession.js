import mongoose from "mongoose";

const ChatSessionSchema = new mongoose.Schema(
{
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },

    title: {
        type: String,
        default: "Cuộc trò chuyện mới"
    },

    lastMessageAt: {
        type: Date,
        default: Date.now
    }
},
{
    timestamps: true
});

module.exports =
mongoose.model("ChatSession", ChatSessionSchema);