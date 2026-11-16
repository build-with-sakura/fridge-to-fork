import Icon from '../components/Icon.jsx';
import Brand from '../components/Brand.jsx';
import PageHead from '../components/PageHead.jsx';
import Empty from '../components/Empty.jsx';
import { RecipeCards } from '../components/RecipeCard.jsx';
import { RECIPES } from '../data/library.js';
import { STATUS } from '../data/matching.js';
import { plural } from '../lib/labels.js';
import { filterRecipes } from '../lib/search.js';

const DOTS = { now: 'var(--aqua)', almost: 'var(--yellow)', shop: 'var(--orange)' };
const CUISINES = ['All'].concat(RECIPES.map((r) => r.cuisine).filter((c, i, a) => a.indexOf(c) === i));

export default function Recipes(p) {
  const searching = p.search.trim() !== '';
  const list = filterRecipes(p.list, p.cuisine, p.search);

  return (
    <>
      <Brand className="mobile-brand" />
      <PageHead title="Recipes" color="#FF7A1A"
        text={p.fridgeCount ? 'Matched to the ' + plural(p.fridgeCount, 'ingredient') + ' in your fridge.' : 'Add ingredients to see what you can cook.'} />

      <label className="search" htmlFor="recipe-search">
        <Icon name="search" />
        <input id="recipe-search" type="text" enterKeyHint="search" placeholder="Search recipes by name" value={p.search}
          autoComplete="off" onChange={(e) => p.setSearch(e.target.value)} />
        {p.search ? (
          <button type="button" className="search-clear" aria-label="Clear search" onClick={() => p.setSearch('')}>
            <Icon name="x" size={18} />
          </button>
        ) : null}
      </label>

      <div className="chips" role="group" aria-label="Cuisine">
        {CUISINES.map((c) => (
          <button key={c} className={'chip filter' + (p.cuisine === c ? ' on' : '')} aria-pressed={p.cuisine === c} onClick={() => p.setCuisine(c)}>{c}</button>
        ))}
      </div>

      {p.fridgeCount === 0 ? (
        <Empty icon="fridge" title="Your fridge is empty" text="Pick a few ingredients first. Then we can match recipes for you."
          action="Open My Fridge" onAction={() => p.go('fridge')} />
      ) : null}

      {searching && list.length === 0 ? (
        <div className="stack" role="status">
          <p className="panel flat muted" style={{ borderStyle: 'dashed', borderWidth: 2 }}>No recipes match that name.</p>
          <div><button className="link small" onClick={() => p.setSearch('')}>Clear search</button></div>
        </div>
      ) : null}

      {['now', 'almost', 'shop'].map((s) => {
        const items = list.filter((x) => x.match.status === s);
        /* While searching, groups with no result are hidden to keep the list short. */
        if (searching && items.length === 0) return null;
        return (
          <section key={s} className="stack">
            <div className="section-head">
              <span className="dot" style={{ background: DOTS[s] }} />
              <h2 className="h-lg">{STATUS[s].label}</h2>
              <span className="pill">{items.length}</span>
            </div>
            <p className="muted small">{STATUS[s].hint}</p>
            {items.length === 0 ? (
              <p className="panel flat small muted" style={{ borderStyle: 'dashed', borderWidth: 2 }}>No recipes here yet.</p>
            ) : (
              <div className="grid">
                <RecipeCards items={items} variant="list" isSaved={p.isSaved} toggleSave={p.toggleSave} open={p.open} />
              </div>
            )}
          </section>
        );
      })}
    </>
  );
}
