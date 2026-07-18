export default function EmptyLine() {
  return (
    <div className="flex h-full flex-1 flex-col items-center justify-center px-8 text-center">
      <p className="font-display text-2xl italic text-ink-secondary">
        the line is quiet.
      </p>
      <p className="mt-2 max-w-sm font-sans text-sm text-ink-tertiary">
        pick a line from the left, or start one of your own, to get things ringing.
      </p>
    </div>
  );
}