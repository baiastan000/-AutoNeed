# AutoNeed — Backend

Node.js + Express сервери. Telegram Bot аркылуу 2FA кодун жөнөтөт.

## Иштетүү

### 1. .env файлын толтуруңуз

```
TELEGRAM_BOT_TOKEN=7123456789:AAH...   ← @BotFather дан
TELEGRAM_CHAT_ID=123456789             ← getUpdates дан
ADMIN_LOGIN=admin
ADMIN_PASSWORD=admin123
PORT=3001
FRONTEND_URL=http://localhost:5173
```

### 2. Иштетүү

```bash
npm run dev    # разработка үчүн (auto-restart)
npm start      # production
```

## API Endpoints

| Method | URL | Максат |
|--------|-----|--------|
| POST | /api/admin/login | Логин текшерүү → Telegram'га OTP жөнөтүү |
| POST | /api/admin/verify | OTP ырастоо |
| GET  | /api/health | Сервер иштеп жатабы |

## Telegram Bot түзүү

1. @BotFather → /newbot
2. Token алыңыз → .env га жазыңыз
3. Ботуңузга /start жазыңыз
4. https://api.telegram.org/bot{TOKEN}/getUpdates → chat.id алыңыз
