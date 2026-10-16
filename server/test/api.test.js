import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { validateAndNormalizeResult, createFallbackErrorResult, SUPPORTED_LANGUAGES } from '../../shared/documentSchema.js';
import { explainDocument } from '../src/aiService.js';

describe('Samjhao Schema & Safety Guardrails Tests', () => {
  test('Supported languages include Hindi, English, Telugu, Gujarati', () => {
    const codes = SUPPORTED_LANGUAGES.map(l => l.code);
    assert.ok(codes.includes('hi'), 'Should support Hindi');
    assert.ok(codes.includes('en'), 'Should support English');
    assert.ok(codes.includes('te'), 'Should support Telugu');
    assert.ok(codes.includes('gu'), 'Should support Gujarati');
  });

  test('validateAndNormalizeResult normalizes valid document structure', () => {
    const raw = {
      documentType: 'Electricity Bill',
      simpleSummary: 'Your monthly power bill.',
      actionRequired: 'Pay ₹500 by Nov 10.',
      keyDetails: [
        { label: 'Amount', value: '₹500', isUncertain: false }
      ],
      warnings: ['Due date is Nov 10'],
      uncertainFields: []
    };

    const normalized = validateAndNormalizeResult(raw, 'en');
    assert.equal(normalized.documentType, 'Electricity Bill');
    assert.equal(normalized.actionRequired, 'Pay ₹500 by Nov 10.');
    assert.equal(normalized.keyDetails.length, 1);
    assert.equal(normalized.isMedicalOrPrescription, false);
  });

  test('Medical prescription guardrail immediately flags prescription', () => {
    const medicalInput = {
      documentType: 'Doctor Prescription',
      simpleSummary: 'Take Paracetamol 500mg twice daily.',
      isMedicalOrPrescription: true
    };

    const result = validateAndNormalizeResult(medicalInput, 'en');
    assert.equal(result.isMedicalOrPrescription, true, 'Must flag prescription as true');
  });

  test('createFallbackErrorResult provides clear guidance for blurry images', () => {
    const errorResult = createFallbackErrorResult('Image too blurry', 'hi');
    assert.equal(errorResult.needsClearerPhoto, true);
    assert.ok(errorResult.photoGuidance.length > 0);
    assert.ok(errorResult.fullSpokenText.length > 0);
  });

  test('explainDocument returns valid structure in offline mock mode', async () => {
    const result = await explainDocument({
      fileBuffer: Buffer.from('fake-image-bytes'),
      mimeType: 'image/jpeg',
      language: 'hi'
    });

    assert.ok(result.id);
    assert.equal(result.language, 'hi');
    assert.ok(result.keyDetails.length > 0);
    assert.ok(result.simpleSummary.length > 0);
    assert.ok(result.fullSpokenText.length > 0);
  });
});
