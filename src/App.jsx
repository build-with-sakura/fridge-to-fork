import { useEffect, useMemo, useState } from 'react';
import { INGREDIENTS, DEFAULT_FRIDGE } from './data/ingredients.js';
import { RECIPES } from './data/recipes.js';
import { matchRecipe, normalize } from './data/matching.js';
import { load, save } from './lib/storage.js';
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

  useEffect(() => { save('f2f.fridge', fridge); }, [fridge]);
  useEffect(() => { save('f2f.saved', saved); }, [saved]);
  useEffect(() => { window.scrollTo(0, 0); }, [tab, openId]);
  useEffect(() => {
    function onHash() {
      const t = tabFromHash();
      if (t) { setTab(t); setOpenId(null); }
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
    setTab(t);
    window.location.hash = t;
  }

  function toggle(k) {
    const n = normalize(k);
    const known = INGREDIENTS.find((i) => normalize(i.key) === n);
    const key = known ? known.key : n;
    setFridge((f) => (f.some((x) => normalize(x) === n) ? f.filter((x) => normalize(x) !== n) : f.concat([key])));
  }

  function toggleSave(id) {
    setSaved((s) => (s.includes(id) ? s.filter((x) => x !== id) : s.concat([id])));
  }

  const isSaved = (id) => saved.includes(id);

  const shared = {
    list, go, open: setOpenId, isSaved, toggleSave,
    fridgeCount: fridge.length, savedCount: saved.length, cuisine, setCuisine,
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
