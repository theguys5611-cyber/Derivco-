<template>
  <div class="page">
    <div class="container">
      <div class="wall-header">
        <div class="wall-pill">🏆 Hall of Fame</div>
        <h1>Celebration Wall</h1>
        <p class="sub">Projects that were built in public and shipped to completion.</p>
      </div>

      <div v-if="loading" class="loader">Loading...</div>

      <div v-else-if="entries.length === 0" class="empty-state">
        <h3>No completions yet</h3>
        <p>Be the first to ship a project and land on the wall.</p>
      </div>

      <div v-else class="wall-grid">
        <div class="wall-card" v-for="entry in entries" :key="entry.id">
          <div class="trophy">🏆</div>
          <router-link :to="`/projects/${entry.projectId}`" class="wall-title">
            {{ entry.projectTitle }}
          </router-link>
          <div class="wall-owner">
            <div class="avatar">{{ entry.ownerName?.charAt(0).toUpperCase() }}</div>
            <span>{{ entry.ownerName }}</span>
          </div>
          <div class="wall-date">Completed {{ formatDate(entry.completedAt) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useProjectsStore } from '../stores/projects.js'

const projectsStore = useProjectsStore()
const entries = ref([])
const loading = ref(true)

onMounted(async () => {
  await projectsStore.fetchCelebrationWall()
  entries.value = projectsStore.celebrationWall
  loading.value = false
})

function formatDate(ts) {
  if (!ts) return ''
  const date = ts?.toDate?.() || new Date(ts)
  return date.toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })
}
</script>

<style scoped>
.wall-header { text-align: center; padding: 2rem 0 3rem; }
.wall-pill { display: inline-block; font-size: 0.8rem; font-weight: 600; color: #a16207; background: #fef9c3; padding: 0.3rem 0.9rem; border-radius: 20px; margin-bottom: 1rem; }
h1 { font-size: 2.5rem; margin-bottom: 0.5rem; }
.sub { color: var(--text-secondary); font-size: 0.9rem; }

.wall-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1.25rem; }

.wall-card {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
  transition: box-shadow var(--transition), transform var(--transition);
}

.wall-card:hover { box-shadow: var(--shadow); transform: translateY(-2px); }

.trophy { font-size: 1.5rem; margin-bottom: 0.75rem; }

.wall-title {
  display: block;
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.75rem;
  line-height: 1.3;
}

.wall-title:hover { color: var(--green); }

.wall-owner { display: flex; align-items: center; gap: 0.5rem; font-size: 0.825rem; color: var(--text-secondary); margin-bottom: 0.5rem; }
.avatar { width: 24px; height: 24px; background: var(--green-light); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.65rem; font-weight: 700; color: var(--green); }

.wall-date { font-size: 0.75rem; color: var(--text-muted); }
</style>
