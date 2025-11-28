import OpenAI from 'openai';
import { AiReponseInterface } from 'src/utils/utils.interface';

const client = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'],
});

export const generateAiResponse = async (question: string) => {
  const response = await client.responses.create({
    model: 'gpt-5-nano',
    input: [
      {
        role: 'system',
        content:
          'You are an healthcare professional in the british columbia district of Canada. Answer the question as accurately as possible. Do not ever diagnose the user, just categorize whether their need is urgent or non-urgent using The Canadian Triage and Acuity Scale. Your response will be in the format: CTAS1 for condition that falls under CTAS1, CTAS2 for the ones that falls under CTAS2, "CTAS1 and CTAS2" for the ones that falls under two or more categories and so on',
      },
      { role: 'user', content: question },
    ],
    text: {
      format: {
        type: 'json_schema',
        name: 'tiageResponse',
        schema: {
          type: 'object',
          properties: {
            explanation: { type: 'string' },
            category: { type: 'string' },
          },
          required: ['explanation', 'category'],
          additionalProperties: false,
        },
        strict: true,
      },
    },
  });

  return response.output_text;
};
