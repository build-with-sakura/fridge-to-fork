/* Recipe-name search for the Recipes screen. No UI in this file. */

/* True when the recipe name contains the typed text.
   Upper and lower case are treated the same. Extra spaces are ignored. */
export function matchesName(recipe, query) {
  const q = String(query || '').trim().toLowerCase().replace(/\s+/g, ' ');
  if (!q) return true;
  return recipe.name.toLowerCase().includes(q);
}

/* Applies the cuisine filter and the name search together.
   "list" holds { recipe, match } items, as built in App.jsx. */
export function filterRecipes(list, cuisine, query) {
  return list.filter((x) => (cuisine === 'All' || x.recipe.cuisine === cuisine) && matchesName(x.recipe, query));
}
