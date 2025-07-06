import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import PromptForm from './components/PromptForm';
import ImageDisplay from './components/ImageDisplay';
import { generateImage } from './services/geminiService';

const App: React.FC = () => {
  const [imageData, setImageData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async (prompt: string) => {
    setIsLoading(true);
    setError(null);
    setImageData(null);

    // Add a small delay to make the UI transition feel smoother
    setTimeout(async () => {
      try {
        const generatedImageData = await generateImage(prompt);
        setImageData(generatedImageData);
      } catch (e) {
        if (e instanceof Error) {
            if (e.message.includes('API_KEY')) {
                setError("Could not connect to the AI service. Please ensure your API_KEY is configured correctly in your environment.");
            } else {
                setError(e.message);
            }
        } else {
          setError('An unexpected error occurred.');
        }
      } finally {
        setIsLoading(false);
      }
    }, 500); // 500ms delay
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col items-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        <Header />
        <main>
          <PromptForm onSubmit={handleGenerate} isLoading={isLoading} />
          <ImageDisplay imageData={imageData} isLoading={isLoading} error={error} />
        </main>
        <footer className="text-center text-gray-500 text-sm mt-8 py-4">
            <p>Powered by Google Gemini. Images are AI-generated and may be fictional.</p>
            <p className="mt-1">
                Note: An API Key from Google AI Studio is required for this application to function.
            </p>
        </footer>
      </div>
    </div>
  );
};

export default App;
