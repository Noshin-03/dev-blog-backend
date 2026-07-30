import { beforeEach, describe, expect, it, jest } from '@jest/globals';

import { AIError } from '../../../src/common/errorsClass';
import { Messages } from '../../../src/constants/messages';

const loggerErrorMock = jest.fn();
const buildStorySummaryPromptMock = jest.fn();

jest.mock('@google/genai', () => {
    const mockGenerateContent = jest.fn();
    return {
        GoogleGenAI: jest.fn().mockImplementation(() => ({
            models: { generateContent: mockGenerateContent },
        })),
        __mockGenerateContent: mockGenerateContent,
    };
});

jest.mock('../../../src/config/env', () => ({
    env: {
        GEMINI_API_KEY: 'test-api-key',
        SUMMARY_MAX_INPUT_CHARS: 50,
    },
}));

jest.mock('../../../src/utils/logger', () => ({
    logger: { error: loggerErrorMock },
}));

jest.mock('../../../src/utils/aiPrompts', () => ({
    buildStorySummaryPrompt: buildStorySummaryPromptMock,
}));

import { generateStorySummary } from '../../../src/services/aiService';

const { __mockGenerateContent: mockGenerateContent } = jest.requireMock(
    '@google/genai',
) as {
    __mockGenerateContent: jest.Mock<any>;
};

beforeEach(() => {
    jest.clearAllMocks();
    buildStorySummaryPromptMock.mockReturnValue('built-prompt-contents');
});

describe('generateStorySummary', () => {
    it('returns the trimmed summary on a successful call', async () => {
        mockGenerateContent.mockResolvedValue({
            text: '  A perfectly valid generated summary.  ',
        });

        const result = await generateStorySummary('Title', 'Short body');

        expect(result).toBe('A perfectly valid generated summary.');
        expect(buildStorySummaryPromptMock).toHaveBeenCalledWith(
            'Title\n\nShort body',
        );
        expect(mockGenerateContent).toHaveBeenCalledWith({
            model: 'gemini-3.5-flash',
            contents: 'built-prompt-contents',
        });
    });

    it('truncates the input with an ellipsis when it exceeds the configured max length', async () => {
        mockGenerateContent.mockResolvedValue({
            text: 'A perfectly valid generated summary.',
        });

        const title = 'A Very Long Title That Pushes Past The Limit';
        const body =
            'And an equally long body making the combined input exceed the max.';

        await generateStorySummary(title, body);

        const promptArg = buildStorySummaryPromptMock.mock
            .calls[0][0] as string;
        expect(promptArg.length).toBe(51);
        expect(promptArg.endsWith('…')).toBe(true);
        expect(`${title}\n\n${body}`.startsWith(promptArg.slice(0, 50))).toBe(
            true,
        );
    });

    it('does not truncate input shorter than the configured max length', async () => {
        mockGenerateContent.mockResolvedValue({
            text: 'A perfectly valid generated summary.',
        });

        await generateStorySummary('Hi', 'Short');

        expect(buildStorySummaryPromptMock).toHaveBeenCalledWith('Hi\n\nShort');
    });

    it('throws AIError and logs when the API call itself fails', async () => {
        const apiError = new Error('network timeout');
        mockGenerateContent.mockRejectedValue(apiError);

        await expect(generateStorySummary('Title', 'Body')).rejects.toThrow(
            Messages.SUMMARY_GENERATION_FAILED,
        );
        await expect(
            generateStorySummary('Title', 'Body'),
        ).rejects.toBeInstanceOf(AIError);
        expect(loggerErrorMock).toHaveBeenCalledWith('Gemini API call failed', {
            model: 'gemini-3.5-flash',
            error: 'network timeout',
        });
    });

    it('logs a stringified error when the thrown value is not an Error instance', async () => {
        mockGenerateContent.mockRejectedValue('a plain string failure');

        await expect(
            generateStorySummary('Title', 'Body'),
        ).rejects.toBeInstanceOf(AIError);
        expect(loggerErrorMock).toHaveBeenCalledWith('Gemini API call failed', {
            model: 'gemini-3.5-flash',
            error: 'a plain string failure',
        });
    });

    it('throws AIError when the response has no text', async () => {
        mockGenerateContent.mockResolvedValue({ text: undefined });

        await expect(generateStorySummary('Title', 'Body')).rejects.toThrow(
            Messages.INVALID_SUMMARY,
        );
        await expect(
            generateStorySummary('Title', 'Body'),
        ).rejects.toBeInstanceOf(AIError);
    });

    it('throws AIError when the response text is only whitespace', async () => {
        mockGenerateContent.mockResolvedValue({ text: '    ' });

        await expect(generateStorySummary('Title', 'Body')).rejects.toThrow(
            Messages.INVALID_SUMMARY,
        );
    });

    it('throws AIError when the summary is shorter than the minimum valid length', async () => {
        mockGenerateContent.mockResolvedValue({ text: 'Too short' });

        await expect(generateStorySummary('Title', 'Body')).rejects.toThrow(
            Messages.INVALID_SUMMARY,
        );
        await expect(
            generateStorySummary('Title', 'Body'),
        ).rejects.toBeInstanceOf(AIError);
    });

    it('accepts a summary exactly at the minimum valid length', async () => {
        const exactlyMinLength = 'x'.repeat(20);
        mockGenerateContent.mockResolvedValue({ text: exactlyMinLength });

        const result = await generateStorySummary('Title', 'Body');

        expect(result).toBe(exactlyMinLength);
    });
});
