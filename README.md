Aplikasi Vue 3 (Composition API) untuk menampilkan, mencari, mengurutkan, menambah, dan menghapus data barang inventaris dari backend FastAPI.

## Cara Menjalankan

1. Pastikan **backend FastAPI** sudah berjalan di `http://127.0.0.1:8000`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Jalankan dev server:
   ```bash
   npm run dev
   ```
4. Buka `http://localhost:5173` di browser.

## Fitur

- 4 tile ringkasan dihitung dengan `computed`:
  - Total Barang
  - Stok Menipis + Habis
  - Jumlah Kategori (unik)
  - Total Unit
- **Pencarian** berdasarkan nama atau kategori (dengan `computed`).
- **Urutkan A-Z / Z-A** berdasarkan nama (chained `computed`).
- **Badge status stok** otomatis berwarna sesuai jumlah stok.
- **Form tambah barang** (POST) dan **tombol hapus** (DELETE).
- **State handling:** loading, empty, error, success.
- **Responsif:** desktop (4 kolom tile), tablet (2 kolom), mobile (1 kolom).

## Ambang Batas Status Stok

| Status | Rentang Stok | Warna Badge |
|---|---|---|
| **Aman** | > 25 | Hijau |
| **Menipis** | 1 – 25 | Oranye |
| **Habis** | 0 | Merah |

## Teknologi

- Vue 3 (Composition API)
- Vite
- Fetch API (async/await)
- CSS Flexbox & Grid (native, tanpa library)
```

### Langkah 4: Simpan

Tekan **`Ctrl + S`**.

## Hasil Akhir

Setelah disimpan, `README.md` Anda akan berisi informasi:
- Nama proyek.
- Cara menjalankan.
- Daftar fitur.
- Ambang batas status stok (**wajib** sesuai ketentuan UTS).
- Teknologi yang dipakai.

Ini memenuhi **ketentuan UTS poin "kerapian README"** (bobot 10 poin). 


##  Lanjut: Buat README di `backend-uts` Juga

Setelah `frontend-uts` selesai, buat juga README di `backend-uts`:

1. Buka folder `backend-uts` di VS Code.
2. Buat file **`README.md`** (kalau belum ada).
3. Isi dengan:

```markdown
# Backend UTS - Inventaris FastAPI

Backend REST API untuk Dashboard Inventaris, dibangun dengan FastAPI + Pydantic.

## Cara Menjalankan

1. Buat virtual environment:
   ```bash
   py -m venv venv
   ```
2. Aktifkan venv (Windows):
   ```bash
   venv\Scripts\activate.bat
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Jalankan server:
   ```bash
   uvicorn main:app --reload
   ```
5. Buka `http://127.0.0.1:8000/docs` untuk Swagger UI.

## Endpoint

| Method | Path | Deskripsi |
|---|---|---|
| GET | `/` | Cek server berjalan |
| GET | `/barang` | Ambil semua barang |
| POST | `/barang` | Tambah barang baru |
| DELETE | `/barang/{id}` | Hapus barang berdasarkan id |

## Data Seed

Data awal disimpan di `data.json` (24 barang) dengan field:
- `id` (int)
- `nama` (str)
- `kategori` (str)
- `jumlah_stok` (int, >= 0)
- `lokasi_gudang` (str)

## Ambang Batas Status Stok

- **Aman:** > 25
- **Menipis:** 1 – 25
- **Habis:** 0
```

Simpan.

---

##FASE 5a

| No | Aksi | Status |
|---|---|---|
| 1 | Ganti isi `README.md` di `frontend-uts` | ⬅ **Sekarang** |
| 2 | Buat `README.md` di `backend-uts` |  |
| 3 | Simpan keduanya |  |

