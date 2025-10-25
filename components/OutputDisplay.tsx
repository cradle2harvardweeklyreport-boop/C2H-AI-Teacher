import React from 'react';
import { LoaderIcon } from './icons/LoaderIcon';
import { LogoIcon } from './icons/LogoIcon';
import { MarkdownRenderer } from './MarkdownRenderer';

interface OutputDisplayProps {
  content: string;
  isLoading: boolean;
  error: string | null;
}

const OutputDisplay: React.FC<OutputDisplayProps> = ({ content, isLoading, error }) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6">
      {isLoading && (
        <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
          <LoaderIcon className="h-12 w-12 animate-spin text-blue-600 mb-4" />
          <p className="font-medium text-lg">Generating content...</p>
          <p className="text-sm">The AI is thinking. This may take a moment.</p>
        </div>
      )}
      {error && (
        <div className="flex items-center justify-center h-full text-center text-red-600 bg-red-50 p-4 rounded-lg">
          <p>{error}</p>
        </div>
      )}
      {!isLoading && !error && !content && (
        <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
          <LogoIcon className="h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700">Welcome to C2H AI</h3>
          <p className="mt-1 max-w-md">Fill out the form above and click "Generate" to create your teaching materials.</p>
        </div>
      )}
      {content && (
         <MarkdownRenderer content={content} />
      )}
    </div>
  );
};

export default OutputDisplay;
