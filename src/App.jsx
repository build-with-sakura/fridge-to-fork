import { useEffect, useMemo, useState } from 'react';
import { DEFAULT_FRIDGE } from './data/ingredients.js';
import { RECIPES } from './data/library.js';
import { matchRecipe, normalize } from './data/matching.js';
import { load, save } from './lib/storage.js';
import { knownIngredient } from './lib/labels.js';
import Nav from './components/Nav.jsx';
import Home from './screens/Home.jsx';
import Fridge from './screens/Fridge.jsx';
import Recipes from './screens/Recipes.jsx';
import Detail from './screens/Detail.jsx';
import Saved from './screens/Saved.jsx';

const TABS = ['home', 'fridge', 'recipes', 'saved'];
const ORDER = { now: 0, almost: 1, shop: 2 };

function tabFromHash() {
  const t = (window.location.hash || '').replace('#', '');
  return TABS.includes(t) ? t : null;
}

export default function App() {
  const [tab, setTab] = useState(() => tabFromHash() || 'home');
  const [fridge, setFridge] = useState(() => load('f2f.fridge', DEFAULT_FRIDGE));
  const [saved, setSaved] = useState(() => load('f2f.saved', []));
  const [openId, setOpenId] = useState(null);
  const [cuisine, setCuisine] = useState('All');
  /* Recipe-name search. Kept only while the app is open. It is never saved. */
  const [search, setSearch] = useState('');

  useEffect(() => { save('f2f.fridge', fridge); }, [fridge]);
  useEffect(() => { save('f2f.saved', saved); }, [saved]);
  useEffect(() => { window.scrollTo(0, 0); }, [tab, openId]);
  useEffect(() => {
    function onHash() {
      const t = tabFromHash();
      if (t) { setTab(t); setOpenId(null); if (t !== 'recipes') setSearch(''); }
    }
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  /* Every recipe with its match result, best matches first. */
  const list = useMemo(() => {
    return RECIPES.map((recipe) => ({ recipe, match: matchRecipe(recipe, fridge) })).sort(
      (a, b) =>
        ORDER[a.match.status] - ORDER[b.match.status] ||
        a.match.missing.length - b.match.missing.length ||
        (a.recipe.time || 0) - (b.recipe.time || 0)
    );
  }, [fridge]);

  function go(t) {
    setOpenId(null);
    if (t !== 'recipes') setSearch('');
    setTab(t);
    window.location.hash = t;
  }

  /* Adds or removes one fridge entry.
     Tappable items are stored by key. Typed items are stored exactly as typed. */
  function toggle(entry) {
    const n = normalize(entry);
    if (!n) return;
    const known = knownIngredient(entry);
    const stored = known ? known.key : String(entry).trim();
    setFridge((f) => (f.some((x) => normalize(x) === n) ? f.filter((x) => normalize(x) !== n) : f.concat([stored])));
  }

  function toggleSave(id) {
    setSaved((s) => (s.includes(id) ? s.filter((x) => x !== id) : s.concat([id])));
  }

  const isSaved = (id) => saved.includes(id);

  const shared = {
    list, go, open: setOpenId, isSaved, toggleSave,
    fridgeCount: fridge.length, savedCount: saved.length, cuisine, setCuisine, search, setSearch,
  };
  const current = openId ? list.find((x) => x.recipe.id === openId) : null;

  let view;
  if (current) {
    view = (
      <Detail key={openId} recipe={current.recipe} match={current.match} saved={isSaved(openId)}
        onSave={() => toggleSave(openId)} close={() => setOpenId(null)} />
    );
  } else if (tab === 'home') view = <Home {...shared} />;
  else if (tab === 'fridge') view = <Fridge fridge={fridge} toggle={toggle} clear={() => setFridge([])} go={go} />;
  else if (tab === 'recipes') view = <Recipes {...shared} />;
  else view = <Saved {...shared} />;

  return (
    <>
      <div className="shell">
        <main className="app">{view}</main>
      </div>
      <Nav tab={tab} go={go} fridgeCount={fridge.length} savedCount={saved.length} />
    </>
  );
}
