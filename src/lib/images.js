/* Builds the right address for a recipe photo.
   - Full web addresses (TheMealDB later) are used as they are.
   - Local files get the site's base path in front, so they also
     work when the app lives in a GitHub Pages sub-folder. */
export function imageUrl(image) {
  if (!image) return '';
  if (/^https?:\/\//.test(image)) return image;
  return import.meta.env.BASE_URL + String(image).replace(/^\/+/, '');
}
