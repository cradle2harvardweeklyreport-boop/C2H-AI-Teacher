import { useState, useEffect } from 'react';
import { type ChatMessage, type ChatSession } from '../types';
import { createChat, summarizeTopicForTitle } from '../services/geminiService';
import { type Chat } from '@google/genai';

const LOCAL_STORAGE_KEY = 'c2h-ai-chat-history';

export const useChatHistory = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [geminiChatInstances, setGeminiChatInstances] = useState<Record<string, Chat>>({});

  useEffect(() => {
    try {
      const storedSessions = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedSessions) {
        const parsedSessions: ChatSession[] = JSON.parse(storedSessions);
        if (parsedSessions.length > 0) {
          setSessions(parsedSessions);
          const latestSessionId = parsedSessions[0].id;
          setActiveSessionId(latestSessionId);
          // Re-create gemini chat instances for all sessions
          const instances: Record<string, Chat> = {};
          parsedSessions.forEach(session => {
            // FIX: Pass chat history to createChat to restore the session correctly, instead of assigning to a private property.
            const chat = createChat(session.messages);
            instances[session.id] = chat;
          });
          setGeminiChatInstances(instances);
        }
      }
    } catch (error) {
      console.error("Failed to load chat history from local storage", error);
    }
  }, []);

  useEffect(() => {
    // Prevent writing empty sessions array on initial load
    if (sessions.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sessions));
    } else {
       // Clear storage if all chats are deleted
      const storedSessions = localStorage.getItem(LOCAL_STORAGE_KEY);
      if(storedSessions) {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
    }
  }, [sessions]);

  const createNewChat = () => {
    const newSessionId = `session-${Date.now()}`;
    const newSession: ChatSession = {
      id: newSessionId,
      title: 'New Chat',
      messages: [],
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSessionId);
    
    const newChat = createChat();
    setGeminiChatInstances(prev => ({ ...prev, [newSessionId]: newChat }));
  };

  const switchChat = (sessionId: string) => {
    if (sessions.some(s => s.id === sessionId)) {
      setActiveSessionId(sessionId);
    }
  };
  
  const deleteChat = (sessionId: string) => {
    const remainingSessions = sessions.filter(s => s.id !== sessionId);
    setSessions(remainingSessions);
    setGeminiChatInstances(prev => {
        const newInstances = { ...prev };
        delete newInstances[sessionId];
        return newInstances;
    });

    if (activeSessionId === sessionId) {
        setActiveSessionId(remainingSessions.length > 0 ? remainingSessions[0].id : null);
    }
  };

  const addMessage = async (sessionId: string, message: ChatMessage) => {
    let sessionTitleNeedsUpdate = false;
    
    setSessions(prev =>
      prev.map(s => {
        if (s.id === sessionId) {
          // If message has an ID, try to update it (for streaming)
          if (message.id) {
            const existingMsgIndex = s.messages.findIndex(m => m.id === message.id);
            if (existingMsgIndex > -1) {
              const newMessages = [...s.messages];
              newMessages[existingMsgIndex] = message;
              return { ...s, messages: newMessages };
            }
          }

          if (s.messages.length === 0 && message.role === 'user') {
            sessionTitleNeedsUpdate = true;
          }
          return { ...s, messages: [...s.messages, message] };
        }
        return s;
      })
    );
    
    if (sessionTitleNeedsUpdate) {
        const userMessageText = message.parts[0].text;
        summarizeTopicForTitle(userMessageText).then(title => {
            setSessions(prev => prev.map(s => s.id === sessionId ? {...s, title} : s));
        });
    }
  };

  const activeChatInstance = activeSessionId ? geminiChatInstances[activeSessionId] : null;

  return {
    sessions,
    activeSessionId,
    activeChatInstance,
    createNewChat,
    switchChat,
    deleteChat,
    addMessage,
  };
};
