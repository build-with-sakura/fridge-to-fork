/* Run with:  npm test
   Checks the recipe data, ingredient names and matching rules. No browser needed. */
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import { RECIPES } from '../src/data/library.js';
import { RECIPES as ORIGINAL_RECIPES } from '../src/data/recipes.js';
import { MORE_RECIPES } from '../src/data/recipes-more.js';
import { INGREDIENTS, DEFAULT_FRIDGE } from '../src/data/ingredients.js';
import { ALIASES } from '../src/data/aliases.js';
import { matchRecipe, normalize, clean } from '../src/data/matching.js';
import { labelFor, knownIngredient } from '../src/lib/labels.js';
import { fromMealDb } from '../src/data/mealdb.js';
import { matchesName, filterRecipes, optionalMatches } from '../src/lib/search.js';
import { missingLine } from '../src/lib/cardLine.js';

let passed = 0;
const failures = [];
function test(name, fn) {
  try { fn(); passed++; } catch (e) { failures.push(name + '\n     ' + e.message.split('\n')[0]); }
}
const by = (id) => RECIPES.find((r) => r.id === id);
const status = (id, fridge) => matchRecipe(by(id), fridge).status;
const keysOf = (r, role) => r.ingredients.filter((i) => !i.staple && i.role === role).map((i) => i.key);

/* An independent copy of the approved rules, written from the spec, to compare against the app. */
function spec(r, fridge) {
  const have = new Set(fridge);
  const ess = keysOf(r, 'essential'), req = keysOf(r, 'required');
  const missE = ess.filter((k) => !have.has(k)).length, missR = req.filter((k) => !have.has(k)).length;
  const owned = ess.length + req.length - missE - missR;
  if (missE === 0 && missR === 0) return 'now';
  if (missE === 0 && owned / (ess.length + req.length) >= 0.5 && missR >= 1 && missR <= 2) return 'almost';
  return 'shop';
}
function subsets(list) {
  const out = [];
  for (let m = 0; m < 1 << list.length; m++) out.push(list.filter((_, i) => m & (1 << i)));
  return out;
}

/* ---------- 1. Recipe data ---------- */
const BASICS = ['water', 'salt', 'pepper', 'sugar', 'oil'];
const TAPPABLE = new Set(INGREDIENTS.map((i) => i.key));
const NOT_TAPPABLE_BUT_NEEDED = []; /* every needed ingredient must be tappable */
const EXPECTED_RECIPES = 30;
const EXPECTED_INGREDIENTS = 37;
const ORIGINAL_IDS = ['chicken-adobo', 'tortang-talong', 'ginisang-repolyo', 'sinangag', 'oyakodon', 'japanese-curry', 'miso-soup', 'gyudon', 'tomato-egg', 'spanish-omelette'];
test('the library has ' + EXPECTED_RECIPES + ' recipes', () => assert.equal(RECIPES.length, EXPECTED_RECIPES));
test('the original ten recipes come first, in the same order', () => assert.deepEqual(RECIPES.slice(0, 10).map((r) => r.id), ORIGINAL_IDS));
test('the original ten recipes are exactly as approved in V1.2 (not edited)', () => {
  assert.equal(crypto.createHash('sha256').update(JSON.stringify(ORIGINAL_RECIPES)).digest('hex'), '0b1de5ad7a0cc919920dbefe403564ece4a6b145f54544ddac97117c61f38438');
});
test('every original recipe still has its photo file name', () => {
  for (const r of ORIGINAL_RECIPES) assert.equal(r.image, 'images/' + r.id + '.webp');
});
test('new recipes have no photo yet, so they show the drawn plate', () => {
  for (const r of MORE_RECIPES) assert.equal(r.image, '', r.id);
});
for (const r of RECIPES) {
  test(r.id + ': has at least one essential ingredient', () => assert.ok(keysOf(r, 'essential').length >= 1));
  test(r.id + ': every ingredient is a basic or has a valid role', () => {
    for (const i of r.ingredients) assert.ok(i.staple ? !i.role : ['essential', 'required', 'optional'].includes(i.role), i.key);
  });
  test(r.id + ': basics are only water, salt, pepper, sugar, oil', () => {
    for (const i of r.ingredients.filter((x) => x.staple)) assert.ok(BASICS.includes(i.key), i.key);
  });
  test(r.id + ': has servings, time, steps, name, cuisine', () => {
    assert.ok(String(r.serves).length > 0); assert.ok(r.time > 0); assert.ok(r.steps.length >= 4);
    assert.ok(['Filipino', 'Japanese', 'International'].includes(r.cuisine));
  });
  test(r.id + ': every ingredient has a name and a quantity', () => {
    for (const i of r.ingredients) { assert.ok(i.name, i.key); assert.ok(i.qty, i.key); }
  });
  test(r.id + ': photo is empty or named after the recipe id', () => assert.ok(r.image === '' || r.image === 'images/' + r.id + '.webp'));
  test(r.id + ': id is lowercase with hyphens, and no ingredient is listed twice', () => {
    assert.match(r.id, /^[a-z-]+$/);
    assert.equal(new Set(r.ingredients.map((i) => i.key)).size, r.ingredients.length);
  });
  test(r.id + ': needed ingredients can be selected in the app', () => {
    for (const k of keysOf(r, 'essential').concat(keysOf(r, 'required'))) assert.ok(TAPPABLE.has(k) || NOT_TAPPABLE_BUT_NEEDED.includes(k), k);
  });
  test(r.id + ': steps say "if using" for optional cooking ingredients', () => {
    const text = r.steps.join(' ').toLowerCase();
    const cookedOptionals = r.ingredients.filter((i) => i.role === 'optional' && !/to serve/.test(i.name));
    if (cookedOptionals.length) assert.ok(/if using|if you have/.test(text));
  });
  test(r.id + ': recipes that need cooked rice say so in the time note', () => {
    const needsCookedRice = r.ingredients.some((i) => i.key === 'rice' && i.role !== 'optional' && /^Cooked rice/.test(i.name));
    if (needsCookedRice) assert.match(r.timeNote || '', /rice is already cooked/);
    const riceLine = r.ingredients.find((i) => i.key === 'rice' && i.role !== 'optional');
    if (riceLine) assert.match(riceLine.name, /^(Cooked|Uncooked) rice/, 'a needed rice line must say cooked or uncooked');
  });
}
test('every recipe id is unique', () => assert.equal(new Set(RECIPES.map((r) => r.id)).size, RECIPES.length));
test('all earlier fridge ingredients are still there, plus the new ones', () => {
  assert.equal(INGREDIENTS.length, EXPECTED_INGREDIENTS);
  assert.equal(new Set(INGREDIENTS.map((i) => i.key)).size, INGREDIENTS.length);
  for (const i of INGREDIENTS) assert.ok(['Protein', 'Veggies', 'Grains', 'Pantry'].includes(i.group), i.key);
  for (const k of ['dashi', 'tomato sauce', 'sinigang mix', 'lemon', 'mirin', 'oyster sauce', 'patis', 'pasta']) assert.ok(TAPPABLE.has(k), k);
  const original = ['eggs', 'chicken', 'pork', 'beef', 'fish', 'shrimp', 'tofu', 'rice', 'noodles', 'bread', 'potatoes', 'carrots', 'cabbage', 'onions', 'garlic', 'tomatoes', 'ginger', 'green onions', 'eggplant', 'bell pepper', 'mushrooms', 'spinach', 'soy sauce', 'vinegar', 'miso', 'curry roux', 'butter', 'cheese', 'milk'];
  for (const k of original) assert.ok(TAPPABLE.has(k), k);
  assert.equal(INGREDIENTS.find((i) => i.key === 'dashi').group, 'Pantry');
});
test('the Dashi chip satisfies the dashi requirement in Tofu Miso Soup', () => {
  assert.equal(knownIngredient('Dashi').key, 'dashi');
  assert.equal(labelFor('dashi'), 'Dashi');
  assert.equal(status('miso-soup', ['miso', 'tofu', 'dashi']), 'now');
  assert.equal(status('miso-soup', ['miso', 'tofu']), 'almost');
  assert.equal(matchRecipe(by('oyakodon'), ['dashi']).optional.find((o) => o.item.key === 'dashi').have, true);
});

/* ---------- 2. Matching: every recipe, every combination ---------- */
for (const r of RECIPES) {
  const ess = keysOf(r, 'essential'), req = keysOf(r, 'required'), opt = keysOf(r, 'optional');
  const core = ess.concat(req);
  test(r.id + ': all needed ingredients -> Can Cook Now', () => assert.equal(status(r.id, core), 'now'));
  test(r.id + ': optional ingredients missing still -> Can Cook Now', () => assert.equal(status(r.id, core), 'now'));
  test(r.id + ': empty fridge -> Need to Shop', () => assert.equal(status(r.id, []), 'shop'));
  test(r.id + ': only optional ingredients -> Need to Shop', () => assert.equal(status(r.id, opt), 'shop'));
  for (const e of ess) {
    test(r.id + ': missing essential "' + e + '" -> Need to Shop', () =>
      assert.equal(status(r.id, core.filter((k) => k !== e).concat(opt)), 'shop'));
  }
  for (const q of req) {
    test(r.id + ': missing only required "' + q + '" -> Almost There', () =>
      assert.equal(status(r.id, core.filter((k) => k !== q)), 'almost'));
  }
  test(r.id + ': all ' + (1 << core.length) + ' needed-ingredient combinations follow the approved rules', () => {
    for (const s of subsets(core)) assert.equal(status(r.id, s), spec(r, s), JSON.stringify(s));
  });
  test(r.id + ': optional ingredients never change the result', () => {
    for (const s of subsets(core)) for (const o of subsets(opt)) {
      const m = matchRecipe(r, s.concat(o));
      assert.equal(m.status, status(r.id, s), JSON.stringify(s.concat(o)));
      assert.equal(m.missing.length, matchRecipe(r, s).missing.length);
      for (const i of m.missing) assert.notEqual(i.role, 'optional');
    }
  });
}

/* ---------- 3. Named scenarios (written by hand) ---------- */
const STARTING_FRIDGE_EXPECTED = { now: 3, almost: 2, shop: 25 };
const scenarios = [
  ['chicken-adobo', ['chicken', 'vinegar'], 'almost'],
  ['chicken-adobo', ['chicken', 'soy sauce', 'garlic'], 'shop'],
  ['chicken-adobo', ['chicken', 'vinegar', 'soy sauce', 'garlic'], 'now'],
  ['tortang-talong', ['eggplant', 'eggs'], 'now'],
  ['tortang-talong', ['eggs', 'onions'], 'shop'],
  ['ginisang-repolyo', ['cabbage', 'garlic', 'onions'], 'now'],
  ['ginisang-repolyo', ['cabbage', 'garlic'], 'almost'],
  ['ginisang-repolyo', ['cabbage'], 'shop'],
  ['ginisang-repolyo', ['pork', 'carrots', 'garlic', 'onions'], 'shop'],
  ['sinangag', ['rice', 'garlic', 'eggs'], 'now'],
  ['sinangag', ['rice', 'garlic'], 'shop'],
  ['sinangag', ['garlic'], 'shop'],
  ['oyakodon', ['chicken', 'eggs'], 'shop'],
  ['oyakodon', ['chicken', 'eggs', 'onions'], 'almost'],
  ['oyakodon', ['chicken', 'eggs', 'onions', 'rice', 'soy sauce'], 'now'],
  ['japanese-curry', ['curry roux', 'potatoes', 'carrots', 'onions', 'rice'], 'now'],
  ['japanese-curry', ['curry roux', 'rice'], 'shop'],
  ['japanese-curry', ['curry roux', 'potatoes', 'carrots'], 'almost'],
  ['japanese-curry', ['chicken', 'potatoes', 'carrots', 'onions', 'rice'], 'shop'],
  ['miso-soup', ['miso', 'tofu'], 'almost'],
  ['miso-soup', ['miso', 'tofu', 'dashi'], 'now'],
  ['miso-soup', ['green onions'], 'shop'],
  ['gyudon', ['beef'], 'shop'],
  ['gyudon', ['beef', 'onions'], 'almost'],
  ['gyudon', ['beef', 'onions', 'rice', 'soy sauce'], 'now'],
  ['tomato-egg', ['tomatoes', 'eggs'], 'now'],
  ['tomato-egg', ['green onions'], 'shop'],
  ['spanish-omelette', ['potatoes', 'eggs'], 'almost'],
  ['spanish-omelette', ['potatoes', 'eggs', 'onions'], 'now'],
  /* V1.3 batch 1 */
  ['pork-sinigang', ['pork', 'sinigang mix', 'tomatoes', 'onions'], 'now'],
  ['pork-sinigang', ['pork', 'sinigang mix'], 'almost'],
  ['pork-sinigang', ['pork', 'tomatoes', 'onions'], 'shop'],
  ['pork-sinigang', ['eggplant', 'spinach', 'rice'], 'shop'],
  ['tinolang-manok', ['chicken', 'ginger', 'garlic', 'onions'], 'now'],
  ['tinolang-manok', ['chicken', 'garlic', 'onions'], 'shop'],
  ['tinolang-manok', ['chicken', 'ginger', 'onions'], 'almost'],
  ['arroz-caldo', ['rice', 'chicken', 'ginger', 'garlic', 'onions'], 'now'],
  ['arroz-caldo', ['rice', 'chicken', 'garlic', 'onions'], 'shop'],
  ['arroz-caldo', ['rice', 'chicken', 'ginger'], 'almost'],
  ['arroz-caldo', ['chicken', 'ginger', 'garlic', 'onions'], 'shop'],
  ['bistek-tagalog', ['beef', 'onions', 'soy sauce', 'lemon'], 'now'],
  ['bistek-tagalog', ['beef', 'onions', 'soy sauce'], 'almost'],
  ['bistek-tagalog', ['beef', 'soy sauce', 'lemon', 'garlic'], 'shop'],
  ['chicken-afritada', ['chicken', 'tomato sauce', 'potatoes', 'carrots', 'onions', 'garlic'], 'now'],
  ['chicken-afritada', ['chicken', 'tomatoes', 'potatoes', 'carrots', 'onions', 'garlic'], 'shop'],
  ['chicken-afritada', ['chicken', 'tomato sauce', 'onions', 'garlic'], 'almost'],
  ['chicken-afritada', ['chicken', 'tomato sauce', 'garlic'], 'shop'],
  ['pancit-canton', ['noodles', 'cabbage', 'carrots', 'garlic', 'onions', 'soy sauce'], 'now'],
  ['pancit-canton', ['noodles', 'cabbage', 'garlic', 'onions'], 'almost'],
  ['pancit-canton', ['noodles'], 'shop'],
  ['pancit-canton', ['chicken', 'cabbage', 'carrots', 'garlic', 'onions', 'soy sauce'], 'shop'],
  ['paksiw-na-isda', ['fish', 'vinegar', 'ginger', 'garlic'], 'now'],
  ['paksiw-na-isda', ['fish', 'vinegar'], 'almost'],
  ['paksiw-na-isda', ['fish', 'ginger', 'garlic'], 'shop'],
  ['tamagoyaki', ['eggs'], 'now'],
  ['tamagoyaki', ['soy sauce', 'dashi', 'mirin'], 'shop'],
  ['yakisoba', ['noodles', 'cabbage', 'soy sauce'], 'now'],
  ['yakisoba', ['noodles', 'cabbage'], 'almost'],
  ['yakisoba', ['pork', 'cabbage', 'soy sauce'], 'shop'],
  ['nikujaga', ['beef', 'potatoes', 'onions', 'carrots', 'soy sauce'], 'now'],
  ['nikujaga', ['beef', 'potatoes'], 'shop'],
  ['nikujaga', ['beef', 'potatoes', 'onions'], 'almost'],
  ['nikujaga', ['beef', 'onions', 'carrots', 'soy sauce'], 'shop'],
  /* V1.3 batch 2 */
  ['shogayaki', ['pork', 'ginger', 'soy sauce'], 'now'],
  ['shogayaki', ['pork', 'ginger'], 'almost'],
  ['shogayaki', ['pork', 'soy sauce'], 'shop'],
  ['teriyaki-chicken', ['chicken', 'soy sauce'], 'now'],
  ['teriyaki-chicken', ['chicken'], 'almost'],
  ['teriyaki-chicken', ['soy sauce', 'mirin', 'ginger'], 'shop'],
  ['butter-soy-mushrooms', ['mushrooms', 'butter', 'soy sauce'], 'now'],
  ['butter-soy-mushrooms', ['mushrooms', 'butter'], 'almost'],
  ['butter-soy-mushrooms', ['mushrooms', 'soy sauce'], 'shop'],
  ['shioyaki', ['fish'], 'now'],
  ['shioyaki', ['lemon', 'rice'], 'shop'],
  ['garlic-butter-shrimp', ['shrimp', 'garlic', 'butter'], 'now'],
  ['garlic-butter-shrimp', ['shrimp', 'garlic'], 'almost'],
  ['garlic-butter-shrimp', ['shrimp', 'butter'], 'shop'],
  ['french-toast', ['bread', 'eggs', 'milk'], 'now'],
  ['french-toast', ['bread', 'eggs'], 'almost'],
  ['french-toast', ['eggs', 'milk'], 'shop'],
  ['grilled-cheese', ['bread', 'cheese', 'butter'], 'now'],
  ['grilled-cheese', ['bread', 'cheese'], 'almost'],
  ['grilled-cheese', ['bread', 'butter'], 'shop'],
  ['garlic-butter-pasta', ['pasta', 'garlic', 'butter'], 'now'],
  ['garlic-butter-pasta', ['noodles', 'garlic', 'butter'], 'shop'],
  ['garlic-butter-pasta', ['pasta', 'garlic'], 'almost'],
  ['chicken-pepper-stir-fry', ['chicken', 'bell pepper', 'onions', 'garlic', 'soy sauce'], 'now'],
  ['chicken-pepper-stir-fry', ['chicken', 'bell pepper'], 'shop'],
  ['chicken-pepper-stir-fry', ['chicken', 'bell pepper', 'onions'], 'almost'],
  ['chicken-pepper-stir-fry', ['chicken', 'onions', 'garlic', 'soy sauce'], 'shop'],
  ['spinach-cheese-omelette', ['eggs', 'spinach', 'cheese'], 'now'],
  ['spinach-cheese-omelette', ['eggs', 'spinach'], 'almost'],
  ['spinach-cheese-omelette', ['eggs'], 'shop'],
  ['spinach-cheese-omelette', ['spinach', 'cheese'], 'shop'],
];
for (const [id, fridge, want] of scenarios) test(id + ' with [' + fridge.join(', ') + '] -> ' + want, () => assert.equal(status(id, fridge), want));
test('starting fridge: the original ten still give 2 can cook now, 1 almost there, 7 need to shop', () => {
  const c = { now: 0, almost: 0, shop: 0 };
  ORIGINAL_RECIPES.forEach((r) => { c[matchRecipe(r, DEFAULT_FRIDGE).status]++; });
  assert.deepEqual(c, { now: 2, almost: 1, shop: 7 });
});
test('starting fridge across the whole library', () => {
  const c = { now: 0, almost: 0, shop: 0 };
  RECIPES.forEach((r) => { c[matchRecipe(r, DEFAULT_FRIDGE).status]++; });
  assert.deepEqual(c, STARTING_FRIDGE_EXPECTED);
});
test('ginisang repolyo: soy sauce or oyster sauce counts as the optional seasoning', () => {
  const m = matchRecipe(by('ginisang-repolyo'), ['cabbage', 'garlic', 'onions', 'oyster sauce']);
  assert.equal(m.optional.find((o) => o.item.key === 'patis').have, true);
});

test('one-ingredient recipes: Can Cook Now with that one item, never Almost There', () => {
  const single = RECIPES.filter((r) => r.ingredients.filter((i) => !i.staple && i.role !== 'optional').length === 1);
  for (const r of single) {
    const only = r.ingredients.find((i) => i.role === 'essential');
    assert.ok(only, r.id + ' must have its one ingredient marked essential');
    assert.equal(matchRecipe(r, [only.key]).status, 'now', r.id);
    assert.equal(matchRecipe(r, r.ingredients.filter((i) => i.role === 'optional').map((i) => i.key)).status, 'shop', r.id);
    assert.ok(r.ingredients.some((i) => i.staple), r.id + ' should list its kitchen basics so the user can check them');
  }
});
test('Arroz Caldo uses uncooked rice and says so clearly', () => {
  const r = by('arroz-caldo'); const riceLine = r.ingredients.find((i) => i.key === 'rice');
  assert.equal(riceLine.role, 'essential'); assert.match(riceLine.name, /^Uncooked rice/);
  assert.match(r.notes.join(' '), /uncooked rice/); assert.match(r.steps.join(' '), /uncooked rice/);
  assert.ok(!/rice is already cooked/.test(r.timeNote || ''));
});
test('optional chips work: an optional item in the fridge is marked as owned', () => {
  assert.equal(matchRecipe(by('tinolang-manok'), ['patis']).optional.find((o) => o.item.key === 'patis').have, true);
  assert.equal(matchRecipe(by('nikujaga'), ['mirin']).optional.find((o) => o.item.key === 'mirin').have, true);
  assert.equal(matchRecipe(by('pancit-canton'), ['shrimp']).optional.find((o) => o.item.key === 'chicken').have, true);
  assert.equal(matchRecipe(by('pancit-canton'), ['oyster sauce']).optional.find((o) => o.item.key === 'oyster sauce').have, true);
});

test('every fridge item is used by at least one recipe', () => {
  const used = new Set(RECIPES.flatMap((r) => r.ingredients.filter((i) => !i.staple).flatMap((i) => [i.key].concat(i.anyOf || []))));
  for (const i of INGREDIENTS) assert.ok(used.has(i.key), i.key + ' is not used by any recipe');
});
test('cuisine totals: Filipino 11, Japanese 11, International 8', () => {
  const n = (c) => RECIPES.filter((r) => r.cuisine === c).length;
  assert.deepEqual([n('Filipino'), n('Japanese'), n('International')], [11, 11, 8]);
});
test('pasta and noodles are different ingredients', () => {
  assert.equal(status('garlic-butter-pasta', ['noodles', 'garlic', 'butter']), 'shop');
  assert.equal(status('yakisoba', ['pasta', 'cabbage', 'soy sauce']), 'shop');
});

/* ---------- 4. Ingredient names and aliases ---------- */
const same = [
  ['Chicken Breast', 'chicken'], ['chicken thighs', 'chicken'], ['egg', 'eggs'], ['Eggs', 'eggs'], ['tomato', 'tomatoes'],
  ['potato', 'potatoes'], ['onion', 'onions'], ['scallions', 'green onions'], ['spring onion', 'green onions'],
  ['talong', 'eggplant'], ['cooked rice', 'rice'], ['rice vinegar', 'vinegar'], ['dashi powder', 'dashi'],
  ['hondashi', 'dashi'], ['miso paste', 'miso'], ['curry cubes', 'curry roux'], ['bay leaves', 'bay leaf'], ['fish sauce', 'patis'],
  ['  Ground   Pork ', 'pork'],
  ['calamansi', 'lemon'], ['lime', 'lemon'], ['Pancit Canton', 'noodles'], ['kangkong', 'spinach'], ['tomato puree', 'tomato sauce'],
  ['tamarind soup mix', 'sinigang mix'], ['fish sauce', 'patis'], ['spaghetti', 'pasta'], ['Macaroni', 'pasta'],
];
for (const [typed, key] of same) test('"' + typed + '" is recognised as ' + key, () => assert.equal(normalize(typed), key));
const unchanged = ['asparagus', 'hummus', 'couscous', 'chicken stock', 'chicken broth', 'rice flour', 'garlic powder',
  'onion powder', 'pepper', 'egg noodles', 'coconut milk', 'peanut butter', 'tomato sauce', 'beef stock', 'kimchi'];
for (const w of unchanged) test('"' + w + '" is left exactly as typed', () => assert.equal(normalize(w), w));
test('look-alike names do not match the wrong ingredient', () => {
  assert.equal(status('chicken-adobo', ['chicken stock', 'vinegar', 'soy sauce', 'garlic']), 'shop');
  assert.equal(status('sinangag', ['rice flour', 'garlic', 'eggs']), 'shop');
  assert.equal(status('tomato-egg', ['tomato sauce', 'eggs']), 'shop');
  assert.equal(status('sinangag', ['rice vinegar', 'garlic', 'eggs']), 'shop');
});
test('typed aliases work in matching', () => {
  assert.equal(status('chicken-adobo', ['chicken breast', 'suka', 'toyo', 'bawang']), 'now');
  assert.equal(status('miso-soup', ['miso paste', 'firm tofu', 'dashi powder']), 'now');
  assert.equal(status('tortang-talong', ['talong', 'egg']), 'now');
});
test('every alias points to a real ingredient key', () => {
  const recipeKeys = new Set(RECIPES.flatMap((r) => r.ingredients.map((i) => i.key)));
  for (const [alias, key] of Object.entries(ALIASES)) assert.ok(TAPPABLE.has(key) || recipeKeys.has(key), alias + ' -> ' + key);
});
test('no alias replaces a tappable ingredient or a recipe ingredient', () => {
  const recipeKeys = new Set(RECIPES.flatMap((r) => r.ingredients.flatMap((i) => [i.key].concat(i.anyOf || []))));
  for (const alias of Object.keys(ALIASES)) { assert.ok(!TAPPABLE.has(alias), alias); assert.ok(!recipeKeys.has(alias), alias); }
});
test('aliases are already in clean form', () => { for (const a of Object.keys(ALIASES)) assert.equal(clean(a), a); });
test('typed text is shown exactly as typed', () => {
  assert.equal(labelFor('chicken breast'), 'chicken breast');
  assert.equal(labelFor('Asparagus'), 'Asparagus');
  assert.equal(labelFor('Hummus'), 'Hummus');
});
test('tappable ingredients show their label', () => {
  assert.equal(labelFor('eggs'), 'Eggs'); assert.equal(labelFor('green onions'), 'Green onions');
  assert.equal(knownIngredient('Soy Sauce').key, 'soy sauce'); assert.equal(knownIngredient('chicken breast'), null);
});

/* ---------- 4b. Recipe search: name OR main/needed ingredient (V1.4) ---------- */
const LIST = RECIPES.map((recipe) => ({ recipe, match: matchRecipe(recipe, DEFAULT_FRIDGE) }));
const found = (cuisine, query) => filterRecipes(LIST, cuisine, query).map((x) => x.recipe.name).sort();
/* Name-only helper: proves the V1.3 name search is unchanged. */
const byName = (cuisine, query) => LIST.filter((x) => (cuisine === 'All' || x.recipe.cuisine === cuisine) && matchesName(x.recipe, query)).map((x) => x.recipe.name).sort();
/* Independent spec of the V1.4 rule, written from the data, not from search.js. */
const keysWith = (r, pick) => r.ingredients.filter((i) => !i.staple && pick(i.role)).flatMap((i) => [i.key].concat(i.anyOf || [])).map(normalize);
const specCore = (r) => keysWith(r, (role) => role !== 'optional');
const specOpt = (r) => keysWith(r, (role) => role === 'optional');
const specFound = (cuisine, q) => LIST.filter((x) => (cuisine === 'All' || x.recipe.cuisine === cuisine) &&
  (x.recipe.name.toLowerCase().includes(q.trim().toLowerCase().replace(/\s+/g, ' ')) || specCore(x.recipe).includes(normalize(q))))
  .map((x) => x.recipe.name).sort();
const optNames = (cuisine, q) => optionalMatches(LIST, cuisine, q).map((x) => x.recipe.name).sort();
const STAPLES = ['water', 'salt', 'pepper', 'sugar', 'oil'];

test('search: empty or blank text shows every recipe', () => {
  assert.equal(found('All', '').length, 30); assert.equal(found('All', '   ').length, 30);
});
test('name search (V1.3) is unchanged: part of the name', () => {
  assert.deepEqual(byName('All', 'chicken'), ['Chicken Adobo', 'Chicken Afritada', 'Chicken and Bell Pepper Stir-Fry', 'Teriyaki Chicken']);
  assert.deepEqual(found('All', 'ome'), ['Home-Style Gyudon Beef Bowl', 'Home-Style Nikujaga', 'Home-Style Oyakodon', 'Home-Style Yakisoba', 'Potato Spanish Omelette', 'Spinach and Cheese Omelette']);
  assert.deepEqual(found('All', 'chick').length, 4, 'half a word matches names only');
});
test('search: upper and lower case give the same result', () => {
  assert.deepEqual(found('All', 'CHICKEN'), found('All', 'chicken'));
  assert.deepEqual(found('All', 'ChIcKeN'), found('All', 'chicken'));
  assert.deepEqual(found('All', 'ITLOG'), found('All', 'itlog'));
  assert.deepEqual(found('All', 'adobo'), ['Chicken Adobo']);
});
test('search: spaces around or doubled inside the text are ignored', () => {
  assert.deepEqual(found('All', '  miso  '), found('All', 'miso'));
  assert.deepEqual(found('All', 'garlic   butter'), ['Garlic Butter Pasta', 'Garlic Butter Shrimp']);
  assert.deepEqual(found('All', '  soy   sauce '), found('All', 'soy sauce'));
});
test('search: cuisine names are not searched', () => assert.deepEqual(found('All', 'filipino'), []));
test('search: no match gives an empty list', () => assert.deepEqual(found('All', 'pizza'), []));
test('name search still works together with the cuisine filter', () => {
  assert.deepEqual(byName('Japanese', 'chicken'), ['Teriyaki Chicken']);
  assert.deepEqual(byName('Filipino', 'chicken'), ['Chicken Adobo', 'Chicken Afritada']);
  assert.deepEqual(byName('International', 'chicken'), ['Chicken and Bell Pepper Stir-Fry']);
  assert.deepEqual(found('Japanese', 'adobo'), []);
  assert.equal(found('Filipino', '').length, 11);
});
test('name search keeps each recipe in its own match group', () => {
  assert.deepEqual(LIST.filter((x) => matchesName(x.recipe, 'egg')).map((x) => x.recipe.id + ':' + x.match.status).sort(), ['sinangag:now', 'tomato-egg:now']);
  for (const x of filterRecipes(LIST, 'All', 'chicken')) assert.equal(x.match.status, matchRecipe(x.recipe, DEFAULT_FRIDGE).status);
});
test('search never changes the recipes or their match results', () => {
  const before = JSON.stringify(LIST); filterRecipes(LIST, 'Japanese', 'chicken'); optionalMatches(LIST, 'All', 'fish sauce'); matchesName(RECIPES[0], 'ADOBO');
  assert.equal(JSON.stringify(LIST), before);
});
test('search treats special characters as plain text', () => {
  assert.deepEqual(found('All', '(shioyaki)'), ['Salt-Grilled Fish (Shioyaki)']);
  assert.deepEqual(found('All', '.*'), []); assert.deepEqual(found('All', 'stir-fry').length, 2);
});

/* Ingredient search: every fridge item and every alias, in every cuisine, equals the spec. */
for (const term of INGREDIENTS.map((i) => i.key).concat(INGREDIENTS.map((i) => i.label), Object.keys(ALIASES))) {
  test('ingredient search equals the spec: "' + term + '"', () => {
    for (const c of ['All', 'Filipino', 'Japanese', 'International']) assert.deepEqual(found(c, term), specFound(c, term), c);
  });
}
test('aliases give the same results as the ingredient', () => {
  assert.deepEqual(found('All', 'itlog'), found('All', 'eggs'));
  assert.deepEqual(found('All', 'kanin'), found('All', 'rice'));
  assert.deepEqual(found('All', 'toyo'), found('All', 'soy sauce'));
  assert.deepEqual(found('All', 'chicken breast'), specFound('All', 'chicken'));
});
test('examples from the approved proposal', () => {
  assert.equal(found('All', 'chicken').length, 7);
  assert.ok(!found('All', 'chicken').includes('Japanese Curry Rice') && !found('All', 'chicken').includes('Pancit Canton'), 'chicken is optional there');
  assert.equal(found('All', 'egg').length, 8); assert.ok(!found('All', 'egg').includes('Arroz Caldo'));
  assert.equal(found('All', 'rice').length, 5); assert.equal(found('All', 'kanin').length, 5);
  assert.equal(found('All', 'toyo').length, 11);
  assert.deepEqual(found('All', 'kangkong'), ['Spinach and Cheese Omelette']);
  assert.deepEqual(found('All', 'fish sauce'), []);
  assert.deepEqual(found('All', 'vinegar'), specFound('All', 'vinegar')); assert.ok(found('All', 'vinegar').includes('Chicken Adobo'));
});
test('"egg" never matches a recipe only because of eggplant', () => {
  for (const x of filterRecipes(LIST, 'All', 'egg')) assert.ok(specCore(x.recipe).includes('eggs') || matchesName(x.recipe, 'egg'), x.recipe.id);
});
test('optional extras never cause a primary match', () => {
  for (const r of RECIPES) for (const k of specOpt(r)) {
    if (specCore(r).includes(k) || matchesName(r, k)) continue;
    assert.ok(!filterRecipes(LIST, 'All', k).some((x) => x.recipe.id === r.id), r.id + ' / ' + k);
  }
});
test('kitchen basics never match as ingredients (names still can)', () => {
  for (const k of STAPLES) assert.deepEqual(found('All', k), byName('All', k), k);
  assert.deepEqual(found('All', 'salt'), ['Salt-Grilled Fish (Shioyaki)']);
  assert.deepEqual(found('All', 'oil'), byName('All', 'oil'));
});
test('several words are one phrase', () => {
  assert.deepEqual(found('All', 'chicken rice'), []);
  assert.deepEqual(found('All', 'soy sauce'), specFound('All', 'soy sauce'));
  assert.deepEqual(found('All', 'green onions'), []);
});

/* Optional-only discovery message */
test('optional matches: shown only when there is no primary result', () => {
  assert.deepEqual(optNames('All', 'fish sauce'), ['Arroz Caldo', 'Ginisang Repolyo', 'Tinolang Manok']);
  assert.deepEqual(optNames('All', 'rice'), [], 'rice has primary results');
  assert.deepEqual(optNames('All', 'pork'), [], 'name matches are never replaced');
  assert.deepEqual(optNames('All', 'chicken'), []);
  assert.deepEqual(optNames('All', 'pizza'), []); assert.deepEqual(optNames('All', ''), []);
  assert.deepEqual(optNames('All', 'salt'), [], 'basics are never suggested');
});
test('optional matches respect the cuisine filter', () => {
  assert.deepEqual(optNames('Filipino', 'fish sauce'), ['Arroz Caldo', 'Ginisang Repolyo', 'Tinolang Manok']);
  assert.deepEqual(optNames('Japanese', 'fish sauce'), []);
  assert.deepEqual(optNames('Japanese', 'green onions'), ['Butter Soy Mushrooms', 'Tofu Miso Soup']);
  /* kangkong has a primary result in All (International) but not in Filipino */
  assert.deepEqual(optNames('All', 'kangkong'), []);
  assert.deepEqual(optNames('Filipino', 'kangkong'), ['Pork Sinigang', 'Tinolang Manok']);
});
test('optional matches equal the spec for every term and cuisine', () => {
  const terms = INGREDIENTS.map((i) => i.key).concat(Object.keys(ALIASES));
  for (const t of terms) for (const c of ['All', 'Filipino', 'Japanese', 'International']) {
    const want = found(c, t).length ? [] : LIST.filter((x) => (c === 'All' || x.recipe.cuisine === c) && specOpt(x.recipe).includes(normalize(t))).map((x) => x.recipe.name).sort();
    assert.deepEqual(optNames(c, t), want, c + ' / ' + t);
  }
});

/* ---------- 4c. Missing-ingredient line on recipe cards (V1.4) ---------- */
const lineFor = (id) => missingLine(matchRecipe(by(id), DEFAULT_FRIDGE));
const fake = (status, ess, req, core = 6) => ({ status, core: Array(core).fill({}), missingEssential: ess.map((key) => ({ key })), missingRequired: req.map((key) => ({ key })), missing: ess.concat(req).map((key) => ({ key })) });
test('card line: Can Cook Now', () => {
  const m = matchRecipe(by('tomato-egg'), DEFAULT_FRIDGE); assert.equal(m.status, 'now');
  assert.equal(missingLine(m), 'All ' + m.core.length + ' needed ingredients at home');
});
test('card line: one needed ingredient is singular (regression)', () => {
  const m = matchRecipe(by('tamagoyaki'), ['eggs']); assert.equal(m.status, 'now'); assert.equal(m.core.length, 1);
  assert.equal(missingLine(m), '1 needed ingredient at home');
  assert.equal(missingLine(fake('now', [], [], 1)), '1 needed ingredient at home');
  assert.equal(missingLine(fake('now', [], [], 2)), 'All 2 needed ingredients at home');
});
test('card line never says "1 needed ingredients", for any recipe or fridge', () => {
  const fridges = [[], DEFAULT_FRIDGE, INGREDIENTS.map((i) => i.key)].concat(INGREDIENTS.map((i) => [i.key]));
  for (const f of fridges) for (const r of RECIPES) {
    const line = missingLine(matchRecipe(r, f));
    assert.ok(!/\b1 needed ingredients\b/.test(line), r.id + ': ' + line);
    assert.ok(!/(^|\D)0 needed/.test(line), r.id + ': ' + line);
  }
});
test('card line: Almost There says how many to buy', () => {
  assert.equal(lineFor('teriyaki-chicken'), 'Buy 1 more: soy sauce');
  assert.equal(missingLine(fake('almost', [], ['vinegar', 'carrots'])), 'Buy 2 more: vinegar, carrots');
});
test('card line: Need to Shop names the missing main ingredient first', () => {
  assert.equal(lineFor('chicken-adobo'), 'Missing main: vinegar · Also: soy sauce');
  assert.equal(lineFor('chicken-afritada'), 'Missing main: tomato sauce · Also: potatoes, carrots');
  assert.equal(missingLine(fake('shop', ['pork'], [])), 'Missing main: pork');
});
test('card line: Need to Shop with the main ingredient at home', () => {
  assert.equal(missingLine(fake('shop', [], ['vinegar', 'carrots', 'potatoes'])), 'Need 3 more: vinegar, carrots, potatoes');
});
test('card line: long lists show 3 names, then "+N more"', () => {
  assert.equal(missingLine(fake('shop', ['pork'], ['vinegar', 'carrots', 'potatoes', 'ginger'])), 'Missing main: pork · Also: vinegar, carrots +2 more');
  assert.equal(missingLine(fake('shop', [], ['vinegar', 'carrots', 'potatoes', 'ginger'])), 'Need 4 more: vinegar, carrots, potatoes +1 more');
  assert.match(lineFor('pancit-canton'), /\+1 more$/);
});
test('card line uses the same items as the To buy list, never optional or basics', () => {
  for (const r of RECIPES) {
    const m = matchRecipe(r, DEFAULT_FRIDGE); const line = missingLine(m);
    for (const i of m.missing.slice(0, 3)) assert.ok(line.includes(labelFor(i.key).toLowerCase()), r.id + ' ' + i.key);
    const extra = Math.max(0, m.missing.length - 3); if (extra) assert.ok(line.endsWith('+' + extra + ' more'), r.id);
    assert.ok(!m.missing.some((i) => i.role === 'optional' || i.staple), r.id);
  }
});

/* ---------- 4b. V1.3.1 phone Search key (source checks; the real keyboard needs a phone) ---------- */
test('recipe search uses a Search keyboard and closes it only on submit', () => {
  const src = fs.readFileSync(new URL('../src/screens/Recipes.jsx', import.meta.url), 'utf8');
  assert.match(src, /<form[^>]*role="search"[^>]*onSubmit=\{submitSearch\}/);
  assert.match(src, /id="recipe-search" type="search" enterKeyHint="search"/);
  assert.match(src, /e\.preventDefault\(\)/);
  assert.match(src, /inputRef\.current\.blur\(\)/);
  assert.equal((src.match(/blur\(\)/g) || []).length, 1, 'blur only in the submit handler');
  assert.match(src, /onChange=\{\(e\) => p\.setSearch\(e\.target\.value\)\}/);
});

/* ---------- 5. TheMealDB converter still loads (it is not connected) ---------- */
test('TheMealDB converter (unused) still produces a matchable recipe', () => {
  const r = fromMealDb({ idMeal: '1', strMeal: 'Test', strArea: 'Filipino', strIngredient1: 'Chicken', strMeasure1: '1 kg', strIngredient2: 'Water', strMeasure2: '1 cup', strInstructions: 'A.\nB.' });
  assert.equal(matchRecipe(r, ['chicken']).status, 'now');
  assert.equal(matchRecipe(r, []).status, 'shop');
});

console.log('\n' + passed + ' checks passed, ' + failures.length + ' failed');
if (failures.length) { failures.forEach((f) => console.log('  FAIL: ' + f)); process.exit(1); }
