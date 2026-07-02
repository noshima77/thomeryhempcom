export default function NavBar({ current, onNavigate, pages }) {
  return (
    <nav className="nav-bar">
      {pages.map((p) => (
        <button
          key={p.id}
          className={`nav-item ${current === p.id ? "active" : ""}`}
          onClick={() => onNavigate(p.id)}
          aria-label={p.label}
        >
          <span className="nav-icon">{p.icon}</span>
          <span className="nav-label">{p.label}</span>
        </button>
      ))}
    </nav>
  );
}
