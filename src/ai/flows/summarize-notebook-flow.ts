'use server';
/**
 * @fileOverview A flow for summarizing notebook entries using AI.
 *
 * - summarizeNotebook - A function that summarizes the provided notebook text.
 * - SummarizeNotebookInput - The input type for the summarizeNotebook function.
 * - SummarizeNotebookOutput - The output type for the summarizeNotebook function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeNotebookInputSchema = z.object({
  notebookText: z.string().describe('The text content of the notebook entry to be summarized.'),
});
export type SummarizeNotebookInput = z.infer<typeof SummarizeNotebookInputSchema>;

const SummarizeNotebookOutputSchema = z.object({
  summary: z.string().describe('A summary of the notebook entry.'),
});
export type SummarizeNotebookOutput = z.infer<typeof SummarizeNotebookOutputSchema>;

export async function summarizeNotebook(input: SummarizeNotebookInput): Promise<SummarizeNotebookOutput> {
  return summarizeNotebookFlow(input);
}

const summarizeNotebookPrompt = ai.definePrompt({
  name: 'summarizeNotebookPrompt',
  input: {schema: SummarizeNotebookInputSchema},
  output: {schema: SummarizeNotebookOutputSchema},
  prompt: `Summarize the following journal entry into 3 key bullet points:\n\n{{notebookText}}`,
});

const summarizeNotebookFlow = ai.defineFlow(
  {
    name: 'summarizeNotebookFlow',
    inputSchema: SummarizeNotebookInputSchema,
    outputSchema: SummarizeNotebookOutputSchema,
  },
  async input => {
    const {output} = await summarizeNotebookPrompt(input);
    return output!;
  }
);
