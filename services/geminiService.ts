import { GoogleGenAI, Type } from "@google/genai";
import { GeminiFoodAnalysis } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeFoodImage = async (base64Image: string): Promise<GeminiFoodAnalysis> => {
  try {
    // Remove header if present (data:image/jpeg;base64,)
    const cleanBase64 = base64Image.split(',')[1] || base64Image;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: cleanBase64
            }
          },
          {
            text: "Analyze this image of food. Identify the item, provide a short appetizing description, estimate the quantity visible, and categorize it (e.g., Bakery, Produce, Prepared Meal). Return JSON."
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "A short, clear title of the food item" },
            description: { type: Type.STRING, description: "A 1-2 sentence appetizing description" },
            quantityEstimation: { type: Type.STRING, description: "Estimated quantity (e.g., '3 boxes', '5 kg')" },
            category: { type: Type.STRING, description: "Category of food" }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as GeminiFoodAnalysis;
    }
    
    throw new Error("No response text from Gemini");

  } catch (error) {
    console.error("Error analyzing food image:", error);
    // Fallback if AI fails
    return {
      title: "Unknown Item",
      description: "Could not analyze image automatically. Please enter details manually.",
      quantityEstimation: "Unknown",
      category: "General"
    };
  }
};
