# Samjhao (समझो) — Accessible AI Document Explanation

> **Neighborhood Hacks 2026 Submission**  
> *Your documents, made simple. Spoken in your language.*

[![Tests](https://img.shields.io/badge/tests-12%2F12%20passing-brightgreen)](#automated-testing)
[![Zero Storage](https://img.shields.io/badge/privacy-zero%20document%20storage-blue)](#privacy--zero-storage-guarantee)
[![License](https://img.shields.io/badge/license-MIT-green)](#license)

---

## 📖 The Problem

Millions of everyday citizens, elderly grandparents, non-native English speakers, and rural households struggle with official documents:
- **Complex utility bills**: Buried due dates, confusing surcharges, and unfamiliar tariff codes.
- **Deceptive scam messages**: Urgency-driven SMS claiming electricity cutoff tonight unless money is transferred immediately.
- **Official notices & receipts**: Jargon-heavy language that causes anxiety.

Many cannot read fine print or understand technical English. Existing AI tools often hallucinate numbers, invent facts, or expose personal uploaded documents to third-party databases.

---

## 💡 The Solution: Samjhao (समझो)

**Samjhao** is a mobile-first, highly accessible AI web application that transforms complex bills, receipts, and notices into simple, digestible explanations in the user's native language.

### 🌟 Key Highlights

1. **Native Spoken Audio (Read-Aloud)**: Uses the browser's native Web Speech API to read the entire explanation or individual cards aloud in **Hindi (हिन्दी)**, **Telugu (తెలుగు)**, **Gujarati (ગુજરાતી)**, or **English**, with a **0.8x slower playback speed** designed for elders.
2. **Prominent Key Information Cards**: Instant visibility on the three things that matter most:
   - **Total Due Amount** (e.g. ₹ 850)
   - **Payment Due Date** (e.g. 25 October 2024)
   - **Document Type** (e.g. Electricity Bill)
3. **Action-First Summaries**: Clear answer to *"What should I do?"* (e.g., *"Pay ₹850 before 25 October to avoid ₹50 late fee. If already paid via UPI, keep receipt."*).
4. **🔒 Zero Persistent Document Storage**: Uploads exist **strictly in RAM memory** during the request lifecycle and are never saved to disk, database, or persistent logs.
5. **🛡️ Responsible AI Guardrails**:
   - **Prescription Refusal**: Strictly refuses to interpret medical prescriptions or provide medical advice, directing users to doctors or pharmacists.
   - **Scam Detection**: Flags threats and urgency signals in screenshots without falsely certifying authenticity.
   - **Explicit Uncertainty**: If text is smudged or cut off, fields are tagged as `❓ Uncertain` rather than guessed.
6. **One-Click Sample Documents Tray**: Test instant real-world samples (Electricity Bill, Disconnection Scam SMS, Medical Prescription refusal) without needing a camera.

---

## 📐 Architecture & Walkthrough Flow

The application follows the 10-screen UX blueprint specified in [`assets/Samjhao Accessible App Walkthrough.png`](assets/Samjhao%20Accessible%20App%20Walkthrough.png):

```
[1. Choose Language] ──► [2. Welcome Screen] ──► [3. Choose Document Input]
                                                         │
   ┌─────────────────────────────────────────────────────┘
   ▼
[4. Capture / Select] ──► [5. Preview & Quality Check] ──► [6. Processing Animation]
                                                                  │
   ┌──────────────────────────────────────────────────────────────┘
   ▼
[7 & 8. Result Cards & Spoken Audio] ──► [9. Step-by-Step Help Guide]
                                     └──► [10. Error Recovery & Retake]
```

### Technology Stack

- **Frontend**: React 19, Vite, Vanilla CSS Design System (high-contrast, 48px touch targets, Google Fonts *Outfit* & *Noto Sans Devanagari*), Lucide icons.
- **Backend**: Node.js v24, Express, Multer (`memoryStorage`), dotenv, cors.
- **AI Multimodal Vision**: Official `@google/generative-ai` (Gemini Vision) with structured JSON validation and a deterministic offline fallback engine.
- **Voice Playback**: Browser Web Speech API (`SpeechSynthesis`) with localized voice matching and speed control.
- **Testing**: Built-in `node:test` suite for backend endpoints, schemas, and client logic.

---

## 🔒 Privacy & Zero-Storage Guarantee

- **No disk storage**: Documents are held as an in-memory buffer in Node.js RAM only during the API call.
- **No database retention**: No user records, names, or extracted text are persisted.
- **No frontend API keys**: API credentials reside exclusively on the server in `.env`.
- **Clean disposal**: In-memory buffers are dereferenced immediately after the response is sent.

---

## 🚀 Quickstart Guide

### 1. Prerequisites
- Node.js `v18+` (tested on Node `v24.15.0`)
- npm `v9+`

### 2. Installation
Clone the repository and install dependencies:

```bash
# Clone the repository
git clone https://github.com/your-username/samjhao.git
cd samjhao

# Install backend dependencies
cd server && npm install

# Install frontend dependencies
cd ../client && npm install
cd ..
```

### 3. Environment Configuration
Create a `.env` file in `server/`:

```bash
cp server/.env.example server/.env
```

Edit `server/.env`:
```env
PORT=5000
MAX_FILE_SIZE_MB=10

# Optional: Add your Google Gemini API key for live multimodal processing
# If left empty, Samjhao runs out-of-the-box in high-fidelity mock demo mode!
GEMINI_API_KEY=
```

> **Note**: If `GEMINI_API_KEY` is not provided, Samjhao automatically operates in **Offline Demo Mode**, allowing full offline verification of all flows, cards, audio, and error states without requiring API keys or credits.

### 4. Running the Development Server
From the project root:

```bash
# Starts both Express backend (port 5000) and Vite frontend (port 5173) concurrently
npm run dev
```

Open your browser to: **`http://localhost:5173`**

---

## 🧪 Automated Testing

Samjhao includes a comprehensive automated test suite covering safety guardrails, schema validation, HTTP endpoints, file constraints, and multilingual translations:

```bash
# Run the complete test suite (both backend and client)
npm test
```

### Test Coverage Highlights:
- **`server/test/api.test.js`**:
  - Supported languages validation (Hindi, English, Telugu, Gujarati)
  - Normalized schema contract enforcement
  - Medical prescription refusal safety guardrail
  - Blurry image fallback generation
  - In-memory offline analysis engine
- **`server/test/http.test.js`**:
  - `GET /api/health` status check
  - `GET /api/languages` language list
  - `POST /api/explain` multipart upload and structured JSON response
- **`client/test/client_logic.test.js`**:
  - Multilingual translation completeness
  - File format validation (JPG, PNG, WebP, PDF)
  - 10MB file size limit enforcement
  - Explicit medical disclaimer copy validation

---

## 📱 Mobile & Accessibility Features

- **Large Touch Targets**: Minimum 48px height across all buttons and inputs.
- **High Contrast**: WCAG AA/AAA compliant slate-on-white text tokens.
- **Audio First**: Every key section has a dedicated *"सुनें / Listen"* button.
- **Slower Playback**: 0.8x speech rate toggle for elderly users.
- **Bilingual Visuals**: Major headings display native script accompanied by clear Latin/English subtitles.

---

## ⚠️ Known Limitations & Future Work

1. **Browser Speech Synthesis Variations**: Speech quality and available native Indian voices vary across browser vendors and operating systems. (Future enhancement: Add an optional server-side TTS fallback like Google Cloud TTS / Bhashini API).
2. **Multi-page PDF OCR**: The initial version analyzes the first page of uploaded PDFs. Multi-page aggregation is planned for v2.0.
3. **Medical Prescriptions**: Intentionally unsupported to prevent patient harm or inaccurate drug administration.

---

## 🤝 Hackathon Compliance & AI Disclosure

- **Hackathon**: NEIGHBORHOOD HACKS 2026
- **Hacking Period Compliance**: All code, configurations, tests, and documentation were created during the official hackathon window.
- **AI Coding Assistant Disclosure**: An AI coding assistant (Google Antigravity) was utilized to assist with scaffolding, layout styling, and test generation in accordance with rule #13.

---

## 📄 License

MIT License. Designed and developed with care for community empowerment.
