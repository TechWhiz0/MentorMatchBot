import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

console.log('API Key loaded:', API_KEY ? 'Yes' : 'No');

if (!API_KEY) {
  console.warn('VITE_GEMINI_API_KEY is not set. Chatbot functionality will be limited.');
}

const genAI = new GoogleGenerativeAI(API_KEY || 'dummy-key');

const STUDY_SYSTEM_PROMPT = `You are an intelligent study assistant and educational mentor. Your role is to help students with their academic journey by providing:

1. **Subject-specific guidance**: Help with various academic subjects including mathematics, science, literature, history, programming, and more.

2. **Study strategies**: Provide effective study techniques, time management tips, and learning methodologies.

3. **Problem-solving assistance**: Help break down complex problems and guide students through the solution process without giving direct answers.

4. **Concept explanations**: Explain difficult concepts in simple, understandable terms with examples.

5. **Academic writing support**: Help with essay structure, research methods, and writing techniques.

6. **Exam preparation**: Provide tips for test-taking strategies and exam preparation.

7. **Career guidance**: Offer insights about different career paths and educational requirements.

**Important Guidelines:**
- Always encourage critical thinking and independent learning
- Provide step-by-step guidance rather than direct answers
- Use examples and analogies to make concepts clearer
- Be encouraging and supportive while maintaining academic rigor
- Ask clarifying questions when needed to provide better assistance
- Respect academic integrity and avoid helping with cheating
- Adapt your explanations to the student's level of understanding

**Response Format:**
- Be concise but thorough
- Use clear, organized structure
- Include relevant examples when helpful
- End with follow-up questions or suggestions for further study

Remember: Your goal is to empower students to become better learners, not just to provide answers.`;

// Enhanced fallback responses for when API is not available
const FALLBACK_RESPONSES = {
  'study habit': "Here are some effective study habits you can try:\n\n1. **Pomodoro Technique**: Study for 25 minutes, then take a 5-minute break\n2. **Active Recall**: Test yourself instead of just re-reading\n3. **Spaced Repetition**: Review material at increasing intervals\n4. **Create a Study Schedule**: Plan your study sessions in advance\n5. **Find Your Optimal Time**: Study when you're most alert\n6. **Use Multiple Methods**: Combine reading, writing, and speaking\n7. **Take Regular Breaks**: Avoid burnout with scheduled rest periods\n\nWould you like me to elaborate on any of these techniques?",
  'note': "Effective note-taking strategies include:\n\n1. **Cornell Method**: Divide your page into sections for notes, cues, and summary\n2. **Mind Mapping**: Create visual diagrams connecting related concepts\n3. **Outline Method**: Use headings and subheadings to organize information\n4. **Charting Method**: Create tables to compare and contrast information\n5. **Sentence Method**: Write complete sentences for each point\n6. **Digital Tools**: Use apps like Notion, OneNote, or Obsidian\n\nWhich method interests you most?",
  'time': "Here are some time management tips for studying:\n\n1. **Prioritize Tasks**: Use the Eisenhower Matrix (urgent vs important)\n2. **Set SMART Goals**: Specific, Measurable, Achievable, Relevant, Time-bound\n3. **Use a Calendar**: Block out study time and stick to it\n4. **Eliminate Distractions**: Find a quiet space and turn off notifications\n5. **Batch Similar Tasks**: Group similar activities together\n6. **Review and Adjust**: Regularly assess your schedule and make improvements\n\nWhat specific time management challenge are you facing?",
  'math': "Here are some tips for studying mathematics:\n\n1. **Practice Regularly**: Math requires consistent practice\n2. **Understand Concepts**: Don't just memorize formulas\n3. **Work Backwards**: Start with the answer and work backwards\n4. **Use Visual Aids**: Draw diagrams and graphs\n5. **Break Down Problems**: Solve complex problems step by step\n6. **Review Mistakes**: Learn from your errors\n7. **Use Online Resources**: Khan Academy, Wolfram Alpha, etc.\n\nWhat specific math topic are you struggling with?",
  'science': "Here are some tips for studying science:\n\n1. **Understand the Scientific Method**: Hypothesis, experiment, conclusion\n2. **Use Visual Learning**: Diagrams, charts, and models\n3. **Connect Concepts**: See how different topics relate\n4. **Practice Lab Skills**: Hands-on experience is crucial\n5. **Read Actively**: Take notes and ask questions\n6. **Use Mnemonics**: Memory aids for complex terms\n7. **Review Regularly**: Science builds on previous knowledge\n\nWhich science subject are you studying?",
  'programming': "Here are some tips for learning programming:\n\n1. **Start Small**: Begin with simple projects\n2. **Practice Daily**: Consistency is key\n3. **Read Code**: Study other people's code\n4. **Build Projects**: Apply what you learn\n5. **Use Online Resources**: LeetCode, HackerRank, freeCodeCamp\n6. **Join Communities**: Stack Overflow, Reddit, Discord\n7. **Debug Systematically**: Learn to troubleshoot effectively\n\nWhat programming language are you learning?",
  'exam': "Here are some exam preparation strategies:\n\n1. **Start Early**: Don't cram the night before\n2. **Create a Study Plan**: Break down topics by day\n3. **Practice Tests**: Take mock exams\n4. **Review Notes**: Go through your materials systematically\n5. **Get Enough Sleep**: Rest is crucial for memory\n6. **Stay Organized**: Keep your study materials tidy\n7. **Ask for Help**: Don't hesitate to seek clarification\n\nWhat type of exam are you preparing for?",
  'writing': "Here are some tips for academic writing:\n\n1. **Plan Your Essay**: Create an outline first\n2. **Start with Research**: Gather your sources\n3. **Write a Strong Thesis**: Clear, specific, arguable\n4. **Use Evidence**: Support your claims with examples\n5. **Edit and Revise**: Multiple drafts are essential\n6. **Check Citations**: Properly cite your sources\n7. **Get Feedback**: Have others review your work\n\nWhat type of writing assignment are you working on?",
  'default': "I'd be happy to help you with your studies! Here are some general study tips:\n\n1. **Create a dedicated study space**\n2. **Set specific, achievable goals**\n3. **Use active learning techniques**\n4. **Take regular breaks**\n5. **Review and practice regularly**\n\nI can help you with specific topics like:\n- Study habits and techniques\n- Note-taking strategies\n- Time management\n- Math and science concepts\n- Programming and coding\n- Exam preparation\n- Academic writing\n\nJust ask me about any of these topics or any other study-related question!"
};

class GeminiService {
  private model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
  private chat: any = null;
  private isApiAvailable = !!API_KEY;

  constructor() {
    console.log('GeminiService initialized with API key:', !!API_KEY);
    this.initializeChat();
    // Test the API key on initialization
    this.testApiKey();
  }

  private async testApiKey() {
    if (!API_KEY) return;
    
    try {
      console.log('Testing API key...');
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
      const result = await model.generateContent('Hello');
      const response = await result.response;
      console.log('API key test successful:', response.text());
      this.isApiAvailable = true;
    } catch (error) {
      console.error('API key test failed:', error);
      this.isApiAvailable = false;
    }
  }

  private initializeChat() {
    if (!this.isApiAvailable) {
      console.warn('Gemini API key not available - using fallback responses');
      return;
    }

    try {
      console.log('Initializing Gemini chat...');
      this.chat = this.model.startChat({
        generationConfig: {
          maxOutputTokens: 1000,
          temperature: 0.7,
        },
        history: [
          {
            role: 'user',
            parts: [{ text: STUDY_SYSTEM_PROMPT }],
          },
          {
            role: 'model',
            parts: [{ text: 'I understand. I am your study assistant and educational mentor. I\'m here to help you with your academic journey by providing guidance, explanations, and support while encouraging independent learning and critical thinking. How can I assist you with your studies today?' }],
          },
        ],
      });
      console.log('Gemini chat initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Gemini chat:', error);
      this.isApiAvailable = false;
    }
  }

  async sendMessage(message: string): Promise<string> {
    console.log('Sending message to Gemini:', message.substring(0, 50) + '...');
    
    try {
      if (!this.isApiAvailable || !this.chat) {
        console.log('Using fallback response - API not available or chat not initialized');
        return this.getFallbackResponse(message);
      }

      console.log('Calling Gemini API...');
      const result = await this.chat.sendMessage(message);
      const response = await result.response;
      const responseText = response.text();
      console.log('Gemini API response received:', responseText.substring(0, 100) + '...');
      return responseText;
    } catch (error) {
      console.error('Error sending message to Gemini:', error);
      this.isApiAvailable = false;
      return this.getFallbackResponse(message);
    }
  }

  private getFallbackResponse(message: string): string {
    const lowerMessage = message.toLowerCase();
    
    // Check for specific topics in the message
    if (lowerMessage.includes('study habit') || lowerMessage.includes('study habit')) {
      return FALLBACK_RESPONSES['study habit'];
    }
    
    if (lowerMessage.includes('note') || lowerMessage.includes('note-taking')) {
      return FALLBACK_RESPONSES['note'];
    }
    
    if (lowerMessage.includes('time') && lowerMessage.includes('management')) {
      return FALLBACK_RESPONSES['time'];
    }

    if (lowerMessage.includes('math') || lowerMessage.includes('mathematics') || lowerMessage.includes('calculus') || lowerMessage.includes('algebra')) {
      return FALLBACK_RESPONSES['math'];
    }

    if (lowerMessage.includes('science') || lowerMessage.includes('biology') || lowerMessage.includes('chemistry') || lowerMessage.includes('physics')) {
      return FALLBACK_RESPONSES['science'];
    }

    if (lowerMessage.includes('programming') || lowerMessage.includes('coding') || lowerMessage.includes('code') || lowerMessage.includes('python') || lowerMessage.includes('javascript')) {
      return FALLBACK_RESPONSES['programming'];
    }

    if (lowerMessage.includes('exam') || lowerMessage.includes('test') || lowerMessage.includes('quiz')) {
      return FALLBACK_RESPONSES['exam'];
    }

    if (lowerMessage.includes('writing') || lowerMessage.includes('essay') || lowerMessage.includes('paper')) {
      return FALLBACK_RESPONSES['writing'];
    }
    
    return FALLBACK_RESPONSES['default'];
  }

  async resetChat(): Promise<void> {
    console.log('Resetting chat...');
    this.initializeChat();
  }

  isAvailable(): boolean {
    return this.isApiAvailable;
  }

  getApiStatus(): { available: boolean; configured: boolean } {
    return {
      available: this.isApiAvailable,
      configured: !!API_KEY
    };
  }
}

export const geminiService = new GeminiService();
