
import React, { useState } from 'react';
import { type PromptDetails, type Tool } from '../types';
import { SparklesIcon } from './icons/SparklesIcon';

interface PromptFormProps {
  onSubmit: (details: PromptDetails) => void;
  isLoading: boolean;
  selectedTool: Tool;
}

const PromptForm: React.FC<PromptFormProps> = ({ onSubmit, isLoading, selectedTool }) => {
  const [topic, setTopic] = useState('');
  const [gradeLevel, setGradeLevel] = useState('');
  const [subject, setSubject] = useState('');
  const [specificInstructions, setSpecificInstructions] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic || !gradeLevel || !subject) {
      alert('Please fill in Topic, Grade Level, and Subject.');
      return;
    }
    onSubmit({ topic, gradeLevel, subject, specificInstructions });
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 sm:p-6 border-b border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
          <input
            type="text"
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., The Solar System"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="gradeLevel" className="block text-sm font-medium text-gray-700 mb-1">Grade Level</label>
          <input
            type="text"
            id="gradeLevel"
            value={gradeLevel}
            onChange={(e) => setGradeLevel(e.target.value)}
            placeholder="e.g., Grade 5"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
          <input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g., Science"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
            required
          />
        </div>
      </div>
      <div className="mb-4">
        <label htmlFor="specificInstructions" className="block text-sm font-medium text-gray-700 mb-1">Specific Instructions (Optional)</label>
        <textarea
          id="specificInstructions"
          value={specificInstructions}
          onChange={(e) => setSpecificInstructions(e.target.value)}
          rows={3}
          placeholder={`e.g., Focus on visual aids and include a fun mnemonic for the planets.`}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
        />
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center px-6 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          <SparklesIcon className={`mr-2 h-5 w-5 ${isLoading ? 'animate-pulse' : ''}`} />
          {isLoading ? 'Generating...' : `Generate ${selectedTool.name}`}
        </button>
      </div>
    </form>
  );
};

export default PromptForm;
