
```markdown
# Todo App - Full Stack

Bu proje, modern web teknolojileri kullanılarak oluşturulmuş tam kapsamlı bir Todo List uygulamasıdır. Kullanıcıların görevleri oluşturmasına, düzenlemesine, silmesine ve tamamlandı olarak işaretlemesine olanak tanır.

## Teknoloji Yığını

### Frontend
- React 19
- Material-UI (MUI)
- Axios

### Backend
- Express.js
- Prisma ORM
- PostgreSQL
- REST API

## Özellikler

- Todo oluşturma, düzenleme, silme
- Todo'ları tamamlandı olarak işaretleme
- Responsive tasarım (mobil, tablet ve masaüstü)
- Hata yönetimi ve bildirimler
- Veritabanı kalıcılığı

## Kurulum ve Çalıştırma

### Gereksinimler

- Node.js (v14 veya üzeri)
- PostgreSQL veritabanı

### Backend

```bash
# Backend klasörüne gidin
cd backend

# Bağımlılıkları yükleyin
npm install

# .env dosyasını oluşturun ve düzenleyin
# DATABASE_URL="postgresql://kullanıcıadı:şifre@localhost:5432/todoapp?schema=public"

# Veritabanı migration'larını çalıştırın
npx prisma migrate dev --name init

# Sunucuyu başlatın
npm run dev
```

### Frontend

```bash
# Frontend klasörüne gidin
cd frontend

# Bağımlılıkları yükleyin
npm install

# Uygulamayı başlatın
npm start
```

Uygulama şu adreslerde çalışacaktır:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001/api

## API Endpoint'leri

- `GET /api/todos` - Tüm todo'ları listele
- `GET /api/todos/:id` - Bir todo'yu getir
- `POST /api/todos` - Yeni todo oluştur
- `PUT /api/todos/:id` - Todo güncelle
- `DELETE /api/todos/:id` - Todo sil
```