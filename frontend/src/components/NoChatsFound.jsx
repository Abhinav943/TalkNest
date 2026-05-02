import { MessageCircleIcon } from "lucide-react";
import { useChatStore } from "../store/useChatStore";

function NoChatsFound() {
  const { setActiveTab } = useChatStore();

  return (
    <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
      <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center">
        <MessageCircleIcon className="w-8 h-8 text-primary" />
      </div>
      <div>
        <h4 className="text-slate-100 font-semibold mb-1">No conversations yet</h4>
        <p className="text-slate-300/75 text-sm px-6">
          Start a new chat by selecting a contact from the contacts tab
        </p>
      </div>
      <button
        onClick={() => setActiveTab("contacts")}
        className="btn btn-sm rounded-xl bg-white/5 border border-white/10 text-slate-100 hover:bg-white/10 hover:border-white/15"
      >
        Find contacts
      </button>
    </div>
  );
}
export default NoChatsFound;
