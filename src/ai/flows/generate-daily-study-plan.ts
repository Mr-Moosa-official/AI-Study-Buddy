'use server';

/**
 * @fileOverview Generates a personalized daily study plan using AI.
 *
 * - generateDailyStudyPlan - A function that generates a daily study plan.
 * - GenerateDailyStudyPlanInput - The input type for the generateDailyStudyPlan function.
 * - GenerateDailyStudyPlanOutput - The return type for the generateDailyStudyPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDailyStudyPlanInputSchema = z.object({
  deadlines: z.string().describe('Upcoming deadlines for assignments and exams.'),
  subjectDifficulty: z.string().describe('The difficulty level of each subject.'),
  pastPerformance: z.string().describe('A summary of past performance in each subject.'),
});
export type GenerateDailyStudyPlanInput = z.infer<typeof GenerateDailyStudyPlanInputSchema>;

const GenerateDailyStudyPlanOutputSchema = z.object({
  dailyPlan: z.string().describe('A personalized daily study plan.'),
});
export type GenerateDailyStudyPlanOutput = z.infer<typeof GenerateDailyStudyPlanOutputSchema>;

export async function generateDailyStudyPlan(input: GenerateDailyStudyPlanInput): Promise<GenerateDailyStudyPlanOutput> {
  return generateDailyStudyPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDailyStudyPlanPrompt',
  input: {schema: GenerateDailyStudyPlanInputSchema},
  output: {schema: GenerateDailyStudyPlanOutputSchema},
  prompt: `You are an AI study planner that helps students create effective daily study plans.

  Based on the following information, generate a personalized daily study plan:

  Deadlines: {{{deadlines}}}
  Subject Difficulty: {{{subjectDifficulty}}}
  Past Performance: {{{pastPerformance}}}

  The study plan should be detailed and actionable, including specific topics to study and practice problems to solve.
  Make sure the plan adapts to past performance, focusing on weak areas.
`,
});

const generateDailyStudyPlanFlow = ai.defineFlow(
  {
    name: 'generateDailyStudyPlanFlow',
    inputSchema: GenerateDailyStudyPlanInputSchema,
    outputSchema: GenerateDailyStudyPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
