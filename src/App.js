import React, { useState, useEffect } from 'react';
import './App.css';

// 1. DEFAULT SAMPLE EVENTS
const defaultEvents = [
  {
    id: 1,
    title: '🚀 Product Launch',
    targetDate: '2026-11-20T09:00',
    category: 'Work',
    color: 'blue',
  },
  {
    id: 2,
    title: '✈️ Summer Vacation',
    targetDate: '2026-12-25T10:00',
    category: 'Travel',
    color: 'amber',
  },
  {
    id: 3,
    title: '🎉 New Year Celebration',
    targetDate: '2027-01-01T00:00',
    category: 'Celebration',
    color: 'emerald',
  },
  {
    id: 4,
    title: '🎯 Hackathon Milestone',
    targetDate: '2026-10-30T12:00',
    category: 'Goal',
    color: 'violet',
  },
];

// 2. MAIN APP COMPONENT
export default function App() {
  // Load saved events from browser localStorage, or use defaultEvents
  const [events, setEvents] = useState(function () {
    const saved = localStorage.getItem('countdown_events');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return defaultEvents;
      }
    }
    return defaultEvents;
  });

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

  // 4. SAVE TO LOCAL STORAGE
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

  // Quick preset button helper (e.g. +1 Day, +7 Days, +30 Days)
  function handleQuickPreset(daysToAdd) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysToAdd);

    // Format into 'YYYY-MM-DDTHH:mm' for datetime-local input
    const year = futureDate.getFullYear();
    const month = String(futureDate.getMonth() + 1).padStart(2, '0');
    const day = String(futureDate.getDate()).padStart(2, '0');
    const hours = String(futureDate.getHours()).padStart(2, '0');
    const minutes = String(futureDate.getMinutes()).padStart(2, '0');

    setTargetDate(`${year}-${month}-${day}T${hours}:${minutes}`);
    setErrorMessage('');
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

