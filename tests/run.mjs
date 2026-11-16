/* Run with:  npm test
   Checks the recipe data, ingredient names and matching rules. No browser needed. */
import assert from 'node:assert/strict';
import { RECIPES } from '../src/data/recipes.js';
import { INGREDIENTS, DEFAULT_FRIDGE } from '../src/data/ingredients.js';
import { ALIASES } from '../src/data/aliases.js';
import { matchRecipe, normalize, clean } from '../src/data/matching.js';
import { labelFor, knownIngredient } from '../src/lib/labels.js';
import { fromMealDb } from '../src/data/mealdb.js';

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
test('there are exactly 10 recipes', () => assert.equal(RECIPES.length, 10));
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
  test(r.id + ': image file name matches the recipe id', () => assert.equal(r.image, 'images/' + r.id + '.webp'));
  test(r.id + ': needed ingredients can be selected in the app', () => {
    for (const k of keysOf(r, 'essential').concat(keysOf(r, 'required'))) assert.ok(TAPPABLE.has(k) || NOT_TAPPABLE_BUT_NEEDED.includes(k), k);
  });
  test(r.id + ': steps say "if using" for optional cooking ingredients', () => {
    const text = r.steps.join(' ').toLowerCase();
    const cookedOptionals = r.ingredients.filter((i) => i.role === 'optional' && !/to serve/.test(i.name));
    if (cookedOptionals.length) assert.ok(/if using|if you have/.test(text));
  });
  test(r.id + ': recipes that need cooked rice say so in the time note', () => {
    const needsRice = r.ingredients.some((i) => i.key === 'rice' && i.role !== 'optional');
    if (needsRice) assert.match(r.timeNote || '', /rice is already cooked/);
  });
}
test('every recipe id is unique', () => assert.equal(new Set(RECIPES.map((r) => r.id)).size, 10));
test('the 29 original fridge ingredients are still there, plus Dashi', () => {
  assert.equal(INGREDIENTS.length, 30);
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
];
for (const [id, fridge, want] of scenarios) test(id + ' with [' + fridge.join(', ') + '] -> ' + want, () => assert.equal(status(id, fridge), want));
test('starting fridge gives 2 can cook now, 1 almost there, 7 need to shop', () => {
  const c = { now: 0, almost: 0, shop: 0 };
  RECIPES.forEach((r) => { c[matchRecipe(r, DEFAULT_FRIDGE).status]++; });
  assert.deepEqual(c, { now: 2, almost: 1, shop: 7 });
});
test('ginisang repolyo: soy sauce or oyster sauce counts as the optional seasoning', () => {
  const m = matchRecipe(by('ginisang-repolyo'), ['cabbage', 'garlic', 'onions', 'oyster sauce']);
  assert.equal(m.optional.find((o) => o.item.key === 'patis').have, true);
});

/* ---------- 4. Ingredient names and aliases ---------- */
const same = [
  ['Chicken Breast', 'chicken'], ['chicken thighs', 'chicken'], ['egg', 'eggs'], ['Eggs', 'eggs'], ['tomato', 'tomatoes'],
  ['potato', 'potatoes'], ['onion', 'onions'], ['scallions', 'green onions'], ['spring onion', 'green onions'],
  ['talong', 'eggplant'], ['cooked rice', 'rice'], ['rice vinegar', 'vinegar'], ['dashi powder', 'dashi'],
  ['hondashi', 'dashi'], ['miso paste', 'miso'], ['curry cubes', 'curry roux'], ['bay leaves', 'bay leaf'], ['fish sauce', 'patis'],
  ['  Ground   Pork ', 'pork'],
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

/* ---------- 5. TheMealDB converter still loads (it is not connected) ---------- */
test('TheMealDB converter (unused) still produces a matchable recipe', () => {
  const r = fromMealDb({ idMeal: '1', strMeal: 'Test', strArea: 'Filipino', strIngredient1: 'Chicken', strMeasure1: '1 kg', strIngredient2: 'Water', strMeasure2: '1 cup', strInstructions: 'A.\nB.' });
  assert.equal(matchRecipe(r, ['chicken']).status, 'now');
  assert.equal(matchRecipe(r, []).status, 'shop');
});

console.log('\n' + passed + ' checks passed, ' + failures.length + ' failed');
if (failures.length) { failures.forEach((f) => console.log('  FAIL: ' + f)); process.exit(1); }
