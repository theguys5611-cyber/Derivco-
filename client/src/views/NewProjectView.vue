<template>
  <div class="page">
    <div class="container narrow">
      <router-link to="/feed" class="back-link">← Back</router-link>
      <h1>New Project</h1>
      <p class="sub">Share what you're building with the community.</p>

      <form @submit.prevent="handleSubmit" class="project-form">

        <!-- Logo preview -->
        <div class="logo-section">
          <div class="logo-preview">
            <div v-if="form.logoSvg" v-html="form.logoSvg" class="logo-svg"></div>
            <div v-else class="logo-placeholder">
              <span>Logo</span>
            </div>
          </div>
          <div class="logo-info">
            <p class="logo-label">Project Logo</p>
            <p class="logo-hint">Fill in your title and description, then generate an AI logo.</p>
            <button
              type="button"
              class="btn-outline btn-sm"
              @click="generateLogo"
              :disabled="generatingLogo || !form.title"
            >
              {{ generatingLogo ? 'Generating...' : form.logoSvg ? 'Regenerate Logo' : '✦ Generate Logo' }}
            </button>
          </div>
        </div>

        <div class="form-group">
          <label>Project Title *</label>
          <input v-model="form.title" placeholder="e.g. EduGoals — AI Investment Platform" required />
        </div>

        <div class="form-group">
          <label>Description *</label>
          <textarea v-model="form.description" rows="4" placeholder="What are you building and why?" required></textarea>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Current Stage *</label>
            <select v-model="form.stage" required>
              <option value="">Select stage</option>
              <option v-for="s in stages" :key="s" :value="s">{{ s }}</option>
            </select>
          </div>
          <div class="form-group">
            <label>Repository URL</label>
            <input v-model="form.repoUrl" placeholder="https://github.com/..." type="url" />
          </div>
        </div>

        <div class="form-group">
          <label>Support Required</label>
          <textarea v-model="form.supportRequired" rows="2" placeholder="What kind of help are you looking for?"></textarea>
        </div>

        <div class="form-group">
          <label>Tech Stack</label>
          <div class="tag-input">
            <input v-model="techInput" placeholder="Type a technology and press Enter" @keydown.enter.prevent="addTech" />
            <div class="tags-row" v-if="form.techStack.length">
              <span class="tag removable" v-for="t in form.techStack" :key="t">
                {{ t }} <button type="button" @click="removeTech(t)">×</button>
              </span>
            </div>
          </div>
        </div>

        <div v-if="error" class="error-banner">{{ error }}</div>

        <div class="form-actions">
          <button type="submit" class="btn-primary" :disabled="loading">
            {{ loading ? 'Publishing...' : 'Publish Project' }}
          </button>
          <router-link to="/feed" class="btn-ghost">Cancel</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useProjectsStore } from '../stores/projects.js'
import api from '../firebase/api.js'

const router = useRouter()
const projectsStore = useProjectsStore()

const stages = ['idea', 'planning', 'in-progress', 'testing', 'launched']
const techInput = ref('')
const loading = ref(false)
const generatingLogo = ref(false)
const error = ref('')

const form = ref({
  title: '',
  description: '',
  stage: '',
  supportRequired: '',
  techStack: [],
  repoUrl: '',
  logoSvg: '',
})

function addTech() {
  const val = techInput.value.trim()
  if (val && !form.value.techStack.includes(val)) {
    form.value.techStack.push(val)
  }
  techInput.value = ''
}

function removeTech(t) {
  form.value.techStack = form.value.techStack.filter(x => x !== t)
}

async function generateLogo() {
  if (!form.value.title) return
  generatingLogo.value = true
  try {
    const res = await api.post('/api/logo/generate', {
      title: form.value.title,
      description: form.value.description,
    })
    form.value.logoSvg = res.data.svg
  } catch (e) {
    error.value = 'Logo generation failed. You can still publish without a logo.'
  } finally {
    generatingLogo.value = false
  }
}

async function handleSubmit() {
  error.value = ''
  loading.value = true
  try {
    const project = await projectsStore.createProject(form.value)
    router.push(`/projects/${project.id}`)
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.narrow { max-width: 680px; }
.back-link { font-size: 0.8rem; color: var(--text-muted); display: inline-block; margin-bottom: 2rem; }
.back-link:hover { color: var(--green); }
h1 { font-size: 2rem; margin-bottom: 0.25rem; }
.sub { color: var(--text-secondary); font-size: 0.875rem; margin-bottom: 2.5rem; }

.logo-section {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 1.25rem;
  margin-bottom: 1.75rem;
  box-shadow: var(--shadow-sm);
}

.logo-preview {
  width: 72px;
  height: 72px;
  flex-shrink: 0;
  border-radius: var(--radius);
  overflow: hidden;
  background: var(--bg);
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-svg { width: 64px; height: 64px; display: flex; align-items: center; justify-content: center; }
.logo-svg :deep(svg) { width: 64px; height: 64px; }

.logo-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  color: var(--text-muted);
  font-weight: 500;
}

.logo-label { font-size: 0.875rem; font-weight: 600; margin-bottom: 0.2rem; }
.logo-hint { font-size: 0.775rem; color: var(--text-secondary); margin-bottom: 0.75rem; }

.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.tag-input { display: flex; flex-direction: column; gap: 0.75rem; }
.tags-row { display: flex; flex-wrap: wrap; gap: 0.5rem; }

.tag.removable {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.75rem;
  padding: 0.25rem 0.6rem;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 20px;
  color: var(--text-secondary);
}

.tag.removable button { background: none; border: none; color: var(--text-muted); font-size: 1rem; line-height: 1; padding: 0; cursor: pointer; }
.tag.removable button:hover { color: #dc2626; }

.error-banner { background: #fef2f2; border: 1px solid #fca5a5; color: #dc2626; padding: 0.75rem 1rem; font-size: 0.8rem; border-radius: var(--radius); margin-bottom: 1rem; }

.form-actions { display: flex; gap: 1rem; align-items: center; margin-top: 2rem; }

@media (max-width: 600px) {
  .form-row { grid-template-columns: 1fr; }
}
</style>
