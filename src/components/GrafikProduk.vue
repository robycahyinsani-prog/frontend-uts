<script setup>
import { ref, onMounted, watch } from 'vue'
import { Bar } from 'vue-chartjs'
import { useAgregasiStore } from '../stores/agregasi.js'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

// ← TAMBAHAN FASE E: pakai store
const agregasi = useAgregasiStore()

const chartData = ref({
  labels: [],
  datasets: [
    {
      label: 'Total Nilai (Rp)',
      data: [],
      backgroundColor: '#2a78d6',
    },
  ],
})

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
  },
}

// Data mentah dari API (belum difilter)
const semuaData = ref([])

// Baca filter dari URL (?produk=...)
const params = new URLSearchParams(window.location.search)
const produkFilter = ref(params.get('produk') || 'semua')

function terapkanFilter() {
  const data =
    produkFilter.value === 'semua'
      ? semuaData.value
      : semuaData.value.filter((d) => d.produk === produkFilter.value)

  chartData.value = {
    labels: data.map((d) => d.produk),
    datasets: [
      {
        label: 'Total Nilai (Rp)',
        data: data.map((d) => d.total_nilai),
        backgroundColor: '#2a78d6',
      },
    ],
  }
}

// ← DIUBAH FASE E: pakai store (bukan fetch langsung)
async function muatData() {
  semuaData.value = await agregasi.ambilProduk()
  terapkanFilter()
}

// Watch: setiap filter berubah, update URL
watch(produkFilter, (val) => {
  const url = new URL(window.location)
  url.searchParams.set('produk', val)
  window.history.replaceState({}, '', url)
  terapkanFilter()
})

onMounted(muatData)
</script>

<template>
  <div>
    <h2>Total Nilai Pesanan per Produk</h2>

    <label class="filter-label">
      Filter produk:
      <select v-model="produkFilter">
        <option value="semua">Semua Produk</option>
        <option v-for="d in semuaData" :key="d.produk" :value="d.produk">
          {{ d.produk }}
        </option>
      </select>
    </label>

    <!-- ← TAMBAHAN FASE E: tombol Muat Ulang -->
    <button @click="muatData" class="btn-reload">Muat Ulang</button>

    <div role="img" aria-label="Grafik batang total nilai pesanan per produk">
      <Bar :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<style scoped>
h2 {
  font-size: 1.1rem;
  color: #0b4f6c;
  margin-bottom: 0.75rem;
}
.filter-label {
  display: block;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: #666;
}
.filter-label select {
  padding: 0.4rem 0.75rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  margin-left: 0.5rem;
  font-size: 0.9rem;
}
/* ← TAMBAHAN FASE E: CSS tombol */
.btn-reload {
  padding: 0.4rem 1rem;
  border: 1px solid #0b4f6c;
  border-radius: 6px;
  background: white;
  color: #0b4f6c;
  cursor: pointer;
  font-weight: bold;
  margin-bottom: 1rem;
  margin-left: 1rem;
}
.btn-reload:hover {
  background: #0b4f6c;
  color: white;
}
</style>
