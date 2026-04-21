#!/bin/bash
# ─── Hotel Booking — Backend Setup ───────────────────────────────────────────
set -e

echo ""
echo "🏨  Hotel Booking — Backend Setup"
echo "────────────────────────────────────"

# Check Python
if ! command -v python3 &> /dev/null; then
  echo "❌ Python 3 не найден. Установите Python 3.10+"
  exit 1
fi

echo "✅ Python: $(python3 --version)"

# Virtual environment
if [ ! -d "venv" ]; then
  echo "📦 Создаём виртуальное окружение..."
  python3 -m venv venv
fi

# Activate
source venv/bin/activate
echo "✅ Виртуальное окружение активировано"

# Install deps
echo "📦 Устанавливаем зависимости..."
pip install -r requirements.txt -q

# Migrations
echo "🗃️  Выполняем миграции..."
python manage.py migrate --run-syncdb

# Seed data
echo "🌱 Загружаем тестовые данные..."
python seed_data.py

echo ""
echo "────────────────────────────────────"
echo "✅ Backend готов!"
echo ""
echo "▶️  Запуск сервера:"
echo "   source venv/bin/activate"
echo "   python manage.py runserver"
echo ""
echo "📖  Django Admin: http://localhost:8000/admin"
echo "   admin / admin123"
echo ""
