import { Telegraf } from 'telegraf';
import express from 'express';
import * as dotenv from 'dotenv';
import { askGPT } from './askGPT';

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN!);
const app = express();
const PORT = process.env.PORT || 3000;
const WEBHOOK_URL = 'https://society-tg-bot.onrender.com';

// Устанавливаем webhook
bot.telegram.setWebhook(`${WEBHOOK_URL}/bot${process.env.BOT_TOKEN}`);

// Принимаем обновления от Telegram через вебхук
app.use(express.json());
app.post(`/bot${process.env.BOT_TOKEN}`, (req, res) => {
  bot.handleUpdate(req.body, res);
});

// Роут для проверки
app.get('/', (_req, res) => {
  res.send('Бот запущен и работает ✅');
});

// Обрабатываем команды
bot.start((ctx) => {
  ctx.reply('👋 Привет! Я помощник по обществознанию.\nВыбери тему или задай вопрос.');
});

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

// Запускаем Express-сервер
app.listen(PORT, () => {
  console.log(`🚀 Сервер слушает порт ${PORT}`);
  console.log('🤖 Бот работает через webhook');
});

// Грейсфул шутдаун
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));