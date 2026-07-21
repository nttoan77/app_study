// import mongoose from "mongoose";
// import Conversation from "../models/conversation.js";
// import aiClient from "../../../util/aiClient.js";
// import { cvSystemPrompt, getCVContext } from "../prompts/promptsCV.js";
// import { generateText } from "ai";

// // Hàm lấy hoặc tạo conversation
// const getOrCreateConversation = async (userId, conversationId, cvId = null) => {
//   // Validate ObjectId trước khi query
//   if (conversationId && !mongoose.Types.ObjectId.isValid(conversationId)) {
//     throw new Error("Conversation ID không hợp lệ");
//   }

//   if (conversationId) {
//     const conv = await Conversation.findOne({
//       _id: conversationId,
//       userId,
//     });

//     if (conv) return conv;
//   }

//   const newConv = new Conversation({
//     userId,
//     messages: [],
//     context: { cvId },
//   });

//   await newConv.save();
//   return newConv;
// };

// class AiChatService {
//   async handleMessage({
//     userId,
//     conversationId,
//     message,
//     cvId,
//     jobDescription,
//   }) {
//     try {
//       // Validate message
//       if (!message?.trim()) {
//         throw new Error("Tin nhắn không được để trống");
//       }

//       const conversation = await getOrCreateConversation(
//         userId,
//         conversationId,
//         cvId
//       );

//       // Thêm tin nhắn user
//       conversation.messages.push({
//         role: "user",
//         content: message,
//       });

//       // Xây dựng system prompt
//       let systemPrompt = cvSystemPrompt;

//       if (cvId) {
//         // TODO: Lấy CV thật từ database
//         const cvData = "Thông tin CV sẽ được lấy ở đây...";
//         systemPrompt += "\n\n" + getCVContext(cvData, jobDescription || "");
//       }

//       // Chỉ lấy 20 tin nhắn gần nhất
//       const recentMessages = conversation.messages.slice(-20);

//       // Khởi tạo model AI
//       const model = aiClient("grok-3");

//       // Gọi AI
//       const { text: aiResponse } = await generateText({
//         model,
//         system: systemPrompt,
//         messages: recentMessages.map((m) => ({
//           role: m.role,
//           content: m.content,
//         })),
//         temperature: 0.7,
//         maxTokens: 1200,
//       });

//       // Lưu phản hồi AI
//       conversation.messages.push({
//         role: "assistant",
//         content: aiResponse,
//       });

//       // Đặt title cho cuộc trò chuyện mới
//       if (!conversationId && conversation.messages.length < 6) {
//         conversation.title =
//           message.length > 60 ? message.substring(0, 57) + "..." : message;
//       }

//       await conversation.save();

//       return {
//         success: true,
//         message: aiResponse,
//         conversationId: conversation._id.toString(),
//         title: conversation.title,
//       };
//     } catch (error) {
//       console.error("AiChatService Error:", error);
//       throw new Error("Không thể kết nối với AI. Vui lòng thử lại sau.");
//     }
//   }

//   async getUserConversations(userId) {
//     return await Conversation.find({ userId })
//       .select("title createdAt updatedAt")
//       .sort({ updatedAt: -1 })
//       .limit(20);
//   }

//   async getConversation(userId, conversationId) {
//     return await Conversation.findOne({
//       _id: conversationId,
//       userId,
//     });
//   }
// }

// export default new AiChatService();
////======================================
// src/API/v1/services/AiChatService.js
class AiChatService {
  async handleMessage({
    userId,
    message,
    conversationId,
    cvId,
    jobDescription,
  }) {
    // console.log(`💬 [Simple Chatbot] User ${userId} nói: ${message}`);

    const lowerMsg = message.toLowerCase().trim();

    let reply = "Xin chào! Tôi là chatbot hỗ trợ. Bạn cần giúp gì?";

    // ==================== TRẢ LỜI CƠ BẢN ====================
    if (
      lowerMsg.includes("xin chào") ||
      lowerMsg.includes("hello") ||
      lowerMsg.includes("chào")
    ) {
      reply = "Chào bạn! Rất vui được hỗ trợ bạn hôm nay ❤️";
    } else if (lowerMsg.includes("bạn là ai") || lowerMsg.includes("tên gì")) {
      reply =
        "Tôi là Chatbot AI hỗ trợ của bạn. Tôi có thể trò chuyện, trả lời câu hỏi cơ bản.";
    } else if (lowerMsg.includes("thời tiết")) {
      reply =
        "Hiện tại tôi chưa cập nhật được thông tin thời tiết. Bạn đang ở đâu vậy?";
    } else if (lowerMsg.includes("cảm ơn") || lowerMsg.includes("thank")) {
      reply = "Không có gì! Mình luôn sẵn sàng hỗ trợ bạn nhé 😊";
    } else if (lowerMsg.includes("cv") || lowerMsg.includes("resume")) {
      reply =
        "Bạn muốn hỗ trợ về CV phải không? Tôi có thể giúp bạn về cách viết CV, review CV, hoặc gợi ý kinh nghiệm.";
    } else if (
      lowerMsg.includes("tuyển dụng") ||
      lowerMsg.includes("việc làm")
    ) {
      reply =
        "Bạn đang tìm việc à? Hãy cho tôi biết ngành nghề hoặc vị trí bạn quan tâm, tôi sẽ hỗ trợ!";
    } else if (lowerMsg.includes("buồn") || lowerMsg.includes("mệt")) {
      reply =
        "Tôi hiểu... Đôi khi ai cũng có lúc mệt mỏi. Bạn muốn chia sẻ không?";
    } else if (
      lowerMsg.includes("haha") ||
      lowerMsg.includes("cười") ||
      lowerMsg.includes("vui")
    ) {
      reply = "Haha, nghe bạn cười mình cũng vui theo 😄";
    }

    // Trả về định dạng giống backend cũ
    return {
      success: true,
      reply: reply,
      conversationId: conversationId || `conv_${Date.now()}`,
      timestamp: new Date(),
    };
  }

  // Các hàm khác (nếu có)
  async getUserConversations(userId) {
    return []; // tạm thời trả về rỗng
  }

  async getConversation(userId, conversationId) {
    return null;
  }
}

export default new AiChatService();
