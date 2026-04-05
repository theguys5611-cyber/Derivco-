<template>
  <div class="page">
    <div class="container">
      <div class="dash-header">
        <div>
          <h1>Dashboard</h1>
          <p class="sub">Welcome back, {{ authStore.user?.displayName || authStore.user?.email }}</p>
        </div>
        <router-link to="/projects/new" class="btn-primary">+ New Project</router-link>
      </div>

      <div class="dash-stats">
        <div class="stat-card">
          <span class="stat-num">{{ userProjects.length }}</span>
          <span class="stat-label">Total Projects</span>
        </div>
        <div class="stat-card">
          <span class="stat-num">{{ activeProjects.length }}</span>
          <span class="stat-label">In Progress</span>
        </div>
        <div class="stat-card">
          <span class="stat-num">{{ completedProjects.length }}</span>
          <span class="stat-label">Completed</span>
        </div>
        <div class="stat-card">
          <span class="stat-num">{{ totalMilestones }}</span>
          <span class="stat-label">Milestones</span>
        </div>
      </div>

      <div v-if="loading" class="loader">Loading your projects...</div>

      <div v-else>
        <div class="section-header">
          <h2>Your Projects</h2>
          <div class="tab-buttons">
            <button :class="{ active: tab === 'active' }" @click="tab = 'active'">Active</button>
            <button :class="{ active: tab === 'completed' }" @click="tab = 'completed'">Completed</button>
          </div>
        </div>

        <div v-if="visibleProjects.length === 0" class="empty-state">
          <h3>No projects here</h3>
          <p>Start building something and share it with the community.</p>
          <router-link to="/projects/new" class="btn-primary" style="margin-top:1rem;display:inline-block">Create your first project</router-link>
        </div>

        <div v-else class="projects-grid">
          <div class="project-row" v-for="p in visibleProjects" :key="p.id">
            <div class="project-row-info">
              <span class="badge" :class="stageBadge(p.stage)">{{ p.stage }}</span>
              <router-link :to="`/projects/${p.id}`" class="row-title">{{ p.title }}</router-link>
            </div>
            <div class="project-row-stats">
              <span>📍 {{ p.milestones?.length || 0 }}</span>
              <span>💬 {{ p.comments?.length || 0 }}</span>
              <span>🤝 {{ p.collaborationRequests?.length || 0 }}</span>
            </div>
            <div class="project-row-actions">
              <router-link :to="`/projects/${p.id}/edit`" class="btn-ghost btn-sm">Edit</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useProjectsStore } from '../stores/projects.js'
import { useAuthStore } from '../stores/auth.js'

const projectsStore = useProjectsStore()
const authStore = useAuthStore()

const userProjects = ref([])
const loading = ref(true)
const tab = ref('active')

onMounted(async () => {
  userProjects.value = await projectsStore.fetchUserProjects(authStore.user.uid)
  loading.value = false
})

const activeProjects = computed(() => userProjects.value.filter(p => p.status !== 'completed'))
const completedProjects = computed(() => userProjects.value.filter(p => p.status === 'completed'))
const totalMilestones = computed(() => userProjects.value.reduce((acc, p) => acc + (p.milestones?.length || 0), 0))
const visibleProjects = computed(() => tab.value === 'active' ? activeProjects.value : completedProjects.value)

const stageBadges = { 'idea': 'badge-blue', 'planning': 'badge-yellow', 'in-progress': 'badge-green', 'testing': 'badge-yellow', 'launched': 'badge-green' }
function stageBadge(stage) { return stageBadges[stage] || 'badge-blue' }
</script>

<style scoped>
.dash-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 2.5rem; flex-wrap: wrap; gap: 1rem; }
h1 { font-size: 2.5rem; margin-bottom: 0.25rem; }
.sub { color: var(--white-dim); font-size: 0.85rem; opacity: 0.6; }

.dash-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; background: var(--border); border: 1px solid var(--border); margin-bottom: 3rem; }
.stat-card { background: var(--black-2); padding: 1.5rem; text-align: center; }
.stat-num { display: block; font-family: var(--font-display); font-size: 2.5rem; font-weight: 800; color: var(--green); line-height: 1; margin-bottom: 0.5rem; }
.stat-label { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--white-dim); opacity: 0.6; }

.section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; }
.section-header h2 { font-size: 1.1rem; }

.tab-buttons { display: flex; gap: 0.5rem; }
.tab-buttons button { background: var(--black-2); border: 1px solid var(--border); color: var(--white-dim); padding: 0.35rem 0.9rem; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.06em; }
.tab-buttons button.active { border-color: var(--green); color: var(--green); background: rgba(0,230,118,0.06); }

.projects-grid { display: flex; flex-direction: column; gap: 1px; background: var(--border); border: 1px solid var(--border); }
.project-row { display: flex; align-items: center; justify-content: space-between; background: var(--black-2); padding: 1rem 1.25rem; gap: 1rem; flex-wrap: wrap; }
.project-row:hover { background: var(--black-3); }
.project-row-info { display: flex; align-items: center; gap: 0.75rem; flex: 1; }
.row-title { font-size: 0.9rem; color: var(--white); font-weight: 600; }
.row-title:hover { color: var(--green); opacity: 1; }
.project-row-stats { display: flex; gap: 1rem; font-size: 0.75rem; color: var(--white-dim); opacity: 0.5; }
.project-row-actions { display: flex; gap: 0.5rem; }

@media (max-width: 768px) {
  .dash-stats { grid-template-columns: repeat(2, 1fr); }
}
</style>
