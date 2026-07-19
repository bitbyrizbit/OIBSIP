export default function EmptyLine() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-background">
      <h2 className="font-display text-4xl italic text-ink-secondary">No Active Connection</h2>
      <p className="mt-4 font-mono text-xs tracking-[0.2em] text-ink-tertiary">
        select a line from the ledger to begin
      </p>
    </div>
  );
}