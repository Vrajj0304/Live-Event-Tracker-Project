import { defaultEvents, loadEvents, saveEvents } from './eventsData.js';
import { updateHeaderStats } from './headerComponent.js';
import { getFormValues, clearForm } from './formComponent.js';
import { renderCards } from './cardsComponent.js';

// Load stored events or defaults
let events = loadEvents();

// Handle form submit to add an event
function handleAddEvent(e) {
  e.preventDefault();

  const newEvent = getFormValues();
  if (!newEvent) {
    return;
  }

  events.unshift(newEvent);
  saveEvents(events);
  clearForm();
  render();
}

// Remove an event by id
function handleDeleteEvent(id) {
  events = events.filter((item) => item.id !== id);
  saveEvents(events);
  render();
}

// Load default sample events
function handleLoadSamples() {
  events = [...defaultEvents];
  saveEvents(events);
  render();
}

// Refresh cards and stats on screen
function render() {
  renderCards(events);
  updateHeaderStats(events);
}

// Setup initial page listeners
function init() {
  const form = document.getElementById('add-event-form');
  if (form) {
    form.addEventListener('submit', handleAddEvent);
  }

  // Handle card button clicks
  document.addEventListener('click', function (e) {
    const deleteBtn = e.target.closest('.delete-card-btn');
    if (deleteBtn) {
      const id = Number(deleteBtn.getAttribute('data-id'));
      handleDeleteEvent(id);
      return;
    }

    if (e.target && e.target.id === 'load-samples-btn') {
      handleLoadSamples();
    }
  });

  render();

  // Tick countdown timer every second
  setInterval(render, 1000);
}

// Start app when page finishes loading
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
