import { useState } from 'react';
import Icon from '../components/Icon.jsx';
import Brand from '../components/Brand.jsx';
import PageHead from '../components/PageHead.jsx';
import { INGREDIENTS, GROUPS } from '../data/ingredients.js';
import { normalize } from '../data/matching.js';
import { labelFor } from '../lib/labels.js';

export default function Fridge({ fridge, toggle, clear, go }) {
  const [q, setQ] = useState('');
  const nq = normalize(q);
  const shown = INGREDIENTS.filter((i) => !nq || normalize(i.label).includes(nq));
  const exact = INGREDIENTS.some((i) => normalize(i.key) === nq) || fridge.some((k) => normalize(k) === nq);

  return (
    <div className="narrow">
      <Brand className="mobile-brand" />
      <PageHead title="My Fridge" text="Tap everything you have at home." color="#19C3C8" />

      <label className="search" htmlFor="ingredient-search">
        <Icon name="search" />
        <input id="ingredient-search" type="search" placeholder="Search ingredients" value={q} autoComplete="off"
          onChange={(e) => setQ(e.target.value)} />
      </label>

      <section className="panel aqua stack">
        <div className="row between">
          <h2 className="h-md">In your fridge</h2>
          <span className="count" aria-label={fridge.length + ' selected'}>{fridge.length}</span>
        </div>
        {fridge.length === 0 ? (
          <p>Nothing yet. Tap an ingredient below.</p>
        ) : (
          <div className="chips">
            {fridge.map((k) => (
              <button key={k} className="chip" style={{ borderColor: 'transparent' }} aria-label={'Remove ' + labelFor(k)} onClick={() => toggle(k)}>
                {labelFor(k)}<Icon name="x" size={16} />
              </button>
            ))}
          </div>
        )}
        {fridge.length > 0 ? <div><button className="link small" onClick={clear}>Clear all</button></div> : null}
      </section>

      {nq && !exact ? (
        <button className="chip add" style={{ alignSelf: 'flex-start' }} onClick={() => { toggle(nq); setQ(''); }}>
          <Icon name="plus" size={18} />{'Add "' + q.trim() + '"'}
        </button>
      ) : null}

      {shown.length === 0 ? (
        <p className="muted">No match in our list. Use the yellow button to add it yourself.</p>
      ) : (
        GROUPS.map((g) => {
          const items = shown.filter((i) => i.group === g);
          if (!items.length) return null;
          return (
            <section key={g} className="stack">
              <h2 className="h-md">{g}</h2>
              <div className="chips">
                {items.map((i) => {
                  const on = fridge.includes(i.key);
                  return (
                    <button key={i.key} className={'chip' + (on ? ' on' : '')} aria-pressed={on} onClick={() => toggle(i.key)}>
                      {on ? <Icon name="check" size={18} weight={2.6} /> : null}{i.label}
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })
      )}

      <div className="sticky-cta">
        <button className="btn block" onClick={() => go('recipes')}>Find My Recipes<Icon name="arrow" /></button>
      </div>
    </div>
  );
}
