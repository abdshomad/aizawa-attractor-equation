import { GoogleGenAI } from "@google/genai";
import { AizawaParams } from '../types';

const getClient = () => {
  if (!process.env.API_KEY) {
    console.warn("API_KEY is not defined in process.env");
    return null;
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const getAttractorExplanation = async (params: AizawaParams): Promise<string> => {
  const ai = getClient();
  if (!ai) return "API Key not configured. Please set a valid API Key.";

  const prompt = `
    I am looking at a 3D visualization of the Aizawa Attractor with the following parameters:
    a=${params.a}, b=${params.b}, c=${params.c}, d=${params.d}, e=${params.e}, f=${params.f}.
    
    Briefly explain (in under 100 words) what the Aizawa attractor is mathematically and visually. 
    Mention how it's known for its sphere-like or tube-like structure with a chaotic tube through the center. 
    Explain what changing parameters generally does in the context of chaos theory.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "No explanation available.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Failed to fetch explanation from Gemini. Please try again later.";
  }
};
