import { useAuthStore } from "../store/useAuthStore";

function MessageReactions({ reactions, onReact, isSentByMe }) {
  const { authUser } = useAuthStore();
  
  if (!reactions || reactions.length === 0) return null;

  // Group reactions by emoji
  const groupedReactions = reactions.reduce((acc, curr) => {
    if (!acc[curr.emoji]) {
      acc[curr.emoji] = {
        count: 0,
        hasReacted: false,
      };
    }
    acc[curr.emoji].count += 1;
    if (curr.userId === authUser._id) {
      acc[curr.emoji].hasReacted = true;
    }
    return acc;
  }, {});

  return (
    <div className={`flex flex-wrap gap-1 mt-1 ${isSentByMe ? "justify-end" : "justify-start"}`}>
      {Object.entries(groupedReactions).map(([emoji, { count, hasReacted }]) => (
        <button
          key={emoji}
          onClick={() => onReact(emoji)}
          className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border transition-all hover:scale-105 active:scale-95 ${
            hasReacted
              ? "bg-primary/20 border-primary/40 text-primary shadow-sm shadow-primary/10"
              : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
          }`}
        >
          <span>{emoji}</span>
          <span>{count}</span>
        </button>
      ))}
    </div>
  );
}

export default MessageReactions;
