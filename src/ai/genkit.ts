import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [googleAI('AIzaSyB2NUml-SwnLIzrMYsW7VkDRxjJ-sW8zyo')],
  model: 'googleai/gemini-2.0-flash',
});
