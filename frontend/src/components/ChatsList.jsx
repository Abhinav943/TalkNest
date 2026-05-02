import { useEffect, useMemo } from "react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import NoChatsFound from "./NoChatsFound";
import { useAuthStore } from "../store/useAuthStore";

function ChatsList({ query = "" }) {
  const { getMyChatPartners, chats, isUsersLoading, setSelectedUser, selectedUser } =
    useChatStore();
  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getMyChatPartners();
  }, [getMyChatPartners]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return chats;
    return chats.filter((c) => String(c.fullName || "").toLowerCase().includes(q));
  }, [chats, query]);

  if (isUsersLoading) return <UsersLoadingSkeleton />;
  if (chats.length === 0) return <NoChatsFound />;

  return (
    <>
      {filtered.map((chat) => (
        <div
          key={chat._id}
          className={[
            "p-4 rounded-2xl cursor-pointer bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/15 hover-lift tap motion-safe:animate-fade-in",
            selectedUser?._id === chat._id ? "selected-row" : "",
          ].join(" ")}
          onClick={() => setSelectedUser(chat)}
        >
          <div className="flex items-center gap-3">
            <div
              className={`avatar ${onlineUsers.includes(chat._id) ? "online" : "offline"}`}
            >
              <div className="size-12 rounded-full ring-1 ring-white/10">
                <img
                  src={chat.profilePic || "/avatar.png"}
                  alt={chat.fullName}
                />
              </div>
            </div>
            <h4 className="text-slate-100 font-semibold truncate">
              {chat.fullName}
            </h4>
          </div>
        </div>
      ))}
    </>
  );
}
export default ChatsList;
