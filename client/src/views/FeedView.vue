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
  margin-bottom: 2rem;
  gap: 1rem;
  flex-wrap: wrap;
}

h1 { font-size: 2.5rem; margin-bottom: 0.25rem; }
.sub { color: var(--white-dim); font-size: 0.85rem; opacity: 0.6; }

.feed-filters {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
}

.filter-btn {
  background: var(--black-2);
  border: 1px solid var(--border);
  color: var(--white-dim);
  padding: 0.4rem 1rem;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  transition: all var(--transition);
}

.filter-btn:hover, .filter-btn.active {
  border-color: var(--green);
  color: var(--green);
  background: rgba(0,230,118,0.06);
}

.feed-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.25rem;
}
</style>
