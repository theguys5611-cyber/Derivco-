import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth'
import { auth, googleProvider } from '../firebase/config.js'
import api from '../firebase/api.js'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const loading = ref(true)

  function init() {
    onAuthStateChanged(auth, async (firebaseUser) => {
      user.value = firebaseUser
      loading.value = false
      if (firebaseUser) {
        // Sync user to backend
        try {
          await api.post('/api/users/profile', {
            displayName: firebaseUser.displayName,
          })
        } catch (e) { /* silent */ }
      }
    })
  }

  async function loginWithGoogle() {
    const result = await signInWithPopup(auth, googleProvider)
    return result.user
  }

  async function loginWithEmail(email, password) {
    const result = await signInWithEmailAndPassword(auth, email, password)
    return result.user
  }

  async function registerWithEmail(email, password, displayName) {
    const result = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(result.user, { displayName })
    return result.user
  }

  async function logout() {
    await signOut(auth)
    user.value = null
  }

  return { user, loading, init, loginWithGoogle, loginWithEmail, registerWithEmail, logout }
})
