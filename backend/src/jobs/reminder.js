// // src/jobs/reminder.js
// import Note from "../API/v1/models/Note.js";
// import Notification from "../API/v1/models/Notification.js";

// export const startReminderJob = () => {
//   setInterval(async () => {
//     try {
//       const now = new Date();

//       const notes = await Note.find({
//         reminderDate: { $lte: now },
//         isNotified: false,
//         isDeleted: false,
//       });

//       for (const note of notes) {
//         // 1. Lưu thông báo vào Database (để lưu lịch sử)
//         const newNotification = await Notification.create({
//           userId: note.userId,
//           title: note.title || "Thông báo nhắc nhở lịch hẹn",
//           content: note.content,
//           noteId: note._id,
//         });

//         // 2. Cập nhật trạng thái Note
//         note.isNotified = true;
//         note.reminderStatus = "done";
//         note.reminderSent = true;
//         await note.save();

//         // 3. 🔥 BẮN SOCKET REAL-TIME ĐỂ FRONTEND HIỆN POPUP NGAY LẬP TỨC
//         if (global._io) {
//           global._io.to(note.userId.toString()).emit("new_notification", {
//             notificationId: newNotification._id,
//             title: newNotification.title,
//             content: newNotification.content,
//             noteId: note._id,
//             createdAt: newNotification.createdAt,
//           });
//         }

//         console.log(`Đã bắn thông báo & socket cho user: ${note.userId}`);
//       }
//     } catch (err) {
//       console.error("Reminder job error:", err);
//     }
//   }, 60 * 1000);
// };


// ==================
// src/jobs/reminder.js
import Note from "../API/v1/models/Note.js";
import Notification from "../API/v1/models/Notification.js";

export const startReminderJob = () => {
  // Thay vì dùng setInterval dễ bị chồng chéo bộ nhớ, bạn nên dùng khoảng quét chính xác mỗi 1 phút
  setInterval(async () => {
    try {
      // Ép giờ hiện tại chính xác để so sánh tuyệt đối với UTC trong MongoDB
      const now = new Date();
      
      // Khắc phục Lỗi 1: Tìm kiếm các ghi chú đến hạn, nới rộng biên độ quét an toàn để tránh lệch mili-giây
      const notes = await Note.find({
        reminderDate: { $lte: now },
        isNotified: false,
        isDeleted: false,
        reminderStatus: "pending" // Đồng bộ hóa với field trạng thái bạn đã định nghĩa
      });

      if (notes.length === 0) return;

      for (const note of notes) {
        // === HÀNH ĐỘNG 1: GỬI THÔNG BÁO CHO NGƯỜI TẠO LỊCH (NHÀ TUYỂN DỤNG) ===
        const recruiterNotification = await Notification.create({
          userId: note.userId,
          title: `[Lịch hẹn] ${note.title || "Nhắc nhở lịch hẹn phỏng vấn"}`,
          content: `Đã đến giờ hẹn: ${note.content}`,
          noteId: note._id,
        });

        // Bắn socket về Room của Nhà tuyển dụng
        if (global._io) {
          global._io.to(note.userId.toString()).emit("new_notification", {
            notificationId: recruiterNotification._id,
            title: recruiterNotification.title,
            content: recruiterNotification.content,
            noteId: note._id,
            createdAt: recruiterNotification.createdAt,
          });
        }

        // === HÀNH ĐỘNG 2: GỬI THÔNG BÁO CHO ỨNG VIÊN (CANDIDATE) ===
        // Lưu ý: Nếu trong body req lúc tạo Note bạn có truyền kèm candidateId hoặc receiverId, 
        // hãy lưu nó vào Schema Note (ví dụ: note.candidateId). Đoạn xử lý logic sẽ như sau:
        if (note.candidateId) {
          const candidateNotification = await Notification.create({
            userId: note.candidateId, // Gửi thẳng vào túi thông báo của ứng viên
            title: `🔔 Lịch phỏng vấn sắp bắt đầu`,
            content: `Bạn có lịch hẹn phỏng vấn: "${note.title}". Nội dung: ${note.content}`,
            noteId: note._id,
          });

          // Bắn socket về Room riêng của Ứng viên (Họ sẽ thấy popup real-time lập tức)
          if (global._io) {
            global._io.to(note.candidateId.toString()).emit("new_notification", {
              notificationId: candidateNotification._id,
              title: candidateNotification.title,
              content: candidateNotification.content,
              noteId: note._id,
              createdAt: candidateNotification.createdAt,
            });
          }
        }

        // === HÀNH ĐỘNG 3: CẬP NHẬT TRẠNG THÁI KHÓA LỊCH QUÉT ===
        note.isNotified = true;
        note.reminderStatus = "done";
        note.reminderSent = true;
        await note.save();

        console.log(`[REMINDER JOB] Đã phân phối thông báo đặt lịch thành công cho các Room liên quan.`);
      }
    } catch (err) {
      console.error("❌ Lỗi nghiêm trọng tại Reminder Job:", err);
    }
  }, 60 * 1000); // Tần suất quét: 1 phút / lần
};