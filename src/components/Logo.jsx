// Brand mark + name (navbar and footer).
export default function Logo() {
  return (
    <span className="logo">
      <span className="logo__mark" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#fff" strokeWidth="1.900" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="8.500" width="18" height="7" rx="3.500" transform="rotate(-40 12 12)" />
          <path d="m9.500 14.500 5-5" />
        </svg>
      </span>
      <span className="logo__text">
        <strong>Qazi Medicine Company</strong>
        <small>Wholesale Medicine Distribution</small>
      </span>
    </span>
  );
}
