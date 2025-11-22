import { GoogleGenAI } from "@google/genai";

// Initialize the client. API_KEY is expected to be in the environment.
// In this simulated environment, we assume process.env.API_KEY is available.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || 'mock-key' });

export const askChinchillaTutor = async (question: string, context: string): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    const systemInstruction = `
      你是一位专门研究 DeepMind "Chinchilla" 论文 (Training Compute-Optimal Large Language Models) 的顶尖 AI 教授。
      你的目标是辅导一位自称"不太聪明"的硕士生。
      
      风格要求：
      1. **极度耐心与鼓励**：使用温暖、平易近人的语气。
      2. **比喻大师**：将复杂的数学概念（如 scaling laws, loss functions, FLOPS）转化为日常生活中的类比（如烹饪、建筑、旅行）。
      3. **学术严谨**：虽然语气轻松，但核心知识点必须准确无误。
      4. **简洁有力**：不要长篇大论，直接切中要害。
      
      当前用户正在浏览网站的上下文是：${context}
      
      请回答用户关于这篇论文的问题。
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: question,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    return response.text || "抱歉，我现在有点累（API 错误），请稍后再试。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "教授正在思考更深奥的问题（连接错误），请检查网络或 API Key。";
  }
};
