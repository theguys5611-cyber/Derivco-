import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../firebase/api.js'

export const useProjectsStore = defineStore('projects', () => {
  const projects = ref([])
  const celebrationWall = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetchFeed() {
    loading.value = true
    try {
      const res = await api.get('/api/feed')
      projects.value = res.data
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  async function fetchCelebrationWall() {
    try {
      const res = await api.get('/api/feed/celebration')
      celebrationWall.value = res.data
    } catch (e) {
      error.value = e.message
    }
  }

  async function fetchUserProjects(uid) {
    loading.value = true
    try {
      const res = await api.get(`/api/users/${uid}/projects`)
      return res.data
    } catch (e) {
      error.value = e.message
      return []
    } finally {
      loading.value = false
    }
  }

  async function getProject(id) {
    const res = await api.get(`/api/projects/${id}`)
    return res.data
  }

  async function createProject(data) {
    const res = await api.post('/api/projects', data)
    projects.value.unshift(res.data)
    return res.data
  }

  async function updateProject(id, data) {
    const res = await api.patch(`/api/projects/${id}`, data)
    const idx = projects.value.findIndex(p => p.id === id)
    if (idx !== -1) projects.value[idx] = { ...projects.value[idx], ...data }
    return res.data
  }

  async function completeProject(id) {
    await api.post(`/api/projects/${id}/complete`)
    const idx = projects.value.findIndex(p => p.id === id)
    if (idx !== -1) projects.value[idx].status = 'completed'
  }

  async function addMilestone(projectId, text) {
    const res = await api.post(`/api/projects/${projectId}/milestones`, { text })
    return res.data
  }

  async function addComment(projectId, text) {
    const res = await api.post(`/api/projects/${projectId}/comments`, { text })
    return res.data
  }

  async function raiseHand(projectId, message) {
    const res = await api.post(`/api/projects/${projectId}/collaborate`, { message })
    return res.data
  }

  async function deleteProject(id) {
    await api.delete(`/api/projects/${id}`)
    projects.value = projects.value.filter(p => p.id !== id)
  }

  return {
    projects, celebrationWall, loading, error,
    fetchFeed, fetchCelebrationWall, fetchUserProjects,
    getProject, createProject, updateProject, completeProject,
    addMilestone, addComment, raiseHand, deleteProject,
  }
})
