import { GoogleGenAI, GenerateImagesResponse } from "@google/genai";

export const generateImage = async (userPrompt: string): Promise<string> => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY is not configured. Please ensure the API_KEY environment variable is set.");
    }
    
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    if (!userPrompt.trim()) {
        throw new Error("Prompt cannot be empty.");
    }

    // A detailed prompt to guide the AI for a specific use case (Zoom background)
    const fullPrompt = `A professional, high-resolution 16:9 aspect ratio virtual background for a video conference. The style is photorealistic and visually appealing. The scene is: ${userPrompt}. The image must be suitable for a professional setting, with good lighting and composition. Avoid text and logos.`;

    try {
        const response: GenerateImagesResponse = await ai.models.generateImages({
        model: 'imagen-3.0-generate-002',
        prompt: fullPrompt,
        config: { numberOfImages: 1, outputMimeType: 'image/jpeg' },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
            if (!base64ImageBytes) {
                throw new Error("API returned an empty image. Please try a different prompt.");
            }
            return base64ImageBytes;
        } else {
            throw new Error("Image generation failed. The API did not return any images.");
        }
    } catch (error) {
        console.error("Error generating image:", error);
        if (error instanceof Error) {
            // Re-throw a more generic error to the UI layer
            throw new Error(`Failed to generate image. Please check the console for details.`);
        }
        throw new Error("An unknown error occurred during image generation.");
    }
};
