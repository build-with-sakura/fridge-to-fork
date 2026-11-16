import { useState } from 'react';
import Icon from '../components/Icon.jsx';
import Photo from '../components/Photo.jsx';
import Badge from '../components/Badge.jsx';

function IngRow({ item, kind }) {
  return (
    <div className="ing">
      <span className={'tick ' + kind} aria-hidden="true"><Icon name={kind === 'miss' ? 'cart' : 'check'} size={15} weight={2.4} /></span>
      <span className="ing-main">
        <span>{item.name}</span>
        <span className="ing-need">{'Recipe needs ' + item.qty}</span>
      </span>
      <span className={'tag ' + kind}>{kind === 'miss' ? 'To buy' : kind === 'staple' ? 'Basic' : 'Have it'}</span>
    </div>
  );
}

export default function Detail({ recipe, match, saved, onSave, close }) {
  const [copied, setCopied] = useState('');
  const [photo, setPhoto] = useState('none');
  const basics = recipe.ingredients.filter((i) => i.staple);
  const time = recipe.time ? <span className="pill"><Icon name="clock" size={15} />{recipe.time + ' min'}</span> : null;

  function copy() {
    const text = 'Shopping list for ' + recipe.name + ':\n' + match.missing.map((i) => '- ' + i.name + ' (' + i.qty + ')').join('\n');
    const failed = () => setCopied('Could not copy. Please write it down.');
    try {
      navigator.clipboard.writeText(text).then(() => setCopied('Copied!'), failed);
    } catch (e) {
      failed();
    }
  }

  return (
    <div className="narrow detail">
      <div className="row between">
        <button className="back" onClick={close}><Icon name="back" size={20} />Back</button>
        <button className="back" style={{ paddingLeft: 16 }} aria-pressed={saved} onClick={onSave}>
          <Icon name="heart" size={20} fill={saved ? '#D81B60' : 'none'} color={saved ? '#D81B60' : '#2A1533'} />
          {saved ? 'Saved' : 'Save'}
        </button>
      </div>

      <div className="detail-photo"><Photo recipe={recipe} onStatus={setPhoto} /></div>
      {photo === 'ok'
        ? (recipe.imageCredit ? <p className="caption">{'Photo: ' + recipe.imageCredit}</p> : null)
        : <p className="caption">Illustration shown. The real photo is not loaded yet.</p>}

      <section className="stack tight">
        <h1 className="h-xl">{recipe.name}</h1>
        <p className="lead">{recipe.blurb}</p>
        <div className="chips">
          <span className="pill">{recipe.cuisine}</span>
          {time}
          <Badge status={match.status} />
        </div>
      </section>

      {match.missing.length ? (
        <section className="panel orange stack tight">
          <div className="row between wrap">
            <h2 className="h-md">To buy</h2>
            <span className="count">{match.missing.length}</span>
          </div>
          <div>{match.missing.map((i) => <IngRow key={i.key} item={i} kind="miss" />)}</div>
          <div className="row wrap">
            <button className="btn ghost" onClick={copy}><Icon name="cart" size={18} />Copy shopping list</button>
            <span className="small" role="status">{copied}</span>
          </div>
        </section>
      ) : (
        <section className="panel aqua stack tight">
          <h2 className="h-md">Nothing to buy</h2>
          <p className="small">Every key ingredient is in your fridge.</p>
        </section>
      )}

      <p className="amount-note">
        <b>Check your amounts. </b>
        We know which ingredients you have, not how much of each. Compare with what the recipe needs.
      </p>

      {match.owned.length ? (
        <section className="panel stack tight">
          <div className="row between">
            <h2 className="h-md">In your fridge</h2>
            <span className="pill">{match.owned.length + ' of ' + match.required.length}</span>
          </div>
          <div>{match.owned.map((i) => <IngRow key={i.key} item={i} kind="have" />)}</div>
        </section>
      ) : null}

      {basics.length ? (
        <section className="panel stack tight">
          <h2 className="h-md">Kitchen basics</h2>
          <p className="small muted">We assume you have these. They are not counted as missing.</p>
          <div>{basics.map((i) => <IngRow key={i.key} item={i} kind="staple" />)}</div>
        </section>
      ) : null}

      <section className="panel stack tight">
        <div className="row between">
          <h2 className="h-md">How to cook it</h2>
          {time}
        </div>
        <div>
          {recipe.steps.map((s, n) => (
            <div key={n} className="cook-step">
              <div className={'num n' + ((n % 3) + 1)}>{n + 1}</div>
              <p>{s}</p>
            </div>
          ))}
        </div>
      </section>

      <p className="note">Sample recipe for the prototype. Please check before cooking.</p>
    </div>
  );
}
