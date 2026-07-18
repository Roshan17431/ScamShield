# ScamShield AI

Think Before You Click. Verify Before You Trust.

ScamShield AI is a Phase 3 full-stack application for reviewing suspicious content before taking action. Users can upload a suspicious screenshot for OpenAI Vision OCR or paste a message, receive a structured GPT-5 Mini scam-risk assessment, and get AI-powered guidance for safer next steps.

## Features

- Premium responsive React interface with dark mode support
- Screenshot upload with drag and drop, preview, replace, remove, and validation
- PNG, JPG, and JPEG validation up to 10 MB
- OpenAI Responses API vision request for OCR-only extraction
- Editable extracted text with character count, copy, and clear actions
- AI-powered scam analysis for extracted OCR text or pasted text
- Structured risk level, scam probability, confidence, category, summary, explanation, and red flags
- Animated risk meter, accessible loading state, request cancellation, and input locking while analysis runs
- Personalized Protection Center with recommended actions, prevention tips, and similar scam examples
- Editable Safe Reply Generator with one-click copy and regeneration
- Professional scam report with copy and downloadable `ScamShield_Report.pdf` export
- Spring Boot API with DTOs, services, validation, and global exception handling
- Environment-only OpenAI configuration with no hardcoded keys

## Tech Stack

**Frontend**

- React 19
- Vite
- TypeScript
- Tailwind CSS
- React Router DOM
- Axios
- Framer Motion
- Lucide React
- React Hot Toast
- jsPDF

**Backend**

- Java 21
- Spring Boot 3.5+
- Maven
- Spring Web
- Spring Validation
- Lombok
- Jackson
- OpenAI Responses API

## Architecture

```text
frontend/
  src/
    assets/       Generated project assets
    components/   Reusable UI components
    hooks/        Upload, theme, OCR, scam analysis, and protection state
    layouts/      Shared app shell
    pages/        Landing and workspace pages
    services/     Axios API clients and OpenAI-backed requests
    types/        Shared TypeScript contracts
    utils/        Browser-side validation, clipboard, and PDF report helpers

backend/
  src/main/java/com/scamshield/
    ai/           OpenAI config, prompt builder, service, parser
    config/       CORS and web config
    controller/   REST endpoints
    dto/          Response DTOs
    exception/    Global error handling
    model/        Domain models
    service/      Application service interfaces
    service/impl/ Application service implementations
    util/         Validation utilities
```

## API

### OCR Extraction

`POST /api/v1/ai/extract-text`

Multipart form data:

- `image`: PNG, JPG, or JPEG screenshot, maximum 10 MB

Success response:

```json
{
  "success": true,
  "message": "Text extracted successfully",
  "data": {
    "extractedText": "Dear Customer, your SBI account has been blocked..."
  }
}
```

### Scam Analysis

`POST /api/v1/scam/analyze`

Request body:

```json
{
  "text": "Dear customer, your SBI account has been blocked. Verify immediately at http://secure-bank-login.xyz"
}
```

### Protection Advice

`POST /api/v1/scam/protection`

Request body:

```json
{
  "message": "Dear customer, your SBI account has been blocked. Verify immediately at http://secure-bank-login.xyz",
  "riskLevel": "CRITICAL",
  "category": "Banking Phishing",
  "redFlags": [
    "Creates urgency",
    "Suspicious website",
    "Requests account verification"
  ]
}
```

Success response:

```json
{
  "success": true,
  "message": "Protection advice generated successfully",
  "data": {
    "recommendedActions": [
      "Do not click the link.",
      "Use the bank's official website or number to verify the message.",
      "Block and report the sender."
    ],
    "safeReply": "I will verify this independently through the official bank website.",
    "preventionTips": [
      "Banks do not request OTPs through unsolicited messages.",
      "Type official website addresses directly into your browser."
    ],
    "similarScams": [
      "Fake KYC Update",
      "Account Suspension"
    ],
    "report": {
      "riskLevel": "CRITICAL",
      "category": "Banking Phishing",
      "redFlags": ["Creates urgency"],
      "recommendedActions": ["Do not click the link."],
      "preventionTips": ["Type official website addresses directly into your browser."],
      "generatedAt": "2026-07-19T00:00:00Z"
    }
  }
}
```

The frontend combines this protection data with the Phase 2 analysis to render the Scam Report and export a professional PDF named `ScamShield_Report.pdf`.

Success response:

```json
{
  "success": true,
  "message": "Message analyzed successfully",
  "data": {
    "riskLevel": "CRITICAL",
    "scamProbability": 98,
    "confidence": 96,
    "category": "Banking Phishing",
    "summary": "This message is highly likely to be a phishing attempt.",
    "explanation": "The message impersonates a bank, creates urgency, and directs users to a suspicious website.",
    "redFlags": [
      "Creates urgency",
      "Suspicious website",
      "Requests account verification",
      "Impersonates a bank"
    ]
  }
}
```

## Environment Variables

Backend variables:

```bash
OPENAI_API_KEY=replace_with_your_openai_api_key
OPENAI_MODEL=gpt-5-mini
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_TIMEOUT_SECONDS=45
SCAMSHIELD_ALLOWED_ORIGINS=http://localhost:5173
```

Frontend variables:

```bash
VITE_API_BASE_URL=http://localhost:8080
```

Use `backend/.env.example` and `frontend/.env.example` as templates. Do not commit real `.env` files, API keys, tokens, credentials, or private keys.

## Installation

Prerequisites:

- Java 21
- Maven 3.9+
- Node.js 20.19+ or 22.12+
- npm
- OpenAI API key with access to `gpt-5-mini`

## Running Backend

```bash
cd backend
export OPENAI_API_KEY=your_key_here
mvn spring-boot:run
```

Backend runs on `http://localhost:8080`.

## Running Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

## Build

Backend:

```bash
cd backend
mvn test
```

Frontend:

```bash
cd frontend
npm run build
```

## Phase Scope

Implemented in Phase 1:

- Screenshot upload
- OpenAI Vision OCR
- Extracted text display and editing
- Paste-message workspace

Implemented in Phase 2:

- OpenAI Responses API scam analysis with GPT-5 Mini
- Structured JSON output validated by the backend
- Scam probability, confidence score, risk level, supported category, summary, explanation, and red flags
- Premium animated analysis card for OCR or pasted text

Implemented in Phase 3:

- AI-powered Protection Center triggered after scam analysis
- Recommended actions, prevention tips, and similar scam examples
- Editable Safe Reply Generator with copy and regenerate actions
- Structured Scam Report with risk details, detected red flags, actions, and generated time
- Copyable reports and professional `ScamShield_Report.pdf` export

Not implemented in this phase:

- URL analysis
- Email analysis
- Job scam detection
- Chatbot
- Dashboard
