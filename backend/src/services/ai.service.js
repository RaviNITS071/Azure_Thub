import OpenAI from 'openai';
import { env } from '../config/env.js';
import pino from 'pino';

const logger = pino();

// Only initialize the client if the key exists to prevent startup crashes
const openai = env.OPENAI_API_KEY && env.OPENAI_API_KEY !== 'dummy_key' 
  ? new OpenAI({ apiKey: env.OPENAI_API_KEY }) 
  : null;

export const analyzeTenderDocument = async (text, promptType = 'summary') => {
  if (!openai) {
    logger.warn('OpenAI API Key is missing or dummy. Returning mock analysis.');
    return { 
      summary: 'Mock AI Summary (API Key missing)', 
      extractedEligibility: ['Mock Eligibility 1', 'Mock Eligibility 2'],
      rawOpenAiResponse: {}
    };
  }

  try {
    const prompt = `Analyze the following tender document and extract a summary and key eligibility criteria. 
    Ensure the output is strictly valid JSON with the keys: "summary" (string) and "extractedEligibility" (array of strings).\n\nText: ${text.substring(0, 15000)}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.1,
    });

    const parsedContent = JSON.parse(response.choices[0].message.content);
    return {
      summary: parsedContent.summary,
      extractedEligibility: parsedContent.extractedEligibility,
      rawOpenAiResponse: response.choices[0].message,
    };
  } catch (error) {
    logger.error(`AI Analysis Error: ${error.message}`);
    throw error;
  }
};