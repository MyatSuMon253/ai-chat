import type { Review } from '../generated/prisma/client';
import { prisma } from '../routes';

export const reviewRepository = {
   async getReviews(productId: number, limit?: number): Promise<Review[]> {
      return await prisma.review.findMany({
         where: { productId },
         orderBy: { createdAt: 'desc' },
      });
   },
};
