import { Router } from 'express'
import { db } from '../index.js'
import { authenticate } from '../middleware/auth.js'
import { FieldValue } from 'firebase-admin/firestore'

const router = Router()

// GET user profile
router.get('/:uid', async (req, res) => {
  try {
    const doc = await db.collection('users').doc(req.params.uid).get()
    if (!doc.exists) return res.status(404).json({ error: 'User not found' })
    res.json({ id: doc.id, ...doc.data() })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST create/update user profile (called on login)
router.post('/profile', authenticate, async (req, res) => {
  try {
    const { displayName, bio, githubUrl, skills } = req.body
    const userRef = db.collection('users').doc(req.user.uid)
    const userData = {
      uid: req.user.uid,
      email: req.user.email,
      displayName: displayName || req.user.name || req.user.email,
      bio: bio || '',
      githubUrl: githubUrl || '',
      skills: skills || [],
      photoURL: req.user.picture || '',
      updatedAt: FieldValue.serverTimestamp(),
    }
    await userRef.set(userData, { merge: true })
    res.json(userData)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET user's own projects
router.get('/:uid/projects', async (req, res) => {
  try {
    const snapshot = await db.collection('projects')
      .where('ownerId', '==', req.params.uid)
      .orderBy('createdAt', 'desc')
      .get()
    const projects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    res.json(projects)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
