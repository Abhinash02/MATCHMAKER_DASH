# 💘 TDC Matchmaker Dashboard — MVP

> An internal matchmaking tool for **The Date Crew** — manage client profiles, run compatibility algorithms, log interactions, and assign matches with AI-assisted intro emails.

## 🔗 Live Links & Demo Credentials

| | Link |
|---|---|
| **Frontend (Live App)** | [https://perfectpair-five.vercel.app/](https://perfectpair-five.vercel.app/) |
| **Backend API** | [https://backendmathc.vercel.app/](https://backendmathc.vercel.app/) |
| **GitHub Repo** | *(this repository)* |

### 🔑 Demo Login Credentials

| Role | Email | Password |
|---|---|---|
| Admin | `admin@tdc.com` | `Admin123` |
| Matchmaker | `matchmaker@tdc.com` | `Match123` |

> One-click login buttons are available on the login page for convenience.

## 📸 Features Overview

- ✅ JWT-based login with role-based access (`admin` / `matchmaker`)
- ✅ Customer dashboard with search, gender & status filters, pagination
- ✅ Create, edit, delete client profiles with rich field support
- ✅ Compatibility scoring algorithm (gender-specific, 0–100 scale)
- ✅ AI-powered: Bio generation, Partner Expectations, Intro Email drafting
- ✅ Interaction Log — notes by type (📝 General, 📞 Call, 🤝 Meeting, ✉️ Email)
- ✅ Sent Matches tracker per client
- ✅ 111 seeded dummy pool profiles for realistic matching
- ✅ Fully responsive UI (mobile → desktop)
- ✅ Premium animated loader, micro-interactions, and glassmorphism-style cards

## 🗂️ Project Structure

```
matchmaker/
├── README.md                   # This file
├── frontend/                   # Next.js 14 (App Router) client
└── backend/                    # Node.js + Express REST API
```

## 🖥️ Frontend

### Tech Stack

| Technology | Purpose |
|---|---|
| **Next.js 14** (App Router) | React framework, file-based routing |
| **React 18** | UI component library |
| **Tailwind CSS** | Utility-first responsive styling |
| **Axios** | HTTP client with interceptors |
| **React Hot Toast** | Toast notifications |
| **country-state-city** | Dynamic country/state/city dropdowns |

### Directory Structure

```
frontend/
├── public/
├── src/
│   ├── api/
│   │   └── client.js              # Axios instance with JWT interceptor & 401 redirect
│   ├── app/
│   │   ├── globals.css            # Global styles, Tailwind directives, custom utilities
│   │   ├── layout.jsx             # Root HTML layout
│   │   ├── page.jsx               # Root redirect → /login
│   │   ├── providers.jsx          # Auth context provider wrapper
│   │   ├── login/
│   │   │   └── page.jsx           # Login page (JWT auth, one-click demo login)
│   │   ├── signup/
│   │   │   └── page.jsx           # Staff signup page
│   │   ├── onboarding/
│   │   │   └── page.jsx           # Post-signup profile setup
│   │   └── (app)/                 # Protected route group (requires auth)
│   │       ├── layout.jsx         # Authenticated layout with sidebar
│   │       ├── dashboard/
│   │       │   └── page.jsx       # Main dashboard — stats, customer table, filters
│   │       ├── browse/
│   │       │   └── page.jsx       # Browse pool profiles
│   │       └── customers/
│   │           ├── new/
│   │           │   └── page.jsx   # Create new client profile
│   │           └── [id]/
│   │               ├── page.jsx   # Customer detail view (tabs: Profile, Matches, Sent, Logs)
│   │               └── edit/
│   │                   └── page.jsx # Edit existing profile
│   ├── components/
│   │   ├── Layout.jsx             # Sidebar + header layout with hamburger menu
│   │   ├── ProfileForm.jsx        # Shared multi-step form (create & edit)
│   │   ├── NoteLog.jsx            # Interaction log (CRUD notes with type filters)
│   │   ├── MatchCard.jsx          # Match result card with score, AI intro, send action
│   │   ├── LocationSelect.jsx     # Dynamic Country → State → City dropdowns
│   │   ├── CustomSelect.jsx       # Reusable styled select component
│   │   └── Loader.jsx             # Premium animated spinner with heart pulse
│   ├── context/
│   │   └── AuthContext.jsx        # Auth state (user, token, login, logout)
│   └── utils/
│       └── format.js              # Helpers: formatAge, formatIncome, formatDate, statusColor, etc.
├── .env.development               # NEXT_PUBLIC_API_URL for local dev
├── next.config.mjs
├── tailwind.config.js
└── vercel.json                    # Vercel deployment config (no rewrites for Next.js)
```

### Key Design Decisions — Frontend

- **App Router** — Uses Next.js 14's App Router with a `(app)` route group for protected pages, keeping auth pages separate without nesting.
- **JWT in `localStorage`** — Axios interceptor reads the token on every request and automatically redirects to `/login` on 401 responses.
- **Single `ProfileForm`** — Both Create and Edit pages share one form component; the `mode` prop toggles between create/edit behavior.
- **Dynamic City Dropdown** — `LocationSelect.jsx` uses the `country-state-city` package to populate cities based on selected state, avoiding a full API call.
- **Responsive Layout** — Sidebar collapses into a slide-over drawer on mobile (hamburger trigger). All cards, tables, and grids adapt across breakpoints.

### Environment Variables

```env
# frontend/.env.development
NEXT_PUBLIC_API_URL=http://localhost:4000/api

# frontend/.env.production (Vercel)
NEXT_PUBLIC_API_URL=https://backendmathc.vercel.app/api
```

### Running Locally

```bash
cd frontend
npm install
npm run dev        # http://localhost:3000
```

## ⚙️ Backend

### Tech Stack

| Technology | Purpose |
|---|---|
| **Node.js** | JavaScript runtime |
| **Express.js** | Web framework & routing |
| **Mongoose** | MongoDB ODM |
| **MongoDB Atlas** | Cloud database |
| **bcryptjs** | Password hashing |
| **jsonwebtoken** | JWT auth tokens |
| **morgan** | HTTP request logging |
| **OpenAI SDK** | AI bio & intro generation |
| **dotenv** | Environment config |
| **nodemon** | Dev auto-restart |

### Directory Structure

```
backend/
├── src/
│   ├── server.js                  # Entry point — connects DB, starts Express server
│   ├── app.js                     # Express app setup, middleware, route mounting, CORS
│   ├── seed.js                    # Database seed script (staff users + 100 pool profiles)
│   ├── config/
│   │   └── db.js                  # Mongoose connection helper
│   ├── models/
│   │   ├── User.js                # Staff user schema (name, email, password hash, role)
│   │   ├── Customer.js            # Full matrimonial profile schema (50+ fields)
│   │   └── Note.js                # Interaction note schema (content, type, customerId)
│   ├── controllers/
│   │   ├── authController.js      # login, register handlers
│   │   ├── customerController.js  # CRUD for client profiles
│   │   ├── matchController.js     # Run matching algo, send/store match
│   │   ├── noteController.js      # CRUD for interaction notes
│   │   ├── aiController.js        # OpenAI: bio, expectations, intro email
│   │   └── statsController.js     # Dashboard stats (totals, counts)
│   ├── routes/
│   │   ├── authRoutes.js          # POST /api/auth/login, /register
│   │   ├── customerRoutes.js      # GET/POST/PATCH/DELETE /api/customers
│   │   ├── matchRoutes.js         # GET /api/matches/:id, POST /api/matches/:id
│   │   ├── noteRoutes.js          # GET/POST/PATCH/DELETE /api/notes
│   │   ├── aiRoutes.js            # POST /api/ai/generate-bio, /generate-intro
│   │   └── statsRoutes.js         # GET /api/stats
│   ├── middleware/
│   │   ├── authMiddleware.js      # JWT verification middleware (protect routes)
│   │   └── errorMiddleware.js     # Global error handler, 404 handler
│   └── lib/
│       └── matching.js            # Core compatibility scoring algorithm
├── .env                           # Environment variables (never committed)
├── package.json
└── vercel.json                    # Vercel serverless function config
```
### API Reference

#### Auth
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register a new staff user |
| `POST` | `/api/auth/login` | Public | Login, returns JWT token |

#### Customers
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/customers` | 🔒 Auth | List all profiles (search, filter, paginate) |
| `POST` | `/api/customers` | 🔒 Auth | Create a new client profile |
| `GET` | `/api/customers/:id` | 🔒 Auth | Get a single customer by ID |
| `PATCH` | `/api/customers/:id` | 🔒 Auth | Update customer fields |
| `DELETE` | `/api/customers/:id` | 🔒 Auth | Delete a customer profile |

#### Matching
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/matches/:id` | 🔒 Auth | Run algorithm, return top-scored pool matches |
| `POST` | `/api/matches/:id` | 🔒 Auth | Save a match as sent (stores on customer record) |

#### Notes (Interaction Log)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/notes/:customerId` | 🔒 Auth | List all notes for a customer |
| `POST` | `/api/notes` | 🔒 Auth | Create a new note |
| `PATCH` | `/api/notes/:id` | 🔒 Auth | Edit a note |
| `DELETE` | `/api/notes/:id` | 🔒 Auth | Delete a note |

#### AI
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/ai/generate-bio` | 🔒 Auth | Generate a bio from profile fields |
| `POST` | `/api/ai/generate-expectations` | 🔒 Auth | Generate partner expectations text |
| `POST` | `/api/ai/generate-intro` | 🔒 Auth | Draft intro email for a match |

#### Stats
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/stats` | 🔒 Auth | Dashboard stats (total, active, matched, matchesSent) |

### Database Models

#### `User`
```
name, email (unique), password (hashed), role (admin | matchmaker), timestamps
```
#### `Customer`
```
firstName, lastName, gender, dateOfBirth, height
email, phone, city, state, country
degree, undergraduateCollege, educationTier (premium | good | average)
designation, currentCompany, income
maritalStatus, wantKids, haveKids, openToRelocate, openToPets
diet, smoking, drinking
religion, caste, manglik, familyType, motherTongue
languagesKnown[], hobbies[], siblings
aboutMe, partnerExpectations
profileType (client | pool), status (active | pending | matched | inactive)
matchesSent, sentMatches[]
```
#### `Note`
```
customerId (ref: Customer), content, type (general | call | meeting | email), timestamps
```
### Environment Variables

```env
# backend/.env
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/matchmaker
JWT_SECRET=your_jwt_secret_here
OPENAI_API_KEY=sk-...
PORT=4000
CLIENT_URL=http://localhost:3000,https://perfectpair-five.vercel.app
NODE_ENV=development
```

### Running Locally

```bash
cd backend
npm install
npm run dev        # http://localhost:4000
```
### Seeding the Database

```bash
cd backend
npm run seed
```

This will:
- Create `admin@tdc.com` (Admin123) and `matchmaker@tdc.com` (Match123) if they don't exist
- Add up to 100 pool profiles (25 male + 25 female per run) if pool count < 100
- **Safe to re-run** — skips existing users and profiles
---

## 🧠 Matching Algorithm

Located at `backend/src/lib/matching.js`. Scores each pool profile from **0–100** based on gender-specific and general compatibility criteria.

### Male Client → Female Pool Matches

| Criterion | Points |
|---|---|
| Age gap: female 1–5 yrs younger | +20 |
| Age gap: female 5–10 yrs younger | +10 |
| Female is shorter | +15 |
| Female earns less (financial dynamic) | +20 |
| Female is financially independent | +5 |
| Both want/don't want kids | +15 |

### Female Client → Male Pool Matches

| Criterion | Points |
|---|---|
| Age gap: male 1–5 yrs older | +15 |
| Age gap: male 5–10 yrs older | +8 |
| Male has equal or higher education tier | +20 |
| Male earns equal or more | +10 |
| Either partner open to relocate | +15 |
| Same family type preference | +15 |

### General Criteria (All)

| Criterion | Points |
|---|---|
| Same religion | +10 |
| Same caste | +5 |
| Same diet | +5 |
| Matching smoking/drinking habits | +5 |

### Score Labels

| Score | Label |
|---|---|
| 85–100 | 🌟 Exceptional Match |
| 70–84 | 💙 High Potential |
| 55–69 | 💛 Good Match |
| 40–54 | ⬜ Possible Match |
| 0–39 | ❌ Low Match |

---

## 🤖 AI Integrations

All powered by **OpenAI `gpt-4o-mini`** via the OpenAI Node.js SDK.

| Feature | Trigger | What It Does |
|---|---|---|
| **Bio Generation** | "Generate with AI" on profile form | Creates a warm, first-person bio from profile fields (location, career, hobbies) |
| **Partner Expectations** | "Generate with AI" on profile form | Writes a natural partner expectations paragraph based on lifestyle and values |
| **Intro Email** | "✨ Generate with AI" on MatchCard | Drafts a personalized introduction email citing specific compatibility reasons |


## 🚀 Deployment

Both apps are deployed on **Vercel**.

### Backend (`/backend/vercel.json`)
```json
{
  "version": 2,
  "builds": [{ "src": "src/server.js", "use": "@vercel/node" }],
  "routes": [{ "src": "/(.*)", "dest": "src/server.js" }]
}
```

### Frontend
Standard Next.js Vercel deployment — no custom `vercel.json` rewrites needed (Next.js handles its own routing).

**Environment variables** must be set in the Vercel dashboard for both projects:
- Backend: `MONGODB_URI`, `JWT_SECRET`, `OPENAI_API_KEY`, `CLIENT_URL`
- Frontend: `NEXT_PUBLIC_API_URL`

---
## 📋 Assumptions

- Matchmakers work collaboratively — any staff can view all profiles, log notes, and run the matching algorithm.
- `profileType: 'client'` = real TDC customer on the dashboard; `profileType: 'pool'` = dummy profiles used for matching.
- Fields like **Manglik status**, **Caste**, **Mother Tongue**, **Family Type**, and **Dietary preference** are treated as first-class matching fields relevant to Indian matrimonial culture.
- A "sent match" is a one-way action — the matchmaker sends the proposal; tracking the outcome is outside the MVP scope.
