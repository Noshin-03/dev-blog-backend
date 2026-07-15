import { GoogleGenAI } from '@google/genai';
import { AiError } from '../common/errorsClass';
import { logger } from '../utils/logger';
import { env } from '../config/env';
import { Messages } from '../constants/messages';

const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

const MODEL = 'gemini-3.5-flash';
const MAX_INPUT_CHARS = env.SUMMARY_MAX_INPUT_CHARS;
const MIN_VALID_SUMMARY_LENGTH = 20;

const truncate = (text: string, max: number): string =>
    text.length > max ? `${text.slice(0, max)}…` : text;

export const generateStorySummary = async (
    title: string,
    body: string,
): Promise<string> => {
    const input = truncate(`${title}\n\n${body}`, MAX_INPUT_CHARS);

    let responseText: string | undefined;

    try {
        const response = await ai.models.generateContent({
            model: MODEL,
            contents: `Summarize the following blog post in 2-3 concise sentences. Return only the summary, no preamble.\n\n${input}`,
        });

        responseText = response.text;
    } catch (err) {
        logger.error('Gemini API call failed', {
            model: MODEL,
            error: err instanceof Error ? err.message : String(err),
        });
        throw new AiError(Messages.SUMMARY_GENERATION_FAILED);
    }

    const summary = responseText?.trim();

    if (!summary || summary.length < MIN_VALID_SUMMARY_LENGTH) {
        throw new AiError(Messages.INVALID_SUMMARY);
    }

    return summary;
};
