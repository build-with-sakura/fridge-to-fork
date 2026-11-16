const ICONS = {
  home: 'M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10',
  fridge: 'M6 3h12a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM5 10h14M9 6v2M9 13v3',
  recipes: 'M7 3v8M4 3v5a3 3 0 0 0 6 0V3M7 11v10M17 3c-2 2-3 5-3 8h3zM17 11v10',
  heart: 'M12 20s-7-4.5-9-9.2C1.7 7.2 4 4 7.2 4c2 0 3.6 1 4.8 2.8C13.2 5 14.8 4 16.8 4 20 4 22.3 7.2 21 10.8 19 15.5 12 20 12 20z',
  search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-4-4',
  clock: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v5l3 2',
  back: 'M15 5l-7 7 7 7',
  check: 'M5 12.5l4.5 4.5L19 7',
  x: 'M6 6l12 12M18 6L6 18',
  plus: 'M12 5v14M5 12h14',
  arrow: 'M4 12h16M13 5l7 7-7 7',
  cart: 'M3 4h3l2.5 11h9.5l2-8H7M10 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM17 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2z',
};

export default function Icon({ name, size = 22, fill = 'none', color = 'currentColor', weight = 2 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={weight}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flex: 'none' }}>
      <path d={ICONS[name]} />
    </svg>
  );
}
