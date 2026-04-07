<template>
  <div class="auth-page">
    <div class="auth-left">
      <router-link to="/" class="auth-logo">
        <span class="logo-mark"></span> MzansiBuilds
      </router-link>
      <div class="auth-quote">
        <p>"Build in public.<br>Grow together."</p>
        <span>MzansiBuilds Community</span>
      </div>
    </div>

    <div class="auth-right">
      <div class="auth-box">
        <h2>{{ mode === 'login' ? 'Welcome back' : 'Create account' }}</h2>
        <p class="auth-sub">{{ mode === 'login' ? 'Sign in to your account' : 'Join the community' }}</p>

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

        <div class="divider"><span>or continue with</span></div>

        <button class="btn-google" @click="handleGoogle" :disabled="loading">
          <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#4285F4" d="M44.5 20H24v8.5h11.8C34.7 33.9 29.8 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 5.1 29.6 3 24 3 12.9 3 4 11.9 4 23s8.9 20 20 20c11 0 19.7-7.7 19.7-20 0-1.3-.1-2.7-.2-3z"/></svg>
          Google
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
.auth-page { display: grid; grid-template-columns: 1fr 1fr; min-height: 100vh; }

.auth-left {
  background: var(--green);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 2.5rem;
}

.auth-logo {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 800;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logo-mark { width: 8px; height: 8px; background: #fff; border-radius: 50%; display: inline-block; }

.auth-quote { padding-bottom: 1rem; }
.auth-quote p { font-family: var(--font-display); font-size: 2rem; font-weight: 800; line-height: 1.2; color: #fff; margin-bottom: 0.75rem; }
.auth-quote span { font-size: 0.8rem; color: rgba(255,255,255,0.7); font-weight: 500; }

.auth-right { display: flex; align-items: center; justify-content: center; padding: 2rem; background: var(--bg); }

.auth-box { width: 100%; max-width: 380px; }

.auth-box h2 { font-size: 1.5rem; margin-bottom: 0.25rem; }
.auth-sub { color: var(--text-secondary); font-size: 0.875rem; margin-bottom: 1.75rem; }

.auth-tabs { display: flex; gap: 0.25rem; background: var(--white); border: 1px solid var(--border); padding: 3px; border-radius: 8px; margin-bottom: 1.5rem; }
.auth-tabs button { flex: 1; background: transparent; border: none; color: var(--text-secondary); padding: 0.45rem; font-size: 0.85rem; font-weight: 500; border-radius: 6px; }
.auth-tabs button.active { background: var(--green); color: #fff; }

.error-banner { background: #fef2f2; border: 1px solid #fca5a5; color: #dc2626; padding: 0.75rem 1rem; font-size: 0.8rem; border-radius: var(--radius); margin-bottom: 1rem; }

.divider { text-align: center; margin: 1.25rem 0; position: relative; }
.divider::before { content: ''; position: absolute; top: 50%; left: 0; right: 0; height: 1px; background: var(--border); }
.divider span { position: relative; background: var(--bg); padding: 0 0.75rem; font-size: 0.75rem; color: var(--text-muted); }

.btn-google { width: 100%; background: var(--white); border: 1px solid var(--border); color: var(--text-primary); padding: 0.7rem 1rem; display: flex; align-items: center; justify-content: center; gap: 0.75rem; font-size: 0.875rem; font-weight: 500; box-shadow: var(--shadow-sm); }
.btn-google:hover { background: var(--bg); border-color: #d1d5db; }

@media (max-width: 768px) {
  .auth-page { grid-template-columns: 1fr; }
  .auth-left { display: none; }
}
</style>
