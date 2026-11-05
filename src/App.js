import React, { useState, useEffect } from 'react';
import './App.css';

// 1. DEFAULT SAMPLE EVENTS
const defaultEvents = [
  {
    id: 1,
    title: 'Product Launch',
    targetDate: '2026-11-20T09:00',
    category: 'Work',
    color: 'blue',
  },
  {
    id: 2,
    title: 'Summer Vacation',
    targetDate: '2026-12-25T10:00',
    category: 'Travel',
    color: 'amber',
  },
  {
    id: 3,
    title: 'New Year Celebration',
    targetDate: '2027-01-01T00:00',
    category: 'Celebration',
    color: 'emerald',
  },
  {
    id: 4,
    title: 'Hackathon Milestone',
    targetDate: '2026-10-30T12:00',
    category: 'Goal',
    color: 'violet',
  },
];

// 2. MAIN APP COMPONENT
export default function App() {
  // All countdown events (starts with defaultEvents)
  const [events, setEvents] = useState(defaultEvents);

  // Current time state: updates every second to tick countdowns
  const [currentTime, setCurrentTime] = useState(Date.now());

  // Form input states
  const [title, setTitle] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [category, setCategory] = useState('Celebration');
  const [errorMessage, setErrorMessage] = useState('');

  // Filtering and Sorting states
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'completed'
  const [sortBy, setSortBy] = useState('nearest'); // 'nearest', 'furthest', 'title'

  // 3. LIVE 1-SECOND TIMER (useEffect)
  useEffect(function () {
    const timer = setInterval(function () {
      setCurrentTime(Date.now());
    }, 1000);

    // Stop timer when component unmounts to prevent memory leaks
    return function () {
      clearInterval(timer);
    };
  }, []);

  // 4. LOAD & SAVE LOCAL STORAGE (Simple & Easy)
  // Load saved events once when page first opens
  useEffect(function () {
    const saved = localStorage.getItem('countdown_events');
    if (saved) {
      setEvents(JSON.parse(saved));
    }
  }, []);

  // Save events whenever the list changes
  useEffect(function () {
    localStorage.setItem('countdown_events', JSON.stringify(events));
  }, [events]);

  // 5. CALCULATE COUNTDOWN (Days, Hours, Minutes, Seconds)
  function calculateTimeLeft(dateString) {
    const targetTime = new Date(dateString).getTime();
    const difference = targetTime - currentTime;

    // If target date has already passed
    if (difference <= 0) {
      return {
        days: '00',
        hours: '00',
        minutes: '00',
        seconds: '00',
        isPast: true,
      };
    }

    // Convert milliseconds to seconds, minutes, hours, days
    const totalSeconds = Math.floor(difference / 1000);
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    // Helper: Add leading zero if number is less than 10 (e.g. 7 becomes "07")
    function addZero(num) {
      if (num < 10) {
        return '0' + num;
      }
      return String(num);
    }

    return {
      days: addZero(days),
      hours: addZero(hours),
      minutes: addZero(minutes),
      seconds: addZero(seconds),
      isPast: false,
    };
  }

  // Format date readable (e.g., Nov 20, 2026, 09:00 AM)
  function formatReadableDate(dateString) {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString;
    }
    return date.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  // 6. ADD & DELETE HANDLERS
  function handleAddEvent(e) {
    e.preventDefault();

    // Basic Validation
    if (title.trim() === '') {
      setErrorMessage('Please enter an event title.');
      return;
    }

    if (targetDate === '') {
      setErrorMessage('Please choose a target date and time.');
      return;
    }

    // Set card color based on category
    let colorName = 'blue';
    if (category === 'Travel') colorName = 'amber';
    if (category === 'Celebration') colorName = 'emerald';
    if (category === 'Goal') colorName = 'violet';
    if (category === 'Personal') colorName = 'rose';

    const newEvent = {
      id: Date.now(),
      title: title.trim(),
      targetDate: targetDate,
      category: category,
      color: colorName,
    };

    // Add new event to the top of list
    setEvents([newEvent, ...events]);

    // Reset form inputs
    setTitle('');
    setTargetDate('');
    setErrorMessage('');
  }

  function handleDeleteEvent(idToDelete) {
    const updatedEvents = events.filter(function (event) {
      return event.id !== idToDelete;
    });
    setEvents(updatedEvents);
  }

  function handleClearAll() {
    if (window.confirm('Are you sure you want to clear all events?')) {
      setEvents([]);
    }
  }

  function handleLoadSampleEvents() {
    setEvents(defaultEvents);
  }

  // 7. FILTER & SORT EVENTS
  // Step A: Filter by tab ('all', 'active', 'completed')
  let visibleEvents = events.filter(function (event) {
    const timeLeft = calculateTimeLeft(event.targetDate);
    if (filter === 'active') {
      return !timeLeft.isPast;
    }
    if (filter === 'completed') {
      return timeLeft.isPast;
    }
    return true;
  });

  // Step B: Sort events
  visibleEvents.sort(function (a, b) {
    const timeA = new Date(a.targetDate).getTime();
    const timeB = new Date(b.targetDate).getTime();

    if (sortBy === 'nearest') {
      return timeA - timeB;
    }
    if (sortBy === 'furthest') {
      return timeB - timeA;
    }
    if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  // Count active and completed events for stats
  const activeCount = events.filter(function (event) {
    return !calculateTimeLeft(event.targetDate).isPast;
  }).length;
  const completedCount = events.length - activeCount;

  // 8. RENDER USER INTERFACE (JSX)
  return (
    <div className="app-container">
      {/* Background Lighting Elements */}
      <div className="studio-spotlight" />
      <div className="subtle-vignette" />

      <div className="content-wrapper">
        {/* Header Section */}
        <header className="dashboard-header">
          <h1 className="dashboard-title">
            Countdown <span className="text-gradient">Dashboard</span>
          </h1>
          <p className="dashboard-subtitle">
            Track milestones, launches, vacations, and special moments with real-time precision.
          </p>

          {/* Quick Stats Pills */}
          <div className="stats-row">
            <div className="stat-pill">
              <span className="stat-number">{events.length}</span>
              <span className="stat-label">Total Events</span>
            </div>
            <div className="stat-pill active-stat">
              <span className="stat-number">{activeCount}</span>
              <span className="stat-label">Active Timers</span>
            </div>
            <div className="stat-pill completed-stat">
              <span className="stat-number">{completedCount}</span>
              <span className="stat-label">Arrived / Passed</span>
            </div>
          </div>
        </header>

        {/* Add Event Form Card */}
        <section className="form-card">
          <div className="form-card-header">
            {/* Stopwatch Timer Symbol */}
            <div className="form-header-icon">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="royalblue"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="13" r="8" />
                <path d="M12 9v4l2.5 2.5" />
                <path d="M10 2h4" />
                <path d="m19 5-1.5 1.5" />
              </svg>
            </div>
            <div>
              <h2 className="form-title">Create New Countdown</h2>
              <p className="form-desc">Set a date and watch the countdown begin immediately.</p>
            </div>
          </div>

          <form onSubmit={handleAddEvent} className="add-event-form">
            <div className="form-grid">
              {/* Event Title Field */}
              <div className="form-group">
                <label htmlFor="event-title" className="input-label">
                  Event Title
                </label>
                <input
                  id="event-title"
                  type="text"
                  className="text-input"
                  placeholder="e.g., Summer Trip, Product Launch, Birthday..."
                  value={title}
                  onChange={function (e) {
                    setTitle(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  maxLength={60}
                />
              </div>

              {/* Target Date/Time Field */}
              <div className="form-group">
                <label htmlFor="event-date" className="input-label">
                  Target Date & Time
                </label>
                <input
                  id="event-date"
                  type="datetime-local"
                  className="date-input"
                  value={targetDate}
                  onChange={function (e) {
                    setTargetDate(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                />
              </div>

              {/* Category Selector */}
              <div className="form-group">
                <label htmlFor="event-category" className="input-label">
                  Category
                </label>
                <select
                  id="event-category"
                  className="select-input"
                  value={category}
                  onChange={function (e) {
                    setCategory(e.target.value);
                  }}
                >
                  <option value="Celebration">🎉 Celebration</option>
                  <option value="Work">💼 Work & Launch</option>
                  <option value="Travel">✈️ Travel & Trip</option>
                  <option value="Goal">🎯 Milestone / Goal</option>
                  <option value="Personal">🌟 Personal</option>
                </select>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && <div className="error-banner">{errorMessage}</div>}

            {/* Submit Button */}
            <div className="form-actions">
              <button type="submit" className="submit-btn">
                <span className="btn-icon">＋</span> Add Countdown Timer
              </button>
            </div>
          </form>
        </section>

        {/* Filter and Sort Toolbar */}
        <div className="controls-bar">
          <div className="filter-tabs">
            <button
              type="button"
              className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
              onClick={function () {
                setFilter('all');
              }}
            >
              All ({events.length})
            </button>
            <button
              type="button"
              className={`filter-tab ${filter === 'active' ? 'active' : ''}`}
              onClick={function () {
                setFilter('active');
              }}
            >
              Active ({activeCount})
            </button>
            <button
              type="button"
              className={`filter-tab ${filter === 'completed' ? 'active' : ''}`}
              onClick={function () {
                setFilter('completed');
              }}
            >
              Arrived ({completedCount})
            </button>
          </div>

          <div className="sort-group">
            <label htmlFor="sort-select" className="sort-label">
              Sort by:
            </label>
            <select
              id="sort-select"
              className="sort-select"
              value={sortBy}
              onChange={function (e) {
                setSortBy(e.target.value);
              }}
            >
              <option value="nearest">Nearest First</option>
              <option value="furthest">Furthest First</option>
              <option value="title">Alphabetical (A-Z)</option>
            </select>

            {events.length > 0 && (
              <button
                type="button"
                className="clear-all-btn"
                onClick={handleClearAll}
                title="Clear all events"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Event Cards Grid OR Empty State */}
        {visibleEvents.length === 0 ? (
          <div className="empty-state-card">
            <div className="empty-icon-wrapper">
              <span className="empty-emoji">⏳</span>
            </div>
            <h3 className="empty-title">
              {events.length === 0
                ? 'No Countdowns Scheduled Yet'
                : 'No Countdowns Match This Filter'}
            </h3>
            <p className="empty-text">
              {events.length === 0
                ? 'Your dashboard is clear! Enter an upcoming event above or load sample events to see the dashboard in action.'
                : 'Try selecting a different filter tab above to view your events.'}
            </p>
            {events.length === 0 && (
              <button
                type="button"
                className="sample-events-btn"
                onClick={handleLoadSampleEvents}
              >
                ⚡ Load Sample Events
              </button>
            )}
          </div>
        ) : (
          <div className="events-grid">
            {visibleEvents.map(function (item) {
              const timeLeft = calculateTimeLeft(item.targetDate);

              return (
                <div
                  key={item.id}
                  className={`event-card color-${item.color || 'blue'} ${
                    timeLeft.isPast ? 'event-past' : ''
                  }`}
                >
                  {/* Card Header */}
                  <div className="card-top">
                    <span className="category-pill">{item.category}</span>
                    <button
                      type="button"
                      className="delete-card-btn"
                      onClick={function () {
                        handleDeleteEvent(item.id);
                      }}
                      title="Delete event"
                      aria-label={`Delete event ${item.title}`}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        <line x1="10" y1="11" x2="10" y2="17" />
                        <line x1="14" y1="11" x2="14" y2="17" />
                      </svg>
                    </button>
                  </div>

                  {/* Title and Formatted Date */}
                  <h3 className="event-title" title={item.title}>
                    {item.title}
                  </h3>
                  <div className="event-date-row">
                    <span className="calendar-icon">📅</span>
                    <span className="event-date-text">
                      {formatReadableDate(item.targetDate)}
                    </span>
                  </div>

                  {/* Countdown Display Boxes OR Arrived Banner */}
                  {timeLeft.isPast ? (
                    <div className="event-arrived-badge">
                      <span className="celebrate-icon">🎉</span>
                      <div className="arrived-content">
                        <strong>The moment has arrived!</strong>
                        <span>This event is happening now or has passed.</span>
                      </div>
                    </div>
                  ) : (
                    <div className="countdown-display">
                      <div className="countdown-box">
                        <span className="countdown-digit">{timeLeft.days}</span>
                        <span className="countdown-unit">DAYS</span>
                      </div>
                      <span className="countdown-separator">:</span>
                      <div className="countdown-box">
                        <span className="countdown-digit">{timeLeft.hours}</span>
                        <span className="countdown-unit">HOURS</span>
                      </div>
                      <span className="countdown-separator">:</span>
                      <div className="countdown-box">
                        <span className="countdown-digit">{timeLeft.minutes}</span>
                        <span className="countdown-unit">MINS</span>
                      </div>
                      <span className="countdown-separator">:</span>
                      <div className="countdown-box highlight-sec">
                        <span className="countdown-digit">{timeLeft.seconds}</span>
                        <span className="countdown-unit">SECS</span>
                      </div>
                    </div>
                  )}

                  {/* Card Bottom Status */}
                  <div className="card-footer">
                    <span className="status-indicator">
                      <span
                        className={`status-dot ${
                          timeLeft.isPast ? 'dot-past' : 'dot-active'
                        }`}
                      />
                      {timeLeft.isPast
                        ? 'Completed'
                        : `${timeLeft.days}d ${timeLeft.hours}h remaining`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <footer className="dashboard-footer">
          <p>
            React Countdown Dashboard • Real-time event tracking with simple, clean JavaScript.
          </p>
        </footer>
      </div>
    </div>
  );
}
