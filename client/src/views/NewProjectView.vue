<template>
  <div class="page">
    <div class="container narrow">
      <router-link to="/feed" class="back-link">← Back</router-link>
      <h1>New Project</h1>
      <p class="sub">Share what you're building with the community.</p>

      <form @submit.prevent="handleSubmit" class="project-form">
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
          <textarea v-model="form.supportRequired" rows="2" placeholder="What kind of help are you looking for? (design, code review, testing, etc.)"></textarea>
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

const router = useRouter()
const projectsStore = useProjectsStore()

const stages = ['idea', 'planning', 'in-progress', 'testing', 'launched']
const techInput = ref('')
const loading = ref(false)
const error = ref('')

const form = ref({
  title: '',
  description: '',
  stage: '',
  supportRequired: '',
  techStack: [],
  repoUrl: '',
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
.back-link { font-size: 0.8rem; color: var(--white-dim); opacity: 0.6; display: inline-block; margin-bottom: 2rem; }
.back-link:hover { opacity: 1; color: var(--green); }
h1 { font-size: 2rem; margin-bottom: 0.25rem; }
.sub { color: var(--white-dim); font-size: 0.85rem; opacity: 0.6; margin-bottom: 2.5rem; }

.project-form { margin-top: 0; }

.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

.tag-input { display: flex; flex-direction: column; gap: 0.75rem; }
.tags-row { display: flex; flex-wrap: wrap; gap: 0.5rem; }

.tag.removable {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.75rem;
  padding: 0.25rem 0.6rem;
  background: var(--black-4);
  border: 1px solid var(--border);
  border-radius: 2px;
  color: var(--white-dim);
}

.tag.removable button {
  background: none;
  border: none;
  color: var(--white-dim);
  font-size: 1rem;
  line-height: 1;
  padding: 0;
  cursor: pointer;
}

.tag.removable button:hover { color: #ff5252; }

.error-banner {
  background: rgba(255, 82, 82, 0.1);
  border: 1px solid rgba(255, 82, 82, 0.3);
  color: #ff5252;
  padding: 0.75rem 1rem;
  font-size: 0.8rem;
  border-radius: var(--radius);
  margin-bottom: 1rem;
}

.form-actions { display: flex; gap: 1rem; align-items: center; margin-top: 2rem; }

@media (max-width: 600px) {
  .form-row { grid-template-columns: 1fr; }
}
</style>
