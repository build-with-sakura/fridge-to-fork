function Squiggle({ color = '#FFC928' }) {
  return (
    <svg className="squiggle" viewBox="0 0 64 10" aria-hidden="true">
      <path d="M2 6c6-6 9 6 15 0s9 6 15 0 9 6 15 0 9 6 15 0" fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}

export default function PageHead({ title, text, color }) {
  return (
    <section className="page-head">
      <h1 className="h-xl">{title}</h1>
      <Squiggle color={color} />
      <p className="lead">{text}</p>
    </section>
  );
}
