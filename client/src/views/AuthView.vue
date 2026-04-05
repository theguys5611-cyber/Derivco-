<template>
  <div class="auth-page">
    <div class="auth-left">
      <div class="auth-brand">
        <router-link to="/" class="nav-logo">
          <span class="logo-bracket">[</span>MzansiBuilds<span class="logo-bracket">]</span>
        </router-link>
      </div>
      <div class="auth-quote">
        <p>"Build in public.<br>Grow together."</p>
        <span>— MzansiBuilds Community</span>
      </div>
      <div class="auth-grid-bg"></div>
    </div>

    <div class="auth-right">
      <div class="auth-box">
        <div class="auth-tabs">
          <button :class="{ active: mode === 'login' }" @click="mode = 'login'">Sign In</button>
          <button :class="{ active: mode === 'register' }" @click="mode = 'register'">Register</button>
        </div>

        <div v-if="error" class="error-banner">{{ error }}</div>

        <form @submit.prevent="handleSubmit">
          <div class="form-group" v-if="mode === 'register'">
            <label>Display Name</label>
            <input v-model="form.displayName" type="text" placeholder="Your name" required />
          </div>
          <div class="form-group">
            <label>Email</label>
            <input v-model="form.email" type="email" placeholder="you@example.com" required />
          </div>
          <div class="form-group">
            <label>Password</label>
            <input v-model="form.password" type="password" placeholder="••••••••" required minlength="6" />
          </div>
          <button class="btn-primary" type="submit" :disabled="loading" style="width:100%">
            {{ loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account' }}
          </button>
        </form>

        <div class="divider"><span>or</span></div>

        <button class="btn-google" @click="handleGoogle" :disabled="loading">
          <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#4285F4" d="M44.5 20H24v8.5h11.8C34.7 33.9 29.8 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 5.1 29.6 3 24 3 12.9 3 4 11.9 4 23s8.9 20 20 20c11 0 19.7-7.7 19.7-20 0-1.3-.1-2.7-.2-3z"/></svg>
          Continue with Google
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const mode = ref('login')
const loading = ref(false)
const error = ref('')
const form = ref({ email: '', password: '', displayName: '' })

const redirect = route.query.redirect || '/feed'

async function handleSubmit() {
  error.value = ''
  loading.value = true
  try {
    if (mode.value === 'login') {
      await authStore.loginWithEmail(form.value.email, form.value.password)
    } else {
      await authStore.registerWithEmail(form.value.email, form.value.password, form.value.displayName)
    }
    router.push(redirect)
  } catch (e) {
    error.value = e.message.replace('Firebase: ', '').replace(/\(auth\/.*\)/, '').trim()
  } finally {
    loading.value = false
  }
}

async function handleGoogle() {
  error.value = ''
  loading.value = true
  try {
    await authStore.loginWithGoogle()
    router.push(redirect)
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-page {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 100vh;
}

.auth-left {
  position: relative;
  background: var(--black-2);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 2rem;
  overflow: hidden;
}

.auth-grid-bg {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(0,230,118,0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,230,118,0.05) 1px, transparent 1px);
  background-size: 40px 40px;
  pointer-events: none;
}

.auth-brand { position: relative; z-index: 1; }
.nav-logo { font-family: var(--font-display); font-size: 1.2rem; font-weight: 800; color: var(--white); }
.logo-bracket { color: var(--green); }

.auth-quote {
  position: relative;
  z-index: 1;
  padding-bottom: 2rem;
}

.auth-quote p {
  font-family: var(--font-display);
  font-size: 2.2rem;
  font-weight: 800;
  line-height: 1.2;
  color: var(--white);
  margin-bottom: 1rem;
}

.auth-quote span {
  font-size: 0.8rem;
  color: var(--green);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.auth-right {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.auth-box {
  width: 100%;
  max-width: 380px;
}

.auth-tabs {
  display: flex;
  gap: 0;
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--border);
}

.auth-tabs button {
  background: none;
  border: none;
  color: var(--white-dim);
  padding: 0.75rem 1.5rem;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
}

.auth-tabs button.active {
  color: var(--green);
  border-bottom-color: var(--green);
}

.error-banner {
  background: rgba(255, 82, 82, 0.1);
  border: 1px solid rgba(255, 82, 82, 0.3);
  color: #ff5252;
  padding: 0.75rem 1rem;
  font-size: 0.8rem;
  border-radius: var(--radius);
  margin-bottom: 1rem;
}

.divider {
  text-align: center;
  margin: 1.5rem 0;
  position: relative;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--border);
}

.divider span {
  position: relative;
  background: var(--black);
  padding: 0 1rem;
  font-size: 0.75rem;
  color: var(--white-dim);
  opacity: 0.5;
}

.btn-google {
  width: 100%;
  background: var(--black-3);
  border: 1px solid var(--border);
  color: var(--white);
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  font-size: 0.875rem;
}

.btn-google:hover { border-color: var(--green); }

@media (max-width: 768px) {
  .auth-page { grid-template-columns: 1fr; }
  .auth-left { display: none; }
}
</style>
