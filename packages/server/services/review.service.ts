import type { Review } from '../generated/prisma/client';
import { reviewRepository } from '../repositories/review.repository';
import { llmClient } from '../llm/prompts/client';

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

      const summary = await llmClient.summarize(joinedReviews);
      if (!summary.trim()) {
         throw new Error('The summarization model returned an empty response');
      }

      await reviewRepository.storeReviewSummary(productId, summary);

      return summary;
   },
};
