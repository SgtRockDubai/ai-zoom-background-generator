import { useState, useCallback } from 'react';
import Header from './components/Header';
import PromptForm from './components/PromptForm';
import ImageDisplay from './components/ImageDisplay';
import { generateImage } from './services/geminiService';

const App: React.FC = () => {
  const [imageData, setImageData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async (prompt: string) => {
    setIsLoading(true);
    setError(null);
    setImageData(null);

    try {
      const generatedImageData = await generateImage(prompt);
      setImageData(generatedImageData);
    } catch (e) {
      const message =
        e instanceof Error
          ? e.message
          : 'An unexpected error occurred.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
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
            An API key from Google AI Studio is required for this application to function.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default App;
