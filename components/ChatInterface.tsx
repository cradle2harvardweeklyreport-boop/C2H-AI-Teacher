
import React, { useState, useRef, useEffect } from 'react';
import { type ChatMessage, type ChatSession } from '../types';
import { sendMessageToChat } from '../services/geminiService';
import { SendIcon } from './icons/SendIcon';
import { MarkdownRenderer } from './MarkdownRenderer';
import { LoaderIcon } from './icons/LoaderIcon';
import { type Chat } from '@google/genai';

interface ChatInterfaceProps {
  activeSession: ChatSession | null;
  geminiChat: Chat | null;
  onNewMessage: (sessionId: string, message: ChatMessage) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ activeSession, geminiChat, onNewMessage }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeSession?.messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !activeSession || !geminiChat) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      parts: [{ text: input }],
    };
    onNewMessage(activeSession.id, userMessage);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const stream = await sendMessageToChat(geminiChat, currentInput);
      
      let modelResponse = '';
      const modelMessageId = `model-${Date.now()}`;
      // Add a placeholder for the model's response
      onNewMessage(activeSession.id, { role: 'model', parts: [{ text: '' }], id: modelMessageId });

      for await (const chunk of stream) {
        // FIX: Access chunk.text directly for streaming response.
        const chunkText = chunk.text;
        modelResponse += chunkText;

        // Update the existing model message in the session for a smooth streaming effect
        onNewMessage(activeSession.id, { role: 'model', parts: [{ text: modelResponse }], id: modelMessageId });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'model',
        parts: [{ text: "Sorry, I encountered an error. Please try again." }],
      };
      onNewMessage(activeSession.id, errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!activeSession) {
    return (
        <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a chat or start a new one.
        </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {activeSession.messages.map((msg, index) => (
          <div key={msg.id || index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-xl lg:max-w-2xl px-4 py-2.5 rounded-2xl ${
                msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'
              }`}
            >
              <MarkdownRenderer content={msg.parts[0].text} />
            </div>
          </div>
        ))}
         {isLoading && (
            <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl px-4 py-2.5 inline-flex items-center">
                    <LoaderIcon className="h-5 w-5 text-gray-500 animate-spin" />
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 sm:p-6 border-t border-gray-200 bg-white">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-blue-500 focus:border-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <SendIcon className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
