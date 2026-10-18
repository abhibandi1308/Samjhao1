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
    fileSize: MAX_FILE_SIZE_MB * 1024 * 1024 // e.g. 25MB
  },
  fileFilter: (req, file, cb) => {
    const mime = (file.mimetype || '').toLowerCase();
    const name = (file.originalname || '').toLowerCase();
    const isImageOrPdf =
      mime.startsWith('image/') ||
      mime === 'application/pdf' ||
      mime === 'application/octet-stream' ||
      /\.(jpe?g|png|webp|heic|heif|bmp|pdf)$/i.test(name);

    if (isImageOrPdf) {
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

// Helper function to split long text into natural sentence chunks (max 180 chars for TTS URL limits)
function splitTtsChunks(text, maxLen = 180) {
  const parts = text.split(/(?<=[.!?।,\n])\s+/);
  const chunks = [];
  let current = '';

  for (const part of parts) {
    if (!part.trim()) continue;
    if ((current + ' ' + part).trim().length <= maxLen) {
      current = (current + ' ' + part).trim();
    } else {
      if (current) chunks.push(current);
      if (part.length <= maxLen) {
        current = part;
      } else {
        for (let i = 0; i < part.length; i += maxLen) {
          chunks.push(part.slice(i, i + maxLen));
        }
        current = '';
      }
    }
  }
  if (current) chunks.push(current);
  return chunks.length > 0 ? chunks : [text.slice(0, maxLen)];
}

// High-Fidelity Text-to-Speech Endpoint for Indian Languages
// Supports optional ElevenLabs Multilingual v2 with zero-config fallback to Google Native Regional TTS
app.get('/api/tts', async (req, res) => {
  try {
    const text = String(req.query.text || '').trim();
    const lang = String(req.query.lang || 'en').trim();

    if (!text) {
      return res.status(400).json({ error: 'Text query parameter is required.' });
    }

    // 1. Optional ElevenLabs Voice Engine (Free tier: 10,000 chars/month, hyper-realistic accents)
    if (process.env.ELEVENLABS_API_KEY && process.env.ELEVENLABS_API_KEY.trim() !== '') {
      try {
        const voiceId = process.env.ELEVENLABS_VOICE_ID || 'EXAVITQu4vr4xnSDxMaL'; // Sarah - warm, clear voice
        const elRes = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
          method: 'POST',
          headers: {
            'xi-api-key': process.env.ELEVENLABS_API_KEY.trim(),
            'Content-Type': 'application/json',
            'Accept': 'audio/mpeg'
          },
          body: JSON.stringify({
            text: text.slice(0, 1500),
            model_id: 'eleven_multilingual_v2',
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.75
            }
          })
        });

        if (elRes.ok) {
          const buffer = Buffer.from(await elRes.arrayBuffer());
          res.setHeader('Content-Type', 'audio/mpeg');
          res.setHeader('Cache-Control', 'public, max-age=86400');
          return res.send(buffer);
        } else {
          console.warn(`⚠️ [Samjhao] ElevenLabs TTS returned ${elRes.status}. Falling back to Google native regional engine.`);
        }
      } catch (elErr) {
        console.warn(`⚠️ [Samjhao] ElevenLabs error: ${elErr.message}. Falling back to Google native regional engine.`);
      }
    }

    // 2. High-Fidelity Google Native Regional TTS (Telugu, Tamil, Hindi, English)
    let tl = 'en';
    if (lang === 'hi') tl = 'hi';
    else if (lang === 'te') tl = 'te';
    else if (lang === 'ta') tl = 'ta';
    else if (lang === 'bn') tl = 'bn';
    else if (lang === 'mr') tl = 'mr';

    const chunks = splitTtsChunks(text, 180);

    const buffers = await Promise.all(chunks.map(async (chunk) => {
      const encoded = encodeURIComponent(chunk);
      const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encoded}&tl=${tl}&client=tw-ob`;
      const response = await fetch(ttsUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      if (!response.ok) {
        throw new Error(`TTS provider returned status ${response.status}`);
      }
      return Buffer.from(await response.arrayBuffer());
    }));

    const combinedBuffer = Buffer.concat(buffers);
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.send(combinedBuffer);
  } catch (err) {
    console.warn('⚠️ [Samjhao] TTS audio error:', err.message);
    res.status(502).json({ error: 'TTS audio service temporarily unavailable.' });
  }
});

// Main Explain Document Endpoint with graceful upload error interception
app.post('/api/explain', (req, res, next) => {
  upload.single('document')(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({
          error: `File is too large. Maximum supported size is ${MAX_FILE_SIZE_MB}MB.`
        });
      }
      return res.status(400).json({
        error: err.message || 'Invalid file format uploaded.'
      });
    }
    next();
  });
}, async (req, res) => {
  try {
    const language = req.body.language || 'hi';
    const file = req.file;

    // Check if file is provided either via multipart file or JSON base64
    let fileBuffer = null;
    let mimeType = 'image/jpeg';

    if (file && file.buffer) {
      fileBuffer = file.buffer;
      mimeType = file.mimetype || 'image/jpeg';
      // Normalize mobile mime types for Gemini API
      if (
        mimeType === 'image/jpg' ||
        mimeType === 'image/pjpeg' ||
        mimeType === 'image/heic' ||
        mimeType === 'image/heif' ||
        mimeType === 'application/octet-stream'
      ) {
        mimeType = 'image/jpeg';
      }
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

// Export app for Vercel Serverless Functions & Testing
export default app;
export { app };

// Start Express Server (only when run directly, not when invoked as a Vercel serverless function)
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    const mode = process.env.GEMINI_API_KEY ? 'Live AI Mode (Gemini)' : 'Offline Mock Demo Mode';
    console.log(`\n==================================================`);
    console.log(`✨ Samjhao Fullstack Server running on http://localhost:${PORT}`);
    console.log(`🔒 Zero-storage policy active (Memory-only processing)`);
    console.log(`🤖 Mode: ${mode}`);
    console.log(`==================================================\n`);
  });
}
