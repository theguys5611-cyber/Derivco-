<template>
  <div class="page">
    <div class="container">
      <div class="wall-header">
        <div class="wall-tag">
          <span class="trophy">🏆</span> Hall of Fame
        </div>
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
          <div class="wall-card-top">
            <div class="trophy-badge">🏆</div>
            <div class="wall-card-meta">
              <router-link :to="`/projects/${entry.projectId}`" class="wall-title">
                {{ entry.projectTitle }}
              </router-link>
              <div class="wall-owner">
                <div class="avatar">{{ entry.ownerName?.charAt(0).toUpperCase() }}</div>
                <span>{{ entry.ownerName }}</span>
              </div>
            </div>
          </div>
          <div class="wall-date">
            Completed {{ formatDate(entry.completedAt) }}
          </div>
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
.wall-header { text-align: center; padding: 3rem 0 3rem; }
.wall-tag { display: inline-flex; align-items: center; gap: 0.5rem; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.12em; color: #ffd600; background: rgba(255, 214, 0, 0.08); border: 1px solid rgba(255,214,0,0.2); padding: 0.35rem 0.9rem; border-radius: 2px; margin-bottom: 1.5rem; }
h1 { font-size: 3rem; margin-bottom: 0.5rem; }
.sub { color: var(--white-dim); font-size: 0.9rem; opacity: 0.6; }

.wall-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.25rem; }

.wall-card {
  background: var(--black-2);
  border: 1px solid rgba(255, 214, 0, 0.2);
  border-radius: var(--radius);
  padding: 1.5rem;
  transition: border-color var(--transition), transform var(--transition);
}

.wall-card:hover {
  border-color: rgba(255, 214, 0, 0.4);
  transform: translateY(-2px);
}

.wall-card-top { display: flex; gap: 1rem; align-items: flex-start; margin-bottom: 1rem; }
.trophy-badge { font-size: 1.75rem; }

.wall-title {
  display: block;
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 700;
  color: var(--white);
  margin-bottom: 0.5rem;
  line-height: 1.3;
}

.wall-title:hover { color: #ffd600; opacity: 1; }

.wall-owner { display: flex; align-items: center; gap: 0.5rem; font-size: 0.8rem; color: var(--white-dim); }
.avatar { width: 22px; height: 22px; background: var(--green-muted); border: 1px solid var(--border-strong); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.65rem; font-weight: 700; color: var(--green); }

.wall-date { font-size: 0.75rem; color: var(--white-dim); opacity: 0.4; }
</style>
