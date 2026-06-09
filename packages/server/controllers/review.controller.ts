import type { Request, Response } from 'express';
import { reviewService } from '../services/review.service';

export const reviewController = {
   async getReviews(req: Request, res: Response) {
      const productId = Number(req.params.id);

      if (isNaN(productId)) {
         res.status(400).json({ error: 'Invalid product ID.' });
         return;
      }

      try {
         const reviews = reviewService.getReviews(productId);

         res.json(reviews);
      } catch (error) {
         console.error('Failed to fetch reviews:', error);
         res.status(500).json({ error: 'Failed to fetch reviews.' });
      }
   },

   async summarizeReviews(req: Request, res: Response) {
      const productId = Number(req.params.id);

      if (isNaN(productId)) {
         res.status(400).json({ error: 'Invalid product ID.' });
         return;
      }

      const summary = reviewService.summarizeReviews(productId);
      res.json({ summary });
   },
};
