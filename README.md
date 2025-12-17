# Final Project Web Programming

Tech stack:
- Laravel 11 (Backend)
- Inertia.js (Bridge)
- React + Vite (Frontend)
- Tailwind CSS v3
- MySQL (via XAMPP / MariaDB)

Repositori ini **tidak menggunakan starter kit** (Breeze / Jetstream). Semua setup dilakukan manual.

---

## 1. Requirements
Pastikan tools berikut **SUDAH TERINSTALL** di komputer kamu:

- PHP **>= 8.2**
- Composer
- Node.js **>= 18** (disarankan)
- NPM
- XAMPP (Apache + MySQL / MariaDB)

Cek versi:
```bash
php -v
composer -V
node -v
npm -v
```

---

## 2. Clone Repository

```bash
git clone <URL_REPOSITORY>
cd final-project-webprog
```

---

## 3. Install Backend Dependencies (Laravel)

```bash
composer install
```

---

## 4. Install Frontend Dependencies (Vite + React + Tailwind)

```bash
npm install
```

---

## 5. Environment Configuration

### 5.1 Copy file `.env`

```bash
cp .env.example .env
```

(Windows PowerShell)
```powershell
copy .env.example .env
```

---

### 5.2 Database Configuration

Pastikan **MySQL di XAMPP sudah RUNNING (Apache & MySQL hijau)**.

Edit file `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3307
DB_DATABASE=waste_management
DB_USERNAME=root
DB_PASSWORD=

DB_CHARSET=utf8mb4
DB_COLLATION=utf8mb4_unicode_ci
```

> ⚠️ **Catatan penting**  
> Port default MySQL biasanya `3306`. Jika MySQL kamu di `3306`, ganti `3307` ke `3306`.

---

## 6. Generate Application Key

```bash
php artisan key:generate
```

---

## 7. Database Migration

Jika database belum ada, Laravel akan otomatis menawarkan membuat database.

```bash
php artisan migrate
```

Jika terjadi error collation (MariaDB):
```bash
php artisan migrate:fresh
```

---

## 8. Jalankan Development Server

⚠️ **WAJIB membuka 2 terminal**

### Terminal 1 — Laravel
```bash
php artisan serve
```

### Terminal 2 — Vite (React)
```bash
npm run dev
```

---

## 9. Akses Aplikasi

Buka browser:
```
http://127.0.0.1:8000
```

❌ **Jangan buka** `localhost:5173` (itu hanya Vite dev server).

---

## 10. Common Issues

### ❌ Vite manifest not found
Solusi:
```bash
npm run dev
```

---

### ❌ Unknown collation `utf8mb4_0900_ai_ci`

Pastikan:
- Database pakai **MariaDB / MySQL < 8**
- `.env` menggunakan:
```env
DB_COLLATION=utf8mb4_unicode_ci
```
- Jalankan ulang:
```bash
php artisan migrate:fresh
```

---

## 11. Git Ignore Notes

Folder berikut **TIDAK disimpan ke Git**:
- `node_modules`
- `vendor`
- `.env`

Pastikan selalu menjalankan:
```bash
composer install
npm install
```
setelah clone.

---

## 12. Development Notes

- Frontend: `resources/js`
- Pages Inertia: `resources/js/Pages`
- Layout React: `resources/js/Layouts`
- Tailwind CSS: `resources/css/app.css`

---

## 13. License

Project ini dibuat untuk keperluan **akademik / pembelajaran**.

