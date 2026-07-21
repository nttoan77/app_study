import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true }, // VD: "Nhắc nhở lịch hẹn"
    content: { type: String, required: true }, // VD: "Phỏng vấn ứng viên lúc 14:00"
    isRead: { type: Boolean, default: false }, // Trạng thái đã đọc hay chưa
    noteId: { // Liên kết ngược lại file Note của bạn nếu cần bấm vào xem chi tiết
      type: mongoose.Schema.Types.ObjectId,
      ref: "Note",
      default: null
    }
  },
  { timestamps: true }
);

export default mongoose.model("Notification", NotificationSchema);