/* Apply before CSS loads so a saved choice does not flash the system theme. */
(() => {
  'use strict';
  const key = 'assense-theme';
  const normalize = value => value === 'light' || value === 'dark' ? value : 'system';
  const read = () => {
    try {
      return normalize(localStorage.getItem(key));
    } catch {
      return 'system';
    }
  };
  let preference = read();
  const apply = value => {
    preference = normalize(value);
    if (preference === 'system') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.dataset.theme = preference;
    }
    document.querySelectorAll('.theme-picker select').forEach(select => {
      select.value = preference;
    });
  };
  apply(preference);
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.theme-picker').forEach(picker => {
      const select = picker.querySelector('select');
      select.value = preference;
      picker.hidden = false;
      select.addEventListener('change', () => {
        apply(select.value);
        try {
          if (preference === 'system') localStorage.removeItem(key);
          else localStorage.setItem(key, preference);
        } catch {
          // The current page still works when browser storage is unavailable.
        }
      });
    });
  });
  window.addEventListener('storage', event => {
    if (event.key === key || event.key === null) apply(read());
  });
})();
