import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { explainDocument } from '../src/aiService.js';
import { SUPPORTED_LANGUAGES } from '../../shared/documentSchema.js';

describe('Samjhao Backend HTTP Endpoints Integration Tests', () => {
  let app;
  let server;
  let baseUrl;

  before(async () => {
    app = express();
    app.use(cors());
    app.use(express.json());

    const upload = multer({
      storage: multer.memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 }
    });

    app.get('/api/health', (req, res) => {
      res.json({ status: 'ok', service: 'Samjhao Backend' });
    });

    app.get('/api/languages', (req, res) => {
      res.json({ languages: SUPPORTED_LANGUAGES });
    });

    app.post('/api/explain', upload.single('document'), async (req, res) => {
      const language = req.body.language || 'hi';
      const file = req.file;
      const fileBuffer = file?.buffer || Buffer.from('test-image-data');
      const result = await explainDocument({
        fileBuffer,
        mimeType: file?.mimetype || 'image/jpeg',
        language
      });
      res.json(result);
    });

    await new Promise((resolve) => {
      server = app.listen(0, () => {
        const port = server.address().port;
        baseUrl = `http://127.0.0.1:${port}`;
        resolve();
      });
    });
  });

  after(async () => {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
  });

  test('GET /api/health returns 200 and status ok', async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.status, 'ok');
  });

  test('GET /api/languages returns supported languages array', async () => {
    const res = await fetch(`${baseUrl}/api/languages`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.ok(Array.isArray(body.languages));
    assert.ok(body.languages.length >= 4);
  });

  test('POST /api/explain returns validated structured explanation', async () => {
    const formData = new FormData();
    formData.append('language', 'hi');
    const blob = new Blob(['sample-image-content'], { type: 'image/jpeg' });
    formData.append('document', blob, 'sample-electricity-bill.jpg');

    const res = await fetch(`${baseUrl}/api/explain`, {
      method: 'POST',
      body: formData
    });

    assert.equal(res.status, 200);
    const data = await res.json();
    assert.ok(data.id);
    assert.equal(data.language, 'hi');
    assert.ok(data.simpleSummary);
    assert.ok(data.actionRequired);
    assert.ok(Array.isArray(data.keyDetails));
    assert.ok(data.keyDetails.length > 0);
  });
});
