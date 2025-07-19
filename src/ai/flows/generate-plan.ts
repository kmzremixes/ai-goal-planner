'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating action plans from user-provided goals.
 *
 * The flow takes a goal description as input and returns a structured action plan.
 * - generateActionPlan - A function that takes a goal description and returns an action plan.
 * - GenerateActionPlanInput - The input type for the generateActionPlan function.
 * - GenerateActionPlanOutput - The return type for the generateActionPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateActionPlanInputSchema = z.object({
  goal: z.string().describe('The goal to achieve.'),
});
export type GenerateActionPlanInput = z.infer<typeof GenerateActionPlanInputSchema>;

const GenerateActionPlanOutputSchema = z.object({
  plan: z.string().describe('A detailed action plan to achieve the goal.'),
});
export type GenerateActionPlanOutput = z.infer<typeof GenerateActionPlanOutputSchema>;

export async function generateActionPlan(input: GenerateActionPlanInput): Promise<GenerateActionPlanOutput> {
  return generateActionPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateActionPlanPrompt',
  input: {schema: GenerateActionPlanInputSchema},
  output: {schema: GenerateActionPlanOutputSchema},
  prompt: `You are a helpful strategic assistant. A user wants to achieve a goal. Break down the goal into 3 simple, actionable steps in Thai. The steps should be clear and concise. Goal: "{{{goal}}}"`,
});

const generateActionPlanFlow = ai.defineFlow(
  {
    name: 'generateActionPlanFlow',
    inputSchema: GenerateActionPlanInputSchema,
    outputSchema: GenerateActionPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
