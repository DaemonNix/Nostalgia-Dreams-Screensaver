import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini client
const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API Key not found in environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

/**
 * Generates an image based on a prompt using the Gemini 2.5 Flash Image model.
 * Returns a base64 string suitable for an img src.
 */
export const generateDreamscapeImage = async (prompt: string): Promise<string | null> => {
  const ai = getClient();
  if (!ai) return null;

  try {
    // We use gemini-2.5-flash-image for speed and efficiency
    // The prompt is enhanced to ensure screensaver-appropriate aesthetics
    const enhancedPrompt = `A high-quality, artistic, wallpaper-style digital art piece: ${prompt}. Cinematic lighting, detailed, 4k resolution, ambient atmosphere.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: enhancedPrompt,
          },
        ],
      },
      config: {
        // We do not set specific imageConfig here as defaults are usually fine for this model,
        // but we ensure we are asking for a generated image.
      }
    });

    // Parse the response to find the image part
    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          const base64Data = part.inlineData.data;
          const mimeType = part.inlineData.mimeType || 'image/png';
          return `data:${mimeType};base64,${base64Data}`;
        }
      }
    }
    
    return null;

  } catch (error) {
    console.error("Gemini Image Generation Error:", error);
    return null;
  }
};
