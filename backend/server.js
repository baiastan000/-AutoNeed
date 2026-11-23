import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 3001;

// ── OTP store: { chatId -> { code, expiry } } ──
const otpStore = new Map();

// ── Middleware ──
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));
app.use(express.json());

// ── Send message via Telegram Bot API ──
async function sendTelegram(chatId, text) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token || token === "YOUR_BOT_TOKEN") {
    console.warn("[Telegram] Bot token орнотулган эмес!");
    return false;
  }
  try {
    const res = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
      }
    );
    const data = await res.json();
    if (!data.ok) { console.error("[Telegram] Error:", data); return false; }
    return true;
  } catch (err) {
    console.error("[Telegram] Fetch error:", err.message);
    return false;
  }
}

// ── Generate 6-digit OTP ──
function generateOTP() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

// ════════════════════════════════════════════
//  POST /api/admin/login
//  Body: { login, password }
//  → Checks credentials, sends OTP to Telegram
// ════════════════════════════════════════════
app.post("/api/admin/login", async (req, res) => {
  const { login, password } = req.body || {};

  const correctLogin    = process.env.ADMIN_LOGIN    || "admin";
  const correctPassword = process.env.ADMIN_PASSWORD || "admin123";

  if (!login || !password) {
    return res.status(400).json({ ok: false, message: "Login жана password жөнөтүңүз." });
  }

  if (login !== correctLogin || password !== correctPassword) {
    return res.status(401).json({ ok: false, message: "Логин же сырсөз туура эмес." });
  }

  // Generate OTP
  const code   = generateOTP();
  const expiry = Date.now() + 5 * 60 * 1000; // 5 minutes
  const chatId = process.env.TELEGRAM_CHAT_ID;

  otpStore.set(chatId, { code, expiry });

  // Send to Telegram
  const message =
    `🔐 <b>Auto Need Admin</b>\n\n` +
    `Кириш коду: <b>${code}</b>\n\n` +
    `⏱ Код 5 мүнөт ичинде жараксыз болот.`;

  const sent = await sendTelegram(chatId, message);

  if (!sent) {
    // Dev fallback — return code in response (only if Telegram not configured)
    if (!process.env.TELEGRAM_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN === "YOUR_BOT_TOKEN") {
      console.log(`[DEV] OTP code: ${code}`);
      return res.json({ ok: true, dev: true, code }); // remove in production!
    }
    return res.status(500).json({ ok: false, message: "Telegram жөнөтүүдө ката болду." });
  }

  res.json({ ok: true, message: "Код Telegram'га жөнөтүлдү." });
});

// ════════════════════════════════════════════
//  POST /api/admin/verify
//  Body: { code }
//  → Verifies OTP
// ════════════════════════════════════════════
app.post("/api/admin/verify", (req, res) => {
  const { code } = req.body || {};
  const chatId   = process.env.TELEGRAM_CHAT_ID;
  const stored   = otpStore.get(chatId);

  if (!stored) {
    return res.status(400).json({ ok: false, message: "Алгач код сураңыз." });
  }

  if (Date.now() > stored.expiry) {
    otpStore.delete(chatId);
    return res.status(400).json({ ok: false, message: "Код мөөнөтү өттү. Кайра кириңиз." });
  }

  if (code !== stored.code) {
    return res.status(401).json({ ok: false, message: "Код туура эмес." });
  }

  // ✅ Success
  otpStore.delete(chatId);
  res.json({ ok: true, message: "Ырасталды." });
});

// ── Health check ──
app.get("/api/health", (_, res) => res.json({ ok: true, service: "AutoNeed Backend" }));

// ── Start ──
app.listen(PORT, () => {
  console.log(`✅ Backend иштеп жатат: http://localhost:${PORT}`);
  console.log(`   Telegram Bot: ${process.env.TELEGRAM_BOT_TOKEN ? "✓ орнотулган" : "✗ орнотулган эмес"}`);
});
