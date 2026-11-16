import { INGREDIENTS } from '../data/ingredients.js';
import { clean } from '../data/matching.js';

/* The fridge item that this text names exactly (by key or by label). */
export function knownIngredient(text) {
  const c = clean(text);
  return INGREDIENTS.find((i) => i.key === c || clean(i.label) === c) || null;
}

/* The name to show for a fridge entry.
   Tappable items show their label, e.g. "Eggs".
   Anything the user typed is shown exactly as they typed it. */
export function labelFor(entry) {
  const known = knownIngredient(entry);
  return known ? known.label : String(entry).trim();
}

/* "1 recipe", "2 recipes" */
export function plural(n, word) {
  return n + ' ' + word + (n === 1 ? '' : 's');
}
