export default function HeroPanel() {
  return (
    <section className="px-8 py-12 md:px-16 md:py-20">
      <p className="font-mono text-xs uppercase tracking-widest text-text-tertiary">
        present conditions over
      </p>

      <div className="mt-4 flex items-baseline gap-4">
        <h1 className="font-display text-6xl font-light text-text-primary md:text-8xl">
          Mumbai
        </h1>
        <span className="font-mono text-sm text-text-secondary">19.01N, 72.85E</span>
      </div>

      <div className="mt-10 flex items-end gap-6">
        <span className="font-display text-8xl font-light leading-none text-text-primary md:text-9xl">
          29.5
        </span>
        <span className="mb-4 font-mono text-2xl text-text-secondary">deg C</span>
      </div>

      <p className="mt-6 max-w-md font-sans text-lg leading-relaxed text-text-secondary">
        Broken clouds drift over the harbour. The air carries a weight the
        glass has been predicting since dawn.
      </p>

      <div className="mt-12 flex gap-10 border-t border-hairline pt-6">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-text-tertiary">humidity</p>
          <p className="mt-1 font-mono text-xl text-text-primary">73%</p>
        </div>
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-text-tertiary">pressure</p>
          <p className="mt-1 font-mono text-xl text-text-primary">1006 hpa</p>
        </div>
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-text-tertiary">visibility</p>
          <p className="mt-1 font-mono text-xl text-text-primary">10.0 km</p>
        </div>
      </div>
    </section>
  );
}