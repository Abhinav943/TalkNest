import { useRef, useState } from "react";
import useKeyboardSound from "../hooks/useKeyboardSound";
import { useChatStore } from "../store/useChatStore";
import toast from "react-hot-toast";
import { ImageIcon, SendIcon, XIcon, Quote } from "lucide-react";

function MessageInput() {
  const { playRandomKeyStrokeSound } = useKeyboardSound();
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  const fileInputRef = useRef(null);

  const { sendMessage, isSoundEnabled, sendTypingEvent, replyingTo, setReplyingTo } = useChatStore();
  const typingTimeoutRef = useRef(null);

  const handleInputChange = (e) => {
    setText(e.target.value);
    isSoundEnabled && playRandomKeyStrokeSound();

    if (!typingTimeoutRef.current) {
      sendTypingEvent();
    }
    
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    
    typingTimeoutRef.current = setTimeout(() => {
      typingTimeoutRef.current = null;
    }, 1000);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;
    if (isSoundEnabled) playRandomKeyStrokeSound();

    sendMessage({
      text: text.trim(),
      image: imagePreview,
    });
    setText("");
    setImagePreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="p-4 border-t border-white/10">
      {imagePreview && (
        <div className="max-w-3xl mx-auto mb-3 flex items-center">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-2xl border border-white/10"
            />
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-base-200/90 border border-white/10 flex items-center justify-center text-slate-100 hover:bg-base-300"
              type="button"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
      
      {replyingTo && (
        <div className="max-w-3xl mx-auto mb-3 animate-in slide-in-from-bottom-2 duration-200">
          <div className="glass-panel rounded-2xl p-3 border-l-4 border-primary relative overflow-hidden group">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Quote className="w-3 h-3 text-primary" />
                  <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                    Replying to {replyingTo.senderId?.fullName || "User"}
                  </span>
                </div>
                <p className="text-sm text-slate-300 truncate opacity-90 italic">
                  {replyingTo.text || (replyingTo.image ? "Shared an image" : "Message deleted")}
                </p>
              </div>
              
              {replyingTo.image && (
                <img src={replyingTo.image} alt="Reply preview" className="w-12 h-12 rounded-lg object-cover border border-white/10" />
              )}

              <button
                onClick={() => setReplyingTo(null)}
                className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 transition-colors"
              >
                <XIcon className="w-4 h-4" />
              </button>
            </div>
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-3xl rounded-full -mr-12 -mt-12 pointer-events-none" />
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto flex space-x-4">
        <input
          type="text"
          value={text}
          onChange={handleInputChange}
          className="flex-1 glass-panel rounded-2xl py-2.5 px-4 text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/70"
          placeholder="Type your message..."
        />

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={`btn btn-ghost rounded-2xl px-4 hover:bg-white/10 ${
            imagePreview ? "text-primary" : "text-slate-300/70"
          }`}
        >
          <ImageIcon className="w-5 h-5" />
        </button>
        <button
          type="submit"
          disabled={!text.trim() && !imagePreview}
          className="btn rounded-2xl px-4 bg-gradient-to-r from-primary to-secondary text-slate-950 font-semibold hover:brightness-110 active:brightness-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed border-0"
        >
          <SendIcon className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
export default MessageInput;
