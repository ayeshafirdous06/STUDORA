'use server';

/**
 * @fileOverview This file defines a Genkit flow for recommending skills to service seekers based on their request.
 *
 * - `getSkillRecommendations`: A function that takes a service request description and returns a list of recommended skills.
 * - `SkillRecommendationsInput`: The input type for the `getSkillRecommendations` function.
 * - `SkillRecommendationsOutput`: The output type for the `getSkillRecommendations` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SkillRecommendationsInputSchema = z.object({
  requestDescription: z
    .string()
    .describe('The description of the service request.'),
});
export type SkillRecommendationsInput = z.infer<typeof SkillRecommendationsInputSchema>;

const SkillRecommendationsOutputSchema = z.object({
  recommendedSkills: z
    .array(z.string())
    .describe('A list of skills recommended for the service seeker\s request.'),
});
export type SkillRecommendationsOutput = z.infer<typeof SkillRecommendationsOutputSchema>;

export async function getSkillRecommendations(
  input: SkillRecommendationsInput
): Promise<SkillRecommendationsOutput> {
  return skillRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'skillRecommendationsPrompt',
  input: {schema: SkillRecommendationsInputSchema},
  output: {schema: SkillRecommendationsOutputSchema},
  prompt: `You are a service recommendation expert. Based on the service request description provided, suggest the most relevant skills a service provider should have.

Service Request Description: {{{requestDescription}}}

Provide a list of skills that would be most beneficial for a service provider to possess to fulfill this request.
`,
});

const skillRecommendationsFlow = ai.defineFlow(
  {
    name: 'skillRecommendationsFlow',
    inputSchema: SkillRecommendationsInputSchema,
    outputSchema: SkillRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
