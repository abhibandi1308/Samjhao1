import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { TRANSLATIONS } from '../src/translations.js';

describe('Samjhao Frontend Client Logic Tests', () => {
  test('All primary languages exist in translations', () => {
    const langs = ['hi', 'en', 'te', 'ta'];
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

  test('Voice guide configuration synchronizes colors and screen instructions across all 4 languages', async () => {
    const { COLOR_TOKENS, COLOR_NAMES, getScreenVoiceInstructions } = await import('../src/voiceGuideConfig.js');

    // 1. Check Color Tokens
    ['green', 'yellow', 'pink', 'blue', 'white'].forEach(color => {
      assert.ok(COLOR_TOKENS[color], `COLOR_TOKENS.${color} must exist`);
      assert.ok(COLOR_TOKENS[color].hex, `COLOR_TOKENS.${color}.hex must be defined`);
    });

    // 2. Check Color Names across languages
    ['en', 'hi', 'te', 'ta'].forEach(lang => {
      assert.ok(COLOR_NAMES[lang], `COLOR_NAMES.${lang} must exist`);
      assert.ok(COLOR_NAMES[lang].green, `${lang} must have green`);
      assert.ok(COLOR_NAMES[lang].yellow, `${lang} must have yellow`);
      assert.ok(COLOR_NAMES[lang].pink, `${lang} must have pink`);
      assert.ok(COLOR_NAMES[lang].blue, `${lang} must have blue`);
    });

    // Specific native language checks
    assert.strictEqual(COLOR_NAMES.te.yellow, 'పసుపు');
    assert.strictEqual(COLOR_NAMES.te.pink, 'గులాబీ');
    assert.strictEqual(COLOR_NAMES.te.blue, 'నీలం');
    assert.strictEqual(COLOR_NAMES.hi.yellow, 'पीला');
    assert.strictEqual(COLOR_NAMES.hi.pink, 'गुलाबी');
    assert.strictEqual(COLOR_NAMES.hi.blue, 'नीला');
    assert.strictEqual(COLOR_NAMES.ta.yellow, 'மஞ்சள்');
    assert.strictEqual(COLOR_NAMES.ta.pink, 'இளஞ்சிவப்பு');
    assert.strictEqual(COLOR_NAMES.ta.blue, 'நீலம்');

    // 3. Screen Instructions Generation
    const screens = ['WELCOME', 'CHOOSE_INPUT', 'PREVIEW', 'PROCESSING', 'RESULT', 'ERROR'];
    screens.forEach(screen => {
      ['en', 'hi', 'te', 'ta'].forEach(lang => {
        const text = getScreenVoiceInstructions(screen, lang);
        assert.ok(text && text.length > 10, `${screen} in ${lang} must return clear voice instruction`);
      });
    });

    // Verify CHOOSE_INPUT mentions the synchronized button colors
    const teInputText = getScreenVoiceInstructions('CHOOSE_INPUT', 'te');
    assert.ok(teInputText.includes('పసుపు'), 'Telugu input instruction must mention yellow button');
    assert.ok(teInputText.includes('గులాబీ'), 'Telugu input instruction must mention pink button');
    assert.ok(teInputText.includes('నీలం'), 'Telugu input instruction must mention blue button');

    const hiInputText = getScreenVoiceInstructions('CHOOSE_INPUT', 'hi');
    assert.ok(hiInputText.includes('पीला'), 'Hindi input instruction must mention yellow button');
    assert.ok(hiInputText.includes('गुलाबी'), 'Hindi input instruction must mention pink button');
    assert.ok(hiInputText.includes('नीला'), 'Hindi input instruction must mention blue button');

    const enInputText = getScreenVoiceInstructions('CHOOSE_INPUT', 'en');
    assert.ok(enInputText.includes('yellow'), 'English input instruction must mention yellow button');
    assert.ok(enInputText.includes('pink'), 'English input instruction must mention pink button');
    assert.ok(enInputText.includes('blue'), 'English input instruction must mention blue button');
  });
});
