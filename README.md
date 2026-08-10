# Repository Structure

Repository ini terdiri dari dua bagian utama, yaitu `fine-tune` dan `website`.

```text
dermadiff-ai/
│
├── fine-tune/
│   ├── assets/
│   ├── dataset/
│   ├── evaluation/
│   ├── models/
│   │   ├── stable-diffusion-2.1-base/
│   │   ├── stable-diffusion-xl-base/
│   │   ├── stable-diffusion-3.5_large/
│   │   └── stable-diffusion-xl-base-dora/
│   ├── dataset_prep.py
│   ├── requirements.txt
│   └── README.md
│
└── website/
    ├── backend/
    │   ├── api/
    │   ├── core/
    │   ├── models/
    │   ├── app.py
    │   └── README.md
    │
    └── frontend/
        ├── public/
        ├── src/
        │   ├── app/
        │   ├── components/
        │   └── lib/
        ├── package.json
        ├── next.config.ts
        ├── tsconfig.json
        └── README.md
```

## `fine-tune/`

Folder ini berisi kode dan konfigurasi yang digunakan untuk proses persiapan dataset, fine-tuning, pembuatan citra sintetis, dan evaluasi model.

| Direktori/File     | Keterangan                                                                 |
| ------------------ | -------------------------------------------------------------------------- |
| `assets/`          | Berisi aset pendukung dokumentasi dan visualisasi.                         |
| `dataset/`         | Berisi script yang berkaitan dengan pengambilan dan persiapan dataset.     |
| `evaluation/`      | Berisi script untuk melakukan evaluasi model dan citra hasil generasi.     |
| `models/`          | Berisi implementasi dan konfigurasi fine-tuning untuk masing-masing model. |
| `dataset_prep.py`  | Digunakan untuk mempersiapkan dataset sebelum proses training.             |
| `requirements.txt` | Daftar dependency Python yang diperlukan.                                  |
| `README.md`        | Dokumentasi untuk bagian `fine-tune`.                                      |

### `fine-tune/models/`

Direktori ini memisahkan eksperimen berdasarkan model yang digunakan.

* `stable-diffusion-2.1-base/` — eksperimen menggunakan Stable Diffusion 2.1.
* `stable-diffusion-xl-base/` — eksperimen menggunakan Stable Diffusion XL dengan LoRA.
* `stable-diffusion-3.5_large/` — eksperimen menggunakan Stable Diffusion 3.5 Large dengan LoRA.
* `stable-diffusion-xl-base-dora/` — eksperimen menggunakan Stable Diffusion XL dengan DoRA.

Setiap direktori model memiliki script yang berkaitan dengan proses fine-tuning, pembuatan citra, training classifier, dan evaluasi.

---

## `website/`

Folder ini berisi aplikasi web DermaDiff AI yang terdiri dari backend dan frontend.

### `website/backend/`

Backend bertanggung jawab terhadap penyediaan API dan proses inference model.

```text
backend/
├── api/
├── core/
├── models/
├── app.py
└── README.md
```

* `api/` — berisi endpoint dan routing API.
* `core/` — berisi konfigurasi dan konstanta yang digunakan oleh backend.
* `models/` — berisi implementasi model yang digunakan dalam proses inference.
* `app.py` — entry point dan konfigurasi aplikasi backend.
* `README.md` — dokumentasi backend.

### `website/frontend/`

Frontend merupakan antarmuka aplikasi yang dibangun menggunakan Next.js.

```text
frontend/
├── public/
├── src/
│   ├── app/
│   ├── components/
│   └── lib/
├── package.json
├── next.config.ts
└── tsconfig.json
```

* `public/` — berisi aset statis.
* `src/app/` — berisi halaman dan routing aplikasi.
* `src/components/` — berisi komponen antarmuka yang dapat digunakan kembali.
* `src/lib/` — berisi fungsi utilitas dan kebutuhan komunikasi dengan backend.
* `package.json` — konfigurasi dependency dan script project.
* `next.config.ts` — konfigurasi Next.js.
* `tsconfig.json` — konfigurasi TypeScript.

---

## Summary

Secara umum, pembagian repository adalah sebagai berikut:

```text
fine-tune/
└── Persiapan dataset, fine-tuning, dan evaluasi model

website/
├── backend/
│   └── API dan proses inference
└── frontend/
    └── Antarmuka aplikasi web
```
