
export const buildStorySummaryPrompt = (input: string): string =>
    `Summarize the following blog post in 2-3 concise sentences. Return only the summary, no preamble.\n\n${input}`;