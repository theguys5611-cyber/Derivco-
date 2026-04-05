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
  background: var(--black-2);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1.5rem;
  color: var(--white);
  transition: border-color var(--transition), transform var(--transition);
}

.project-card:hover {
  border-color: var(--border-strong);
  transform: translateY(-2px);
  color: var(--white);
  opacity: 1;
}

.card-top { flex: 1; }

.card-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.card-time { font-size: 0.75rem; color: var(--white-dim); opacity: 0.5; }

.card-title {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  line-height: 1.3;
}

.card-desc {
  font-size: 0.8rem;
  color: var(--white-dim);
  opacity: 0.65;
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
  padding: 0.2rem 0.5rem;
  background: var(--black-4);
  border: 1px solid var(--border);
  border-radius: 2px;
  color: var(--white-dim);
}

.card-stats {
  display: flex;
  gap: 0.75rem;
  font-size: 0.75rem;
  color: var(--white-dim);
  opacity: 0.6;
}

.card-owner {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--border);
  font-size: 0.8rem;
  color: var(--white-dim);
}

.avatar {
  width: 26px;
  height: 26px;
  background: var(--green-muted);
  border: 1px solid var(--border-strong);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--green);
}
</style>
