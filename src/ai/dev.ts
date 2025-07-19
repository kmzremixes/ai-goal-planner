import { config } from 'dotenv';
config();

import '@/ai/flows/generate-content.ts';
import '@/ai/flows/summarize-notebook-flow.ts';
import '@/ai/flows/generate-plan.ts';
import '@/ai/flows/generate-prompt.ts';