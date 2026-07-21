import { createXai } from "@ai-sdk/xai";
import dotenv from "dotenv";

dotenv.config();

const getAIClient = () => {
  console.log("🔹 AI Provider: xAI Grok");

  if (!process.env.XAI_API_KEY) {
    throw new Error("❌ Thiếu XAI_API_KEY trong file .env");
  }

  return createXai({
    apiKey: process.env.XAI_API_KEY,
  });
};

export const aiClient = getAIClient();
export default aiClient;
