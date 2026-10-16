import { defineStore } from 'pinia'

const API = 'http://127.0.0.1:8000'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null, // masih di memori saja: hilang saat refresh
  }),

  getters: {
    isLoggedIn: (state) => state.token !== null,
  },

  actions: {
    async login(username, password) {
      const response = await fetch(`${API}/auth/login`, {
        method: 'POST',
        body: new URLSearchParams({ username, password }),
      })

      if (response.status === 429) {
        throw new Error('Terlalu banyak percobaan. Tunggu satu menit.')
      }
      if (!response.ok) {
        throw new Error('Username atau password salah')
      }

      const data = await response.json()
      this.token = data.access_token
    },

    logout() {
      this.token = null
    },

    async apiFetch(path, options = {}) {
      const response = await fetch(`${API}/${path}`, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${this.token}`,
        },
      })

      if (response.status === 401) {
        this.token = null
        throw new Error('Sesi berakhir, silakan login lagi')
      }

      return response
    },
  },
})
