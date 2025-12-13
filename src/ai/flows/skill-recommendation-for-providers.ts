'use server';
/**
 * @fileOverview Recommends skills for service providers based on their profile and service demand.
 *
 * - recommendSkillsForProvider - A function that recommends skills for a service provider.
 * - RecommendSkillsForProviderInput - The input type for the recommendSkillsForProvider function.
 * - RecommendSkillsForProviderOutput - The return type for the recommendSkillsForProvider function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendSkillsForProviderInputSchema = z.object({
  profileSummary: z
    .string()
    .describe(
      'A summary of the service provider profile, including their experience, education, and current skills.'
    ),
  servicesInDemand: z
    .string()
    .describe('A description of the services that are currently in high demand on the platform.'),
});
export type RecommendSkillsForProviderInput = z.infer<typeof RecommendSkillsForProviderInputSchema>;

const RecommendSkillsForProviderOutputSchema = z.object({
  recommendedSkills: z
    .array(z.string())
    .describe('A list of skills recommended for the service provider to list on their profile.'),
  rationale: z
    .string()
    .describe(
      'A brief explanation of why these skills are recommended, based on the provider profile and service demand.'
    ),
});
export type RecommendSkillsForProviderOutput = z.infer<typeof RecommendSkillsForProviderOutputSchema>;

export async function recommendSkillsForProvider(
  input: RecommendSkillsForProviderInput
): Promise<RecommendSkillsForProviderOutput> {
  return recommendSkillsForProviderFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendSkillsForProviderPrompt',
  input: {schema: RecommendSkillsForProviderInputSchema},
  output: {schema: RecommendSkillsForProviderOutputSchema},
  prompt: `You are an AI skill recommendation tool for a service marketplace.

  Based on the service provider's profile summary and the current services in demand,
  recommend a list of skills that the provider should list to attract more orders.
  Also, provide a rationale for why these skills are recommended.

  Profile Summary: {{{profileSummary}}}
  Services in Demand: {{{servicesInDemand}}}

  Format your response as a JSON object with "recommendedSkills" (an array of strings) and "rationale" (a string) fields.
  `,
});

const recommendSkillsForProviderFlow = ai.defineFlow(
  {
    name: 'recommendSkillsForProviderFlow',
    inputSchema: RecommendSkillsForProviderInputSchema,
    outputSchema: RecommendSkillsForProviderOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
