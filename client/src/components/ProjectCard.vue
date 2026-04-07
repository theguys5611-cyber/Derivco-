<template>
  <router-link :to="`/projects/${project.id}`" class="project-card">
    <div class="card-top">
      <div class="card-meta">
        <span class="badge" :class="stageBadge">{{ project.stage }}</span>
        <span class="card-time">{{ timeAgo }}</span>
      </div>
      <h3 class="card-title">{{ project.title }}</h3>
      <p class="card-desc">{{ project.description?.substring(0, 100) }}{{ project.description?.length > 100 ? '...' : '' }}</p>
    </div>

    <div class="card-bottom">
      <div class="card-tags" v-if="project.techStack?.length">
        <span class="tag" v-for="tech in project.techStack?.slice(0, 3)" :key="tech">{{ tech }}</span>
      </div>
      <div class="card-stats">
        <span>💬 {{ project.comments?.length || 0 }}</span>
        <span>🤝 {{ project.collaborationRequests?.length || 0 }}</span>
        <span>📍 {{ project.milestones?.length || 0 }}</span>
      </div>
    </div>

    <div class="card-owner">
      <div class="avatar">{{ project.ownerName?.charAt(0).toUpperCase() }}</div>
      <span>{{ project.ownerName }}</span>
    </div>
  </router-link>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({ project: Object })

const stageBadges = {
  'idea': 'badge-blue',
  'planning': 'badge-yellow',
  'in-progress': 'badge-green',
  'testing': 'badge-yellow',
  'launched': 'badge-green',
}

const stageBadge = computed(() => stageBadges[props.project.stage] || 'badge-blue')

const timeAgo = computed(() => {
  if (!props.project.createdAt) return ''
  const date = props.project.createdAt?.toDate?.() || new Date(props.project.createdAt)
  const diff = Date.now() - date.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
})
</script>

<style scoped>
.project-card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  color: var(--text-primary);
  box-shadow: var(--shadow-sm);
  transition: box-shadow var(--transition), border-color var(--transition), transform var(--transition);
}

.project-card:hover {
  box-shadow: var(--shadow);
  border-color: #d1d5db;
  transform: translateY(-2px);
  color: var(--text-primary);
  opacity: 1;
}

.card-top { flex: 1; }

.card-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.card-time { font-size: 0.75rem; color: var(--text-muted); }

.card-title {
  font-size: 0.975rem;
  font-weight: 700;
  margin-bottom: 0.4rem;
  line-height: 1.3;
  color: var(--text-primary);
}

.card-desc {
  font-size: 0.825rem;
  color: var(--text-secondary);
  line-height: 1.6;
}

.card-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.card-tags { display: flex; gap: 0.4rem; flex-wrap: wrap; }

.tag {
  font-size: 0.7rem;
  font-weight: 500;
  padding: 0.2rem 0.6rem;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 20px;
  color: var(--text-secondary);
}

.card-stats {
  display: flex;
  gap: 0.75rem;
  font-size: 0.75rem;
  color: var(--text-muted);
}

.card-owner {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--border);
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.avatar {
  width: 26px;
  height: 26px;
  background: var(--green-light);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--green);
}
</style>
