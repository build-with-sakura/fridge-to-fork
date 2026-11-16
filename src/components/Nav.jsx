import Icon from './Icon.jsx';
import Brand from './Brand.jsx';

const ITEMS = [
  ['home', 'Home', 'home'],
  ['fridge', 'My Fridge', 'fridge'],
  ['recipes', 'Recipes', 'recipes'],
  ['saved', 'Saved', 'heart'],
];

/* Bottom bar on phones, side rail on desktop (see app.css). */
export default function Nav({ tab, go, fridgeCount, savedCount }) {
  return (
    <nav className="nav" aria-label="Main">
      <Brand className="nav-brand" />
      {ITEMS.map(([id, label, icon]) => {
        const active = tab === id;
        const n = id === 'fridge' ? fridgeCount : id === 'saved' ? savedCount : 0;
        return (
          <button key={id} className={active ? 'active' : ''} aria-current={active ? 'page' : undefined} onClick={() => go(id)}>
            <Icon name={icon} size={24} />
            {label}
            {n > 0 ? <span className="badge" aria-label={n + ' items'}>{n}</span> : null}
          </button>
        );
      })}
    </nav>
  );
}
