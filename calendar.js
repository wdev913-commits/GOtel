
const MONTHS_RU = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
let calYear = 2026, calMonth = 3;
let calCheckin = null, calCheckout = null;

function renderCalendar() {
  const m1 = calMonth, y1 = calYear;
  const m2 = (calMonth+1)%12, y2 = calMonth===11 ? calYear+1 : calYear;
  document.getElementById('cal-month1-title').textContent = `${MONTHS_RU[m1]} ${y1}`;
  document.getElementById('cal-month2-title').textContent = `${MONTHS_RU[m2]} ${y2}`;
  document.getElementById('cal-title').textContent = `${MONTHS_RU[m1]} — ${MONTHS_RU[m2]} ${y1}`;
  renderMonth('cal-days-1', y1, m1);
  renderMonth('cal-days-2', y2, m2);
  updateCalSummary();
}

function renderMonth(containerId, year, month) {
  const container = document.getElementById(containerId);
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month+1, 0).getDate();
  const offset = firstDay === 0 ? 6 : firstDay - 1;
  const today = new Date(); today.setHours(0,0,0,0);
  let html = '';
  for (let i=0;i<offset;i++) html += '<div class="cal-day empty"></div>';
  for (let d=1;d<=daysInMonth;d++) {
    const date = new Date(year, month, d);
    let cls = 'cal-day';
    if (date < today) cls += ' disabled';
    else {
      if (date.getTime()===today.getTime()) cls += ' today';
      if (calCheckin && date.getTime()===calCheckin.getTime()) cls += ' selected';
      if (calCheckout && date.getTime()===calCheckout.getTime()) cls += ' selected';
      if (calCheckin && calCheckout && date > calCheckin && date < calCheckout) cls += ' in-range';
    }
    html += `<div class="${cls}" onclick="selectDay(${year},${month},${d})">${d}</div>`;
  }
  container.innerHTML = html;
}

function selectDay(y,m,d) {
  const date = new Date(y,m,d);
  const today = new Date(); today.setHours(0,0,0,0);
  if (date < today) return;
  if (!calCheckin || (calCheckin && calCheckout)) { calCheckin = date; calCheckout = null; }
  else if (date > calCheckin) { calCheckout = date; }
  else { calCheckin = date; calCheckout = null; }
  renderCalendar();
}

function changeMonth(dir) {
  calMonth += dir;
  if (calMonth < 0) { calMonth = 11; calYear--; }
  if (calMonth > 11) { calMonth = 0; calYear++; }
  renderCalendar();
}

function updateCalSummary() {
  const fmtDate = d => d ? d.toLocaleDateString('ru-RU',{day:'numeric',month:'long'}) : '—';
  document.getElementById('cal-checkin').textContent = fmtDate(calCheckin);
  document.getElementById('cal-checkout').textContent = fmtDate(calCheckout);
  if (calCheckin && calCheckout) {
    const nights = Math.round((calCheckout-calCheckin)/(1000*60*60*24));
    document.getElementById('cal-nights').textContent = nights + (nights===1?' ночь':nights<5?' ночи':' ночей');
  } else {
    document.getElementById('cal-nights').textContent = '—';
  }
}