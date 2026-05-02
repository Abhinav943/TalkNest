function MessagesLoadingSkeleton() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          className={`chat ${index % 2 === 0 ? "chat-start" : "chat-end"}`}
        >
          <div className={`chat-bubble bg-white/6 border border-white/10 w-40`}>
            <div className="h-4 rounded bg-white/8 shimmer w-28"></div>
            <div className="h-3 rounded bg-white/6 shimmer w-16 mt-2"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
export default MessagesLoadingSkeleton;
