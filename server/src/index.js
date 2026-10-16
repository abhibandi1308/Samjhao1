import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import { explainDocument } from './aiService.js';
import { SUPPORTED_LANGUAGES } from '../../shared/documentSchema.js';

// Load environment variables
dotenv.config();

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
      language
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

// Start Express Server
app.listen(PORT, () => {
  const mode = process.env.GEMINI_API_KEY ? 'Live AI Mode (Gemini)' : 'Offline Mock Demo Mode';
  console.log(`\n==================================================`);
  console.log(`✨ Samjhao Backend running on http://localhost:${PORT}`);
  console.log(`🔒 Zero-storage policy active (Memory-only processing)`);
  console.log(`🤖 Mode: ${mode}`);
  console.log(`==================================================\n`);
});
