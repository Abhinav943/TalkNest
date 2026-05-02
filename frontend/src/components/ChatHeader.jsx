import { XIcon } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";

function ChatHeader() {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const isOnline = onlineUsers.includes(selectedUser._id);

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") setSelectedUser(null);
    };

    window.addEventListener("keydown", handleEscKey);

    // cleanup function
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [setSelectedUser]);

  return (
    <div
      className="flex justify-between items-center border-b border-white/10 max-h-[84px] px-5 md:px-6 flex-1"
    >
      <div className="flex items-center space-x-3">
        <div className={`avatar ${isOnline ? "online" : "offline"}`}>
          <div className="w-12 rounded-full ring-1 ring-white/10">
            <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.fullName} />
          </div>
        </div>

        <div>
          <h3 className="text-slate-100 font-semibold leading-tight">{selectedUser.fullName}</h3>
          <p className="text-slate-300/70 text-sm">{isOnline ? "Online" : "Offline"}</p>
        </div>
      </div>

      <button
        onClick={() => setSelectedUser(null)}
        className="btn btn-ghost btn-sm rounded-xl hover:bg-white/10"
      >
        <XIcon className="w-5 h-5 text-slate-300/70 hover:text-slate-100 transition-colors cursor-pointer" />
      </button>
    </div>
  );
}
export default ChatHeader;
