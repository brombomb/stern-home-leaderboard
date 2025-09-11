// Utility functions for URL query parameters

export function getQueryParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    machineId: params.get('machine'),
    fullscreen: params.get('fullscreen') === 'true',
  };
}

export function setQueryParams(params) {
  const url = new URL(window.location);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      url.searchParams.set(key, value);
    } else {
      url.searchParams.delete(key);
    }
  });

  window.history.pushState({}, '', url.toString());

  // Trigger a custom event to notify components of URL change
  window.dispatchEvent(new CustomEvent('urlchange'));
}

export function clearQueryParams() {
  const url = new URL(window.location);
  url.search = '';
  window.history.pushState({}, '', url.toString());

  // Trigger a custom event to notify components of URL change
  window.dispatchEvent(new CustomEvent('urlchange'));
}
