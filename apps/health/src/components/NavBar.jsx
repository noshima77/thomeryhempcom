export default function NavBar({ current, onNavigate, pages }) {
  return (
    <nav className="fixed bottom-0 inset-x-0 h-[68px] flex items-stretch bg-neutral-0/95 backdrop-blur-xl border-t border-neutral-200 z-50 pb-[env(safe-area-inset-bottom)]">
      {pages.map((p) => {
        const active = current === p.id;
        return (
          <button
            key={p.id}
            onClick={() => onNavigate(p.id)}
            aria-label={p.label}
            className={`flex-1 flex flex-col items-center justify-center gap-1 min-h-touch transition-colors ${
              active ? "text-green-500" : "text-neutral-500"
            }`}
          >
            <span className={`text-xl leading-none transition-transform duration-200 ${active ? "scale-125" : ""}`}>
              {p.icon}
            </span>
            <span className="font-mono text-[0.55rem] tracking-wide uppercase">
              {p.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}