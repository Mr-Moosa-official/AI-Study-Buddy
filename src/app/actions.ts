
'use server';

import {
  generateDailyStudyPlan,
  GenerateDailyStudyPlanInput,
} from '@/ai/flows/generate-daily-study-plan';
import {
  adaptStudyPlanBasedOnProgress,
  AdaptStudyPlanBasedOnProgressInput,
} from '@/ai/flows/adapt-study-plan-based-on-progress';
import {
  recommendResources,
  RecommendResourcesInput,
} from '@/ai/flows/recommend-relevant-study-resources';

export async function generateDailyStudyPlanAction(
  input: GenerateDailyStudyPlanInput
) {
  try {
    const output = await generateDailyStudyPlan(input);
    return { success: true, data: output };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to generate study plan.' };
  }
}

export async function adaptStudyPlanBasedOnProgressAction(
  input: AdaptStudyPlanBasedOnProgressInput
) {
  try {
    const output = await adaptStudyPlanBasedOnProgress(input);
    return { success: true, data: output };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to adapt study plan.' };
  }
}

export async function recommendResourcesAction(input: RecommendResourcesInput) {
  try {
    const output = await recommendResources(input);
    return { success: true, data: output };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to recommend resources.' };
  }
}
