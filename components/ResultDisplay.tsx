import React, { useState, useCallback } from 'react';
import type { ReadingResponse } from '../types';

interface ResultDisplayProps {
  response: ReadingResponse | null;
  error: string | null;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ response, error }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = useCallback(() => {
    if (response?.text) {
      navigator.clipboard.writeText(response.text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500); // Reset after 2.5 seconds
    }
  }, [response]);
  
  if (error) {
    return (
      <div className="w-full text-center p-4 bg-red-900/50 border border-red-500 rounded-lg animate-fade-in">
        <h3 className="text-lg font-bold text-red-300">An Error Occurred</h3>
        <p className="mt-2 text-red-200">{error}</p>
      </div>
    );
  }

  if (response) {
    return (
      <div className="w-full h-full animate-fade-in text-left">
        <div className="flex justify-end mb-4 -mt-2">
            <button
                onClick={handleCopy}
                disabled={isCopied}
                className="bg-purple-500/20 hover:bg-purple-500/40 text-gray-200 font-semibold py-1 px-3 border border-purple-500/50 rounded-lg shadow-sm transition-all duration-200 ease-in-out flex items-center text-sm disabled:opacity-70 disabled:cursor-default"
                aria-label="Copy reading to clipboard"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 mr-2 transition-opacity ${isCopied ? 'opacity-0' : 'opacity-100'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                 <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 mr-2 transition-opacity ${isCopied ? 'opacity-100' : 'opacity-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {isCopied ? 'Copied!' : 'Copy'}
            </button>
        </div>
        {response.imageUrl && (
          <div className="mb-6 flex justify-center">
            <img 
              src={response.imageUrl} 
              alt="Soulmate Sketch" 
              className="rounded-lg shadow-2xl shadow-purple-900/80 max-w-sm w-full border-2 border-purple-400/50"
            />
          </div>
        )}
        <div 
            className="text-gray-200 text-lg leading-relaxed whitespace-pre-wrap font-serif"
        >
            {response.text}
        </div>
      </div>
    );
  }

  return (
    <div className="text-center text-purple-200/70">
        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      <h3 className="mt-4 text-2xl font-bold">The Veil is Still</h3>
      <p className="mt-2">Your reading will appear here once the spirits have spoken.</p>
    </div>
  );
};

export default ResultDisplay;
