<template>
  <div class="home">
    <section class="hero">
      <div class="container">
        <div class="hero-tag">
          <span class="dot"></span> Live Platform — Builders Active Now
        </div>
        <h1 class="hero-title">Build.<br><span class="accent">Ship.</span><br>In Public.</h1>
        <p class="hero-sub">
          MzansiBuilds is the home for South African developers who build in the open.
          Share your projects, track milestones, and connect with builders across the country.
        </p>
        <div class="hero-actions">
          <router-link to="/feed" class="btn-primary">Explore the Feed</router-link>
          <router-link to="/auth" class="btn-outline" v-if="!authStore.user">Start Building</router-link>
          <router-link to="/projects/new" class="btn-outline" v-else>New Project</router-link>
        </div>
      </div>
      <div class="hero-grid-bg"></div>
    </section>

    <section class="features container">
      <div class="feature-card" v-for="f in features" :key="f.title">
        <div class="feature-icon">{{ f.icon }}</div>
        <h3>{{ f.title }}</h3>
        <p>{{ f.desc }}</p>
      </div>
    </section>

    <section class="cta container" v-if="!authStore.user">
      <h2>Ready to build in public?</h2>
      <p>Join developers who are shipping openly and collaborating across South Africa.</p>
      <router-link to="/auth" class="btn-primary">Create Your Account</router-link>
    </section>
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/auth.js'

const authStore = useAuthStore()

const features = [
  { icon: '⚡', title: 'Live Project Feed', desc: 'See what developers across South Africa are working on in real time.' },
  { icon: '🤝', title: 'Collaboration Requests', desc: 'Raise your hand on a project you want to contribute to.' },
  { icon: '📍', title: 'Milestone Tracking', desc: 'Log progress as you build and keep your momentum visible.' },
  { icon: '🏆', title: 'Celebration Wall', desc: 'Completed projects are immortalised on the wall for all to see.' },
  { icon: '💬', title: 'Community Comments', desc: 'Give and receive feedback directly on project pages.' },
  { icon: '🔓', title: 'Open by Default', desc: 'No private mode. Everything you build here is built in public.' },
]
</script>

<style scoped>
.home { overflow: hidden; }

.hero {
  position: relative;
  min-height: 90vh;
  display: flex;
  align-items: center;
  padding: 5rem 0;
  overflow: hidden;
}

.hero-grid-bg {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(0,230,118,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,230,118,0.04) 1px, transparent 1px);
  background-size: 60px 60px;
  pointer-events: none;
  z-index: 0;
}

.hero .container { position: relative; z-index: 1; }

.hero-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--green);
  background: rgba(0,230,118,0.08);
  border: 1px solid var(--border);
  padding: 0.35rem 0.9rem;
  border-radius: 2px;
  margin-bottom: 2rem;
}

.dot {
  width: 7px;
  height: 7px;
  background: var(--green);
  border-radius: 50%;
  animation: pulse 1.5s ease infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.8); }
}

.hero-title {
  font-size: clamp(3.5rem, 10vw, 7rem);
  line-height: 1;
  margin-bottom: 1.5rem;
  letter-spacing: -0.03em;
}

.accent { color: var(--green); }

.hero-sub {
  max-width: 520px;
  color: var(--white-dim);
  font-size: 0.95rem;
  margin-bottom: 2.5rem;
  line-height: 1.8;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.features {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background: var(--border);
  margin: 4rem auto;
  border: 1px solid var(--border);
}

.feature-card {
  background: var(--black);
  padding: 2rem;
  transition: background var(--transition);
}

.feature-card:hover { background: var(--black-2); }

.feature-icon {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  font-size: 1rem;
  margin-bottom: 0.5rem;
  color: var(--white);
}

.feature-card p {
  font-size: 0.8rem;
  color: var(--white-dim);
  line-height: 1.7;
  opacity: 0.7;
}

.cta {
  text-align: center;
  padding: 5rem 0;
  border-top: 1px solid var(--border);
}

.cta h2 { font-size: 2.5rem; margin-bottom: 1rem; }
.cta p { color: var(--white-dim); margin-bottom: 2rem; font-size: 0.9rem; opacity: 0.7; }

@media (max-width: 768px) {
  .features { grid-template-columns: 1fr; }
}
</style>
