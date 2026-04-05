import { Router } from 'express'
import { db } from '../index.js'

const router = Router()

// GET live feed of all projects
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('projects')
      .where('status', '==', 'in-progress')
      .orderBy('createdAt', 'desc')
      .get()
    const projects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    res.json(projects)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET celebration wall
router.get('/celebration', async (req, res) => {
  try {
    const snapshot = await db.collection('celebrationWall')
      .orderBy('completedAt', 'desc')
      .get()
    const entries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    res.json(entries)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
