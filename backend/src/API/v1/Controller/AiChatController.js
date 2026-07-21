// src/controllers/AiChatController.js
import chatbotService from "../services/AiChatService.js";
import { sendMessageSchema } from "../validators/ChatValidator.js";

class ChatController {
  // ==================== GỬI TIN NHẮN CHAT ====================
  static async sendMessage(req, res) {
    // console.log("📨 [ChatController] sendMessage called");
    // console.log("📦 Body:", req.body);
    // console.log("👤 User:", req.user);

    try {
      const { error, value } = sendMessageSchema.validate(req.body);
      if (error) {
        // console.log("❌ Validation Error:", error.details[0].message);
        return res.status(400).json({
          success: false,
          message: error.details[0].message,
        });
      }

      const { message, conversationId, cvId, jobDescription } = value;
      const userId = req.user?.id || req.user?._id;

      if (!userId) {
        // console.log("⚠️ Unauthorized - No userId");
        return res.status(401).json({
          success: false,
          message: "Vui lòng đăng nhập để sử dụng chatbot",
        });
      }

      // console.log(`💬 Processing message for user ${userId}`);

      const result = await chatbotService.handleMessage({
        userId,
        conversationId,
        message,
        cvId,
        jobDescription,
      });

      // console.log("✅ Message processed successfully");
      return res.status(200).json(result);
    } catch (error) {
      console.error("❌ LỖI sendMessage:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Lỗi server khi xử lý tin nhắn chatbot",
      });
    }
  }

  // ==================== LẤY DANH SÁCH CUỘC TRÒ CHUYỆN ====================
  static async getConversations(req, res) {
    try {
      const userId = req.user?.id || req.user?._id;
      // console.log(
      //   `📋 [ChatController] Getting conversations for user: ${userId}`
      // );

      const conversations = await chatbotService.getUserConversations(userId);

      return res.status(200).json({
        success: true,
        count: conversations?.length || 0,
        data: conversations,
      });
    } catch (error) {
      console.error("❌ LỖI getConversations:", error);
      return res.status(500).json({
        success: false,
        message: "Không thể lấy danh sách cuộc trò chuyện",
      });
    }
  }

  // ==================== LẤY CHI TIẾT CUỘC TRÒ CHUYỆN ====================
  static async getConversationById(req, res) {
    try {
      const userId = req.user?.id || req.user?._id;
      const { id } = req.params;

      // console.log(
      //   `🔍 [ChatController] Getting conversation ${id} for user ${userId}`
      // );

      const conversation = await chatbotService.getConversation(userId, id);

      if (!conversation) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy cuộc trò chuyện",
        });
      }

      return res.status(200).json({
        success: true,
        data: conversation,
      });
    } catch (error) {
      console.error("❌ LỖI getConversationById:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi khi lấy chi tiết cuộc trò chuyện",
      });
    }
  }
}

// Export class (không export instance)
export default ChatController;
