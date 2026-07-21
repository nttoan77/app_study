// import express from 'express'
// import chatController from '../Controller/AiChatController.js'
// import authMiddleware from '../middleware/authMiddleware.js'

// const router = express.Router();

// console.log('🔍 Debug Controller:', {
//     type: typeof chatController,
//     hasSendMessage: typeof chatController?.sendMessage,
//     hasGetConversations: typeof chatController?.getConversations
//   });

// // Tất cả route chat đều cần xác thực
// router.use(authMiddleware);

// // POST /api/chat/
// router.post('/', chatController.sendMessage);
// // router.post('/send', chatController.sendMessage);
// // GET /api/chat/conversations
// router.get('/conversations', chatController.getConversations);
// // GET /api/chat/conversations/:id
// router.get('/conversations/:id', chatController.getConversationById);

// export default router;

// =============================================
// src/API/v1/routes/AiChatRouter.js
import express from "express";
import ChatController from "../Controller/AiChatController.js"; // ← Import class
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Debug
console.log("🔍 AiChatRouter loaded");

router.use(authMiddleware);

// ==================== ROUTES ====================

// POST /api/chat
router.post("/", ChatController.sendMessage); // ← Sửa thành ChatController

// GET /api/chat/conversations
router.get("/conversations", ChatController.getConversations);

// GET /api/chat/conversations/:id
router.get("/conversations/:id", ChatController.getConversationById);

export default router;
