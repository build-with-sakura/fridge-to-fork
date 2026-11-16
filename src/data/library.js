/* The full recipe library the app uses.
   The original ten recipes stay in recipes.js, untouched.
   Recipes added later live in recipes-more.js. */
import { RECIPES as ORIGINAL_RECIPES } from './recipes.js';
import { MORE_RECIPES } from './recipes-more.js';

export const RECIPES = ORIGINAL_RECIPES.concat(MORE_RECIPES);
