import Icon from './Icon.jsx';
import Photo from './Photo.jsx';
import Badge from './Badge.jsx';
import Heart from './Heart.jsx';
import { labelFor } from '../lib/labels.js';

/* variant "mini" = small card for the Home carousel.
   variant "list" = compact row on phones, photo card on wide screens. */
export default function RecipeCard({ recipe, match, variant = 'list', saved, onSave, onOpen }) {
  const mini = variant === 'mini';
  const line = match.missing.length === 0
    ? 'All ' + match.core.length + ' needed ingredients at home'
    : 'Missing: ' + match.missing.map((i) => labelFor(i.key).toLowerCase()).join(', ');
  return (
    <article className={'card ' + (mini ? 'mini' : 'list')}>
      <button className="card-open" onClick={onOpen} aria-label={'Open ' + recipe.name}>
        <div className="photo"><Photo recipe={recipe} /></div>
        <div className="card-body">
          <div className="card-title">{recipe.name}</div>
          <div className="meta">
            <span className="cuisine">{recipe.cuisine}</span>
            {recipe.time ? <span className="time"><Icon name="clock" size={15} />{recipe.time + ' min'}</span> : null}
          </div>
          <div><Badge status={match.status} /></div>
          {mini ? null : <p className="small muted card-line">{line}</p>}
        </div>
      </button>
      <Heart on={saved} name={recipe.name} onToggle={onSave} />
    </article>
  );
}

/* A list of cards wired to the app's save and open actions. */
export function RecipeCards({ items, variant, isSaved, toggleSave, open }) {
  return items.map((x) => (
    <RecipeCard key={x.recipe.id} variant={variant} recipe={x.recipe} match={x.match}
      saved={isSaved(x.recipe.id)} onSave={() => toggleSave(x.recipe.id)} onOpen={() => open(x.recipe.id)} />
  ));
}
