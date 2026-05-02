import { useChatStore } from "../store/useChatStore";

function ActiveTabSwitch() {
  const { activeTab, setActiveTab } = useChatStore();

  return (
    <div className="p-3">
      <div className="tabs tabs-boxed bg-white/5 border border-white/10 rounded-2xl p-1">
      <button
        onClick={() => setActiveTab("chats")}
        className={`tab ${
          activeTab === "chats"
            ? "bg-gradient-to-r from-primary/25 to-secondary/20 text-slate-100"
            : "text-slate-300/70 hover:text-slate-200"
        }`}
      >
        Chats
      </button>

      <button
        onClick={() => setActiveTab("contacts")}
        className={`tab ${
          activeTab === "contacts"
            ? "bg-gradient-to-r from-primary/25 to-secondary/20 text-slate-100"
            : "text-slate-300/70 hover:text-slate-200"
        }`}
      >
        Contacts
      </button>
      </div>
    </div>
  );
}
export default ActiveTabSwitch;
