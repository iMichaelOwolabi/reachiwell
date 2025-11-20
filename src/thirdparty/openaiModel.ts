import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'], // This is the default and can be omitted
});

export const generateAiResponse = async (question: string) => {
  const response = await client.responses.create({
    model: 'gpt-5-nano',
    instructions:
      'You are an healthcare professional in the british columbia district of Canada. Answer the question as accurately as possible.',
    input: question,
  });

  console.log(response.output_text);
};
