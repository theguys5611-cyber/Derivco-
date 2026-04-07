# MzansiBuilds

> A platform where South African developers **build in public** — share projects, track milestones, and connect with the community.

![Stack](https://img.shields.io/badge/Frontend-Vue%203-42b883?style=flat-square)
![Stack](https://img.shields.io/badge/Backend-Node.js%20%2F%20Express-339933?style=flat-square)
![Stack](https://img.shields.io/badge/Database-Firebase%20Firestore-FFCA28?style=flat-square&logoColor=black)
![Stack](https://img.shields.io/badge/Auth-Firebase%20Auth-FF6F00?style=flat-square)

---

## What is MzansiBuilds?

MzansiBuilds is a community platform that helps developers build openly and keep up with what other developers are building across South Africa. Everything built here is built in public — no private mode.

### Core Features

- **Developer Accounts** — Register and manage your profile via email/password or Google OAuth
- **Project Feed** — A live feed of what developers are currently building, filterable by stage
- **Project Creation** — Share your project with title, description, stage, tech stack, support needed, and an AI-generated logo
- **Milestone Tracking** — Log and display progress milestones on your projects
- **Comments** — Community members can leave feedback directly on any project
- **Collaboration Requests** — Developers can "raise their hand" to contribute to a project
- **Celebration Wall** — Completed projects are immortalised for all to see
- **AI Logo Generation** — Automatically generate a project logo using the Gemini API

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Vue 3 (Composition API), Vue Router, Pinia |
| Backend | Node.js, Express |
| Database | Firebase Firestore |
| Authentication | Firebase Auth (Email + Google OAuth) |
| AI | Google Gemini API (logo generation) |
| Build Tool | Vite |

---

## Project Structure

```
mzansibuilds/
├── client/                  # Vue 3 frontend
│   ├── src/
│   │   ├── views/           # Page components
│   │   │   ├── HomeView.vue
│   │   │   ├── AuthView.vue
│   │   │   ├── FeedView.vue
│   │   │   ├── NewProjectView.vue
│   │   │   ├── EditProjectView.vue
│   │   │   ├── ProjectDetailView.vue
│   │   │   ├── DashboardView.vue
│   │   │   └── CelebrationWallView.vue
│   │   ├── components/      # Reusable components
│   │   │   └── ProjectCard.vue
│   │   ├── stores/          # Pinia state management
│   │   │   ├── auth.js
│   │   │   └── projects.js
│   │   ├── firebase/        # Firebase config & API client
│   │   │   ├── config.js
│   │   │   └── api.js
│   │   ├── router/
│   │   │   └── index.js
│   │   ├── App.vue
│   │   └── main.js
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── server/                  # Express backend
    ├── routes/
    │   ├── projects.js      # CRUD + milestones, comments, collaboration
    │   ├── users.js         # User profiles
    │   ├── feed.js          # Live feed & celebration wall
    │   └── logo.js          # AI logo generation
    ├── middleware/
    │   └── auth.js          # Firebase token verification
    ├── index.js             # Server entry point
    └── package.json
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- A Firebase project (Firestore + Authentication enabled)
- A Google Gemini API key

---

### 1. Clone the repository

```bash
git clone https://github.com/theguys5611-cyber/Derivco-.git
cd Derivco-
```

---

### 2. Set up the Server

```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory:

```env
PORT=3000
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-client-email@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GEMINI_API_KEY=your-gemini-api-key
```

> You can find your Firebase Admin credentials in the Firebase Console under **Project Settings → Service Accounts → Generate new private key**.

Start the server:

```bash
node index.js
```

The server runs on `http://localhost:3000`.

---

### 3. Set up the Client

```bash
cd client
npm install
```

Create a `.env` file in the `client/` directory:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_API_BASE_URL=http://localhost:3000
```

> Your Firebase web app config is available in the Firebase Console under **Project Settings → Your apps**.

Start the development server:

```bash
npm run dev
```

The client runs on `http://localhost:5173`.

---

## API Endpoints

### Projects
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/projects` | No | Get all projects |
| GET | `/api/projects/:id` | No | Get a single project |
| POST | `/api/projects` | Yes | Create a new project |
| PATCH | `/api/projects/:id` | Yes | Update a project |
| DELETE | `/api/projects/:id` | Yes | Delete a project |
| POST | `/api/projects/:id/complete` | Yes | Mark project as complete |
| POST | `/api/projects/:id/milestones` | Yes | Add a milestone |
| POST | `/api/projects/:id/comments` | Yes | Add a comment |
| POST | `/api/projects/:id/collaborate` | Yes | Submit a collaboration request |

### Feed
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/feed` | No | Get live feed of active projects |
| GET | `/api/feed/celebration` | No | Get celebration wall entries |

### Users
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/users/:uid` | No | Get a user profile |
| POST | `/api/users/profile` | Yes | Create or update user profile |
| GET | `/api/users/:uid/projects` | No | Get all projects by a user |

### Logo
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/logo/generate` | Yes | Generate an AI SVG logo for a project |

---

## Firebase Setup

### Firestore Collections

The app uses the following Firestore collections:

- **`projects`** — All project documents
- **`users`** — User profile documents
- **`celebrationWall`** — Entries for completed projects

### Firestore Indexes

Some queries require composite indexes. If you see an index error in the console, Firebase will provide a direct link to create the required index.

### Authentication

Enable the following providers in Firebase Console under **Authentication → Sign-in method**:
- Email/Password
- Google

---

## User Journey

1. **Register or sign in** via the `/auth` page
2. **Browse the feed** at `/feed` to see what others are building
3. **Create a project** at `/projects/new` — fill in your details and optionally generate an AI logo
4. **Track progress** by adding milestones to your project as you build
5. **Engage with the community** — comment on projects or raise your hand to collaborate
6. **Mark your project complete** — it will appear on the Celebration Wall at `/celebration`

---

## Design

- **Theme:** Green, white, and black
- **Typography:** Display font for headings, system font for body
- **Responsive:** Mobile-friendly layouts across all views

---

## Ethical Use of AI

AI tools were used as a development companion in building this application. All architectural decisions, logic, and implementation were guided by the developer's own understanding and thinking. AI assistance was used to accelerate, not replace, the development process.

---

## Author

**Faiq Ebrahim**  
Derivco Graduate Programme — Code Skills Challenge  
Deadline: 11 April 2026
