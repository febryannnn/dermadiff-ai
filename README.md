# Repository Structure

Repository **DermaDiff AI** terdiri dari dua bagian utama:

* `fine-tune/` — berisi seluruh kebutuhan eksperimen dan fine-tuning model AI.
* `website/` — berisi aplikasi web, yang terdiri dari backend dan frontend.

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

Berisi pipeline untuk eksperimen machine learning, mulai dari persiapan dataset, fine-tuning diffusion model, pembuatan synthetic images, hingga evaluasi.

| Folder/File        | Deskripsi                                               |
| ------------------ | ------------------------------------------------------- |
| `assets/`          | Asset dan gambar pendukung dokumentasi pipeline         |
| `dataset/`         | Script untuk memperoleh dan menyiapkan dataset          |
| `evaluation/`      | Script untuk evaluasi kualitas image dan performa model |
| `models/`          | Implementasi eksperimen berdasarkan diffusion model     |
| `dataset_prep.py`  | Persiapan dan pembagian dataset sebelum proses training |
| `requirements.txt` | Dependency Python untuk pipeline fine-tuning            |
| `README.md`        | Dokumentasi khusus bagian fine-tuning                   |

### `fine-tune/models/`

Berisi eksperimen berdasarkan model diffusion yang berbeda.

| Folder                           | Deskripsi                                         |
| -------------------------------- | ------------------------------------------------- |
| `stable-diffusion-2.1-base/`     | Eksperimen Stable Diffusion 2.1 dengan LoRA       |
| `stable-diffusion-xl-base/`      | Eksperimen Stable Diffusion XL dengan LoRA        |
| `stable-diffusion-3.5_large/`    | Eksperimen Stable Diffusion 3.5 Large dengan LoRA |
| `stable-diffusion-xl-base-dora/` | Eksperimen Stable Diffusion XL dengan DoRA        |

Setiap folder model umumnya berisi script untuk:

* fine-tuning;
* generate synthetic images;
* training classifier;
* evaluation;
* hasil atau weights fine-tuning.

---

## `website/`

Berisi implementasi aplikasi web DermaDiff AI.

```text
website/
├── backend/
└── frontend/
```

### `website/backend/`

Backend yang menangani inference model dan menyediakan API untuk frontend.

```text
backend/
├── api/
├── core/
├── models/
├── app.py
└── README.md
```

| Folder/File | Deskripsi                                      |
| ----------- | ---------------------------------------------- |
| `api/`      | Endpoint API dan routing                       |
| `core/`     | Configuration dan constants                    |
| `models/`   | Implementasi model AI yang digunakan backend   |
| `app.py`    | Entry point dan konfigurasi deployment backend |
| `README.md` | Dokumentasi backend                            |

### `website/frontend/`

Frontend aplikasi berbasis Next.js.

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

| Folder/File       | Deskripsi                                              |
| ----------------- | ------------------------------------------------------ |
| `public/`         | Static assets                                          |
| `src/app/`        | Halaman dan routing aplikasi                           |
| `src/components/` | Reusable UI components                                 |
| `src/lib/`        | Utility dan helper, termasuk komunikasi dengan backend |
| `package.json`    | Dependency dan script frontend                         |
| `next.config.ts`  | Konfigurasi Next.js                                    |
| `tsconfig.json`   | Konfigurasi TypeScript                                 |

---

## Ringkasan

Secara sederhana, struktur repository dapat dipahami sebagai:

```text
dermadiff-ai/
│
├── fine-tune/        → Research & Model Training
│   ├── dataset/      → Dataset preparation
│   ├── models/       → Diffusion model experiments
│   └── evaluation/   → Model & image evaluation
│
└── website/          → Web Application
    ├── backend/      → API & AI inference
    └── frontend/     → User interface
```

Dengan pembagian tersebut, **`fine-tune/` berfokus pada pengembangan dan eksperimen model**, sedangkan **`website/` berfokus pada penggunaan model melalui aplikasi web**.
