import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import PromptForm from './components/PromptForm';
import OutputDisplay from './components/OutputDisplay';
import ChatInterface from './components/ChatInterface';
import { type Tool, type Approach, type PromptDetails, type ChatMessage } from './types';
import { TOOLS, APPROACHES } from './constants';
import { generateContent } from './services/geminiService';
import { useChatHistory } from './hooks/useChatHistory';

const App: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState<Tool>(TOOLS[0]);
  const [selectedApproach, setSelectedApproach] = useState<Approach>(APPROACHES[0]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [outputContent, setOutputContent] = useState<string>('');
  const [isApiReady, setIsApiReady] = useState(true);

  useEffect(() => {
    // This check verifies that the API key is present in the client-side environment.
    // On platforms like Vercel, environment variables must be explicitly exposed to the browser.
    // If this check fails, it indicates a deployment configuration issue.
    if (!process.env.API_KEY) {
      setError("The AI service is not configured correctly. Please ensure the API key is set up in the deployment environment. AI features have been disabled.");
      setIsApiReady(false);
    }
  }, []);

  const {
    sessions: chatSessions,
    activeSessionId,
    activeChatInstance,
    createNewChat,
    switchChat,
    deleteChat,
    addMessage,
  } = useChatHistory();

  const handlePromptSubmit = async (details: PromptDetails) => {
    if (!isApiReady) return;
    setIsLoading(true);
    setError(null);
    setOutputContent('');
    try {
      const content = await generateContent(details, selectedTool, selectedApproach);
      setOutputContent(content);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectTool = (tool: Tool) => {
    setSelectedTool(tool);
    // Clear non-chat output when switching tools
    if (tool.id !== 'chat') {
      setOutputContent('');
      // Keep the API configuration error if it exists
      if (isApiReady) {
        setError(null);
      }
    }
  };

  const activeChatSession = useMemo(() => {
    return chatSessions.find(s => s.id === activeSessionId) || null;
  }, [chatSessions, activeSessionId]);

  const handleNewMessage = (sessionId: string, message: ChatMessage) => {
    addMessage(sessionId, message);
  };
  
  return (
    <div className="h-screen w-screen flex flex-col bg-gray-100 font-sans">
      <Header />
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <Sidebar
          tools={TOOLS}
          approaches={APPROACHES}
          selectedTool={selectedTool}
          onSelectTool={handleSelectTool}
          selectedApproach={selectedApproach}
          onSelectApproach={setSelectedApproach}
          chatSessions={chatSessions}
          activeChatSessionId={activeSessionId}
          onNewChat={createNewChat}
          onSwitchChat={switchChat}
          onDeleteChat={deleteChat}
        />
        <main className="flex-1 flex flex-col bg-white">
          {!isApiReady ? (
            <div className="flex-1 flex items-center justify-center p-4">
              <div className="text-center bg-red-50 text-red-800 p-6 rounded-lg shadow-md max-w-lg">
                <h3 className="font-bold text-lg">Service Not Available</h3>
                <p className="mt-2 text-sm">{error}</p>
              </div>
            </div>
          ) : selectedTool.id === 'chat' ? (
             <ChatInterface 
                activeSession={activeChatSession}
                geminiChat={activeChatInstance}
                onNewMessage={handleNewMessage}
            />
          ) : (
            <>
              <PromptForm
                onSubmit={handlePromptSubmit}
                isLoading={isLoading}
                selectedTool={selectedTool}
              />
              <OutputDisplay
                content={outputContent}
                isLoading={isLoading}
                error={error}
              />
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
