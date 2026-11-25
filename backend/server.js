import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";
import { randomBytes, randomInt, scrypt as scryptCallback, timingSafeEqual, createHash } from "node:crypto";
import { promisify } from "node:util";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 3001;

// Parse request bodies and handle CORS before registering API routes.
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));
app.use(express.json());

// OTP store: chatId → { code, expiry }
const otpStore = new Map();
const scrypt = promisify(scryptCallback);
const dataFile = resolve(dirname(fileURLToPath(import.meta.url)), "data", "users.json");
const emailCodes = new Map();
const passwordResetTokens = new Map();
const resetSendTimes = new Map();

await mkdir(dirname(dataFile), { recursive: true });
let users = [];
try { users = JSON.parse(await readFile(dataFile, "utf8")); } catch (error) {
  if (error.code !== "ENOENT") throw error;
}

async function saveUsers() {
  await writeFile(dataFile, JSON.stringify(users, null, 2), { mode: 0o600 });
}

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function validEmail(email) {
  return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function hashPassword(password, salt = randomBytes(16).toString("hex")) {
  const derived = await scrypt(password, salt, 64);
  return { salt, hash: derived.toString("hex") };
}

async function sendPasswordResetEmail(email, code) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.AUTH_EMAIL_FROM;
  if (!apiKey || !from) throw new Error("EMAIL_PROVIDER_NOT_CONFIGURED");
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [email],
      subject: "Auto Need — password reset code",
      text: `Your password reset code is ${code}. It expires in 10 minutes. If you did not request this, ignore this email.`,
      html: `<div style="font-family:Arial,sans-serif;color:#28251f"><h2>Auto Need</h2><p>Your password reset code:</p><p style="font-size:28px;font-weight:bold;letter-spacing:8px">${code}</p><p>This code expires in 10 minutes.</p><p>If you did not request this, ignore this email.</p></div>`,
    }),
  });
  if (!response.ok) {
    console.error("[Auth email] Provider returned status", response.status);
    throw new Error("EMAIL_DELIVERY_FAILED");
  }
}

app.post("/api/auth/register", async (req, res) => {
  const email = normalizeEmail(req.body?.email);
  const password = String(req.body?.password || "");
  if (!validEmail(email)) return res.status(400).json({ ok: false, error: "INVALID_EMAIL" });
  if (password.length < 8 || password.length > 128) return res.status(400).json({ ok: false, error: "INVALID_PASSWORD" });
  if (users.some(user => user.email === email)) return res.status(409).json({ ok: false, error: "EMAIL_EXISTS" });
  try {
    const credential = await hashPassword(password);
    users.push({ email, passwordSalt: credential.salt, passwordHash: credential.hash, createdAt: Date.now() });
    await saveUsers();
    res.status(201).json({ ok: true, user: { email } });
  } catch (error) {
    console.error("[Auth] Registration failed:", error.message);
    res.status(500).json({ ok: false, error: "SERVER_ERROR" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const email = normalizeEmail(req.body?.email);
  const password = String(req.body?.password || "");
  if (!validEmail(email) || !password) return res.status(400).json({ ok: false, error: "INVALID_CREDENTIALS" });
  const user = users.find(entry => entry.email === email);
  if (!user) return res.status(401).json({ ok: false, error: "INVALID_CREDENTIALS" });
  try {
    const candidate = await scrypt(password, user.passwordSalt, 64);
    const stored = Buffer.from(user.passwordHash, "hex");
    if (candidate.length !== stored.length || !timingSafeEqual(candidate, stored)) {
      return res.status(401).json({ ok: false, error: "INVALID_CREDENTIALS" });
    }
    res.json({ ok: true, user: { email: user.email } });
  } catch (error) {
    console.error("[Auth] Login failed:", error.message);
    res.status(500).json({ ok: false, error: "SERVER_ERROR" });
  }
});

app.post("/api/auth/password/forgot", async (req, res) => {
  const email = normalizeEmail(req.body?.email);
  if (!validEmail(email)) return res.status(400).json({ ok: false, error: "INVALID_EMAIL" });
  const lastSent = resetSendTimes.get(email) || 0;
  if (Date.now() - lastSent < 60_000) return res.status(429).json({ ok: false, error: "TRY_LATER" });
  resetSendTimes.set(email, Date.now());
  const user = users.find(entry => entry.email === email);
  if (!user) return res.json({ ok: true, message: "If that account exists, a code has been sent." });

  const code = String(randomInt(100000, 1000000));
  try {
    await sendPasswordResetEmail(email, code);
    emailCodes.set(email, { codeHash: createHash("sha256").update(code).digest("hex"), expiresAt: Date.now() + 10 * 60_000, attempts: 0 });
    resetSendTimes.set(email, Date.now());
    res.json({ ok: true, message: "If that account exists, a code has been sent." });
  } catch (error) {
    console.error("[Auth email] Password reset email could not be sent.");
    res.status(error.message === "EMAIL_PROVIDER_NOT_CONFIGURED" ? 503 : 502).json({ ok: false, error: error.message === "EMAIL_PROVIDER_NOT_CONFIGURED" ? "EMAIL_NOT_CONFIGURED" : "EMAIL_DELIVERY_FAILED" });
  }
});

app.post("/api/auth/password/verify-code", (req, res) => {
  const email = normalizeEmail(req.body?.email);
  const code = String(req.body?.code || "").trim();
  const entry = emailCodes.get(email);
  if (!entry || entry.expiresAt < Date.now()) {
    emailCodes.delete(email);
    return res.status(400).json({ ok: false, error: "CODE_EXPIRED" });
  }
  entry.attempts += 1;
  if (entry.attempts > 5) {
    emailCodes.delete(email);
    return res.status(429).json({ ok: false, error: "TOO_MANY_ATTEMPTS" });
  }
  const submittedHash = createHash("sha256").update(code).digest();
  const storedHash = Buffer.from(entry.codeHash, "hex");
  if (submittedHash.length !== storedHash.length || !timingSafeEqual(submittedHash, storedHash)) {
    return res.status(400).json({ ok: false, error: "INVALID_CODE" });
  }
  emailCodes.delete(email);
  const token = randomBytes(32).toString("hex");
  passwordResetTokens.set(email, { tokenHash: createHash("sha256").update(token).digest("hex"), expiresAt: Date.now() + 10 * 60_000 });
  res.json({ ok: true, resetToken: token });
});

app.post("/api/auth/password/reset", async (req, res) => {
  const email = normalizeEmail(req.body?.email);
  const token = String(req.body?.resetToken || "");
  const password = String(req.body?.password || "");
  if (password.length < 8 || password.length > 128) return res.status(400).json({ ok: false, error: "INVALID_PASSWORD" });
  const reset = passwordResetTokens.get(email);
  if (!reset || reset.expiresAt < Date.now()) {
    passwordResetTokens.delete(email);
    return res.status(400).json({ ok: false, error: "RESET_EXPIRED" });
  }
  const tokenHash = createHash("sha256").update(token).digest();
  const savedHash = Buffer.from(reset.tokenHash, "hex");
  if (tokenHash.length !== savedHash.length || !timingSafeEqual(tokenHash, savedHash)) {
    return res.status(400).json({ ok: false, error: "INVALID_RESET_TOKEN" });
  }
  const userIndex = users.findIndex(entry => entry.email === email);
  if (userIndex < 0) return res.status(404).json({ ok: false, error: "ACCOUNT_NOT_FOUND" });
  try {
    const credential = await hashPassword(password);
    users[userIndex] = { ...users[userIndex], passwordSalt: credential.salt, passwordHash: credential.hash, passwordUpdatedAt: Date.now() };
    await saveUsers();
    passwordResetTokens.delete(email);
    res.json({ ok: true });
  } catch (error) {
    console.error("[Auth] Password reset failed:", error.message);
    res.status(500).json({ ok: false, error: "SERVER_ERROR" });
  }
});


// ── Telegram sender ──
async function sendTelegram(chatId, text) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token || token === "YOUR_BOT_TOKEN") {
    console.warn("[Telegram] Token орнотулган эмес!");
    return false;
  }
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
    });
    const data = await res.json();
    if (!data.ok) { console.error("[Telegram] Error:", data); return false; }
    return true;
  } catch (err) {
    console.error("[Telegram] Fetch error:", err.message);
    return false;
  }
}

function generateOTP() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

// ══════════════════════════════════════════════════════
//  POST /api/admin/login
//  Body: { email, password }
//  Текшерет → OTP жасайт → Telegram'га жөнөтөт
// ══════════════════════════════════════════════════════
app.post("/api/admin/login", async (req, res) => {
  const { email, password } = req.body || {};

  const correctEmail    = process.env.ADMIN_EMAIL    || "admin@gmail.com";
  const correctPassword = process.env.ADMIN_PASSWORD || "admin123";

  if (!email || !password) {
    return res.status(400).json({ ok: false, message: "Email жана пароль жөнөтүңүз." });
  }

  if (email.toLowerCase() !== correctEmail.toLowerCase() || password !== correctPassword) {
    return res.status(401).json({ ok: false, message: "Email же сырсөз туура эмес." });
  }

  const code   = generateOTP();
  const expiry = Date.now() + 5 * 60 * 1000; // 5 мүнөт
  const chatId = process.env.TELEGRAM_CHAT_ID;

  otpStore.set(chatId, { code, expiry });

  const message =
    `🔐 <b>Auto Need — Admin кириш коду</b>\n\n` +
    `Код: <b>${code}</b>\n\n` +
    `⏱ 5 мүнөт ичинде жараксыз болот.\n` +
    `Эгер сиз кирүүгө аракет кылбасаңыз — бул билдирүүнү этибарга албаңыз.`;

  const sent = await sendTelegram(chatId, message);

  if (!sent) {
    // Telegram орнотулмаса dev режим — код консолго чыгат
    if (!process.env.TELEGRAM_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN === "YOUR_BOT_TOKEN") {
      console.log(`\n[DEV MODE] OTP Code: ${code}\n`);
      return res.json({ ok: true, dev: true, code });
    }
    return res.status(500).json({ ok: false, message: "Telegram'га жөнөтүүдө ката болду." });
  }

  res.json({ ok: true, message: "Код Telegram'га жөнөтүлдү." });
});

// ══════════════════════════════════════════════════════
//  POST /api/admin/verify
//  Body: { code }
//  OTP ырастоо
// ══════════════════════════════════════════════════════
app.post("/api/admin/verify", (req, res) => {
  const { code }  = req.body || {};
  const chatId    = process.env.TELEGRAM_CHAT_ID;
  const stored    = otpStore.get(chatId);

  if (!stored) {
    return res.status(400).json({ ok: false, message: "Алгач кириш суроосун жөнөтүңүз." });
  }
  if (Date.now() > stored.expiry) {
    otpStore.delete(chatId);
    return res.status(400).json({ ok: false, message: "Код мөөнөтү өттү. Кайра кириңиз." });
  }
  if (String(code).trim() !== stored.code) {
    return res.status(401).json({ ok: false, message: "Код туура эмес. Дагы аракет кылыңыз." });
  }

  otpStore.delete(chatId);
  res.json({ ok: true, message: "Ырасталды. Кириш ачылды." });
});

// ── Health ──
app.get("/api/health", (_, res) => res.json({ ok: true, service: "AutoNeed Backend" }));

app.listen(PORT, () => {
  console.log(`\n✅ Backend иштеп жатат: http://localhost:${PORT}`);
  console.log(`   Admin Email    : ${process.env.ADMIN_EMAIL    || "admin@gmail.com (default)"}`);
  console.log(`   Telegram Bot   : ${process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_BOT_TOKEN !== "YOUR_BOT_TOKEN" ? "✓ орнотулган" : "✗ орнотулган эмес (dev mode)"}`);
  console.log(`   Telegram ChatID: ${process.env.TELEGRAM_CHAT_ID  && process.env.TELEGRAM_CHAT_ID  !== "YOUR_CHAT_ID"  ? "✓ орнотулган" : "✗ орнотулган эмес"}\n`);
});
