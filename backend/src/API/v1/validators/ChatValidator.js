import Joi from "joi";

const sendMessageSchema = Joi.object({
  message: Joi.string().min(1).max(2000).required().messages({
    "string.empty": "Tin nhắn không được để trống",
    "string.max": "Tin nhắn tối đa 2000 ký tự",
  }),

  conversationId: Joi.string().hex().length(24).allow(null, ""),
  cvId: Joi.string().allow(null, ""),
  jobDescription: Joi.string().allow(null, ""),
});

export { sendMessageSchema };
