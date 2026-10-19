import "dotenv/config";
import { GoogleGenAI } from "@google/genai";
import Product from "../models/Product.js";

const SYSTEM_PROMPT = `Tum "Bannu Business Online" ke helpful marketplace assistant ho.
Sirf local marketplace, products, sellers, shopping, orders, delivery aur payments se related sawalon ka jawab do.
Jawab chhota, saaf aur helpful Roman Urdu mein do (ya user ki language mein).
Agar product list mein maujood ho to usi naam, price aur stock ka zikr karo.
Jawab ke aakhir mein customer ko "Order kaise karun?" ya relevant page suggest kar sakte ho.
Kuch bhi invent mat karo — agar info nahi hai to seedha keh do ke aap team se rabta karein.
ZAROORI: Hamesha mukammal aur pori tafseel ke sath jawab dein. Jawab ko beech mein na chhorein.`;

// ✅ Valid Gemini model names. Override via GEMINI_MODEL / GEMINI_MODELS env.
const DEFAULT_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
  "gemini-2.5-pro",
  "gemini-1.5-flash",
  "gemini-1.5-pro",
];

const MAX_MESSAGES = 20;
const MAX_CHARS = 2000;
const PER_MODEL_TIMEOUT_MS = 8000;
const MAX_OUTPUT_TOKENS = 2048;

/* ---------- Config helpers ---------- */

function resolveModels() {
  const raw = process.env.GEMINI_MODELS?.trim();

  if (raw) {
    const list = raw
      .split(",")
      .map((m) => m.trim())
      .filter(Boolean);
    if (list.length) return [...new Set(list)];
  }

  const single = process.env.GEMINI_MODEL?.trim();
  if (single) {
    return [...new Set([single, ...DEFAULT_MODELS])];
  }

  return DEFAULT_MODELS;
}

/* ---------- Product context ---------- */

async function buildProductContext() {
  try {
    const products = await Product.find({ isActive: true, stock: { $gt: 0 } })
      .select("name category price discountPrice stock")
      .limit(80)
      .lean();

    if (!products.length) return "Abhi koi product available nahi hai.";

    return products
      .map((p) => {
        const price = p.discountPrice > 0 ? p.discountPrice : p.price;
        const old = p.discountPrice > 0 ? ` (was Rs ${p.price})` : "";
        return `- ${p.name} | ${p.category} | Rs ${price}${old} | stock: ${p.stock}`;
      })
      .join("\n");
  } catch (e) {
    console.error("buildProductContext:", e);
    return "Product data abhi load nahi ho saka.";
  }
}

/* ---------- Error + timeout helpers ---------- */

function errorStatus(err) {
  return (
    err?.status ||
    err?.statusCode ||
    err?.response?.status ||
    err?.error?.status ||
    err?.error?.code ||
    500
  );
}

function errorMessage(err) {
  return (
    err?.message ||
    err?.error?.message ||
    err?.response?.data?.error?.message ||
    "unknown error"
  );
}

function withTimeout(promise, ms) {
  let timer;
  const timeoutPromise = new Promise((_, reject) => {
    timer = setTimeout(() => {
      reject(
        Object.assign(new Error(`Model timed out after ${ms / 1000}s`), {
          status: 504,
        })
      );
    }, ms);
  });

  promise.catch(() => {});

  return Promise.race([promise, timeoutPromise]).finally(() =>
    clearTimeout(timer)
  );
}

/* ---------- Public entry point ---------- */

export async function getAIReply(messages) {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (
    !apiKey ||
    /placeholder|your.*key|replace.*key|enter.*key/i.test(apiKey)
  ) {
    const err = new Error(
      "GEMINI_API_KEY backend/.env mein set nahi hai. Google AI Studio se key le kar .env mein daalein aur server restart karein."
    );
    err.statusCode = 503;
    err.code = "MISSING_API_KEY";
    throw err;
  }

  if (!Array.isArray(messages)) {
    const err = new Error("Messages array required.");
    err.statusCode = 400;
    throw err;
  }

  const contents = messages
    .filter(
      (m) =>
        m &&
        ["user", "assistant"].includes(m.role) &&
        typeof m.content === "string" &&
        m.content.trim()
    )
    .slice(-MAX_MESSAGES)
    .map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content.trim().slice(0, MAX_CHARS) }],
    }));

  while (contents.length && contents[0].role !== "user") contents.shift();

  if (!contents.length) {
    const err = new Error("Koi valid user message nahi mila.");
    err.statusCode = 400;
    throw err;
  }

  const productContext = await buildProductContext();
  const systemInstruction = `${SYSTEM_PROMPT}\n\nAvailable products (use these for prices/stock):\n${productContext}`;

  const ai = new GoogleGenAI({ apiKey });
  const config = {
    systemInstruction,
    maxOutputTokens: MAX_OUTPUT_TOKENS,
    temperature: 0.5,
  };

  const models = resolveModels();
  const attempts = [];

  for (const model of models) {
    const startedAt = Date.now();

    try {
      const response = await withTimeout(
        ai.models.generateContent({ model, contents, config }),
        PER_MODEL_TIMEOUT_MS
      );

      const text = response?.text?.trim();
      const finishReason = response?.candidates?.[0]?.finishReason;
      if (finishReason === "MAX_TOKENS") {
        console.warn(`[chat] ⚠ ${model} hit MAX_TOKENS limit.`);
      }

      if (!text) {
        throw Object.assign(new Error("Empty response from model"), {
          status: 502,
        });
      }

      const ms = Date.now() - startedAt;
      console.log(`[chat] ✓ ${model} answered in ${ms}ms`);
      return text;
    } catch (err) {
      const status = errorStatus(err);
      const message = errorMessage(err);
      const ms = Date.now() - startedAt;

      attempts.push({ model, status, message, ms });
      console.warn(
        `[chat] ✗ ${model} failed (${status}, ${ms}ms): ${message}`
      );

      if (status === 401 || status === 403) {
        const e = new Error(
          "Gemini API key rejected (401/403). Check GEMINI_API_KEY in backend/.env — it may be invalid, disabled, or missing permissions."
        );
        e.statusCode = 503;
        e.code = "AUTH_ERROR";
        e.attempts = attempts;
        throw e;
      }
    }
  }

  const allBusy = attempts.every((a) =>
    [429, 500, 502, 503, 504].includes(a.status)
  );
  const allNotFound = attempts.every((a) => a.status === 404);
  const allQuota = attempts.every((a) => a.status === 429);

  let userMessage;
  if (allQuota) {
    userMessage =
      "Aaj ki Gemini API quota khatam ho gayi hai. Google AI Studio mein billing/quota check karein, ya kal dobara koshish karein.";
  } else if (allBusy) {
    userMessage =
      "Sabhi Gemini models abhi busy ya overloaded hain. 1-2 minute baad dobara koshish karein.";
  } else if (allNotFound) {
    userMessage =
      "Koi bhi configured Gemini model available nahi mila. GEMINI_MODELS ko backend/.env mein check karein. Valid examples: gemini-2.5-flash,gemini-2.0-flash";
  } else {
    userMessage = `AI jawab nahi de saka (${attempts
      .map((a) => `${a.model}:${a.status}`)
      .join(", ")}). Thori der baad koshish karein.`;
  }

  const err = new Error(userMessage);
  err.statusCode = 503;
  err.code = "ALL_MODELS_FAILED";
  err.attempts = attempts;
  throw err;
}