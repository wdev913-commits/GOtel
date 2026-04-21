# 🏨 Hotel Booking — Full Stack App

Django REST Framework + Angular 17

---

## 📁 Структура проекта

```
hotel_project/
├── backend/                  # Django + DRF
│   ├── hotel_booking/        # Настройки проекта
│   ├── hotels/               # Приложение (модели, views, сериализаторы)
│   ├── manage.py
│   ├── seed_data.py          # Тестовые данные
│   ├── requirements.txt
│   └── setup.sh              # Скрипт быстрой установки
├── frontend/                 # Angular 17
│   ├── src/app/
│   │   ├── pages/            # login, hotels, hotel-detail, bookings
│   │   ├── services/         # ApiService, AuthService
│   │   ├── interceptors/     # JWT interceptor
│   │   ├── guards/           # Auth guard
│   │   └── models/           # TypeScript интерфейсы
│   └── setup.sh
└── HotelBooking.postman_collection.json
```

---

## ⚙️ Требования

| Инструмент | Версия |
|---|---|
| Python | 3.10+ |
| Node.js | 18+ |
| npm | 9+ |

---

## 🚀 Быстрый старт

### 1. Backend

```bash
cd backend
chmod +x setup.sh
./setup.sh
```

Или вручную:

```bash
cd backend
python3 -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python seed_data.py
python manage.py runserver
```

**Backend запустится на:** `http://localhost:8000`

---

### 2. Frontend (в новом терминале)

```bash
cd frontend
chmod +x setup.sh
./setup.sh
npm start
```

**Frontend запустится на:** `http://localhost:4200`

---

## 🔑 Тестовые аккаунты

| Логин | Пароль | Роль |
|---|---|---|
| `admin` | `admin123` | Суперпользователь |
| `testuser` | `test123` | Обычный пользователь |

**Django Admin:** `http://localhost:8000/admin`

---

## 📡 API Endpoints

### Auth
| Метод | URL | Описание |
|---|---|---|
| POST | `/api/auth/register/` | Регистрация |
| POST | `/api/auth/login/` | Вход (получить JWT) |
| POST | `/api/auth/logout/` | Выход (blacklist токен) |

### Hotels
| Метод | URL | Описание |
|---|---|---|
| GET | `/api/hotels/` | Список + фильтрация |
| GET | `/api/hotels/?city=Москва&stars=5` | С фильтрами |
| GET | `/api/hotels/{id}/` | Детали отеля |
| POST | `/api/hotels/` | Создать (только admin) |
| PUT | `/api/hotels/{id}/` | Обновить (только admin) |
| DELETE | `/api/hotels/{id}/` | Удалить (только admin) |

### Rooms
| Метод | URL | Описание |
|---|---|---|
| GET | `/api/hotels/{id}/rooms/` | Список номеров |
| POST | `/api/hotels/{id}/rooms/` | Создать (только admin) |

### Bookings
| Метод | URL | Описание |
|---|---|---|
| GET | `/api/bookings/` | Мои бронирования |
| POST | `/api/bookings/` | Создать бронь |
| DELETE | `/api/bookings/{id}/` | Отменить бронь |

### Reviews
| Метод | URL | Описание |
|---|---|---|
| GET | `/api/hotels/{id}/reviews/` | Отзывы |
| POST | `/api/hotels/{id}/reviews/` | Добавить отзыв |

---

## 🎨 Frontend Страницы

| URL | Страница | Auth |
|---|---|---|
| `/login` | Вход / Регистрация | - |
| `/hotels` | Список отелей с фильтрами | - |
| `/hotels/:id` | Детали отеля + Бронирование | Нужна для брони |
| `/bookings` | Мои брони | ✅ |

---

## ✅ Чек-лист ТЗ

### Backend
- [x] 4+ модели: User, Hotel, Room, Booking, Review
- [x] HotelSerializer (ModelSerializer)
- [x] RoomSerializer (ModelSerializer)
- [x] BookingSerializer (custom validation — даты, пересечение броней)
- [x] AuthSerializer (Serializer)
- [x] FBV: login_view, logout_view, register_view
- [x] CBV (APIView): HotelListView, HotelDetailView, BookingView, ReviewView
- [x] JWT (SimpleJWT) + blacklist токена при logout
- [x] Полный CRUD для Hotel и Booking
- [x] Фильтрация: город, цена, звёзды, доступность, вместимость
- [x] CORS для localhost:4200

### Frontend
- [x] Routing: /login, /hotels, /bookings + /hotels/:id
- [x] ApiService (все запросы через него)
- [x] 4+ события: Войти, Забронировать, Фильтр, Удалить бронь
- [x] 4+ ngModel формы: login, фильтр, бронирование, отзыв
- [x] @for и @if директивы
- [x] JWT interceptor (добавляет Bearer токен)
- [x] Auth guard для /bookings
- [x] localStorage для токена

### Postman
- [x] Auth (login, logout, register)
- [x] Hotels (list, create, update, delete)
- [x] Rooms (list, create)
- [x] Bookings (list, create, delete)
- [x] Примеры ответов

---

## 🛠️ Windows пользователям

Замените `source venv/bin/activate` на:
```
venv\Scripts\activate
```
И `./setup.sh` запускайте через Git Bash или WSL.
