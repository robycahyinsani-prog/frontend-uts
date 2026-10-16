<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth.js'

const auth = useAuthStore()

const username = ref('')
const password = ref('')
const keadaan = ref('idle')
const pesanError = ref('')

async function kirim() {
  keadaan.value = 'loading'
  try {
    await auth.login(username.value, password.value)
    password.value = ''
    keadaan.value = 'idle'
  } catch (error) {
    pesanError.value = error.message
    keadaan.value = 'error'
  }
}
</script>

<template>
  <div class="login-wrapper">
    <form class="login-form" @submit.prevent="kirim">
      <h2>Masuk ke Dashboard</h2>
      <input
        v-model="username"
        type="text"
        placeholder="Username"
        autocomplete="username"
        required
      />
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        autocomplete="current-password"
        required
      />
      <button type="submit" :disabled="keadaan === 'loading'">
        {{ keadaan === 'loading' ? 'Memeriksa...' : 'Masuk' }}
      </button>
      <p v-if="keadaan === 'error'" class="pesan-error">{{ pesanError }}</p>
    </form>
  </div>
</template>

<style scoped>
.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #f3f7f8;
}
.login-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 22rem;
}
.login-form h2 {
  color: #0b4f6c;
  margin-bottom: 0.5rem;
  text-align: center;
}
.login-form input {
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
}
.login-form button {
  padding: 0.75rem;
  border: none;
  border-radius: 6px;
  background: #0b4f6c;
  color: white;
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
}
.login-form button:hover {
  background: #056688;
}
.login-form button:disabled {
  background: #aaa;
  cursor: not-allowed;
}
.pesan-error {
  color: #b00020;
  font-size: 0.9rem;
  text-align: center;
}
</style>
