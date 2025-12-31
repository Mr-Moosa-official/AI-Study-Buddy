import { config } from 'dotenv';
config();

import '@/ai/flows/generate-daily-study-plan.ts';
import '@/ai/flows/recommend-relevant-study-resources.ts';
import '@/ai/flows/adapt-study-plan-based-on-progress.ts';