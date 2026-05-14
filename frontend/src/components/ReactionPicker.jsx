const EMOJIS = [
  { emoji: "❤️", label: "Love" },
  { emoji: "👍", label: "Like" },
  { emoji: "😂", label: "Haha" },
  { emoji: "😮", label: "Wow" },
  { emoji: "😢", label: "Sad" },
  { emoji: "🔥", label: "Fire" },
  { emoji: "👏", label: "Clap" },
];

function ReactionPicker({ onSelect, className = "" }) {
  return (
    <div className={`flex items-center gap-1 p-1.5 bg-slate-900/90 backdrop-blur-md border border-white/10 rounded-full shadow-xl animate-in fade-in zoom-in duration-200 ${className}`}>
      {EMOJIS.map(({ emoji, label }) => (
        <button
          key={emoji}
          onClick={() => onSelect(emoji)}
          className="w-8 h-8 flex items-center justify-center text-xl hover:scale-125 hover:-translate-y-1 transition-all active:scale-95"
          title={label}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}

export default ReactionPicker;
