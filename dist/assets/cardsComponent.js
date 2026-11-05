import { calculateTimeLeft, formatReadableDate } from './timeUtils.js';

// Render cards into the grid
export function renderCards(events) {
  const grid = document.getElementById('events-grid');
  const emptyState = document.getElementById('empty-state');
  const template = document.getElementById('card-template');

  if (!grid || !emptyState || !template) return;

  // Show empty message if list is empty
  if (events.length === 0) {
    emptyState.style.display = 'block';
    grid.innerHTML = '';
    return;
  }

  emptyState.style.display = 'none';
  grid.innerHTML = '';

  // Create card element for each event
  for (let i = 0; i < events.length; i++) {
    const item = events[i];
    const time = calculateTimeLeft(item.date);
    const cardFragment = template.content.cloneNode(true);
    const card = cardFragment.querySelector('.event-card');

    // Category color styling
    card.className = 'event-card color-' + (item.color || 'blue');
    if (time.isPast) {
      card.classList.add('event-past');
    }

    // Set text values
    card.querySelector('.category-pill').textContent = item.category;
    card.querySelector('.delete-card-btn').setAttribute('data-id', item.id);
    card.querySelector('.event-title').textContent = item.title;
    card.querySelector('.event-date-text').textContent = formatReadableDate(item.date);

    const countdownDisplay = card.querySelector('.countdown-display');
    const arrivedBadge = card.querySelector('.event-arrived-badge');
    const statusDot = card.querySelector('.status-dot');
    const statusText = card.querySelector('.status-text');

    // Switch between countdown boxes and arrived badge
    if (time.isPast) {
      countdownDisplay.style.display = 'none';
      arrivedBadge.style.display = 'flex';
      statusDot.className = 'status-dot dot-past';
      statusText.textContent = 'Completed';
    } else {
      countdownDisplay.style.display = 'grid';
      arrivedBadge.style.display = 'none';
      card.querySelector('.day-num').textContent = time.days;
      card.querySelector('.hour-num').textContent = time.hours;
      card.querySelector('.min-num').textContent = time.minutes;
      card.querySelector('.sec-num').textContent = time.seconds;
      statusDot.className = 'status-dot dot-active';
      statusText.textContent = time.days + 'd ' + time.hours + 'h remaining';
    }

    grid.appendChild(cardFragment);
  }
}
