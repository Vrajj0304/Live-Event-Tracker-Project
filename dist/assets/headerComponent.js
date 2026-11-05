import { calculateTimeLeft } from './timeUtils.js';

// Update header counter numbers
export function updateHeaderStats(events) {
  const total = events.length;
  let active = 0;

  for (let i = 0; i < events.length; i++) {
    const time = calculateTimeLeft(events[i].date);
    if (!time.isPast) {
      active++;
    }
  }

  const completed = total - active;

  const totalEl = document.getElementById('stat-total');
  const activeEl = document.getElementById('stat-active');
  const completedEl = document.getElementById('stat-completed');

  if (totalEl) totalEl.textContent = total;
  if (activeEl) activeEl.textContent = active;
  if (completedEl) completedEl.textContent = completed;
}
