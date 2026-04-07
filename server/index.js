import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

dotenv.config()

// Initialize Firebase Admin
initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
})

export const db = getFirestore()

const app = express()
app.use(cors())
app.use(express.json())

// Routes
import projectRoutes from './routes/projects.js'
import userRoutes from './routes/users.js'
import feedRoutes from './routes/feed.js'
import logoRoutes from './routes/logo.js'

app.use('/api/projects', projectRoutes)
app.use('/api/users', userRoutes)
app.use('/api/feed', feedRoutes)
app.use('/api/logo', logoRoutes)

app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`MzansiBuilds server running on port ${PORT}`))
