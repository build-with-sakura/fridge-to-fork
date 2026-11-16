import Icon from '../components/Icon.jsx';
import Brand from '../components/Brand.jsx';
import FoodArt from '../components/FoodArt.jsx';
import { RecipeCards } from '../components/RecipeCard.jsx';
import { RECIPES } from '../data/library.js';
import { plural } from '../lib/labels.js';

const CUISINES = [['Filipino', 'p'], ['Japanese', 'o'], ['International', 'a']];
const HOW = [
  ['1', 'Pick your ingredients', 'Tap what is in your fridge.'],
  ['2', 'See your matches', 'Recipes sorted by what you can cook now.'],
  ['3', 'Cook or shop', 'Follow the steps, or grab what is missing.'],
];

export default function Home(p) {
  const counts = { now: 0, almost: 0, shop: 0 };
  p.list.forEach((x) => { counts[x.match.status]++; });
  const featured = p.list.slice(0, 5);
  const top = p.list[0];

  return (
    <>
      <Brand className="mobile-brand" />

      <section className="hero">
        <svg className="hero-dots" viewBox="0 0 400 200" preserveAspectRatio="none" aria-hidden="true">
          <circle cx="30" cy="180" r="46" fill="#FF7A1A" opacity=".55" />
          <circle cx="210" cy="8" r="26" fill="#FFC928" opacity=".9" />
          <circle cx="150" cy="14" r="9" fill="#19C3C8" />
        </svg>
        <div className="hero-dish" aria-hidden="true"><FoodArt recipe={top.recipe} /></div>
        <div className="hero-copy">
          <h1>Hey, what's cooking?</h1>
          <p>Let's make something yummy with what you've got!</p>
        </div>
        <div className="hero-actions">
          <button className="btn sun" onClick={() => p.go('fridge')}>Let's Cook!<Icon name="arrow" /></button>
          <span className="hero-note">{plural(p.fridgeCount, 'ingredient') + ' in your fridge'}</span>
        </div>
      </section>

      <section className="stats" aria-label="Your matches">
        <button className="stat a" onClick={() => p.go('recipes')}><b>{counts.now}</b><span>Can cook now</span></button>
        <button className="stat y" onClick={() => p.go('recipes')}><b>{counts.almost}</b><span>Almost there</span></button>
        <button className="stat o" onClick={() => p.go('saved')}><b>{p.savedCount}</b><span>Saved recipes</span></button>
      </section>

      <section className="stack">
        <div className="row between">
          <h2 className="h-lg">Best matches for you</h2>
          <button className="link small" onClick={() => p.go('recipes')}>See all</button>
        </div>
        <div className="scroller">
          <RecipeCards items={featured} variant="mini" isSaved={p.isSaved} toggleSave={p.toggleSave} open={p.open} />
        </div>
      </section>

      <section className="stack">
        <h2 className="h-lg">Pick a cuisine</h2>
        <div className="tiles">
          {CUISINES.map(([name, color]) => {
            const n = RECIPES.filter((r) => r.cuisine === name).length;
            return (
              <button key={name} className={'tile ' + color} onClick={() => { p.setCuisine(name); p.go('recipes'); }}>
                {name}
                <small>{plural(n, 'recipe')}</small>
              </button>
            );
          })}
        </div>
      </section>

      <section className="panel yellow stack">
        <h2 className="h-lg">Cook first, shop less</h2>
        <p>Fridge to Fork finds dishes you can make with food you already have. Less waste, fewer trips to the store.</p>
        <div className="how">
          {HOW.map(([num, title, text]) => (
            <div key={num}>
              <div className="row">
                <div className={'num n' + num}>{num}</div>
                <h3 className="h-md" style={{ fontSize: 17 }}>{title}</h3>
              </div>
              <p className="small muted">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
