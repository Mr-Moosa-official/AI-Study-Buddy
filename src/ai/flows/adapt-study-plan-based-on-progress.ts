'use server';
/**
 * @fileOverview Adapts the study plan based on user progress, test performance, and deadlines.
 *
 * - adaptStudyPlanBasedOnProgress - A function that adjusts the study plan in real-time.
 * - AdaptStudyPlanBasedOnProgressInput - The input type for the adaptStudyPlanBasedOnProgress function.
 * - AdaptStudyPlanBasedOnProgressOutput - The return type for the adaptStudyPlanBasedOnProgress function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AdaptStudyPlanBasedOnProgressInputSchema = z.object({
  currentStudyPlan: z.string().describe('The current study plan.'),
  completedTopics: z.array(z.string()).describe('List of topics the user has completed.'),
  practiceTestScores: z
    .array(z.object({subject: z.string(), score: z.number()}))
    .describe('List of practice test scores for each subject.'),
  upcomingDeadlines: z.array(z.string()).describe('List of upcoming deadlines for assignments and exams.'),
});
export type AdaptStudyPlanBasedOnProgressInput = z.infer<typeof AdaptStudyPlanBasedOnProgressInputSchema>;

const AdaptStudyPlanBasedOnProgressOutputSchema = z.object({
  adaptedStudyPlan: z.string().describe('The adapted study plan based on progress and performance.'),
});
export type AdaptStudyPlanBasedOnProgressOutput = z.infer<typeof AdaptStudyPlanBasedOnProgressOutputSchema>;

export async function adaptStudyPlanBasedOnProgress(
  input: AdaptStudyPlanBasedOnProgressInput
): Promise<AdaptStudyPlanBasedOnProgressOutput> {
  return adaptStudyPlanBasedOnProgressFlow(input);
}

const prompt = ai.definePrompt({
  name: 'adaptStudyPlanBasedOnProgressPrompt',
  input: {schema: AdaptStudyPlanBasedOnProgressInputSchema},
  output: {schema: AdaptStudyPlanBasedOnProgressOutputSchema},
  prompt: `You are an AI study planner that helps students optimize their learning.

  Based on the student's current study plan, completed topics, practice test scores, and upcoming deadlines,
  adapt the study plan to focus on weak areas and ensure all deadlines are met.

Current Study Plan: {{{currentStudyPlan}}}
Completed Topics: {{#each completedTopics}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
Practice Test Scores: {{#each practiceTestScores}}{{{subject}}}: {{{score}}}{{#unless @last}}, {{/unless}}{{/each}}
Upcoming Deadlines: {{#each upcomingDeadlines}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

Adapted Study Plan:`,
});

const adaptStudyPlanBasedOnProgressFlow = ai.defineFlow(
  {
    name: 'adaptStudyPlanBasedOnProgressFlow',
    inputSchema: AdaptStudyPlanBasedOnProgressInputSchema,
    outputSchema: AdaptStudyPlanBasedOnProgressOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
