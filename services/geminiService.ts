export const generateImage = async (userPrompt: string): Promise<string> => {
  if (!userPrompt.trim()) {
    throw new Error("Prompt cannot be empty.");
  }

  try {
    const response = await fetch('/api/generate-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: userPrompt })
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => null);
      const message = errorBody?.error || `Server error: ${response.status}`;
      throw new Error(message);
    }

    const data: { imageBytes?: string } = await response.json();
    if (!data.imageBytes) {
      throw new Error('Image generation failed: empty response from server.');
    }
    return data.imageBytes;
  } catch (error) {
    console.error('Error generating image via API:', error);
    if (error instanceof Error) {
      throw new Error(error.message || 'Failed to generate image.');
    }
    throw new Error('An unknown error occurred during image generation.');
  }
};
