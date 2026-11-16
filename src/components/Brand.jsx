import Icon from './Icon.jsx';

export default function Brand({ className = '' }) {
  return (
    <div className={'brand ' + className}>
      <div className="brand-mark"><Icon name="recipes" size={24} color="#FFFFFF" weight={2.2} /></div>
      <div>
        <div className="brand-name">Fridge to Fork</div>
        <div className="brand-tag">Your fridge has possibilities.</div>
      </div>
    </div>
  );
}
