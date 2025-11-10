
import { GoogleGenAI } from "@google/genai";
import type { ChatMessage } from '../types';
import { MessageAuthor } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const systemInstruction = `
You are a world-class Farmer Support Chatbot. Your goal is to provide helpful, actionable advice to farmers.
You can answer questions about:
1.  **Crop-specific advice**: Based on weather, planting dates, and location. Supported crops are rice, wheat, maize, cotton, sugarcane, pulses, and vegetables.
2.  **Weather Information**: Provide current weather and forecasts.
3.  **Market Prices**: Give current market prices for various crops. (You can use placeholder data if you don't have real-time access).
4.  **Notifications**: Explain that users can subscribe to alerts for fertilizer/pesticide reminders, and weather warnings like rain, frost, or heat stress.

When a user asks a question, provide a clear, concise, and friendly answer. If a question is ambiguous, ask for clarification.
If the user's query is outside the scope of farming, politely decline to answer and steer the conversation back to agriculture.
Keep your answers structured, using bullet points for lists of advice or data.
Example response for "advice for my wheat crop":
"To give you the best advice for your wheat crop, I need to know your location. Could you please share it? You can also subscribe to get personalized alerts!"
`;

const model = ai.chats.create({
  model: 'gemini-2.5-flash',
  config: {
    systemInstruction: systemInstruction,
  },
});

export const getBotResponse = async (history: ChatMessage[], newMessage: string): Promise<string> => {
  try {
    // We are not using the history here because this model is stateful.
    // It remembers the conversation history internally.
    const response = await model.sendMessage({ message: newMessage });
    return response.text;
  } catch (error) {
    console.error("Error getting response from Gemini:", error);
    return "I'm sorry, I'm having trouble connecting to my brain right now. Please try again later.";
  }
};
