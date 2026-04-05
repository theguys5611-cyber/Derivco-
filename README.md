# MzansiBuilds

A platform for South African developers to build in public. Share your projects, track milestones, collaborate, and celebrate completions.

## Tech Stack

- **Frontend:** Vue 3 + Vite + Pinia + Vue Router
- **Backend:** Node.js + Express
- **Database & Auth:** Firebase (Firestore + Authentication)
- **Theme:** Green, white and black

---

## Project Structure

```
mzansibuilds/
├── client/          # Vue 3 frontend
│   ├── src/
│   │   ├── assets/        # Global CSS
│   │   ├── components/    # Shared components (ProjectCard)
│   │   ├── firebase/      # Firebase config + Axios API instance
│   │   ├── router/        # Vue Router
│   │   ├── stores/        # Pinia stores (auth, projects)
│   │   └── views/         # All page views
│   └── .env.example
└── server/          # Node.js + Express backend
    ├── middleware/    # Firebase auth middleware
    ├── routes/        # API routes
    └── .env.example
```

---

## Setup

### 1. Firebase Configuration

**Client-side (Authentication):**
1. Go to your Firebase Console → Project Settings → General
2. Under "Your apps", add a Web app
3. Copy the config values into `client/.env`

**Server-side (Admin SDK):**
1. Go to Project Settings → Service accounts
2. Click "Generate new private key" — download the JSON file
3. Copy values into `server/.env`

**Enable Firebase services:**
- Authentication → Enable Email/Password and Google providers
- Firestore → Create database (start in test mode for development)

**Firestore Indexes** (add in Firebase Console → Firestore → Indexes):
- Collection: `projects` | Fields: `status ASC`, `createdAt DESC`
- Collection: `projects` | Fields: `ownerId ASC`, `createdAt DESC`
- Collection: `celebrationWall` | Fields: `completedAt DESC`

---

### 2. Backend Setup

```bash
cd server
cp .env.example .env
# Fill in your Firebase Admin SDK credentials in .env
npm install
npm run dev
```

Server runs on `http://localhost:3000`

---

### 3. Frontend Setup

```bash
cd client
cp .env.example .env
# Fill in your Firebase web app config in .env
npm install
npm run dev
```

Client runs on `http://localhost:5173`

---

## Environment Variables

### `server/.env`
```
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
PORT=3000
```

### `client/.env`
```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_API_BASE_URL=http://localhost:3000
```

---

## Features

| Feature | Description |
|---|---|
| Auth | Email/password + Google sign-in via Firebase |
| Project CRUD | Create, read, update, delete projects |
| Stage tracking | idea → planning → in-progress → testing → launched |
| Milestones | Log progress checkpoints per project |
| Comments | Community feedback on any project |
| Collaboration | Raise hand to request to join a project |
| Live Feed | Browse all active projects with stage filters |
| Celebration Wall | Completed projects immortalised publicly |
| Dashboard | Personal view of your projects and stats |

---

## Git Setup

```bash
git init
git add .
git commit -m "feat: initial MzansiBuilds scaffold"
git remote add origin https://github.com/YOUR_USERNAME/mzansibuilds.git
git push -u origin main
```

Make regular commits as you build — version control is part of the assessment criteria.
