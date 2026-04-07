<template>
  <div class="page">
    <div class="container">
      <div class="feed-header">
        <div>
          <h1>Live Feed</h1>
          <p class="sub">What developers are building right now</p>
        </div>
        <router-link to="/projects/new" class="btn-primary" v-if="authStore.user">+ New Project</router-link>
      </div>

      <div class="feed-filters">
        <button
          v-for="s in stages"
          :key="s.value"
          :class="['filter-btn', { active: activeStage === s.value }]"
          @click="activeStage = s.value"
        >
          {{ s.label }}
        </button>
      </div>

      <div v-if="projectsStore.loading" class="loader">Loading feed...</div>

      <div v-else-if="filtered.length === 0" class="empty-state">
        <h3>No projects yet</h3>
        <p>Be the first to build in public.</p>
      </div>

      <div v-else class="feed-grid">
        <ProjectCard v-for="p in filtered" :key="p.id" :project="p" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useProjectsStore } from '../stores/projects.js'
import { useAuthStore } from '../stores/auth.js'
import ProjectCard from '../components/ProjectCard.vue'

const projectsStore = useProjectsStore()
const authStore = useAuthStore()
const activeStage = ref('all')

const stages = [
  { value: 'all', label: 'All' },
  { value: 'idea', label: 'Idea' },
  { value: 'planning', label: 'Planning' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'testing', label: 'Testing' },
  { value: 'launched', label: 'Launched' },
]

const filtered = computed(() => {
  if (activeStage.value === 'all') return projectsStore.projects
  return projectsStore.projects.filter(p => p.stage === activeStage.value)
})

onMounted(() => projectsStore.fetchFeed())
</script>

<style scoped>
.feed-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1.75rem;
  gap: 1rem;
  flex-wrap: wrap;
}

h1 { font-size: 2rem; margin-bottom: 0.2rem; }
.sub { color: var(--text-secondary); font-size: 0.875rem; }

.feed-filters {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
}

.filter-btn {
  background: var(--white);
  border: 1px solid var(--border);
  color: var(--text-secondary);
  padding: 0.4rem 1rem;
  font-size: 0.8rem;
  font-weight: 500;
  border-radius: 20px;
  transition: all var(--transition);
}

.filter-btn:hover { border-color: var(--green); color: var(--green); }
.filter-btn.active { background: var(--green); border-color: var(--green); color: #fff; }

.feed-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.25rem;
}
</style>
