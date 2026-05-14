import { useEffect, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder";
import MessageInput from "./MessageInput";
import MessagesLoadingSkeleton from "./MessagesLoadingSkeleton";
import { useState } from "react";
import { Reply, Smile, Quote } from "lucide-react";
import ReactionPicker from "./ReactionPicker";
import MessageReactions from "./MessageReactions";

function ChatContainer() {
  const {
    selectedUser,
    getMessagesByUserId,
    messages,
    isMessagesLoading,
    subscribeToMessages,
    unsubscribeFromMessages,
    isTyping,
    setReplyingTo,
    reactToMessage,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  const [activeReactionId, setActiveReactionId] = useState(null);
  const [highlightedMessageId, setHighlightedMessageId] = useState(null);

  const scrollToMessage = (messageId) => {
    const element = document.getElementById(`msg-${messageId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      setHighlightedMessageId(messageId);
      setTimeout(() => setHighlightedMessageId(null), 2000);
    }
  };

  useEffect(() => {
    getMessagesByUserId(selectedUser._id);
    subscribeToMessages();

    // clean up
    return () => unsubscribeFromMessages();
  }, [selectedUser, getMessagesByUserId, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <>
      <ChatHeader />
      <div className="flex-1 px-5 md:px-6 overflow-y-auto py-8">
        {messages.length > 0 && !isMessagesLoading ? (
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((msg) => {
              const isSentByMe = String(msg.senderId) === String(authUser?._id);

              return (
                <div
                  key={msg._id}
                  id={`msg-${msg._id}`}
                  className={`chat ${isSentByMe ? "chat-end" : "chat-start"} motion-safe:animate-fade-in group relative`}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    setActiveReactionId(msg._id);
                  }}
                  onDoubleClick={() => setReplyingTo(msg)}
                >
                  <div
                    className={`chat-bubble relative flex flex-col min-w-[60px] ${
                      isSentByMe
                        ? "bg-gradient-to-br from-primary to-secondary text-slate-950 hover-lift bubble-tail-me shadow-lg shadow-primary/10"
                        : "bg-white/6 border border-white/10 text-slate-100 hover-lift bubble-tail-them"
                    } ${highlightedMessageId === msg._id ? "ring-2 ring-primary ring-offset-2 ring-offset-base-100 scale-[1.02] transition-all duration-500" : "transition-all duration-300"}`}
                  >
                    {/* Reply Section */}
                    {msg.replyTo && (
                      <div 
                        onClick={() => scrollToMessage(msg.replyTo._id)}
                        className={`mb-2 p-2 rounded-xl text-xs cursor-pointer transition-colors border-l-2 ${
                          isSentByMe 
                            ? "bg-slate-950/20 border-slate-950/40 hover:bg-slate-950/30" 
                            : "bg-white/5 border-white/20 hover:bg-white/10"
                        }`}
                      >
                        <div className="flex items-center gap-1.5 font-bold mb-0.5 opacity-80 uppercase tracking-tighter">
                          <Quote className="w-2.5 h-2.5" />
                          {msg.replyTo.senderId?.fullName || "User"}
                        </div>
                        <p className="truncate opacity-70 italic line-clamp-1">
                          {msg.replyTo.text || (msg.replyTo.image ? "📷 Photo" : "Message deleted")}
                        </p>
                      </div>
                    )}

                    {msg.image && (
                      <img
                        src={msg.image}
                        alt="Shared"
                        className="rounded-xl h-48 w-full object-cover border border-black/5"
                      />
                    )}
                    {msg.text && <p className="mt-1 leading-relaxed">{msg.text}</p>}
                    
                    <div className={`flex items-center gap-2 mt-1 opacity-70 text-[10px] ${isSentByMe ? "justify-end" : "justify-start"}`}>
                      {new Date(msg.createdAt).toLocaleTimeString(undefined, {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>

                    {/* Action Buttons (Floating) */}
                    <div className={`absolute top-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                      isSentByMe ? "right-full mr-3" : "left-full ml-3"
                    }`}>
                      <button 
                        onClick={() => setReplyingTo(msg)}
                        className="p-1.5 rounded-full glass-panel hover:bg-primary/20 hover:text-primary transition-all active:scale-90"
                        title="Reply"
                      >
                        <Reply className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => setActiveReactionId(activeReactionId === msg._id ? null : msg._id)}
                        className={`p-1.5 rounded-full glass-panel hover:bg-primary/20 hover:text-primary transition-all active:scale-90 ${activeReactionId === msg._id ? "text-primary bg-primary/20" : ""}`}
                        title="React"
                      >
                        <Smile className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Reaction Picker Popup */}
                    {activeReactionId === msg._id && (
                      <div className={`absolute z-50 bottom-full mb-2 ${isSentByMe ? "right-0" : "left-0"}`}>
                        <ReactionPicker 
                          onSelect={(emoji) => {
                            reactToMessage(msg._id, emoji);
                            setActiveReactionId(null);
                          }} 
                        />
                      </div>
                    )}
                  </div>
                  
                  {/* Render Reactions Below Bubble */}
                  <MessageReactions 
                    reactions={msg.reactions} 
                    isSentByMe={isSentByMe} 
                    onReact={(emoji) => reactToMessage(msg._id, emoji)}
                  />
                </div>
              );
            })}
            {isTyping && (
              <div className="chat chat-start">
                <div className="chat-bubble bg-white/6 border border-white/10 text-slate-100 opacity-85">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-slate-300/80 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-slate-300/80 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
                    <span className="w-2 h-2 bg-slate-300/80 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></span>
                  </span>
                </div>
              </div>
            )}
            <div ref={messageEndRef} />
          </div>
        ) : isMessagesLoading ? (
          <MessagesLoadingSkeleton />
        ) : (
          <NoChatHistoryPlaceholder name={selectedUser.fullName} />
        )}
      </div>

      <MessageInput />
    </>
  );
}

export default ChatContainer;
