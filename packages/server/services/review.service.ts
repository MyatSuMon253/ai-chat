import type { Review } from '../generated/prisma/client';
import { reviewRepository } from '../repositories/review.repository';
import { llmClient } from '../llm/prompts/client';
import template from '../llm/prompts/summarize-review.txt';

export const reviewService = {
   async getReviews(productId: number): Promise<Review[]> {
      return reviewRepository.getReviews(productId);
   },

   async summarizeReviews(productId: number): Promise<string> {
      const existingSummary =
         await reviewRepository.getReviewSummary(productId);

      if (existingSummary) {
         return existingSummary;
      }

      // get the last 10 reviews
      const reviews = await reviewRepository.getReviews(productId, 10);
      const joinedReviews = reviews.map((r) => r.content).join('\n\n');

      const prompt = template.replace('${{reviews}}', joinedReviews);

      // send the reviews to a LLM
      const { text: summary } = await llmClient.generateText({
         model: 'gpt-4.1',
         prompt,
         temperature: 0.2,
         maxTokens: 500,
      });

      await reviewRepository.storeReviewSummary(productId, summary);

      return summary;
   },
};
