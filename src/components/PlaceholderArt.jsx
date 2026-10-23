// Neutral "no photo yet" graphic. It is deliberately generic so it is never mistaken
// for the real packaging of a specific medicine.
export default function PlaceholderArt() {
  return (
    <svg className="placeholder-art" viewBox="0 0 120 120" role="img" aria-label="Product image coming soon">
      <rect width="120" height="120" rx="14" fill="#f3edf8" />
      <g transform="rotate(-35 60 56)">
        <rect x="26" y="44" width="68" height="26" rx="13" fill="#fff" stroke="#c9b0dc" strokeWidth="2" />
        <path d="M60 44h21a13 13 0 0 1 0 26H60z" fill="#64218b" opacity=".85" />
      </g>
      <text x="60" y="104" textAnchor="middle" fontSize="9" fontFamily="sans-serif" fill="#8a6fa0">Image coming soon</text>
    </svg>
  );
}
