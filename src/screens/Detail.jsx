import { useState } from 'react';
import Icon from '../components/Icon.jsx';
import Photo from '../components/Photo.jsx';
import Badge from '../components/Badge.jsx';

const TAGS = { miss: 'To buy', have: 'Have it', staple: 'Basic', optional: 'Optional' };

/* One ingredient line. "main" marks an ingredient that defines the dish. */
function IngRow({ item, kind, have = false, main = false }) {
  const icon = kind === 'miss' ? 'cart' : kind === 'optional' && !have ? 'plus' : 'check';
  return (
    <div className="ing">
      <span className={'tick ' + kind + (have ? ' have' : '')} aria-hidden="true"><Icon name={icon} size={15} weight={2.4} /></span>
      <span className="ing-main">
        {main ? <b>Main ingredient</b> : null}
        <span>{item.name}</span>
        <span className="ing-need">{'Recipe needs ' + item.qty + (item.note ? '. ' + item.note : '')}</span>
      </span>
      <span className={'tag ' + (kind === 'optional' && have ? 'have' : kind)}>{kind === 'optional' && have ? 'Have it' : TAGS[kind]}</span>
    </div>
  );
}

export default function Detail({ recipe, match, saved, onSave, close }) {
  const [copied, setCopied] = useState('');
  const [photo, setPhoto] = useState('none');
  const isMain = (i) => match.essential.includes(i);
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
          {recipe.serves ? <span className="pill">{'Serves ' + recipe.serves}</span> : null}
          {time}
          <Badge status={match.status} />
        </div>
        {recipe.timeNote ? <p className="small muted">{recipe.timeNote}</p> : null}
      </section>

      {match.missing.length ? (
        <section className="panel orange stack tight">
          <div className="row between wrap">
            <h2 className="h-md">To buy</h2>
            <span className="count">{match.missing.length}</span>
          </div>
          <div>{match.missing.map((i) => <IngRow key={i.key} item={i} kind="miss" main={isMain(i)} />)}</div>
          <div className="row wrap">
            <button className="btn ghost" onClick={copy}><Icon name="cart" size={18} />Copy shopping list</button>
            <span className="small" role="status">{copied}</span>
          </div>
        </section>
      ) : (
        <section className="panel aqua stack tight">
          <h2 className="h-md">Nothing to buy</h2>
          <p className="small">Every needed ingredient is in your fridge.</p>
        </section>
      )}

      <div className="amount-note note-list">
        <p><b>Check your amounts. </b>We know which ingredients you have, not how much of each. Compare with what the recipe needs.</p>
        {(recipe.notes || []).map((n) => <p key={n}>{n}</p>)}
      </div>

      {match.owned.length ? (
        <section className="panel stack tight">
          <div className="row between">
            <h2 className="h-md">In your fridge</h2>
            <span className="pill">{match.owned.length + ' of ' + match.core.length}</span>
          </div>
          <div>{match.owned.map((i) => <IngRow key={i.key} item={i} kind="have" main={isMain(i)} />)}</div>
        </section>
      ) : null}

      {match.optional.length ? (
        <section className="panel stack tight">
          <h2 className="h-md">Optional extras</h2>
          <p className="small muted">Nice to have. The recipe works without them.</p>
          <div>{match.optional.map((o) => <IngRow key={o.item.key} item={o.item} kind="optional" have={o.have} />)}</div>
        </section>
      ) : null}

      {match.basics.length ? (
        <section className="panel stack tight">
          <h2 className="h-md">Kitchen basics</h2>
          <p className="small muted">We assume every kitchen has water, salt, black pepper, sugar and cooking oil. We do not check these. Please check the amounts yourself.</p>
          <div>{match.basics.map((i) => <IngRow key={i.key} item={i} kind="staple" />)}</div>
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

      <p className="note">Sample recipe. Please check before cooking.</p>
    </div>
  );
}
