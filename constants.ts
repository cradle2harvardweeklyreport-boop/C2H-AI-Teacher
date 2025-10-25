import { type Tool, type Approach } from './types';

export const TOOLS: Tool[] = [
  { id: 'lesson_plan', name: 'Lesson Plan', description: 'Create a detailed, step-by-step lesson plan.' },
  { id: 'class_notes', name: 'Class Notes', description: 'Generate comprehensive notes for students.' },
  { id: 'assessment_questions', name: 'Assessment Questions', description: 'Design questions to test understanding.' },
  { id: 'activity_ideas', name: 'Activity Ideas', description: 'Brainstorm engaging classroom activities.' },
  { id: 'worksheet', name: 'Worksheet', description: 'Produce a printable worksheet for students.' },
  { id: 'chat', name: 'Chat with AI', description: 'Have a conversation with an AI assistant.' },
];

export const APPROACHES: Approach[] = [
  { id: 'blended_world', name: 'World\'s Best (Blended)' },
  { id: 'british', name: 'British' },
  { id: 'american', name: 'American' },
  { id: 'nigerian', name: 'Nigerian' },
  { id: 'canadian', name: 'Canadian' },
  { id: 'cambridge', name: 'Cambridge' },
  { id: 'montessori', name: 'Montessori' },
  { id: 'project_based', name: 'Project-Based' },
];