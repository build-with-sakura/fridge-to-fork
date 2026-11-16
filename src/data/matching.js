/* Ingredient matching. No UI in this file. */
export const ALIASES = { 'scallion': 'green onion', 'spring onion': 'green onion', 'aubergine': 'eggplant', 'capsicum': 'bell pepper', 'talong': 'eggplant', 'repolyo': 'cabbage' };

/* Turns "Tomatoes " and "tomato" into the same word. */
export function normalize(name) {
  var s = String(name || '').toLowerCase().replace(/[^a-z\s]/g, ' ').replace(/\s+/g, ' ').trim();
  if (/oes$/.test(s)) s = s.slice(0, -2);
  else if (/ies$/.test(s)) s = s.slice(0, -3) + 'y';
  else if (/s$/.test(s) && !/ss$/.test(s)) s = s.slice(0, -1);
  return ALIASES[s] || s;
}

/* Match rules:
   - Only non-staple ingredients are counted.
   - Missing 0            -> "now"    (Can Cook Now)
   - Missing 1 or 2, and you have at least one -> "almost" (Almost There)
   - Everything else      -> "shop"   (Need to Shop) */
export function matchRecipe(recipe, fridgeKeys) {
  var have = {}; fridgeKeys.forEach(function (k) { have[normalize(k)] = true; });
  var required = recipe.ingredients.filter(function (i) { return !i.staple; });
  var owned = required.filter(function (i) { return have[normalize(i.key)]; });
  var missing = required.filter(function (i) { return !have[normalize(i.key)]; });
  var status = missing.length === 0 ? 'now' : (missing.length <= 2 && owned.length >= 1 ? 'almost' : 'shop');
  return { status: status, required: required, owned: owned, missing: missing };
}
export const STATUS = {
  now: { label: 'Can Cook Now', hint: 'You have every key ingredient. Check the amounts before you start.' },
  almost: { label: 'Almost There', hint: 'Just one or two things missing.' },
  shop: { label: 'Need to Shop', hint: 'A few more ingredients needed.' }
};
