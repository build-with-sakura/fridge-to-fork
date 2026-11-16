/* ============================================================
   PREPARED FOR LATER. NOT CONNECTED YET.
   Turns one TheMealDB meal into the same shape as our built-in
   recipes, so the same cards, photos and matching work for both.
   Nothing in the app imports this file yet.
   ============================================================ */
import { normalize } from './matching.js';

const STAPLE_KEYS = ['salt', 'pepper', 'black pepper', 'water', 'oil', 'olive oil', 'vegetable oil', 'sugar'];
export function fromMealDb(meal) {
  var ingredients = [];
  for (var n = 1; n <= 20; n++) {
    var name = (meal['strIngredient' + n] || '').trim();
    if (!name) continue;
    var key = normalize(name);
    ingredients.push({ key: key, name: name, qty: (meal['strMeasure' + n] || '').trim() || 'as needed', role: 'required', staple: STAPLE_KEYS.indexOf(key) !== -1 });
  }
  var steps = String(meal.strInstructions || '').split(/\r?\n+/).map(function (s) { return s.trim(); }).filter(Boolean);
  return { id: 'mealdb-' + meal.idMeal, source: 'themealdb', name: meal.strMeal, cuisine: meal.strArea || 'International', time: null,
    image: meal.strMealThumb || '', imageCredit: 'TheMealDB', blurb: '', ingredients: ingredients, steps: steps };
}
