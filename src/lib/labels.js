import { INGREDIENTS } from '../data/ingredients.js';
import { normalize } from '../data/matching.js';

/* The display name for an ingredient key, e.g. "eggs" -> "Eggs". */
export function labelFor(key) {
  const found = INGREDIENTS.find((i) => normalize(i.key) === normalize(key));
  return found ? found.label : key.charAt(0).toUpperCase() + key.slice(1);
}

/* "1 recipe", "2 recipes" */
export function plural(n, word) {
  return n + ' ' + word + (n === 1 ? '' : 's');
}
