import cron from "node-cron";
import Note from "../models/Note.model.js"; // Sửa lại đường dẫn import đúng dự án của bạn

// Quét mỗi phút 1 lần
cron.schedule("* * * * *", async () => {
  try {
    const now = new Date();

    // Tìm những ghi chú có reminderDate nhỏ hơn hoặc bằng hiện tại mà chưa gửi thông báo
    const overdueReminders = await Note.find({
      reminderDate: { $lte: now },
      isDeleted: false,
      isNotified: false,
      reminderStatus: "pending"
    });

    if (overdueReminders.length > 0) {
      for (const note of overdueReminders) {
        
        // 1. Thực hiện hành động gửi thông báo ở đây
        console.log(`🔔 THÔNG BÁO: Ghi chú "${note.title || 'Không tiêu đề'}" đã đến giờ hẹn!`);

        // 2. Cập nhật lại trạng thái để không bị thông báo lặp lại
        note.isNotified = true;
        note.reminderStatus = "done";
        await note.save();

        // 3. NẾU CÓ SOCKET.IO: Hãy phát sự kiện real-time tại đây
        // global.io.to(note.userId.toString()).emit("new_notification", {
        //   message: `Lịch hẹn: ${note.title} đã đến giờ thực hiện!`,
        //   noteId: note._id
        // });
      }
    }
  } catch (error) {
    console.error("Lỗi trong quá trình quét thông báo đặt lịch:", error);
  }
});