<template>
  <div class="page" v-if="project">
    <div class="container">
      <router-link to="/feed" class="back-link">← Back to Feed</router-link>

      <div class="project-header">
        <div class="header-left">
          <div class="header-meta">
            <span class="badge" :class="stageBadge">{{ project.stage }}</span>
            <span class="status-tag" v-if="project.status === 'completed'">✓ Completed</span>
          </div>
          <h1>{{ project.title }}</h1>
          <div class="owner-info">
            <div class="avatar">{{ project.ownerName?.charAt(0).toUpperCase() }}</div>
            <span>{{ project.ownerName }}</span>
          </div>
        </div>

        <div class="header-actions" v-if="isOwner">
          <router-link :to="`/projects/${project.id}/edit`" class="btn-outline btn-sm">Edit</router-link>
          <button class="btn-primary btn-sm" @click="showMilestoneForm = true" v-if="project.status !== 'completed'">+ Milestone</button>
          <button class="btn-ghost btn-sm" @click="handleComplete" v-if="project.status !== 'completed'">Mark Complete</button>
          <button class="btn-danger btn-sm" @click="handleDelete">Delete</button>
        </div>
      </div>

      <div class="project-body">
        <div class="project-main">
          <section class="section">
            <h2>About</h2>
            <p class="desc-text">{{ project.description }}</p>
          </section>

          <section class="section" v-if="project.supportRequired">
            <h2>Support Needed</h2>
            <div class="support-box">{{ project.supportRequired }}</div>
          </section>

          <section class="section" v-if="project.techStack?.length">
            <h2>Tech Stack</h2>
            <div class="tags-row">
              <span class="tag" v-for="t in project.techStack" :key="t">{{ t }}</span>
            </div>
          </section>

          <!-- Milestones -->
          <section class="section">
            <h2>Milestones <span class="count">{{ project.milestones?.length || 0 }}</span></h2>

            <div v-if="showMilestoneForm" class="inline-form">
              <input v-model="milestoneText" placeholder="Describe your milestone..." />
              <button class="btn-primary btn-sm" @click="submitMilestone">Add</button>
              <button class="btn-ghost btn-sm" @click="showMilestoneForm = false">Cancel</button>
            </div>

            <div v-if="project.milestones?.length" class="milestones-list">
              <div class="milestone" v-for="m in [...project.milestones].reverse()" :key="m.id">
                <span class="milestone-dot"></span>
                <div>
                  <p>{{ m.text }}</p>
                  <span class="meta-time">{{ formatDate(m.achievedAt) }}</span>
                </div>
              </div>
            </div>
            <div v-else class="empty-note">No milestones yet.</div>
          </section>

          <!-- Comments -->
          <section class="section">
            <h2>Comments <span class="count">{{ project.comments?.length || 0 }}</span></h2>

            <div v-if="authStore.user" class="inline-form">
              <input v-model="commentText" placeholder="Leave a comment..." @keyup.enter="submitComment" />
              <button class="btn-primary btn-sm" @click="submitComment">Post</button>
            </div>
            <p v-else class="auth-note"><router-link to="/auth">Sign in</router-link> to comment.</p>

            <div class="comments-list" v-if="project.comments?.length">
              <div class="comment" v-for="c in [...project.comments].reverse()" :key="c.id">
                <div class="avatar sm">{{ c.authorName?.charAt(0).toUpperCase() }}</div>
                <div>
                  <div class="comment-header">
                    <strong>{{ c.authorName }}</strong>
                    <span class="meta-time">{{ formatDate(c.createdAt) }}</span>
                  </div>
                  <p>{{ c.text }}</p>
                </div>
              </div>
            </div>
            <div v-else class="empty-note">No comments yet.</div>
          </section>
        </div>

        <div class="project-sidebar">
          <div class="card">
            <h3>Collaborate</h3>
            <p class="sidebar-sub">Interested in contributing to this project?</p>
            <div v-if="authStore.user && !isOwner">
              <textarea v-model="colabMsg" rows="3" placeholder="Introduce yourself and your skills..."></textarea>
              <button class="btn-primary" style="width:100%;margin-top:0.75rem" @click="submitColab">Raise Hand 🤝</button>
            </div>
            <p v-else-if="!authStore.user" class="auth-note"><router-link to="/auth">Sign in</router-link> to collaborate.</p>
            <p v-else class="auth-note">You own this project.</p>

            <div v-if="isOwner && project.collaborationRequests?.length" style="margin-top:1.5rem">
              <h4 style="margin-bottom:0.75rem;font-size:0.85rem;color:var(--white-dim)">
                Requests ({{ project.collaborationRequests.length }})
              </h4>
              <div class="colab-request" v-for="r in project.collaborationRequests" :key="r.id">
                <div class="avatar sm">{{ r.userName?.charAt(0).toUpperCase() }}</div>
                <div>
                  <strong>{{ r.userName }}</strong>
                  <p>{{ r.message }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="card" v-if="project.repoUrl">
            <h3>Repository</h3>
            <a :href="project.repoUrl" target="_blank" class="repo-link">↗ View on GitHub</a>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else-if="loading" class="loader">Loading project...</div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProjectsStore } from '../stores/projects.js'
import { useAuthStore } from '../stores/auth.js'

const route = useRoute()
const router = useRouter()
const projectsStore = useProjectsStore()
const authStore = useAuthStore()

const project = ref(null)
const loading = ref(true)
const showMilestoneForm = ref(false)
const milestoneText = ref('')
const commentText = ref('')
const colabMsg = ref('')

const isOwner = computed(() => authStore.user?.uid === project.value?.ownerId)

const stageBadges = { 'idea': 'badge-blue', 'planning': 'badge-yellow', 'in-progress': 'badge-green', 'testing': 'badge-yellow', 'launched': 'badge-green' }
const stageBadge = computed(() => stageBadges[project.value?.stage] || 'badge-blue')

onMounted(async () => {
  project.value = await projectsStore.getProject(route.params.id)
  loading.value = false
})

async function submitMilestone() {
  if (!milestoneText.value.trim()) return
  const m = await projectsStore.addMilestone(project.value.id, milestoneText.value)
  project.value.milestones = [...(project.value.milestones || []), m]
  milestoneText.value = ''
  showMilestoneForm.value = false
}

async function submitComment() {
  if (!commentText.value.trim()) return
  const c = await projectsStore.addComment(project.value.id, commentText.value)
  project.value.comments = [...(project.value.comments || []), c]
  commentText.value = ''
}

async function submitColab() {
  if (!colabMsg.value.trim()) return
  await projectsStore.raiseHand(project.value.id, colabMsg.value)
  colabMsg.value = ''
  alert('Collaboration request sent!')
}

async function handleComplete() {
  if (!confirm('Mark this project as complete?')) return
  await projectsStore.completeProject(project.value.id)
  project.value.status = 'completed'
  router.push('/celebration')
}

async function handleDelete() {
  if (!confirm('Delete this project? This cannot be undone.')) return
  await projectsStore.deleteProject(project.value.id)
  router.push('/dashboard')
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>

<style scoped>
.back-link { font-size: 0.8rem; color: var(--white-dim); opacity: 0.6; display: inline-block; margin-bottom: 2rem; }
.back-link:hover { opacity: 1; color: var(--green); }

.project-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
}

h1 { font-size: 2.5rem; margin: 0.75rem 0; }

.header-meta { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem; }

.status-tag {
  font-size: 0.75rem;
  color: var(--green);
  background: rgba(0,230,118,0.1);
  border: 1px solid var(--border-strong);
  padding: 0.2rem 0.6rem;
  border-radius: 2px;
}

.owner-info { display: flex; align-items: center; gap: 0.5rem; color: var(--white-dim); font-size: 0.85rem; }
.avatar { width: 28px; height: 28px; background: var(--green-muted); border: 1px solid var(--border-strong); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700; color: var(--green); }
.avatar.sm { width: 24px; height: 24px; font-size: 0.65rem; flex-shrink: 0; }

.header-actions { display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center; }

.project-body { display: grid; grid-template-columns: 1fr 300px; gap: 2rem; align-items: start; }

.section { margin-bottom: 2.5rem; }
.section h2 { font-size: 1rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--white-dim); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem; }
.count { background: var(--black-4); border: 1px solid var(--border); padding: 0.1rem 0.5rem; border-radius: 2px; font-size: 0.75rem; }

.desc-text { font-size: 0.9rem; color: var(--white-dim); line-height: 1.8; }

.support-box { background: var(--black-3); border: 1px solid var(--border); padding: 1rem; font-size: 0.85rem; color: var(--white-dim); border-radius: var(--radius); }

.tags-row { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.tag { font-size: 0.75rem; padding: 0.3rem 0.75rem; background: var(--black-4); border: 1px solid var(--border); border-radius: 2px; color: var(--white-dim); }

.inline-form { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
.inline-form input { flex: 1; }

.milestones-list { display: flex; flex-direction: column; gap: 0.75rem; }
.milestone { display: flex; gap: 1rem; align-items: flex-start; }
.milestone-dot { width: 8px; height: 8px; background: var(--green); border-radius: 50%; margin-top: 0.45rem; flex-shrink: 0; }
.milestone p { font-size: 0.875rem; color: var(--white); margin-bottom: 0.2rem; }

.comments-list { display: flex; flex-direction: column; gap: 1rem; }
.comment { display: flex; gap: 0.75rem; align-items: flex-start; }
.comment-header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.25rem; }
.comment-header strong { font-size: 0.85rem; }
.comment p { font-size: 0.85rem; color: var(--white-dim); }

.meta-time { font-size: 0.7rem; color: var(--white-dim); opacity: 0.4; }
.empty-note { font-size: 0.8rem; color: var(--white-dim); opacity: 0.4; }
.auth-note { font-size: 0.8rem; color: var(--white-dim); opacity: 0.6; }

.project-sidebar { display: flex; flex-direction: column; gap: 1rem; }
.card { background: var(--black-2); border: 1px solid var(--border); border-radius: var(--radius); padding: 1.25rem; }
.card h3 { font-size: 0.9rem; margin-bottom: 0.5rem; }
.sidebar-sub { font-size: 0.8rem; color: var(--white-dim); opacity: 0.6; margin-bottom: 1rem; }

.colab-request { display: flex; gap: 0.75rem; margin-bottom: 0.75rem; }
.colab-request strong { font-size: 0.8rem; display: block; margin-bottom: 0.2rem; }
.colab-request p { font-size: 0.75rem; color: var(--white-dim); opacity: 0.7; }

.repo-link { font-size: 0.85rem; color: var(--green); }

@media (max-width: 768px) {
  .project-body { grid-template-columns: 1fr; }
}
</style>
