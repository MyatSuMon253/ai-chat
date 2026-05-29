import type { Request, Response } from 'express';
import z from 'zod';
import { chatService } from '../services/chat.service';

// Implementation detail
const chatSchema = z.object({
   prompt: z
      .string()
      .trim()
      .min(1, 'Prompt is required.')
      .max(1000, 'Prompt is too long max 1000 characters'),
   conversationId: z.string(),
});

// Public interface
export const chatController = {
   async sendMessage(req: Request, res: Response) {
      const parsedResult = chatSchema.safeParse(req.body);

      if (!parsedResult.success) {
         res.status(400).json(parsedResult.error.format());
         return;
      }

      try {
         const { prompt, conversationId } = req.body;
         const response = await chatService.sendMessage(prompt, conversationId);

         res.json({ message: response.message });
      } catch (error) {
         res.status(500).json({ error: 'Failed to generate a response.' });
      }
   },
};
