import { MessageCircleIcon } from "lucide-react";

const NoConversationPlaceholder = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6">
      <div className="size-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
        <MessageCircleIcon className="size-10 text-primary" />
      </div>
      <h3 className="text-2xl font-bold text-slate-100 mb-2 tracking-tight">Select a conversation</h3>
      <p className="text-slate-300/75 max-w-md">
        Choose a contact from the sidebar to start chatting or continue a previous conversation.
      </p>
    </div>
  );
};

export default NoConversationPlaceholder;
