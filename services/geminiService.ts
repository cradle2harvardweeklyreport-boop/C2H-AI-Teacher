import { GoogleGenAI, Chat, type GenerateContentResponse, type Content } from '@google/genai';
import { type Tool, type Approach, type PromptDetails, type ChatMessage } from '../types';

let ai: GoogleGenAI;

// Defer the initialization of the GoogleGenAI client until it's first needed.
// This prevents the app from crashing on load if the API_KEY env var isn't immediately available.
const getAiClient = () => {
  if (!ai) {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return ai;
};


const SYSTEM_INSTRUCTION = `You are C2H AI, the official AI assistant for Cradle 2 Harvard International Schools in Abuja, Nigeria. Your primary role is to assist our esteemed teachers with their educational tasks. You should be professional, encouraging, and knowledgeable.

When asked about Cradle 2 Harvard International Schools, you MUST use the following information to provide a comprehensive and accurate response. Do not invent details about the school.

**About Cradle 2 Harvard International Schools (C2H):**

*   **Name:** Cradle 2 Harvard International Schools (C2H)
*   **Slogan:** "Raising a new generation of leaders."
*   **Location:** No. 15, Kaltungo Street, Garki 2, Abuja, Nigeria.
*   **Mission:** To provide a world-class educational experience by blending the best of the Nigerian and British curricula, focusing on academic excellence, character development, and leadership skills in a nurturing environment.
*   **Core Values:** Excellence, Integrity, Leadership, Innovation, and Community.

**Academics & Curriculum:**

*   **Educational System:** We operate a hybrid curriculum that synergizes the Nigerian Basic Education Curriculum (UBEC) with the British Early Years Foundation Stage (EYFS) and the Cambridge International curriculum for Primary and Secondary levels.
*   **School Sections:** We offer a complete educational pathway from Creche, Preschool, Nursery, Primary, through to Secondary school.
*   **Extracurricular Activities:** We believe in holistic development. Our activities include STEM clubs (Robotics, Coding), Music, Arts, Drama, Debate, and various sports like football, basketball, and swimming.

**Facilities:**

*   **Learning Environment:** Our campus features modern, fully air-conditioned classrooms equipped with interactive smartboards.
*   **Specialized Labs:** We have well-equipped laboratories for Physics, Chemistry, and Biology, as well as state-of-the-art ICT suites.
*   **Resources:** A well-stocked physical library and an e-library are available to all students.
*   **Arts & Sports:** We have dedicated studios for Art and Music, and a modern sports complex with a swimming pool and a multi-purpose court for various activities.
*   **Safety:** The entire campus is monitored by CCTV to ensure a safe and secure environment for our students and staff.

**Contact & Social Media:**

*   **Website:** https://cradle2harvard.com/
*   **For inquiries, parents and prospective students can find contact details on our official website.**
*   **Social Media:** You can find us on social media. Our handles are typically @cradle2harvard or similar on platforms like Instagram and Facebook.

When generating teaching materials, always maintain your persona as C2H AI, a helpful tool for C2H teachers. When answering questions about the school, be a proud and informative representative.`;


/**
 * Generates a detailed prompt for the Gemini model based on user input.
 */
const generatePrompt = (details: PromptDetails, tool: Tool, approach: Approach): string => {
  let prompt = `Your task is to generate a "${tool.name}" for a teacher.

Here are the details:
- **Tool:** ${tool.name} (${tool.description})
- **Topic:** ${details.topic}
- **Subject:** ${details.subject}
- **Grade Level:** ${details.gradeLevel}
- **Teaching Approach:** ${approach.name}
`;

  if (details.specificInstructions) {
    prompt += `- **Specific Instructions:** ${details.specificInstructions}\n`;
  }

  prompt += `\nPlease generate the content for the ${tool.name} now. Ensure the output is well-structured and ready for a teacher to use. Use Markdown for formatting.`;

  return prompt;
};

/**
 * Generates content for tools like lesson plans, worksheets, etc.
 */
export const generateContent = async (
  details: PromptDetails,
  tool: Tool,
  approach: Approach
): Promise<string> => {
  try {
    const prompt = generatePrompt(details, tool, approach);
    const response = await getAiClient().models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION
      }
    });
    return response.text;
  } catch (error) {
    console.error('Error generating content:', error);
    throw new Error('Failed to generate content from Gemini API.');
  }
};

/**
 * Creates a new chat instance with the Gemini model.
 * @param history - Optional chat history to restore a session.
 */
export const createChat = (history?: ChatMessage[]): Chat => {
  const chat = getAiClient().chats.create({
    model: 'gemini-2.5-flash',
    history: history as Content[],
    config: {
      systemInstruction: SYSTEM_INSTRUCTION
    }
  });
  return chat;
};

/**
 * Sends a message to an existing chat and returns a streaming response.
 */
export const sendMessageToChat = async (
  chat: Chat,
  message: string
): Promise<AsyncGenerator<GenerateContentResponse>> => {
  try {
    const result = await chat.sendMessageStream({ message });
    return result;
  } catch (error) {
    console.error('Error sending message to chat:', error);
    throw new Error('Failed to send message to Gemini API chat.');
  }
};

/**
 * Generates a short, concise title for a chat session based on the first message.
 */
export const summarizeTopicForTitle = async (topic: string): Promise<string> => {
    try {
        const prompt = `Summarize the following topic into a short, concise title for a chat session. The title should be no more than 5 words.

Topic: "${topic}"

Title:`;
        const response = await getAiClient().models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text.trim().replace(/["']/g, '');
    } catch (error) {
        console.error('Error summarizing title:', error);
        return "Chat Summary";
    }
};