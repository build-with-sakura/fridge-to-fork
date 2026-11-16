import Icon from './Icon.jsx';

export default function Heart({ on, name, onToggle }) {
  return (
    <button className="heart" aria-pressed={on} aria-label={(on ? 'Remove ' : 'Save ') + name}
      onClick={(e) => { e.stopPropagation(); onToggle(); }}>
      <Icon name="heart" fill={on ? '#D81B60' : 'none'} color={on ? '#D81B60' : '#2A1533'} />
    </button>
  );
}
