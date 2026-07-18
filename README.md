# ScamShield AI

**Think before you click. Verify before you trust.**

ScamShield AI is a production-minded full-stack safety companion for reviewing suspicious messages, screenshots, links, emails, job offers, and online-payment situations. It combines deterministic checks with OpenAI's Responses API and GPT-5 Mini to provide explainable, safety-first guidance.

## Highlights

- Screenshot OCR for PNG, JPG, and JPEG uploads up to 10 MB
- Structured scam analysis with probability, risk, confidence, category, summary, explanation, and red flags
- Personalized protection guidance, safe reply drafting, report copy, and PDF export
- Advanced URL, email, and job-offer detection with deterministic signals and AI analysis
- AI Safety Coach for phishing, OTP, UPI, QR, courier, job, investment, and family-safety questions
- Scam Awareness Hub covering banking, UPI, QR, job, investment, courier, lottery, social media, OTP, and shopping scams
- Browser-local analysis history with search, filtering, deletion, dashboard analytics, and privacy controls
- Global search, system/light/dark themes, animation preference, keyboard access, focus states, contrast support, and responsive layouts

## Visual Tour

Run the application locally and visit these complete product screens:

| Screen | Route | Purpose |
| --- | --- | --- |
| Landing | `/` | Product introduction and core capabilities |
| Dashboard | `/dashboard` | Local analysis metrics and activity timeline |
| Workspace | `/app` | Screenshot OCR, message analysis, protection center, and report |
| Advanced Detection | `/advanced` | URL, email, and job-offer analysis |
| AI Safety Coach | `/coach` | Current-session safety Q&A with Markdown answers |
| Awareness Hub | `/awareness` | Scam-pattern education and prevention tips |
| Analysis History | `/history` | Searchable, filterable, browser-local analysis records |
| Settings | `/settings` | Theme, motion, privacy, and version controls |

## Architecture

```text
React + Vite client
  ├─ Local-only preferences and analysis history
  ├─ Axios API client
  ├─ Lazy-loaded routes and reusable state hooks
  └─ Accessible UI, PDF export, and safety education content
                 │
                 ▼
Spring Boot API
  ├─ DTO validation and global exception handling
  ├─ OCR, analysis, protection, advanced detection, and chat services
  ├─ Deterministic URL, email, and job-scam checks
  └─ OpenAI Responses API client with strict JSON parsing
                 │
                 ▼
OpenAI Responses API
  └─ GPT-5 Mini, `store: false`, strict response schemas
```

## Project Structure

```text
ScamShield/
├── backend/
│   ├── src/main/java/com/scamshield/
│   │   ├── ai/            OpenAI configuration, prompts, parsing, service client
│   │   ├── controller/    REST endpoints
│   │   ├── dto/           Request and response contracts
│   │   ├── service/       Application services and implementations
│   │   └── util/          Image, URL, domain, and rule-signal validation
│   ├── Dockerfile         Production backend image
│   └── .env.example       Safe environment-variable template
├── frontend/
│   ├── src/
│   │   ├── components/    Shared cards, navigation, dialogs, and loading UI
│   │   ├── contexts/      Local history and app preferences
│   │   ├── data/          Awareness Hub content
│   │   ├── hooks/         API, chat, upload, theme, and UI state hooks
│   │   ├── pages/         Route-level screens
│   │   ├── services/      Axios request services
│   │   └── utils/         Clipboard, PDF, formatting, and validation helpers
│   ├── .env.example       Public frontend variable template
│   └── vercel.json        SPA route rewrite for Vercel
├── render.yaml            Render backend Blueprint with secret-safe variables
└── .gitignore             Prevents secrets, keys, build output, and local files
```

## Technology Stack

| Area | Technologies |
| --- | --- |
| Frontend | React 19, TypeScript, Vite, Tailwind CSS, React Router, Axios |
| UI | Framer Motion, Lucide React, React Markdown, React Hot Toast, jsPDF |
| Backend | Java 21, Spring Boot 3.5, Maven, Spring Validation, Jackson, Lombok |
| AI | OpenAI Responses API with GPT-5 Mini and strict JSON schemas |
| Deployment | Vercel for the frontend, Render Docker web service for the backend |

## API Reference

All successful endpoints return:

```json
{
  "success": true,
  "message": "Human-readable status",
  "data": {}
}
```

| Method | Endpoint | Request | Purpose |
| --- | --- | --- | --- |
| `GET` | `/api/v1/health` | None | Deployment health check |
| `POST` | `/api/v1/ai/extract-text` | Multipart `image` | OCR a supported screenshot |
| `POST` | `/api/v1/scam/analyze` | `{ "text": "..." }` | Analyze a suspicious message |
| `POST` | `/api/v1/scam/protection` | Analysis context | Generate safety steps and a report |
| `POST` | `/api/v1/scam/url-analysis` | `{ "url": "..." }` | Analyze one or more URLs safely |
| `POST` | `/api/v1/scam/email-analysis` | Sender, subject, body | Analyze a suspicious email |
| `POST` | `/api/v1/scam/job-analysis` | `{ "message": "..." }` | Analyze a job offer |
| `POST` | `/api/v1/chat` | `{ "message": "..." }` | Ask the AI Safety Coach |

### AI Safety Coach

`POST /api/v1/chat`

```json
{
  "message": "What should I do if a caller asks for my OTP?"
}
```

```json
{
  "success": true,
  "message": "Safety Coach response generated",
  "data": {
    "answer": "## Stay safe\n\n- End the call.\n- Never share an OTP.\n- Contact the bank using the number on your card."
  }
}
```

The backend requests live OpenAI output; it does not contain mocked AI responses. The Safety Coach prompt rejects harmful assistance and instructs the model not to request credentials, OTPs, PINs, account numbers, or private links.

## Environment Variables

Use the example files as local references, then add values outside Git:

```bash
cp frontend/.env.example frontend/.env
```

Vite reads `frontend/.env` during local development. The Spring Boot backend reads variables from your shell, IDE run configuration, or hosting platform; use `backend/.env.example` as the safe list of names to configure.

### Backend

| Variable | Required | Purpose |
| --- | --- | --- |
| `OPENAI_API_KEY` | Yes | Secret OpenAI API key. Never expose it to the frontend or commit it. |
| `OPENAI_MODEL` | No | Defaults to `gpt-5-mini`. |
| `OPENAI_BASE_URL` | No | Defaults to `https://api.openai.com/v1`. |
| `OPENAI_TIMEOUT_SECONDS` | No | Defaults to `45`. |
| `SCAMSHIELD_ALLOWED_ORIGINS` | Production | Comma-separated frontend origins allowed by CORS. |

### Frontend

| Variable | Required | Purpose |
| --- | --- | --- |
| `VITE_API_BASE_URL` | Yes | Public URL of the deployed Spring Boot API. Do not put OpenAI keys in Vite variables. |

## Local Development

### Prerequisites

- Java 21
- Maven 3.9+
- Node.js 20.19+ or 22.12+
- npm
- An OpenAI API key with GPT-5 Mini access

### Start the Backend

```bash
cd backend
export OPENAI_API_KEY="your_key_here"
mvn spring-boot:run
```

The API runs at `http://localhost:8080`.

### Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

The client runs at `http://localhost:5173`.

### Validate

```bash
cd backend && mvn test
cd frontend && npm run build
```

## Deployment

### Backend on Render

1. Push the repository without `.env` files or real credentials.
2. In Render, create a new Blueprint from this repository. The root `render.yaml` uses the backend Dockerfile because Java is deployed through Render's Docker runtime.
3. During the Blueprint setup, provide `OPENAI_API_KEY` only in Render's secure environment-variable UI.
4. Set `SCAMSHIELD_ALLOWED_ORIGINS` to the exact Vercel production URL, for example `https://your-project.vercel.app`.
5. Deploy and copy the resulting Render HTTPS URL.

`render.yaml` declares `OPENAI_API_KEY` with `sync: false`, so the secret is never stored in the repository. Render's Blueprint documentation also recommends keeping secret values out of the YAML file. [Render Blueprint reference](https://render.com/docs/blueprint-spec) and [Render environment-variable guidance](https://render.com/docs/configure-environment-variables) describe this setup.

### Frontend on Vercel

1. Import this repository into Vercel and set the project Root Directory to `frontend`.
2. Use `npm run build` as the build command and `dist` as the output directory.
3. Add `VITE_API_BASE_URL` with the Render backend URL. This is public configuration, not a secret.
4. Deploy, then update Render CORS with the deployed Vercel URL.

`frontend/vercel.json` rewrites client-side routes to `index.html`, which is required for direct visits to React Router paths such as `/coach` or `/history`. [Vercel's SPA rewrite guidance](https://examples.vercel.com/kb/guide/why-is-my-deployed-project-giving-404) explains this behavior.

## Security and Privacy

- `.gitignore` excludes `.env`, credential-like files, certificates, keystores, private keys, build output, PDFs, and IDE state.
- `backend/.dockerignore` prevents local environment files from entering the deployment image.
- The OpenAI key is read only by the backend through `OPENAI_API_KEY`.
- OpenAI Responses API requests use `store: false`.
- Frontend analysis history, theme preference, and animation preference are stored only in the current browser's local storage.
- Do not paste passwords, OTPs, PINs, CVVs, recovery codes, complete card numbers, or API keys into the app.

## Completed Checklist

- [x] OCR screenshot workflow and editable extracted text
- [x] Structured scam analysis and protection center
- [x] Downloadable scam report
- [x] Advanced URL, email, and job-offer checks
- [x] AI Safety Coach with live strict-JSON responses
- [x] Awareness Hub with ten scam categories
- [x] Local history, filtering, dashboard, and global search
- [x] Theme, system preference, animation toggle, accessibility, and responsive UI polish
- [x] Vercel and Render deployment configuration without committed secrets

## Future Improvements

- Optional authenticated, encrypted cross-device history
- Regional reporting links and incident-report templates
- Browser extension for link warnings before navigation
- More languages and accessibility localization
- Automated end-to-end tests and CI deployment checks

## License

No license has been selected for this repository yet. Choose and add a license before public reuse or distribution.
