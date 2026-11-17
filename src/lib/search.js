/* ============================================================
   RECIPE SEARCH
   A recipe matches when the typed text is:
   - part of the recipe name (any part, any case), OR
   - the exact name of a main or needed ingredient, or one of
     its aliases in aliases.js ("itlog" finds eggs).

   Optional extras and kitchen basics (water, salt, pepper,
   sugar, oil) never make a recipe match.
   Several words are one phrase: "soy sauce" is one ingredient.
   Half words only match recipe names, never ingredients.
   ============================================================ */
import { normalize } from '../data/matching.js';

function tidy(query) {
  return String(query || '').trim().toLowerCase().replace(/\s+/g, ' ');
}

/* Ingredient keys per recipe, worked out once and kept. */
const CACHE = new Map();
function keysOf(recipe) {
  let k = CACHE.get(recipe);
  if (!k) {
    const pick = (opt) => new Set(recipe.ingredients
      .filter((i) => !i.staple && (i.role === 'optional') === opt)
      .flatMap((i) => [i.key].concat(i.anyOf || []))
      .map(normalize));
    const core = pick(false);
    const optional = pick(true);
    core.forEach((x) => optional.delete(x));
    k = { core, optional };
    CACHE.set(recipe, k);
  }
  return k;
}

export function matchesName(recipe, query) {
  const q = tidy(query);
  if (!q) return true;
  return recipe.name.toLowerCase().includes(q);
}

/* True when the text names a main or needed ingredient of this recipe. */
export function matchesIngredient(recipe, query) {
  const q = tidy(query);
  if (!q) return false;
  return keysOf(recipe).core.has(normalize(q));
}

export function matchesSearch(recipe, query) {
  return matchesName(recipe, query) || matchesIngredient(recipe, query);
}

const inCuisine = (x, cuisine) => cuisine === 'All' || x.recipe.cuisine === cuisine;

export function filterRecipes(list, cuisine, query) {
  return list.filter((x) => inCuisine(x, cuisine) && matchesSearch(x.recipe, query));
}

/* Recipes where the typed ingredient is only an optional extra.
   Only given when the search found nothing else in this cuisine,
   so real matches are never replaced. */
export function optionalMatches(list, cuisine, query) {
  const q = tidy(query);
  if (!q || filterRecipes(list, cuisine, query).length) return [];
  const key = normalize(q);
  return list.filter((x) => inCuisine(x, cuisine) && keysOf(x.recipe).optional.has(key));
}
