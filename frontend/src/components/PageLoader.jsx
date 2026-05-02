function PageLoader() {
  return (
    <div className="app-shell">
      <div className="app-bg" />
      <div className="app-grid" />

      <div className="relative z-10 flex flex-col items-center gap-4">
        <div className="relative">
          <div className="absolute -inset-6 rounded-full bg-gradient-to-r from-primary/30 via-secondary/25 to-accent/25 blur-2xl motion-safe:animate-pulse" />

          <div className="relative grid place-items-center size-16 rounded-3xl bg-white/5 border border-white/10 shadow-glow">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary/20 to-secondary/15 motion-safe:animate-shimmer" style={{ backgroundSize: "200% 100%" }} />

            <div className="relative size-10 rounded-full border-2 border-white/10 border-t-primary border-r-secondary motion-safe:animate-spin" />
          </div>
        </div>

        <div className="text-center">
          <p className="text-slate-100 font-semibold tracking-tight">Loading TalkNest</p>
          <p className="text-slate-300/70 text-sm">Warming up your chats…</p>
        </div>
      </div>
    </div>
  );
}

export default PageLoader;
