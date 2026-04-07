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

    const entries = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const entry = { id: doc.id, ...doc.data() }
        // Fetch the project to get logoSvg and repoUrl
        try {
          const projectDoc = await db.collection('projects').doc(entry.projectId).get()
          if (projectDoc.exists) {
            entry.logoSvg = projectDoc.data().logoSvg || ''
            entry.repoUrl = projectDoc.data().repoUrl || ''
          }
        } catch (e) { /* silent */ }
        return entry
      })
    )

    res.json(entries)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
