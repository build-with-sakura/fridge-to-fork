/* Ingredient matching. No UI in this file. */
import { ALIASES } from './aliases.js';

/* Tidies typed text: lower case, letters only, single spaces. */
export function clean(text) {
  return String(text || '').toLowerCase().replace(/[^a-z\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

/* Turns typed text into the ingredient key the app uses.
   Only names listed in aliases.js are changed. Everything else
   stays exactly as typed. No letters are cut off. */
export function normalize(name) {
  const s = clean(name);
  return ALIASES[s] || s;
}

/* ============================================================
   MATCH RULES
   Each recipe ingredient has a role:
   - essential: defines the dish
   - required:  needed, but not the defining ingredient
   - optional:  garnish, side or suggested extra
   - staple:    a kitchen basic (never checked, never counted)

   Can Cook Now  = every essential and required ingredient is there.
   Almost There  = every essential is there,
                   AND you have at least half of essential + required,
                   AND only 1 or 2 required ingredients are missing.
   Need to Shop  = everything else.

   Optional ingredients never change the result.
   ============================================================ */
export function matchRecipe(recipe, fridge) {
  const have = new Set(fridge.map(normalize));
  const has = (i) => [i.key].concat(i.anyOf || []).some((k) => have.has(normalize(k)));
  const role = (r) => recipe.ingredients.filter((i) => !i.staple && i.role === r);

  const essential = role('essential');
  const required = role('required');
  const core = essential.concat(required);
  const owned = core.filter(has);
  const missingEssential = essential.filter((i) => !has(i));
  const missingRequired = required.filter((i) => !has(i));
  const missing = missingEssential.concat(missingRequired);
  const optional = role('optional').map((item) => ({ item, have: has(item) }));
  const basics = recipe.ingredients.filter((i) => i.staple);

  let status = 'shop';
  if (missing.length === 0) status = 'now';
  else if (
    missingEssential.length === 0 &&
    owned.length * 2 >= core.length &&
    missingRequired.length >= 1 &&
    missingRequired.length <= 2
  ) status = 'almost';

  return { status, essential, required, core, owned, missing, missingEssential, missingRequired, optional, basics };
}

export const STATUS = {
  now: { label: 'Can Cook Now', hint: 'You have every needed ingredient. Check the amounts before you start.' },
  almost: { label: 'Almost There', hint: 'You have the main ingredients. Just one or two things missing.' },
  shop: { label: 'Need to Shop', hint: 'A main ingredient is missing, or several others.' },
};
