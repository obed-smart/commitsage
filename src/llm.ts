import axios from 'axios';
import { buildPrompt } from './prompt.js';
import { log } from './utils/logger.js';

interface GeminiPart {
  text?: string;
}

interface GeminiContent {
  parts?: GeminiPart[];
}

interface GeminiCandidate {
  content?: GeminiContent;
}

interface GeminiResponse {
  candidates: GeminiCandidate[];
}

export const generateCommitMessage = async (
  rawDiff: string,
  detailed: boolean,
): Promise<string> => {
  const API_URL =
    'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent';

  const API_KEY: string | undefined = process.env.GEMINI_COMMIT_MESSAGE_API_KEY;

  if (!API_KEY) {
    log.error('Missing GEMINI_COMMIT_MESSAGE_API_KEY environment variable.');

    log.info('Please set your API key before running this command.\n');

    log.warn('How to fix this:\n');

    log.title('macOS / Linux:');
    log.text('  export GEMINI_COMMIT_MESSAGE_API_KEY=your_api_key_here\n');

    log.title('Windows (PowerShell):');
    log.text('  setx GEMINI_COMMIT_MESSAGE_API_KEY "your_api_key_here"\n');

    log.text('After setting the variable, restart your terminal.\n');

    process.exit(1);
  }

 
  const prompt = buildPrompt(rawDiff, detailed);

  try {
    log.info('Generating commit message...');

    const response = await axios.post<GeminiResponse>(
      API_URL,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': API_KEY,
        },
      },
    );

    const message =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!message) {
      log.warn('LLM returned empty response. Using fallback.');

      return 'chore: update project files';
    }

    return message;
  } catch (error: any) {
    log.error('LLM request failed.');

    if (error.response) {
      log.text(`Status: ${error.response.status}`);
      log.text(JSON.stringify(error.response.data, null, 2));
    } else {
      log.text(error.message);
    }

    return 'chore: update project files';
  }
};
