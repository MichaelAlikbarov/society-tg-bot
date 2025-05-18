import { Telegraf } from 'telegraf';
import express from 'express';
import * as dotenv from 'dotenv';
import { askGPT } from './askGPT';

// Загружаем переменные окружения из .env
dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN!); // "!" говорит TypeScript, что переменная точно есть

// Команда /start
bot.start((ctx) => {
  ctx.reply('👋 Привет! Я помощник по обществознанию.\nВыбери тему или задай вопрос.');
});

// Ответ на текстовые сообщения
bot.on('text', async (ctx) => {
  const question = ctx.message.text;

  ctx.reply('🤔 Думаю...');

  try {
    const answer = await askGPT(question);
    ctx.reply(answer);
  } catch (err) {
    console.error(err);
    ctx.reply('❌ Ошибка при обращении к GPT. Попробуй позже.');
  }
});

// Запуск бота
bot.launch();
console.log('✅ Бот запущен');

// Грейсфул шутдаун
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (_req, res) => {
  res.send('Бот запущен и работает');
});

app.listen(PORT, () => {
  console.log(`Сервер слушает порт ${PORT}`);
});