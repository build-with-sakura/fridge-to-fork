import { RECIPES } from '../data/library.js';
import { DISH, TINTS, plate, C, keyed } from './dishArt.js';

/* The drawn dish picture. Used as the fallback behind every photo. */
export default function FoodArt({ recipe }) {
  const tint = TINTS[Math.max(0, RECIPES.indexOf(recipe)) % TINTS.length];
  const draw = DISH[recipe.id] || (() => [plate(), C(100, 100, 56, tint[1])]);
  return (
    <svg viewBox="0 0 320 240" preserveAspectRatio="xMidYMid slice" role="img" aria-label={'Picture of ' + recipe.name}>
      <rect width="320" height="240" fill={tint[0]} />
      <circle cx="262" cy="30" r="78" fill={tint[1]} opacity=".55" />
      <circle cx="30" cy="226" r="64" fill={tint[1]} opacity=".4" />
      <rect x="26" y="34" width="16" height="6" rx="3" fill="#FFFFFF" transform="rotate(-30 34 37)" />
      <rect x="282" y="196" width="16" height="6" rx="3" fill="#FFFFFF" transform="rotate(40 290 199)" />
      <circle cx="48" cy="70" r="4" fill="#FFFFFF" />
      <circle cx="276" cy="150" r="5" fill="#FFFFFF" />
      <ellipse cx="160" cy="214" rx="92" ry="10" fill="#2A1533" opacity=".12" />
      <g transform="translate(60 20)">{keyed(draw())}</g>
    </svg>
  );
}
