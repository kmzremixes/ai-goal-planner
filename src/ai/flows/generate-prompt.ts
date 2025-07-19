// src/ai/flows/generate-prompt.ts
'use server';
/**
 * @fileOverview A Genkit flow that generates prompts for LLMs using generative AI.
 *
 * - generatePrompt - A function that generates a prompt given an idea and a target model.
 * - GeneratePromptInput - The input type for the generatePrompt function.
 * - GeneratePromptOutput - The return type for the generatePrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePromptInputSchema = z.object({
  idea: z.string().describe('The idea for which to generate a prompt.'),
  model: z.string().describe('The target LLM model.'),
});
export type GeneratePromptInput = z.infer<typeof GeneratePromptInputSchema>;

const GeneratePromptOutputSchema = z.object({
  prompt: z.string().describe('The generated prompt.'),
});
export type GeneratePromptOutput = z.infer<typeof GeneratePromptOutputSchema>;

export async function generatePrompt(input: GeneratePromptInput): Promise<GeneratePromptOutput> {
  return generatePromptFlow(input);
}

const generatePromptPrompt = ai.definePrompt({
  name: 'generatePromptPrompt',
  input: {schema: GeneratePromptInputSchema},
  output: {schema: GeneratePromptOutputSchema},
  prompt: `You are a world-class prompt engineering expert. Your task is to expand a user\'s simple idea into a detailed, high-quality, and effective prompt in English. The target model is {{model}}. User\'s idea: "{{idea}}". Based on the idea and the target model, create a detailed prompt that includes specifics like:

- For image models (Imagen, DALL-E): Subject details, art style (e.g., photorealistic, cinematic, 3D render, digital painting), composition, lighting (e.g., cinematic lighting, soft light), color scheme, and camera angle.
- For video models (Veo): A short scene description, character actions, environment details, camera movement (e.g., tracking shot, wide angle), and overall mood.
- For text models (Gemini): A clear instruction, the desired format for the output, the persona the AI should adopt, and any constraints.

The final output should be ONLY the generated prompt itself, ready to be copied and pasted.`,
});

const generatePromptFlow = ai.defineFlow(
  {
    name: 'generatePromptFlow',
    inputSchema: GeneratePromptInputSchema,
    outputSchema: GeneratePromptOutputSchema,
  },
  async input => {
    const {output} = await generatePromptPrompt(input);
    return output!;
  }
);
