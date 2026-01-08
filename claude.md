# Legacy-XYZ: AI Voice Legacy Platform

## Project Context
Legacy-XYZ preserves user life stories through automated AI phone interviews. Users schedule recurring calls (approx. 6 mins) where an AI agent asks questions about their life. These conversations are recorded, transcribed, and archived to create a digital legacy.

## Tech Stack
- **Framework:** Next.js 16+ (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS 4
- **Voice/AI Provider:** Telnyx (Voice API + AI Assistant)
- **AI Backend:** OpenAI (via Telnyx integration)
- **State Management (Hot):** Upstash Redis (active call state & transcript buffering)
- **Database (Cold):** MongoDB/Mongoose (user profiles, schedules, final archives)
- **Authentication:** JWT (jose library) + bcrypt
- **Infrastructure:** Vercel (Serverless)

## Folder Structure
```
legacy-xyz/
├── app/                              # Next.js App Router
│   ├── api/                          # API Routes
│   │   ├── auth/
│   │   │   ├── login/route.ts        # POST - User login
│   │   │   └── register/route.ts     # POST - User registration
│   │   ├── make-call/route.ts        # POST - Initiate Telnyx call
│   │   └── webhooks/
│   │       └── telnyx/route.ts       # POST - Telnyx event handler
│   ├── admin/                        # Admin subdomain routes
│   │   ├── layout.tsx                # Admin layout
│   │   ├── page.tsx                  # Admin dashboard (protected)
│   │   └── login/page.tsx            # Admin login page
│   ├── layout.tsx                    # Root layout (Geist fonts)
│   ├── page.tsx                      # Home page (CallAgent)
│   └── globals.css                   # Tailwind + theme variables
├── core/                             # Core business logic
│   ├── auth/
│   │   ├── jwt.ts                    # JWT sign/verify (jose)
│   │   └── middleware.ts             # Auth middleware
│   └── db/
│       ├── connect-mongo.js          # MongoDB connection (cached)
│       └── models/
│           └── user.ts               # User schema (Mongoose)
├── components/
│   └── onboarding/
│       └── onboarding.tsx            # Call initiation UI
├── proxy.ts                          # Subdomain routing middleware
├── next.config.ts                    # Next.js configuration
└── tsconfig.json                     # TypeScript config (@/* alias)
```

## Subdomain Architecture
The app uses **subdomain-based routing** via custom middleware (`proxy.ts`):

| Subdomain | Routes To | Auth Required |
|-----------|-----------|---------------|
| `legacy-xyz.com` | `/app/*` | No |
| `admin.legacy-xyz.com` | `/app/admin/*` | Yes (JWT) |

**Local Development:**
- Root: `localhost:3000`
- Admin: `admin.localhost:3000`

**Vercel Preview:**
- Handles `admin---branch.vercel.app` pattern

**Public paths on admin subdomain:** `/login` only

## API Routes

### Authentication
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/auth/login` | POST | Email/password login, returns JWT cookie |
| `/api/auth/register` | POST | Create user + auto-login |

### Call Management
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/make-call` | POST | Initiate Telnyx call with AI prompt |
| `/api/webhooks/telnyx` | POST | Handle all Telnyx events |

### Telnyx Webhook Events Handled
1. `call.answered` - Force start recording + start AI assistant
2. `ai_assistant.transcription` - Real-time transcript chunks
3. `call.conversation_insights.generated` - AI summary
4. `call.recording.saved` - MP3 URL capture

## Database Models

### User (`core/db/models/user.ts`)
```typescript
{
  email: string;     // required, unique
  password: string;  // required, bcrypt hashed
  phone?: string;    // optional, unique, sparse
}
```

## Authentication Flow
1. User submits email/password
2. Server validates against bcrypt hash
3. JWT token (7-day expiry) set in httpOnly cookie
4. Middleware validates token on protected routes
5. Invalid tokens redirect to `/login`

**Security:**
- httpOnly cookies (XSS protection)
- secure flag in production
- sameSite: "lax" (CSRF protection)
- bcrypt salt rounds: 10

## Environment Variables
```bash
# Domain
NEXT_PUBLIC_ROOT_DOMAIN=legacy-xyz.com
NEXT_PUBLIC_BASE_URL=https://www.legacy-xyz.com

# Database
MONGO_URI=mongodb+srv://...

# Auth
JWT_SECRET=your-secret-key

# Telnyx
TELNYX_API_KEY=KEY...
TELNYX_PHONE_NUMBER=+1234567890

# OpenAI (used by Telnyx AI Assistant)
OPENAI_API_KEY=sk-...

# Upstash Redis
KV_REST_API_URL=https://...
KV_REST_API_TOKEN=...
KV_REST_API_READ_ONLY_TOKEN=...
KV_URL=redis://...
REDIS_URL=redis://...
```

## Architecture Patterns

### 1. The "Active Call" Flow
- **Initiation:** Calls triggered via `app/api/make-call`
- **State:** Redis stores transcript chunks (Vercel functions are stateless)
- **Webhooks:** All Telnyx events flow to `app/api/webhooks/telnyx`
- **Custom Header:** AI prompt passed via `X-AI-Prompt` header

### 2. Critical Telnyx "Gotchas" (DO NOT CHANGE)
- **Recording:** We MUST use the "Force Start" pattern. We explicitly send a `record_start` command inside the `call.answered` webhook. Relying on "Auto-record" dashboard settings is unreliable.
- **Dual Channel:** Always record with `channels: "dual"` to separate user/AI audio.
- **Webhook URL:** Post-call events often default to Portal URL, not session URL. Ensure Portal URL matches active environment.

### 3. Data Pipeline
- **Real-time:** `ai_assistant.transcription` events -> Append to Redis List
- **Post-call:**
    1. `call.hangup` -> Trigger cleanup
    2. `call.conversation_insights.generated` -> Capture AI summary
    3. `call.recording.saved` -> Capture MP3 URL
- **Finalization:** Once all 3 events received, move from Redis to MongoDB

### 4. MongoDB Connection Pattern
Uses cached connection for serverless (`core/db/connect-mongo.js`):
- Global cache survives hot reloads
- Connection pooling: `maxPoolSize: 120`
- Timeout: 120 seconds

## Coding Conventions

### TypeScript
- Strict mode enabled
- No `any` in core logic
- Path alias: `@/*` maps to project root

### Logging
Use emoji prefixes for serverless log readability:
- `🔔` Event received
- `🚀` Action started
- `🗣️` Transcript
- `💎` Insights/Summary
- `🎙️` Recording
- `❌` Error

### Components
- Client components marked with `"use client"`
- Tailwind for styling
- Geist fonts (sans/mono)

## Common Commands
```bash
npm run dev                    # Start local server
npx vercel env pull .env.local # Sync env vars from Vercel
```

## Key File Locations
| Purpose | Path |
|---------|------|
| Subdomain routing | `proxy.ts` |
| JWT utilities | `core/auth/jwt.ts` |
| Auth middleware | `core/auth/middleware.ts` |
| MongoDB connection | `core/db/connect-mongo.js` |
| User model | `core/db/models/user.ts` |
| Telnyx webhook handler | `app/api/webhooks/telnyx/route.ts` |
| Call initiation | `app/api/make-call/route.ts` |

## TODOs / Known Gaps
- Recording/summary/transcript persistence to MongoDB (webhook handler lines ~99-100)
- Schedule management UI
- User story archive viewer