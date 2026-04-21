#!/bin/bash
# ─── Hotel Booking — Frontend Setup ──────────────────────────────────────────
set -e

echo ""
echo "🎨  Hotel Booking — Frontend Setup"
echo "────────────────────────────────────"

# Check Node
if ! command -v node &> /dev/null; then
  echo "❌ Node.js не найден. Установите Node.js 18+"
  echo "   https://nodejs.org"
  exit 1
fi

echo "✅ Node: $(node --version)"
echo "✅ npm:  $(npm --version)"

# Install deps
echo "📦 Устанавливаем зависимости..."
npm install

echo ""
echo "────────────────────────────────────"
echo "✅ Frontend готов!"
echo ""
echo "▶️  Запуск dev-сервера:"
echo "   npm start"
echo ""
echo "🌐  Откройте: http://localhost:4200"
echo ""
