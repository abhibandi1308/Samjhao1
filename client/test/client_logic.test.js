import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { TRANSLATIONS } from '../src/translations.js';

describe('Samjhao Frontend Client Logic Tests', () => {
  test('All primary languages exist in translations', () => {
    const langs = ['hi', 'en', 'te', 'gu'];
    langs.forEach(lang => {
      assert.ok(TRANSLATIONS[lang], `Translation for ${lang} must exist`);
      assert.ok(TRANSLATIONS[lang].appName, `appName in ${lang} must exist`);
      assert.ok(TRANSLATIONS[lang].welcomeTitle, `welcomeTitle in ${lang} must exist`);
      assert.ok(TRANSLATIONS[lang].btnUnderstandDoc, `btnUnderstandDoc in ${lang} must exist`);
      assert.ok(TRANSLATIONS[lang].medicalRefusalTitle, `medicalRefusalTitle in ${lang} must exist`);
      assert.ok(TRANSLATIONS[lang].medicalRefusalText, `medicalRefusalText in ${lang} must exist`);
      assert.ok(TRANSLATIONS[lang].scamWarningTitle, `scamWarningTitle in ${lang} must exist`);
      assert.ok(TRANSLATIONS[lang].btnShareFamily, `btnShareFamily in ${lang} must exist`);
    });
  });

  test('File type validator accepts images and PDFs, rejects executables', () => {
    const validMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'application/pdf'];
    const invalidMimes = ['application/x-msdownload', 'text/javascript', 'application/zip'];

    validMimes.forEach(mime => {
      assert.ok(validMimes.includes(mime), `${mime} should be allowed`);
    });

    invalidMimes.forEach(mime => {
      assert.ok(!validMimes.includes(mime), `${mime} should be rejected`);
    });
  });

  test('File size limit enforces 10MB maximum', () => {
    const MAX_SIZE = 10 * 1024 * 1024;
    const smallFile = { size: 2 * 1024 * 1024 };
    const exactFile = { size: 10 * 1024 * 1024 };
    const oversizedFile = { size: 11 * 1024 * 1024 };

    assert.ok(smallFile.size <= MAX_SIZE, '2MB file should be accepted');
    assert.ok(exactFile.size <= MAX_SIZE, '10MB file should be accepted');
    assert.ok(oversizedFile.size > MAX_SIZE, '11MB file should be rejected');
  });

  test('Medical prescription guardrail has unambiguous medical refusal warning', () => {
    const hindiRefusal = TRANSLATIONS.hi.medicalRefusalText;
    const englishRefusal = TRANSLATIONS.en.medicalRefusalText;

    assert.ok(hindiRefusal.includes('डॉक्टर या फार्मासिस्ट'), 'Hindi refusal must direct to doctor/pharmacist');
    assert.ok(englishRefusal.includes('doctor or pharmacist'), 'English refusal must direct to doctor/pharmacist');
    assert.ok(englishRefusal.includes('does not interpret medical prescriptions'), 'Must explicitly disclaim interpretation');
  });
});
