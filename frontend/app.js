let favorites = new Set();
let currentHotelForBooking = null;
let currentView = 'list';

function renderStars(n) {
  return Array.from({length:5}, (_,i) => `<span class="star${i<n?'':' empty'}">★</span>`).join('');
}

function formatPrice(p) {
  return '₸' + p.toLocaleString('ru');
}

function renderHotels(hotels) {
  const container = document.getElementById('hotel-cards-container');
  if (!container) return;
  
  if (!hotels.length) {
    container.innerHTML = '<div style="text-align:center;padding:60px;background:white;border-radius:20px;border:1.5px dashed var(--lilac-200)"><div style="font-size:2.5rem;margin-bottom:12px">🔍</div><h3 style="font-family:Playfair Display,serif;color:var(--gray-700)">Нет совпадений</h3><p style="color:var(--gray-500);margin-top:6px">Попробуйте изменить фильтры</p></div>';
    return;
  }
  if (currentView === 'list') {
    container.innerHTML = hotels.map(h => `
      <div class="hotel-card" onclick="openBooking(${h.id})">
        <div class="hotel-img-wrap">
          <div class="hotel-img-placeholder">${h.emoji}</div>
          ${h.badge ? `<span class="hotel-badge ${h.badgeClass}">${h.badge}</span>` : ''}
          <button class="fav-heart-btn ${favorites.has(h.id)?'active':''}" onclick="toggleFav(event,${h.id})" title="В избранное">${favorites.has(h.id)?'♥':'♡'}</button>
        </div>
        <div class="hotel-info">
          <div>
            <div class="hotel-meta">
              <div>
                <div class="hotel-name">${h.name}</div>
                <div class="hotel-location">📍 ${h.location}</div>
              </div>
              <div class="hotel-stars">${renderStars(h.stars)}</div>
            </div>
            <div class="hotel-tags">
              ${h.tags.map(t => `<span class="tag tag-lilac">${t}</span>`).join('')}
              ${h.hasDiscount ? '<span class="tag tag-green">Скидка</span>' : ''}
            </div>
            <div class="hotel-amenities">${h.amenities.map(a=>`<span class="amenity-icon">${a}</span>`).join('')}</div>
          </div>
          <div class="hotel-footer">
            <div style="display:flex;align-items:center">
              <div class="hotel-score">${h.score}</div>
              <div class="hotel-score-info">
                <div class="score-label">${h.score>=9.5?'Исключительно':h.score>=9?'Превосходно':h.score>=8.5?'Очень хорошо':'Хорошо'}</div>
                <div class="score-reviews">${h.reviews.toLocaleString('ru')} отзывов</div>
              </div>
            </div>
            <div style="display:flex;align-items:center">
              <div class="hotel-price-section">
                ${h.oldPrice ? `<div class="price-old">${formatPrice(h.oldPrice)}</div>` : ''}
                <div class="price-main">${formatPrice(h.price)}</div>
                <div class="price-night">за ночь</div>
              </div>
              <button class="book-btn" onclick="openBooking(${h.id});event.stopPropagation()">Забронировать</button>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  } else {
    container.innerHTML = `<div class="fav-grid" style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px;">${hotels.map(h=>`
      <div class="fav-card" onclick="openBooking(${h.id})">
        <div class="fav-img-wrap"><div class="fav-img-placeholder">${h.emoji}</div></div>
        <div class="fav-body">
          <div class="fav-name">${h.name}</div>
          <div class="fav-loc">📍 ${h.location}</div>
          <div class="hotel-stars">${renderStars(h.stars)}</div>
          <div class="fav-footer">
            <div class="fav-price">${formatPrice(h.price)}<span style="font-size:0.75rem;color:var(--gray-500);font-family:DM Sans,sans-serif;font-weight:400">/ночь</span></div>
            <div class="fav-actions">
              <button class="btn-sm btn-danger" onclick="toggleFav(event,${h.id})">✕</button>
              <button class="btn-sm btn-primary" onclick="openBooking(${h.id})">Бронь</button>
            </div>
          </div>
        </div>
      </div>
    `).join('')}</div>`;
  }
  const countEl = document.getElementById('hotel-count-num');
  if (countEl) countEl.textContent = hotels.length;
}

function applyFilters() {
  const max = parseInt(document.getElementById('price-max')?.value) || 150000;
  const min = parseInt(document.getElementById('price-min')?.value) || 0;
  let result = HOTELS.filter(h => h.price >= min && h.price <= max);
  
  // Star filter
  const activeStars = Array.from(document.querySelectorAll('.star-chip.active')).map(el => parseInt(el.dataset.stars));
  if (activeStars.length > 0 && activeStars.length < 5) {
    result = result.filter(h => activeStars.includes(h.stars));
  }
  
  // Rating filter
  const ratingCheckboxes = document.querySelectorAll('.rating-checkbox:checked');
  let minRating = 0;
  if (ratingCheckboxes.length > 0) {
    minRating = Math.min(...Array.from(ratingCheckboxes).map(cb => parseInt(cb.dataset.minRating)));
    result = result.filter(h => h.score >= minRating);
  }
  
  // Amenities filter
  const selectedAmenities = Array.from(document.querySelectorAll('.amenity-checkbox:checked')).map(cb => cb.dataset.amenity);
  if (selectedAmenities.length > 0) {
    result = result.filter(h => {
      const amenityMap = {
        'pool': '🏊',
        'spa': '💆',
        'parking': '🅿️',
        'breakfast': '🍳',
        'gym': '🏋️',
        'pets': '🐾'
      };
      return selectedAmenities.every(a => h.amenities.includes(amenityMap[a]));
    });
  }
  
  renderHotels(result);
}

function resetFilters() {
  const priceMin = document.getElementById('price-min');
  const priceMax = document.getElementById('price-max');
  const priceSlider = document.getElementById('price-slider');
  if (priceMin) priceMin.value = 5000;
  if (priceMax) priceMax.value = 80000;
  if (priceSlider) priceSlider.value = 80000;
  document.querySelectorAll('.star-chip').forEach(chip => chip.classList.add('active'));
  document.querySelectorAll('.rating-checkbox').forEach(cb => cb.checked = true);
  document.querySelectorAll('.amenity-checkbox').forEach(cb => {
    if (cb.dataset.amenity === 'pool' || cb.dataset.amenity === 'spa' || cb.dataset.amenity === 'breakfast') {
      cb.checked = true;
    } else {
      cb.checked = false;
    }
  });
  applyFilters();
}

function sortHotels(val) {
  let sorted = [...HOTELS];
  if (val === 'price-asc') sorted.sort((a,b)=>a.price-b.price);
  else if (val === 'price-desc') sorted.sort((a,b)=>b.price-a.price);
  else if (val === 'rating') sorted.sort((a,b)=>b.score-a.score);
  else if (val === 'stars') sorted.sort((a,b)=>b.stars-a.stars);
  renderHotels(sorted);
}

function updateSlider(el) {
  const priceMax = document.getElementById('price-max');
  const priceMin = document.getElementById('price-min');
  const minVal = 5000;
  const maxVal = 150000;
  
  let value = parseInt(el.value);
  if (isNaN(value)) value = maxVal;
  value = Math.min(maxVal, Math.max(minVal, value));
  
  if (priceMax) priceMax.value = value;
  
  const pct = ((value - minVal) / (maxVal - minVal)) * 100;
  el.style.background = `linear-gradient(to right, var(--lilac-500) ${pct}%, var(--lilac-200) ${pct}%)`;
}

function setView(mode, btn) {
  currentView = mode;
  document.querySelectorAll('.view-btn').forEach(b=>b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  applyFilters();
}

function toggleFav(e, id) {
  e.stopPropagation();
  if (favorites.has(id)) favorites.delete(id);
  else favorites.add(id);
  const favCount = document.getElementById('fav-count');
  if (favCount) favCount.textContent = favorites.size;
  applyFilters();
  renderFavorites();
  showSuccess(favorites.has(id) ? 'Добавлено в избранное ♥' : 'Удалено из избранного');
}

function renderFavorites() {
  const container = document.getElementById('fav-container');
  if (!container) return;
  
  const favHotels = HOTELS.filter(h => favorites.has(h.id));
  if (!favHotels.length) {
    container.innerHTML = `<div class="fav-empty"><div class="fav-empty-icon">♡</div><h3>Избранное пусто</h3><p>Добавляйте отели нажав ♡ на карточке отеля</p></div>`;
    return;
  }
  container.innerHTML = `<div class="fav-grid">${favHotels.map(h=>`
    <div class="fav-card">
      <div class="fav-img-wrap"><div class="fav-img-placeholder">${h.emoji}</div></div>
      <div class="fav-body">
        <div class="fav-name">${h.name}</div>
        <div class="fav-loc">📍 ${h.location}</div>
        <div class="hotel-stars">${renderStars(h.stars)}</div>
        <div class="fav-footer">
          <div class="fav-price">${formatPrice(h.price)}<span style="font-size:0.75rem;color:var(--gray-500);font-family:DM Sans,sans-serif;font-weight:400">/ночь</span></div>
          <div class="fav-actions">
            <button class="btn-sm btn-danger" onclick="toggleFav(event,${h.id})">✕</button>
            <button class="btn-sm btn-primary" onclick="openBooking(${h.id})">Бронь</button>
          </div>
        </div>
      </div>
    </div>
  `).join('')}</div>`;
}

function openBooking(id) {
  const h = HOTELS.find(x=>x.id===id);
  if (!h) return;
  currentHotelForBooking = h;
  const modalHotelName = document.getElementById('modal-hotel-name');
  const modalHotelLoc = document.getElementById('modal-hotel-loc');
  const modalHotelPrice = document.getElementById('modal-hotel-price');
  const sumNight = document.getElementById('sum-night');
  const sumTax = document.getElementById('sum-tax');
  const sumTotal = document.getElementById('sum-total');
  const modal = document.getElementById('booking-modal');
  
  if (modalHotelName) modalHotelName.textContent = h.name;
  if (modalHotelLoc) modalHotelLoc.textContent = h.location;
  if (modalHotelPrice) modalHotelPrice.textContent = formatPrice(h.price);
  if (sumNight) sumNight.textContent = formatPrice(h.price);
  const nightsSpan = document.getElementById('sum-nights');
  if (nightsSpan) nightsSpan.textContent = '3 ночи';
  const tax = Math.round(h.price * 3 * 0.1);
  if (sumTax) sumTax.textContent = formatPrice(tax);
  if (sumTotal) sumTotal.textContent = formatPrice(h.price * 3 + tax);
  if (modal) modal.classList.add('open');
}

function closeModal() {
  const modal = document.getElementById('booking-modal');
  if (modal) modal.classList.remove('open');
}

function confirmBooking() {
  closeModal();
  showSuccess('Бронирование подтверждено! Письмо отправлено на email.');
}

function showSuccess(msg) {
  const banner = document.getElementById('success-banner');
  const msgSpan = document.getElementById('success-msg');
  if (msgSpan) msgSpan.textContent = msg;
  if (banner) {
    banner.classList.add('show');
    setTimeout(() => banner.classList.remove('show'), 3500);
  }
}

/* ── NAVIGATION ── */
function showPage(name, btn) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  
  // Show selected page
  const targetPage = document.getElementById('page-' + name);
  if (targetPage) targetPage.classList.add('active');
  
  // Update active state on nav buttons
  document.querySelectorAll('.nav-link').forEach(b => b.classList.remove('active'));
  if (btn) {
    btn.classList.add('active');
  } else {
    // Find the button with matching data-page
    const matchingBtn = document.querySelector(`.nav-link[data-page="${name}"]`);
    if (matchingBtn) matchingBtn.classList.add('active');
  }
  
  // Render favorites if needed
  if (name === 'favorites') renderFavorites();
  
  // Scroll to top
  window.scrollTo(0, 0);
}

// Initialize star chip click handlers
document.addEventListener('DOMContentLoaded', function() {
  // Star chips
  document.querySelectorAll('.star-chip').forEach(chip => {
    chip.addEventListener('click', function() { 
      this.classList.toggle('active'); 
    });
  });
  
  // Initialize hotels
  if (typeof HOTELS !== 'undefined') {
    renderHotels(HOTELS);
  }
  
  // Set default dates on search
  const today = new Date();
  const next = new Date(today);
  next.setDate(today.getDate() + 3);
  const fmt = d => d.toISOString().slice(0, 10);
  const checkinInput = document.getElementById('search-checkin');
  const checkoutInput = document.getElementById('search-checkout');
  if (checkinInput) checkinInput.value = fmt(today);
  if (checkoutInput) checkoutInput.value = fmt(next);
});

// Make sure calendar renders when page loads
if (typeof renderCalendar !== 'undefined') {
  renderCalendar();
}