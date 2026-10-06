# ☕ Kopi Komar

Website UMKM kopi lokal **Kopi Komar** dengan formulir pemesanan interaktif. Dibuat dengan HTML, Tailwind CSS (CDN), dan JavaScript murni sebagai tugas praktikum web.

## Fitur

- Halaman informasi: Tentang Kami, Produk (tabel), Galeri (klik untuk memperbesar), Kontak, dan Video Profil
- Navigasi sticky dengan smooth scroll dan tombol kembali ke atas
- Formulir pemesanan dengan validasi dan penghitung karakter pesan
- Ringkasan harga langsung (produk, jumlah, pengiriman, diskon)
- Kode promo `KOPI10` untuk diskon 10%
- Struk pesanan yang bisa dicetak
- Simulasi status pesanan: Diproses → Disiapkan → Dikirim → Selesai
- Rating dan komentar setelah pesanan selesai
- Dashboard pesanan dan riwayat (disimpan di `localStorage`, maksimal 20 pesanan)
- **Kirim via WhatsApp**: konfirmasi pesanan dari struk
- **Pesan Lagi**: isi ulang form dari pesanan sebelumnya

## Struktur Proyek

```
Tugas 2/
├── index.html   # Struktur halaman dan modal
├── script.js    # Logika pemesanan, promo, struk, riwayat, rating
├── .gitignore
└── README.md
```

## Cara Menjalankan

1. Clone atau unduh repositori ini.
2. Buka `index.html` di browser (dua kali klik, atau gunakan ekstensi *Live Server* di VS Code).
3. Koneksi internet dibutuhkan untuk memuat Tailwind CSS, gambar Unsplash, dan video.

Tidak ada proses instalasi atau build.

## Cara Mencoba Alur Pemesanan

1. Isi nama, email, produk, dan jumlah, lalu centang persetujuan.
2. (Opsional) Masukkan kode promo `KOPI10` dan klik **Pakai**.
3. Klik **Kirim Pesanan** untuk melihat struk.
4. Klik **Simulasikan Status Berikutnya** sampai **Selesai** untuk memunculkan form rating.
5. Lihat riwayat di dashboard, lalu coba **Pesan Lagi**.

## Konfigurasi

- Harga produk dan ongkos kirim: objek `prices` dan `shippingPrices` di `script.js`
- Nomor WhatsApp penjual: ubah `6281234567890` pada URL `wa.me` di `script.js`

## Teknologi

HTML5 · Tailwind CSS v4 (browser CDN) · JavaScript (ES6) · Web Storage API

## Pembuat

**Achmad Tifli** — Sistem Informasi, Universitas Hasanuddin
