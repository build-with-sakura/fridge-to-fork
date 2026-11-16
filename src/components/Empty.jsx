import Icon from './Icon.jsx';

export default function Empty({ icon, title, text, action, onAction }) {
  return (
    <div className="empty">
      <div className="num" style={{ width: 56, height: 56, borderRadius: 20 }}><Icon name={icon} size={28} /></div>
      <h3 className="h-md">{title}</h3>
      <p className="muted">{text}</p>
      {action ? <button className="btn" onClick={onAction}>{action}</button> : null}
    </div>
  );
}
