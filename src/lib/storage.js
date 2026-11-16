/* Saves small things in the browser so they are still there next visit.
   Storage can be blocked, so every call is wrapped in try/catch. */
export function load(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (e) {
    return fallback;
  }
}

export function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    /* Storage not available. The app still works for this visit. */
  }
}
