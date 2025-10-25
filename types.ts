
export interface Tool {
  id: string;
  name: string;
  description: string;
}

export interface Approach {
  id: string;
  name: string;
}

export interface PromptDetails {
  topic: string;
  gradeLevel: string;
  subject: string;
  specificInstructions: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
  id?: string; // for React keys during streaming
}

export interface ChatSession {
    id: string;
    title: string;
    messages: ChatMessage[];
}
