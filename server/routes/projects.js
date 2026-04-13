import { Router } from 'express'
import { db } from '../index.js'
import { authenticate } from '../middleware/auth.js'
import { FieldValue } from 'firebase-admin/firestore'

const router = Router()

// GET all projects (feed)
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('projects')
      .orderBy('createdAt', 'desc')
      .get()
    const projects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    res.json(projects)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET single project
router.get('/:id', async (req, res) => {
  try {
    const doc = await db.collection('projects').doc(req.params.id).get()
    if (!doc.exists) return res.status(404).json({ error: 'Project not found' })
    res.json({ id: doc.id, ...doc.data() })
  } catch (err) {
    console.error('GET /projects error:', err)
    res.status(500).json({ error: err.message })
  }
})

// POST create project
router.post('/', authenticate, async (req, res) => {
  try {
    const { title, description, stage, supportRequired, techStack, repoUrl, logoSvg } = req.body
    const project = {
      title,
      description,
      stage,
      supportRequired,
      techStack,
      repoUrl: repoUrl || '',
      logoSvg: logoSvg || '',
      ownerId: req.user.uid,
      ownerName: req.user.name || req.user.email,
      ownerPhoto: req.user.picture || '',
      status: 'in-progress',
      milestones: [],
      comments: [],
      collaborationRequests: [],
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    }
    const ref = await db.collection('projects').add(project)
    res.status(201).json({ id: ref.id, ...project })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PATCH update project
router.patch('/:id', authenticate, async (req, res) => {
  try {
    const doc = await db.collection('projects').doc(req.params.id).get()
    if (!doc.exists) return res.status(404).json({ error: 'Not found' })
    if (doc.data().ownerId !== req.user.uid) return res.status(403).json({ error: 'Forbidden' })

    const updates = { ...req.body, updatedAt: FieldValue.serverTimestamp() }
    await db.collection('projects').doc(req.params.id).update(updates)
    res.json({ id: req.params.id, ...updates })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST mark project complete
router.post('/:id/complete', authenticate, async (req, res) => {
  try {
    const doc = await db.collection('projects').doc(req.params.id).get()
    if (!doc.exists) return res.status(404).json({ error: 'Not found' })
    if (doc.data().ownerId !== req.user.uid) return res.status(403).json({ error: 'Forbidden' })

    await db.collection('projects').doc(req.params.id).update({
      status: 'completed',
      completedAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    })

    // Add to celebration wall
    await db.collection('celebrationWall').add({
      projectId: req.params.id,
      projectTitle: doc.data().title,
      ownerId: req.user.uid,
      ownerName: doc.data().ownerName,
      ownerPhoto: doc.data().ownerPhoto,
      completedAt: FieldValue.serverTimestamp(),
    })

    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST add milestone
router.post('/:id/milestones', authenticate, async (req, res) => {
  try {
    const doc = await db.collection('projects').doc(req.params.id).get()
    if (!doc.exists) return res.status(404).json({ error: 'Not found' })
    if (doc.data().ownerId !== req.user.uid) return res.status(403).json({ error: 'Forbidden' })

    const milestone = {
      id: Date.now().toString(),
      text: req.body.text,
      achievedAt: new Date().toISOString(),
    }
    await db.collection('projects').doc(req.params.id).update({
      milestones: FieldValue.arrayUnion(milestone),
      updatedAt: FieldValue.serverTimestamp(),
    })
    res.status(201).json(milestone)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST add comment
router.post('/:id/comments', authenticate, async (req, res) => {
  try {
    const comment = {
      id: Date.now().toString(),
      text: req.body.text,
      authorId: req.user.uid,
      authorName: req.user.name || req.user.email,
      authorPhoto: req.user.picture || '',
      createdAt: new Date().toISOString(),
    }
    await db.collection('projects').doc(req.params.id).update({
      comments: FieldValue.arrayUnion(comment),
    })
    res.status(201).json(comment)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST raise hand for collaboration
router.post('/:id/collaborate', authenticate, async (req, res) => {
  try {
    const request = {
      id: Date.now().toString(),
      userId: req.user.uid,
      userName: req.user.name || req.user.email,
      userPhoto: req.user.picture || '',
      message: req.body.message || '',
      createdAt: new Date().toISOString(),
    }
    await db.collection('projects').doc(req.params.id).update({
      collaborationRequests: FieldValue.arrayUnion(request),
    })
    res.status(201).json(request)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE project
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const doc = await db.collection('projects').doc(req.params.id).get()
    if (!doc.exists) return res.status(404).json({ error: 'Not found' })
    if (doc.data().ownerId !== req.user.uid) return res.status(403).json({ error: 'Forbidden' })
    await db.collection('projects').doc(req.params.id).delete()
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router

// This route is already at the bottom - just confirming structure
// Milestone endpoint: logs developer progress against a project
