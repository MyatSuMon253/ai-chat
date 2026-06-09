import { conversationRepository } from '../repositories/conversation.repository';
import template from '../llm/prompts/chatbot.txt';
import fs from 'fs';
import path from 'path';
import { llmClient } from '../llm/prompts/client';

type ChatResponse = {
   id: string;
   message: string;
};

const parkInfo = fs.readFileSync(
   path.join(__dirname, '..', 'llm/prompts', 'WonderWorld.md'),
   'utf8'
);
const instructions = template.replace('{{parkInfo}}', parkInfo);

// Public interface
// Leaky abstraction
export const chatService = {
   async sendMessage(
      prompt: string,
      conversationId: string
   ): Promise<ChatResponse> {
      const response = await llmClient.generateText({
         model: 'gpt-4o-mini',
         instructions,
         prompt,
         temperature: 0.2,
         maxTokens: 200,
         previous_response_id:
            conversationRepository.getLastResponseId(conversationId),
      });

      conversationRepository.setLastResponseId(conversationId, response.id);

      return { id: response.id, message: response.text };
   },
};
