export default function EmptyLine() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-24 relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
        <h2 className="font-sans text-[20rem] font-black uppercase tracking-tighter text-ink-alabaster leading-none text-center">
          NO<br/>LINK
        </h2>
      </div>
      
      <div className="relative z-10 border-8 border-ink-alabaster bg-accent-vermilion p-12 text-center max-w-2xl transform -rotate-2">
        <h2 className="font-display text-7xl italic text-ink-alabaster leading-none">Standby</h2>
        <div className="mt-8 pt-8 border-t-4 border-ink-alabaster">
          <p className="font-sans text-2xl font-bold uppercase tracking-tight text-ink-alabaster">
            Select a vector from the index to establish connection
          </p>
        </div>
      </div>
    </div>
  );
}