export default function Header() {
  return (
    <header className="flex items-center justify-between px-8 py-6 md:px-16 md:py-10">
      <div className="flex items-baseline gap-3">
        <span className="font-display text-2xl tracking-tight text-text-primary">
          Glass
        </span>
        <span className="hidden font-mono text-xs uppercase tracking-widest text-text-tertiary md:inline">
          instrument no. 01
        </span>
      </div>
      <nav className="font-mono text-xs uppercase tracking-widest text-text-secondary">
        <span>local time observatory</span>
      </nav>
    </header>
  );
}