// Read and validate input values from form
export function getFormValues() {
  const titleInput = document.getElementById('event-title');
  const dateInput = document.getElementById('event-date');
  const categorySelect = document.getElementById('event-category');
  const errorBox = document.getElementById('form-error');

  const title = titleInput.value.trim();
  const date = dateInput.value;
  const category = categorySelect.value;

  // Basic validation checks
  if (title === '') {
    errorBox.textContent = 'Please enter an event title.';
    errorBox.style.display = 'block';
    return null;
  }

  if (date === '') {
    errorBox.textContent = 'Please choose a target date and time.';
    errorBox.style.display = 'block';
    return null;
  }

  errorBox.style.display = 'none';

  // Set color according to category
  let color = 'blue';
  if (category === 'Travel') color = 'amber';
  if (category === 'Celebration') color = 'emerald';
  if (category === 'Goal') color = 'violet';
  if (category === 'Personal') color = 'rose';

  return {
    id: Date.now(),
    title: title,
    date: date,
    category: category,
    color: color
  };
}

// Reset form inputs after submitting
export function clearForm() {
  document.getElementById('event-title').value = '';
  document.getElementById('event-date').value = '';
  const errorBox = document.getElementById('form-error');
  if (errorBox) errorBox.style.display = 'none';
}
