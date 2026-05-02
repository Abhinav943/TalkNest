function BorderAnimatedContainer({ children }) {
  return (
    <div className="w-full h-full [background:linear-gradient(180deg,rgba(17,27,46,0.65),rgba(7,10,18,0.55))_padding-box,conic-gradient(from_var(--border-angle),rgba(255,255,255,0.10)_80%,_theme(colors.cyan.400)_86%,_theme(colors.violet.400)_90%,_theme(colors.rose.400)_94%,rgba(255,255,255,0.10))_border-box] rounded-3xl border border-transparent animate-border flex overflow-hidden shadow-glow">
      {children}
    </div>
  );
}

export default BorderAnimatedContainer;
