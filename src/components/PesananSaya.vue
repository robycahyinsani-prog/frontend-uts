<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth.js'

const auth = useAuthStore()
const pesanan = ref([])
const keadaan = ref('idle')

async function muatPesanan() {
  keadaan.value = 'loading'
  try {
    const response = await auth.apiFetch('orders/saya')
    if (!response.ok) {
      throw new Error('Status HTTP: ' + response.status)
    }
    const data = await response.json()
    pesanan.value = data
    keadaan.value = data.length === 0 ? 'empty' : 'success'
  } catch (error) {
    console.error('Gagal memuat pesanan:', error)
    keadaan.value = 'error'
  }
}

onMounted(muatPesanan)
</script>

<template>
  <section class="pesanan-saya">
    <h2>Pesanan Saya</h2>
    <p v-if="keadaan === 'loading'">Memuat pesanan...</p>
    <p v-else-if="keadaan === 'empty'">Belum ada pesanan.</p>
    <p v-else-if="keadaan === 'error'">Gagal memuat pesanan.</p>
    <ul v-else-if="keadaan === 'success'">
      <li v-for="p in pesanan" :key="p.id">
        {{ p.produk }} x{{ p.jumlah }} — Rp {{ p.total.toLocaleString('id-ID') }}
      </li>
    </ul>
  </section>
</template>

<style scoped>
.pesanan-saya {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
.pesanan-saya h2 {
  color: #0b4f6c;
  font-size: 1.1rem;
  margin-bottom: 0.75rem;
}
</style>
