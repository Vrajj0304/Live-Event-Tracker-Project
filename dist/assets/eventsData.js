// Default sample events
export const defaultEvents = [
  {
    id: 1,
    title: '🚀 Product Launch',
    date: '2026-11-20T09:00',
    category: 'Work',
    color: 'blue'
  },
  {
    id: 2,
    title: '✈️ Summer Vacation',
    date: '2026-12-25T10:00',
    category: 'Travel',
    color: 'amber'
  },
  {
    id: 3,
    title: '🎉 New Year Celebration',
    date: '2027-01-01T00:00',
    category: 'Celebration',
    color: 'emerald'
  },
  {
    id: 4,
    title: '🎯 Hackathon Milestone',
    date: '2026-10-30T12:00',
    category: 'Goal',
    color: 'violet'
  }
];

// Load events from browser localStorage
export function loadEvents() {
  const saved = localStorage.getItem('countdown_events');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      return defaultEvents;
    }
  }
  return defaultEvents;
}

// Save events array to localStorage
export function saveEvents(eventsList) {
  localStorage.setItem('countdown_events', JSON.stringify(eventsList));
}
