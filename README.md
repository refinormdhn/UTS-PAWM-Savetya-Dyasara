# Website Virtual Lab Savetya Dyasara

**Tim Savetya Dyasara Terdiri dari:**

  - **K-2 - 18223044 - Princessfa Azzahra Alvin**
  - **K-2 - 18223070 - Muhammad Refino Ramadhan**

Ini adalah repositori untuk Website Virtual Lab sebagai pengganti Ujian Tengah Semester. Proyek ini dikembangkan sebagai tugas untuk mata kuliah **II3140 Pengembangan Aplikasi Web dan Mobile**

Website ini sepenuhnya dibangun dari dasar menggunakan **HTML**, **CSS**, dan **JS** untuk menampilkan profil, keahlian, dan proyek-proyek yang pernah saya kerjakan dalam format yang bersih dan modern.

## 🚀 Pratinjau Langsung (Live Preview)

Anda bisa melihat hasil akhirnya di sini:

https://savetya-dyasara.vercel.app

<img width="1440" height="900" alt="Screenshot 2025-10-27 at 22 57 50" src="https://github.com/user-attachments/assets/a28ededc-fec5-4f21-bf50-1cbc575f4e2e" />

<img width="1440" height="900" alt="Screenshot 2025-10-27 at 23 02 11" src="https://github.com/user-attachments/assets/761cfd04-2a95-45ac-be7a-3ca48fe95176" />

<img width="1440" height="900" alt="Screenshot 2025-10-27 at 23 02 31" src="https://github.com/user-attachments/assets/0b274125-6709-488f-a2d4-70cab67caaf5" />

<img width="1440" height="900" alt="Screenshot 2025-10-27 at 23 10 25" src="https://github.com/user-attachments/assets/fcd189d4-0eca-4b3a-b5b1-61446227d796" />

-----
## 🎯 Deskripsi Proyek

**Savetya Dyasara** adalah aplikasi berbasis web yang terdiri atas tiga fitur utama:
1. 🧠 **Learn** — Menyediakan materi pembelajaran dalam bentuk PDF yang dapat diakses oleh pengguna.  
2. 📝 **Quiz** — Memberikan latihan interaktif yang diambil dari Supabase.  
3. 🔐 **Login** — Autentikasi sederhana menggunakan email domain `@std.stei.itb.ac.id` untuk membatasi akses pengguna.

---

## 🧰 Teknologi yang Digunakan

### Frontend
- **HTML5** — Struktur halaman (`learn.html`, `quiz.html`, `login.html`, `index.html`).
- **CSS3** — Styling, dengan file terpisah per halaman (`learn.css`, `quiz.css`, `login.css`, `style.css`).
- **JavaScript (ES6+)** — Logika interaktif untuk tiap halaman (`learn.js`, `quiz.js`, `login.js`, `script.js`).

### Backend
- **Node.js + Express.js** — Server API sederhana.
- **dotenv** — Untuk mengelola konfigurasi environment.
- **node-fetch** — Untuk melakukan request HTTP ke Supabase API.

### Database
- **Supabase** - Penyimpan data 

---

## 📂 Struktur Proyek

```
📦 UTS-PAWM-Savetya-Dyasara
├── 📁 css
│ ├── 🎨 learn.css
│ ├── 🎨 login.css
│ ├── 🎨 quiz.css
│ └── 🎨 style.css
│
├── 📁 img
│ ├── 🖼️ home.png
│ ├── 🖼️ login.png
│ ├── 🖼️ logo.png
│ └── 🖼️ profile.png
│
├── 📁 js
│ ├── ⚙️ learn.js
│ ├── ⚙️ login.js
│ ├── ⚙️ quiz.js
│ ├── ⚙️ script.js
│ └── 🖥️ server.js
│
├── 📁 materials
│ ├── 📘 Delivery-Techniques--Drafting-Conclusion-and-Writing-a-Process.pdf
│ ├── 📘 Engaging-Your-Audience-and-Drafting-Openers.pdf
│ ├── 📘 Handling-Questions-and-Body-Language.pdf
│ └── 📘 Visual-Aids-and-Drafting-Body-of-Presentation.pdf
│
├── 🏠 index.html
├── 📄 learn.html
├── 📄 login.html
├── 📄 quiz.html
├── 📦 package.json
├── 📦 package-lock.json
└── 🧾 README.md
```

-----
