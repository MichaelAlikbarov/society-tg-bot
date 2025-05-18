import { OpenAI } from 'openai';
import * as dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL,
});

export async function askGPT(question: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: 'anthropic/claude-3-haiku',
      messages: [
        { role: 'system', content: 'Ты помощник по обществознанию. Отвечай кратко, ясно и по теме.' },
        { role: 'user', content: question },
      ],
    });

    return response.choices[0].message.content ?? 'Ответ не получен';
  } catch (err: any) {
    console.error('❌ GPT ошибка:', err.response?.data || err.message);
    return '❌ GPT вызвал ошибку. Смотри терминал.';
  }
}
