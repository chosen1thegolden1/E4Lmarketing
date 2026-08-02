// Deterministic slug from the lead's domain (e.g. allthingsroofing.squarespace.com
// -> "allthingsroofing"), so the demo URL is knowable before the build finishes.
export function slugFromUrl(url) {
  const labels = new URL(url).hostname.split('.');
  return (labels[0] === 'www' ? labels[1] : labels[0])
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-');
}
