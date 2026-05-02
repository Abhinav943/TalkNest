import { useEffect, useMemo } from "react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import { useAuthStore } from "../store/useAuthStore";

function ContactList({ query = "" }) {
  const { getAllContacts, allContacts, setSelectedUser, isUsersLoading, selectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getAllContacts();
  }, [getAllContacts]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allContacts;
    return allContacts.filter((c) => String(c.fullName || "").toLowerCase().includes(q));
  }, [allContacts, query]);

  if (isUsersLoading) return <UsersLoadingSkeleton />;

  return (
    <>
      {filtered.map((contact) => (
        <div
          key={contact._id}
          className={[
            "p-4 rounded-2xl cursor-pointer bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/15 hover-lift tap motion-safe:animate-fade-in",
            selectedUser?._id === contact._id ? "selected-row" : "",
          ].join(" ")}
          onClick={() => setSelectedUser(contact)}
        >
          <div className="flex items-center gap-3">
            <div className={`avatar ${onlineUsers.includes(contact._id) ? "online" : "offline"}`}>
              <div className="size-12 rounded-full ring-1 ring-white/10">
                <img src={contact.profilePic || "/avatar.png"} />
              </div>
            </div>
            <h4 className="text-slate-100 font-semibold truncate">{contact.fullName}</h4>
          </div>
        </div>
      ))}
    </>
  );
}
export default ContactList;
