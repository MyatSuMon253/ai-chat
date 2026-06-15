import OpenAI from 'openai';
import { InferenceClient } from '@huggingface/inference';
import summarizePrompt from './prompts/summarize-review.txt';

type GenerateTextOptions = {
   model?: string;
   prompt: string;
   instructions?: string;
   temperature?: number;
   maxTokens?: number;
   previous_response_id?: string;
};

type GenerateTextResult = {
   id: string;
   text: string;
};

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
   throw new Error('OPENAI_API_KEY environment variable is required');
}

const openAIClient = new OpenAI({
   apiKey,
   baseURL: 'https://api.openai.com/v1',
});

const hfToken = process.env.HF_TOKEN!;
const inferenceClient = new InferenceClient(hfToken);

export const llmClient = {
   async generateText({
      model = 'gpt-4.1',
      prompt,
      instructions,
      temperature = 0.2,
      maxTokens = 300,
   }: GenerateTextOptions): Promise<GenerateTextResult> {
      const response = await openAIClient.responses.create({
         model,
         input: prompt,
         instructions,
         temperature,
         max_output_tokens: maxTokens,
      });

      return {
         id: response.id,
         text: response.output_text,
      };
   },

   async summarizeReviews(reviews: string) {
      const chatCompletion = await inferenceClient.chatCompletion({
         model: 'meta-llama/Llama-3.1-8B-Instruct:novita',
         messages: [
            {
               role: 'system',
               content: summarizePrompt,
            },
            { role: 'user', content: reviews },
         ],
      });

      return chatCompletion.choices[0]?.message.content || '';
   },
};
