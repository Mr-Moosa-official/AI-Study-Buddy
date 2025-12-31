'use server';

/**
 * @fileOverview Recommends relevant study materials from web links or shared documents.
 *
 * - recommendResources - A function that recommends study resources.
 * - RecommendResourcesInput - The input type for the recommendResources function.
 * - RecommendResourcesOutput - The return type for the recommendResources function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendResourcesInputSchema = z.object({
  topic: z.string().describe('The topic for which study resources are needed.'),
  userKnowledgeLevel: z
    .string()
    .describe(
      'The user knowledge level on the topic (e.g., beginner, intermediate, advanced).'
    ),
  availableResources: z
    .string()
    .describe(
      'A list of available resources, including web links and document titles, separated by commas.'
    ),
});
export type RecommendResourcesInput = z.infer<typeof RecommendResourcesInputSchema>;

const RecommendResourcesOutputSchema = z.object({
  recommendedResources: z
    .string()
    .describe(
      'A list of the most relevant study resources, including web links and document titles, separated by commas.'
    ),
  reasoning: z
    .string()
    .describe('The reasoning behind the resource recommendations.'),
});
export type RecommendResourcesOutput = z.infer<typeof RecommendResourcesOutputSchema>;

export async function recommendResources(
  input: RecommendResourcesInput
): Promise<RecommendResourcesOutput> {
  return recommendResourcesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendResourcesPrompt',
  input: {schema: RecommendResourcesInputSchema},
  output: {schema: RecommendResourcesOutputSchema},
  prompt: `You are an AI-powered study assistant that recommends the most relevant study resources for a given topic based on the user's knowledge level and available resources.\n\nTopic: {{{topic}}}\nUser Knowledge Level: {{{userKnowledgeLevel}}}\nAvailable Resources: {{{availableResources}}}\n\nBased on the above information, recommend the most relevant study resources and explain your reasoning.\n\nRecommended Resources: \nReasoning: `,
});

const recommendResourcesFlow = ai.defineFlow(
  {
    name: 'recommendResourcesFlow',
    inputSchema: RecommendResourcesInputSchema,
    outputSchema: RecommendResourcesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
