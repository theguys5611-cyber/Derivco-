<template>
  <div class="home">
    <section class="hero">
      <div class="container">
        <div class="hero-pill">
          <span class="pill-dot"></span> Live — Builders active now
        </div>
        <h1 class="hero-title">Where South African<br>developers <span class="accent">build in public</span></h1>
        <p class="hero-sub">
          Share your projects, track milestones, and connect with builders across South Africa.
          No private mode. Everything here is built openly.
        </p>
        <div class="hero-actions">
          <router-link to="/feed" class="btn-primary">Explore the Feed</router-link>
          <router-link to="/auth" class="btn-outline" v-if="!authStore.user">Start Building</router-link>
          <router-link to="/projects/new" class="btn-outline" v-else>New Project</router-link>
        </div>
      </div>
    </section>

    <!-- Completed projects strip -->
    <section class="project-strip" v-if="completedProjects.length">
      <div class="container">
        <div class="strip-header">
          <span class="strip-label">🏆 Shipped projects</span>
          <router-link to="/celebration" class="strip-link">View all →</router-link>
        </div>
        <div class="strip-logos">
          <a
            v-for="project in completedProjects"
            :key="project.id"
            :href="project.repoUrl || '#'"
            :target="project.repoUrl ? '_blank' : '_self'"
            class="strip-item"
            :title="project.projectTitle"
          >
            <div class="strip-logo" v-if="project.logoSvg" v-html="project.logoSvg"></div>
            <div class="strip-logo-fallback" v-else>
              {{ project.projectTitle?.charAt(0).toUpperCase() }}
            </div>
            <span class="strip-name">{{ project.projectTitle }}</span>
          </a>
        </div>
      </div>
    </section>

    <!-- Ongoing projects strip -->
    <section class="project-strip ongoing" v-if="ongoingProjects.length">
      <div class="container">
        <div class="strip-header">
          <span class="strip-label">⚡ Currently being built</span>
          <router-link to="/feed" class="strip-link">View feed →</router-link>
        </div>
        <div class="strip-logos">
          <router-link
            v-for="project in ongoingProjects"
            :key="project.id"
            :to="`/projects/${project.id}`"
            class="strip-item"
            :title="project.title"
          >
            <div class="strip-logo" v-if="project.logoSvg" v-html="project.logoSvg"></div>
            <div class="strip-logo-fallback ongoing-fallback" v-else>
              {{ project.title?.charAt(0).toUpperCase() }}
            </div>
            <span class="strip-name">{{ project.title }}</span>
            <span class="strip-badge">{{ project.stage }}</span>
          </router-link>
        </div>
      </div>
    </section>

    <section class="features container">
      <div class="feature-card" v-for="f in features" :key="f.title">
        <div class="feature-icon">{{ f.icon }}</div>
        <h3>{{ f.title }}</h3>
        <p>{{ f.desc }}</p>
      </div>
    </section>

    <section class="cta-strip container" v-if="!authStore.user">
      <div class="cta-inner">
        <div>
          <h2>Ready to build in public?</h2>
          <p>Join developers who are shipping openly across South Africa.</p>
        </div>
        <router-link to="/auth" class="btn-primary">Create Your Account</router-link>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth.js'
import api from '../firebase/api.js'

const authStore = useAuthStore()
const completedProjects = ref([])
const ongoingProjects = ref([])

onMounted(async () => {
  try {
    const [celebRes, feedRes] = await Promise.all([
      api.get('/api/feed/celebration'),
      api.get('/api/feed'),
    ])
    completedProjects.value = celebRes.data.slice(0, 8)
    ongoingProjects.value = feedRes.data.slice(0, 8)
  } catch (e) {
    // silent
  }
})

const features = [
  { icon: '⚡', title: 'Live Project Feed', desc: 'See what developers across South Africa are working on in real time.' },
  { icon: '🤝', title: 'Collaboration', desc: 'Raise your hand on a project you want to contribute to.' },
  { icon: '📍', title: 'Milestone Tracking', desc: 'Log progress as you build and keep your momentum visible.' },
  { icon: '🏆', title: 'Celebration Wall', desc: 'Completed projects immortalised for all to see.' },
  { icon: '💬', title: 'Community Feedback', desc: 'Give and receive feedback directly on project pages.' },
  { icon: '🔓', title: 'Open by Default', desc: 'Everything you build here is built in public.' },
]
</script>

<style scoped>
.hero {
  background: var(--white);
  border-bottom: 1px solid var(--border);
  padding: 6rem 0 5rem;
}

.hero-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--green);
  background: var(--green-light);
  padding: 0.3rem 0.9rem;
  border-radius: 20px;
  margin-bottom: 2rem;
}

.pill-dot {
  width: 6px;
  height: 6px;
  background: var(--green);
  border-radius: 50%;
  animation: pulse 1.5s ease infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.hero-title {
  font-size: clamp(2.2rem, 5vw, 3.5rem);
  line-height: 1.1;
  margin-bottom: 1.5rem;
  letter-spacing: -0.03em;
}

.accent { color: var(--green); }

.hero-sub {
  max-width: 520px;
  color: var(--text-secondary);
  font-size: 1rem;
  margin-bottom: 2.5rem;
  line-height: 1.7;
}

.hero-actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }

/* Project strips */
.project-strip {
  background: var(--white);
  border-bottom: 1px solid var(--border);
  padding: 1.75rem 0;
}

.project-strip.ongoing {
  background: var(--bg);
}

.strip-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
}

.strip-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-secondary);
}

.strip-link {
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--green);
}

.strip-logos {
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;
  align-items: flex-start;
}

.strip-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  text-decoration: none;
  transition: transform var(--transition);
  color: var(--text-primary);
}

.strip-item:hover { transform: translateY(-2px); opacity: 1; }

.strip-logo {
  width: 52px;
  height: 52px;
  border-radius: var(--radius);
  overflow: hidden;
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg);
  box-shadow: var(--shadow-sm);
}

.strip-logo :deep(svg) { width: 48px; height: 48px; }

.strip-logo-fallback {
  width: 52px;
  height: 52px;
  border-radius: var(--radius);
  background: var(--green-light);
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--green);
  box-shadow: var(--shadow-sm);
}

.ongoing-fallback {
  background: #eff6ff;
  color: #1d4ed8;
}

.strip-name {
  font-size: 0.7rem;
  font-weight: 500;
  color: var(--text-secondary);
  text-align: center;
  max-width: 64px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.strip-badge {
  font-size: 0.6rem;
  font-weight: 600;
  background: var(--green-light);
  color: var(--green);
  padding: 0.1rem 0.4rem;
  border-radius: 10px;
}

/* Features */
.features {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background: var(--border);
  border: 1px solid var(--border);
  margin: 3rem auto;
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.feature-card { background: var(--white); padding: 2rem; transition: background var(--transition); }
.feature-card:hover { background: var(--bg); }
.feature-icon { font-size: 1.4rem; margin-bottom: 0.75rem; }
.feature-card h3 { font-size: 0.95rem; margin-bottom: 0.4rem; }
.feature-card p { font-size: 0.825rem; color: var(--text-secondary); line-height: 1.6; }

/* CTA */
.cta-strip { margin: 2rem auto 4rem; }
.cta-inner {
  background: var(--green);
  border-radius: var(--radius-lg);
  padding: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  flex-wrap: wrap;
}
.cta-inner h2 { font-size: 1.5rem; color: #fff; margin-bottom: 0.25rem; }
.cta-inner p { color: rgba(255,255,255,0.8); font-size: 0.9rem; }
.cta-inner .btn-primary { background: #fff; color: var(--green); flex-shrink: 0; }
.cta-inner .btn-primary:hover { background: var(--green-light); box-shadow: none; }

@media (max-width: 768px) {
  .features { grid-template-columns: 1fr; }
}
</style>
