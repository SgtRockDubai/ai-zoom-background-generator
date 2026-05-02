const API_BASE = import.meta.env.VITE_API_BASE ?? '';
const APP_ACCESS_TOKEN = import.meta.env.VITE_APP_ACCESS_TOKEN ?? '';

export const generateImage = async (userPrompt: string): Promise<string> => {
  const trimmed = userPrompt.trim();
  if (!trimmed) {
    throw new Error('Prompt cannot be empty.');
  }

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    if (APP_ACCESS_TOKEN) {
      headers['X-App-Access-Token'] = APP_ACCESS_TOKEN;
    }

    const response = await fetch(`${API_BASE}/api/generate-image`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ prompt: trimmed })
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
