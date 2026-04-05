<template>
  <div id="app-wrapper">
    <nav class="navbar" v-if="!isAuthPage">
      <div class="container nav-inner">
        <router-link to="/" class="nav-logo">
          <span class="logo-bracket">[</span>MzansiBuilds<span class="logo-bracket">]</span>
        </router-link>

        <div class="nav-links">
          <router-link to="/feed">Feed</router-link>
          <router-link to="/celebration">Wall</router-link>
          <template v-if="authStore.user">
            <router-link to="/dashboard">Dashboard</router-link>
            <router-link to="/projects/new" class="btn-primary btn-sm">+ New Project</router-link>
            <button class="btn-ghost btn-sm" @click="authStore.logout()">Sign Out</button>
          </template>
          <template v-else>
            <router-link to="/auth" class="btn-primary btn-sm">Sign In</router-link>
          </template>
        </div>
      </div>
    </nav>

    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from './stores/auth.js'

const route = useRoute()
const authStore = useAuthStore()
const isAuthPage = computed(() => route.name === 'Auth')
</script>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(5, 10, 7, 0.92);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
}

.nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
}

.nav-logo {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--white);
  letter-spacing: -0.02em;
}

.logo-bracket { color: var(--green); }

.nav-links {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav-links a {
  color: var(--white-dim);
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: color var(--transition);
}

.nav-links a:hover,
.nav-links a.router-link-active { color: var(--green); }

.nav-links .btn-primary { color: var(--black); }
.nav-links .btn-primary:hover { color: var(--black); opacity: 1; }
</style>
