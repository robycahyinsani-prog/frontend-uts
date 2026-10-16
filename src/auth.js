import { ref, computed } from 'vue'

const API = 'http://127.0.0.1:8000'

// Token disimpan di MEMORI saja (hilang saat refresh halaman).
const token = ref(null)
const sudahLogin = computed(() => token.value !== null)

async function login(username, password) {
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
  token.value = data.access_token
}

function logout() {
  token.value = null
}

async function apiFetch(path, options = {}) {
  const response = await fetch(`${API}/${path}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token.value}`,
    },
  })

  if (response.status === 401) {
    token.value = null
    throw new Error('Sesi berakhir, silakan login lagi')
  }

  return response
}

export { sudahLogin, login, logout, apiFetch }
