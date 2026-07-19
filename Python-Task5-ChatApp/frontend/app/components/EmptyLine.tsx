export default function EmptyLine() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-surface/30 to-background pointer-events-none" />
      <div className="relative z-10 text-center">
        <h2 className="font-display text-5xl italic text-ink-secondary drop-shadow-md">Awaiting Connection</h2>
        <p className="mt-6 font-sans text-xs tracking-[0.3em] uppercase text-accent-copper">
          Select a line from the switchboard
        </p>
      </div>
    </div>
  );
}