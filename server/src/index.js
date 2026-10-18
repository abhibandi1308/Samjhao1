import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { explainDocument } from './aiService.js';
import { SUPPORTED_LANGUAGES } from '../../shared/documentSchema.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Robustly load environment variables from server/.env, root .env, or process env
dotenv.config({ path: path.resolve(__dirname, '../.env') });
if (!process.env.GEMINI_API_KEY) {
  dotenv.config({ path: path.resolve(process.cwd(), '.env') });
}

const app = express();
const PORT = process.env.PORT || 5000;
const MAX_FILE_SIZE_MB = parseInt(process.env.MAX_FILE_SIZE_MB || '10', 10);

// Middleware
app.use(cors());
app.use(express.json({ limit: '15mb' }));

// In-Memory Storage Configuration (Zero Document Persistence)
// Files exist strictly in RAM buffer during the HTTP request cycle and are never written to disk.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE_MB * 1024 * 1024 // e.g. 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'application/pdf'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file format. Please upload JPG, PNG, WebP, or PDF.'));
    }
  }
});

// Health & System Status Endpoint
app.get('/api/health', (req, res) => {
  const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== '');
  res.json({
    status: 'ok',
    service: 'Samjhao Backend',
    mode: hasGeminiKey ? 'live_ai' : 'offline_mock_mode',
    supportedLanguagesCount: SUPPORTED_LANGUAGES.length,
    timestamp: new Date().toISOString()
  });
});

// Supported Languages Endpoint
app.get('/api/languages', (req, res) => {
  res.json({
    languages: SUPPORTED_LANGUAGES
  });
});

// High-Fidelity Text-to-Speech Endpoint for Indian Languages
// Provides native Telugu, Gujarati, Hindi, and English audio for elders
app.get('/api/tts', async (req, res) => {
  try {
    const text = String(req.query.text || '').trim();
    const lang = String(req.query.lang || 'en').trim();

    if (!text) {
      return res.status(400).json({ error: 'Text query parameter is required.' });
    }

    let tl = 'en';
    if (lang === 'hi') tl = 'hi';
    else if (lang === 'te') tl = 'te';
    else if (lang === 'gu') tl = 'gu';
    else if (lang === 'bn') tl = 'bn';
    else if (lang === 'mr') tl = 'mr';

    // Google Translate TTS supports up to ~200 characters per single call
    const cleanText = text.slice(0, 250);
    const encoded = encodeURIComponent(cleanText);
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encoded}&tl=${tl}&client=tw-ob`;

    const response = await fetch(ttsUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`TTS provider returned status ${response.status}`);
    }

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    const buffer = Buffer.from(await response.arrayBuffer());
    res.send(buffer);
  } catch (err) {
    console.warn('⚠️ [Samjhao] TTS audio note:', err.message);
    res.status(502).json({ error: 'TTS audio service temporarily unavailable.' });
  }
});

// Main Explain Document Endpoint
app.post('/api/explain', upload.single('document'), async (req, res) => {
  try {
    const language = req.body.language || 'hi';
    const file = req.file;

    // Check if file is provided either via multipart file or JSON base64
    let fileBuffer = null;
    let mimeType = 'image/jpeg';

    if (file && file.buffer) {
      fileBuffer = file.buffer;
      mimeType = file.mimetype;
    } else if (req.body.imageBase64) {
      const match = req.body.imageBase64.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
      if (match) {
        mimeType = match[1];
        fileBuffer = Buffer.from(match[2], 'base64');
      } else {
        fileBuffer = Buffer.from(req.body.imageBase64, 'base64');
      }
    }

    if (!fileBuffer) {
      return res.status(400).json({
        error: 'No document provided. Please upload an image or PDF.'
      });
    }

    // Process document in-memory through AI service
    const result = await explainDocument({
      fileBuffer,
      mimeType,
      language,
      fileName: file?.originalname || req.body.fileName || ''
    });

    // Zero-storage guarantee: Clean up local reference
    fileBuffer = null;

    res.json(result);
  } catch (error) {
    console.error('Server error handling /api/explain:', error);
    res.status(500).json({
      error: error.message || 'An unexpected error occurred while analyzing the document.'
    });
  }
});

// Production Static Serving (Single-Port Fullstack Deployment)
const clientDistPath = path.resolve(__dirname, '../../client/dist');

if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
  console.log(`📦 [Samjhao] Production build detected. Serving static assets from client/dist.`);
}

// Start Express Server
app.listen(PORT, () => {
  const mode = process.env.GEMINI_API_KEY ? 'Live AI Mode (Gemini)' : 'Offline Mock Demo Mode';
  console.log(`\n==================================================`);
  console.log(`✨ Samjhao Fullstack Server running on http://localhost:${PORT}`);
  console.log(`🔒 Zero-storage policy active (Memory-only processing)`);
  console.log(`🤖 Mode: ${mode}`);
  console.log(`==================================================\n`);
});
