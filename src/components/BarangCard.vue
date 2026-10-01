<script setup>
defineProps({
  barang: {
    type: Object,
    required: true,
  },
})

defineEmits(['hapus'])
</script>

<template>
  <li class="barang-card">
    <div class="barang-info">
      <strong class="barang-nama">{{ barang.nama }}</strong>
      <span class="barang-detail">{{ barang.kategori }} · {{ barang.lokasi_gudang }}</span>
    </div>
    <div class="barang-aksi">
      <span
        class="badge"
        :class="{
          'badge-aman': barang.jumlah_stok > 25,
          'badge-menipis': barang.jumlah_stok > 0 && barang.jumlah_stok <= 25,
          'badge-habis': barang.jumlah_stok === 0,
        }"
      >
        {{ barang.jumlah_stok }}
      </span>
      <button class="btn-hapus" @click="$emit('hapus', barang.id)">Hapus</button>
    </div>
  </li>
</template>

<style scoped>
.barang-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e0e0e0;
  gap: 1rem;
}

.barang-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.barang-nama {
  font-size: 1rem;
  color: #1a2b3c;
}

.barang-detail {
  font-size: 0.85rem;
  color: #666;
}

.barang-aksi {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-weight: bold;
  font-size: 0.9rem;
  color: white;
  min-width: 40px;
  text-align: center;
}

.badge-aman {
  background: #27ae60;
}

.badge-menipis {
  background: #f39c12;
}

.badge-habis {
  background: #c0392b;
}

.btn-hapus {
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 6px;
  background: #c0392b;
  color: white;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: bold;
}

.btn-hapus:hover {
  background: #a93226;
}
</style>
