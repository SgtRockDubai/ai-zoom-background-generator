import React from 'react';

const DownloadIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
        <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
    </svg>
);

interface ImageDisplayProps {
  imageData: string | null;
  isLoading: boolean;
  error: string | null;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ imageData, isLoading, error }) => {
  const content = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-gray-400">
          <svg className="animate-spin h-12 w-12 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-lg">Generating your masterpiece...</p>
        </div>
      );
    }
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-red-400 p-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          <p className="mt-4 text-lg font-semibold">Oops! Something went wrong.</p>
          <p className="text-center text-sm text-red-300 mt-2">{error}</p>
        </div>
      );
    }
    if (imageData) {
      return (
        <img
          src={`data:image/jpeg;base64,${imageData}`}
          alt="Generated AI background"
          className="w-full h-full object-cover"
        />
      );
    }
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <p className="text-lg text-center p-4">Your generated background will appear here</p>
      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
        <div className="w-full aspect-video bg-gray-800 rounded-lg border-2 border-dashed border-gray-700 overflow-hidden relative shadow-lg flex items-center justify-center">
            {content()}
        </div>
        {imageData && !isLoading && (
            <div className="mt-4 flex justify-center">
                 <a
                    href={`data:image/jpeg;base64,${imageData}`}
                    download="ai-zoom-background.jpg"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition duration-200 ease-in-out"
                >
                    <DownloadIcon className="w-5 h-5" />
                    Download Image
                </a>
            </div>
        )}
    </div>
  );
};

export default ImageDisplay;
