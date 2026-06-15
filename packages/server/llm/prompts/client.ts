import OpenAI from 'openai';
import { InferenceClient } from '@huggingface/inference';

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

const hfToken = process.env.HF_TOKEN;
const inferenceClient = hfToken ? new InferenceClient(hfToken) : null;

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

   async summarize(text: string): Promise<string> {
      if (inferenceClient) {
         try {
            const output = await inferenceClient.summarization(
               {
                  model: 'facebook/bart-large-cnn',
                  inputs: text,
                  provider: 'hf-inference',
               },
               {
                  retry_on_error: false,
                  signal: AbortSignal.timeout(10_000),
               }
            );

            if (output.summary_text.trim()) {
               return output.summary_text;
            }
         } catch (error) {
            const message =
               error instanceof Error ? error.message : String(error);
            console.warn(`Hugging Face summarization failed: ${message}`);
         }
      }

      const response = await openAIClient.responses.create({
         model: 'gpt-4.1',
         instructions:
            'Summarize the customer reviews into one short paragraph. Include both positive and negative themes.',
         input: text,
         temperature: 0.2,
         max_output_tokens: 500,
      });

      return response.output_text;
   },
};
