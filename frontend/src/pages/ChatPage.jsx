import { useMemo, useState } from "react";
import { SearchIcon } from "lucide-react";
import { useChatStore } from "../store/useChatStore";

import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import ProfileHeader from "../components/ProfileHeader";
import ActiveTabSwitch from "../components/ActiveTabSwitch";
import ChatsList from "../components/ChatsList";
import ContactList from "../components/ContactList";
import ChatContainer from "../components/ChatContainer";
import NoConversationPlaceholder from "../components/NoConversationPlaceholder";

function ChatPage() {
  const { activeTab, selectedUser } = useChatStore();
  const [query, setQuery] = useState("");

  const placeholder = useMemo(() => {
    if (activeTab === "contacts") return "Search contacts…";
    return "Search chats…";
  }, [activeTab]);

  return (
    <div className="relative w-full max-w-6xl h-[720px] motion-safe:animate-fade-up">
      <BorderAnimatedContainer>
        <div className="w-full flex flex-col md:flex-row">
          <div className="md:w-[360px] glass-panel flex flex-col">
            <ProfileHeader />
            <ActiveTabSwitch />

            <div className="px-4 pb-2">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-300/70" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={placeholder}
                  className="w-full glass-panel rounded-2xl py-2.5 pl-9 pr-3 text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/60"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {activeTab === "chats" ? <ChatsList query={query} /> : <ContactList query={query} />}
            </div>
          </div>

          <div className="flex-1 flex flex-col glass-panel">
            {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />}
          </div>
        </div>
      </BorderAnimatedContainer>
    </div>
  );
}
export default ChatPage;
