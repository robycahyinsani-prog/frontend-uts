<script setup>
import { ref, computed } from 'vue'
import BarangCard from './components/BarangCard.vue'

const sidebarTerbuka = ref(false)

function toggleSidebar() {
  sidebarTerbuka.value = !sidebarTerbuka.value
}

// --- State ---
const barangList = ref([])
const keadaan = ref('idle') // idle | loading | empty | error | success
const queryPencarian = ref('')
const arahUrutan = ref('asc') // asc | desc

// --- Form tambah ---
const formBaru = ref({
  nama: '',
  kategori: '',
  jumlah_stok: 0,
  lokasi_gudang: '',
})

// --- Fetch data dari backend ---
async function muatBarang() {
  keadaan.value = 'loading'
  try {
    const response = await fetch('http://127.0.0.1:8000/barang')
    if (!response.ok) {
      throw new Error('Status HTTP: ' + response.status)
    }
    const data = await response.json()

    if (data.length === 0) {
      keadaan.value = 'empty'
      return
    }

    barangList.value = data
    keadaan.value = 'success'
  } catch (error) {
    console.error('Gagal memuat data:', error)
    keadaan.value = 'error'
  }
}

// --- Computed: filter pencarian ---
const barangTersaring = computed(() => {
  const q = queryPencarian.value.toLowerCase().trim()
  if (!q) return barangList.value
  return barangList.value.filter(
    (b) => b.nama.toLowerCase().includes(q) || b.kategori.toLowerCase().includes(q),
  )
})

// --- Computed berantai: urutkan hasil pencarian ---
const barangTerurut = computed(() => {
  const salinan = [...barangTersaring.value]
  return salinan.sort((a, b) => {
    if (arahUrutan.value === 'asc') {
      return a.nama.localeCompare(b.nama)
    } else {
      return b.nama.localeCompare(a.nama)
    }
  })
})

// --- Computed: 4 tile ringkasan ---
const totalBarang = computed(() => barangList.value.length)

const stokMenipisHabis = computed(() => {
  return barangList.value.filter((b) => b.jumlah_stok >= 0 && b.jumlah_stok <= 25).length
})

const jumlahKategori = computed(() => {
  const kategoriSet = new Set(barangList.value.map((b) => b.kategori))
  return kategoriSet.size
})

const totalUnit = computed(() => {
  return barangList.value.reduce((sum, b) => sum + b.jumlah_stok, 0)
})

// --- Tambah barang (POST) ---
async function tambahBarang() {
  try {
    const response = await fetch('http://127.0.0.1:8000/barang', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formBaru.value),
    })

    if (!response.ok) {
      throw new Error('Status HTTP: ' + response.status)
    }

    // Reset form
    formBaru.value = {
      nama: '',
      kategori: '',
      jumlah_stok: 0,
      lokasi_gudang: '',
    }

    // Refresh data
    await muatBarang()
  } catch (error) {
    console.error('Gagal menambah barang:', error)
    alert('Gagal menambah barang. Coba lagi.')
  }
}

// --- Hapus barang (DELETE) ---
async function hapusBarang(id) {
  if (!confirm('Yakin ingin menghapus barang ini?')) return

  try {
    const response = await fetch(`http://127.0.0.1:8000/barang/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new Error('Status HTTP: ' + response.status)
    }

    // Refresh data
    await muatBarang()
  } catch (error) {
    console.error('Gagal menghapus barang:', error)
    alert('Gagal menghapus barang. Coba lagi.')
  }
}

// --- Muat data saat halaman dibuka ---
muatBarang()
</script>

<template>
  <div class="dashboard">
    <!-- Sidebar kiri -->
    <aside class="sidebar" :class="{ 'sidebar-open': sidebarTerbuka }">
      <h2 class="sidebar-brand">Inventaris</h2>
      <nav>
        <ul>
          <li><a href="#" class="nav-link active">Dashboard</a></li>
          <li><a href="#" class="nav-link">Laporan</a></li>
          <li><a href="#" class="nav-link">Pengaturan</a></li>
        </ul>
      </nav>
    </aside>

    <!-- Topbar kanan atas -->
    <!-- Topbar kanan atas -->
    <header class="topbar">
      <button id="menu-toggle" @click="toggleSidebar" aria-label="Open menu">≡</button>
      <h1>Dashboard Inventaris</h1>
    </header>

    <!-- Content kanan bawah -->
    <main class="content">
      <!-- 4 Tile Ringkasan -->
      <section class="ringkasan">
        <div class="tile">
          <p class="tile-label">Total Barang</p>
          <p class="tile-nilai">{{ totalBarang }}</p>
        </div>
        <div class="tile">
          <p class="tile-label">Stok Menipis + Habis</p>
          <p class="tile-nilai">{{ stokMenipisHabis }}</p>
        </div>
        <div class="tile">
          <p class="tile-label">Jumlah Kategori</p>
          <p class="tile-nilai">{{ jumlahKategori }}</p>
        </div>
        <div class="tile">
          <p class="tile-label">Total Unit</p>
          <p class="tile-nilai">{{ totalUnit }}</p>
        </div>
      </section>

      <!-- Form Tambah -->
      <section class="form-tambah">
        <h2>Tambah Barang Baru</h2>
        <div class="form-row">
          <input v-model="formBaru.nama" type="text" placeholder="Nama barang" />
          <input v-model="formBaru.kategori" type="text" placeholder="Kategori" />
          <input
            v-model.number="formBaru.jumlah_stok"
            type="number"
            min="0"
            placeholder="Jumlah stok"
          />
          <input v-model="formBaru.lokasi_gudang" type="text" placeholder="Lokasi gudang" />
          <button @click="tambahBarang">Tambah</button>
        </div>
      </section>

      <!-- Toolbar: Search & Sort -->
      <section class="toolbar">
        <input v-model="queryPencarian" type="text" placeholder="Cari nama atau kategori..." />
        <div class="sort-controls">
          <button @click="arahUrutan = 'asc'" :class="{ active: arahUrutan === 'asc' }">
            Urutkan A-Z
          </button>
          <button @click="arahUrutan = 'desc'" :class="{ active: arahUrutan === 'desc' }">
            Urutkan Z-A
          </button>
        </div>
      </section>

      <!-- State Handling -->
      <p v-if="keadaan === 'loading'">Memuat data...</p>
      <p v-else-if="keadaan === 'empty'">Tidak ada barang.</p>
      <p v-else-if="keadaan === 'error'">Gagal memuat data. Coba lagi.</p>
      <p v-else-if="keadaan === 'success' && barangTerurut.length === 0">
        Tidak ada barang yang cocok dengan pencarian.
      </p>

      <!-- Daftar Barang -->
      <ul v-else-if="keadaan === 'success'" class="daftar-barang">
        <BarangCard v-for="b in barangTerurut" :key="b.id" :barang="b" @hapus="hapusBarang" />
      </ul>
    </main>
  </div>
</template>

<style scoped>
/* ===== Layout Grid (seperti Dashboard Shell) ===== */
.dashboard {
  display: grid;
  grid-template-columns: 240px 1fr;
  grid-template-areas:
    'sidebar topbar'
    'sidebar content';
  min-height: 100vh;
}

/* ===== Sidebar ===== */
.sidebar {
  grid-area: sidebar;
  background: #0b4f6c;
  color: white;
  padding: 1.5rem 0;
}

.sidebar-brand {
  font-size: 1.25rem;
  padding: 0 1.5rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  margin-bottom: 1rem;
}

.sidebar nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-link {
  display: block;
  padding: 0.75rem 1.5rem;
  color: white;
  text-decoration: none;
  transition: background 0.2s;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.1);
}

.nav-link.active {
  background: rgba(255, 255, 255, 0.15);
  font-weight: bold;
}

/* ===== Topbar ===== */
.topbar {
  grid-area: topbar;
  background: white;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #dfe6e9;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.topbar h1 {
  font-size: 1.25rem;
  color: #0b4f6c;
}

/* ===== Content ===== */
.content {
  grid-area: content;
  padding: 1.5rem;
  background: #f3f7f8;
}

/* ===== Tile Ringkasan ===== */
.ringkasan {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.tile {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.tile-label {
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 0.25rem;
}

.tile-nilai {
  font-size: 1.75rem;
  font-weight: bold;
  color: #0b4f6c;
}

/* ===== Form Tambah ===== */
.form-tambah {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.form-tambah h2 {
  font-size: 1.1rem;
  margin-bottom: 0.75rem;
  color: #0b4f6c;
}

.form-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.form-row input {
  flex: 1 1 150px;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 0.95rem;
}

.form-row button {
  padding: 0.5rem 1.5rem;
  border: none;
  border-radius: 6px;
  background: #27ae60;
  color: white;
  font-weight: bold;
  cursor: pointer;
}

.form-row button:hover {
  background: #219150;
}

/* ===== Toolbar ===== */
.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
  align-items: center;
}

.toolbar input {
  flex: 1 1 200px;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 0.95rem;
}

.sort-controls {
  display: flex;
  gap: 0.5rem;
}

.sort-controls button {
  padding: 0.5rem 1rem;
  border: 1px solid #0b4f6c;
  border-radius: 6px;
  background: white;
  color: #0b4f6c;
  cursor: pointer;
  font-weight: bold;
}

.sort-controls button.active {
  background: #0b4f6c;
  color: white;
}

/* ===== Daftar Barang ===== */
.daftar-barang {
  list-style: none;
  padding: 0;
  margin: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
#menu-toggle {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #0b4f6c;
  margin-right: 0.5rem;
}

@media (min-width: 1024px) {
  #menu-toggle {
    display: none;
  }
}

@media (max-width: 1023px) {
  .sidebar.sidebar-open {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    width: 240px;
    height: 100vh;
    z-index: 10;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.2);
  }
}

/* ===== Responsif ===== */

/* Tablet: sidebar disembunyikan, tile 2 kolom */
@media (max-width: 1023px) {
  .dashboard {
    grid-template-columns: 1fr;
    grid-template-areas:
      'topbar'
      'content';
  }

  .sidebar {
    display: none;
  }

  .ringkasan {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Mobile: tile 1 kolom, form full width */
@media (max-width: 767px) {
  .ringkasan {
    grid-template-columns: 1fr;
  }

  .form-row input {
    flex: 1 1 100%;
  }

  .toolbar input {
    flex: 1 1 100%;
  }

  .content {
    padding: 1rem;
  }
}
</style>
