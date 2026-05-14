import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  allContacts: [],
  chats: [],
  messages: [],
  activeTab: "chats",
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isTyping: false,
  typingTimeout: null,
  replyingTo: null,
  isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled")) === true,

  toggleSound: () => {
    localStorage.setItem("isSoundEnabled", !get().isSoundEnabled);
    set({ isSoundEnabled: !get().isSoundEnabled });
  },

  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedUser: (selectedUser) => set({ selectedUser }),
  setReplyingTo: (message) => set({ replyingTo: message }),

  getAllContacts: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/contacts");
      set({ allContacts: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },
  getMyChatPartners: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/chats");
      set({ chats: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessagesByUserId: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser } = get();
    const { authUser } = useAuthStore.getState();

    const tempId = `temp-${Date.now()}`;

    const optimisticMessage = {
      _id: tempId,
      senderId: authUser._id,
      receiverId: selectedUser._id,
      text: messageData.text,
      image: messageData.image,
      replyTo: get().replyingTo,
      createdAt: new Date().toISOString(),
      isOptimistic: true,
    };

    set((state) => ({ 
      messages: [...state.messages, optimisticMessage],
      replyingTo: null 
    }));

    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        {
          ...messageData,
          replyTo: optimisticMessage.replyTo?._id,
        },
      );

      set((state) => ({
        messages: state.messages.map((msg) =>
          msg._id === tempId ? res.data : msg,
        ),
      }));
    } catch (error) {
      set((state) => ({
        messages: state.messages.filter((msg) => msg._id !== tempId),
      }));
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  },

  reactToMessage: async (messageId, emoji) => {
    const { messages } = get();
    const { authUser } = useAuthStore.getState();

    // Optimistic update
    const updatedMessages = messages.map((msg) => {
      if (msg._id === messageId) {
        const reactions = [...(msg.reactions || [])];
        const existingIndex = reactions.findIndex(
          (r) => r.emoji === emoji && String(r.userId) === String(authUser._id),
        );

        if (existingIndex > -1) {
          reactions.splice(existingIndex, 1);
        } else {
          reactions.push({ emoji, userId: authUser._id });
        }
        return { ...msg, reactions };
      }
      return msg;
    });

    set({ messages: updatedMessages });

    try {
      await axiosInstance.post(`/messages/react/${messageId}`, { emoji });
    } catch {
      toast.error("Failed to react to message");
      // Rollback if needed (simplified here)
    }
  },

  sendTypingEvent: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;
    const socket = useAuthStore.getState().socket;
    if (socket) {
      socket.emit("typing", { receiverId: selectedUser._id });
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.off("newMessage");
    socket.off("typing");
    socket.off("messageReactionUpdate");

    socket.on("messageReactionUpdate", ({ messageId, reactions }) => {
      set((state) => ({
        messages: state.messages.map((msg) =>
          msg._id === messageId ? { ...msg, reactions } : msg,
        ),
      }));
    });

    socket.on("typing", ({ senderId }) => {
      const currentSelectedUser = get().selectedUser;
      if (currentSelectedUser && senderId === currentSelectedUser._id) {
        set({ isTyping: true });
        
        const { typingTimeout } = get();
        if (typingTimeout) clearTimeout(typingTimeout);
        
        const timeout = setTimeout(() => {
          set({ isTyping: false });
        }, 2000);
        
        set({ typingTimeout: timeout });
      }
    });

    socket.on("newMessage", (newMessage) => {
      const currentSelectedUser = get().selectedUser;

      if (!currentSelectedUser) return;

      const isMessageSentFromSelectedUser =
        newMessage.senderId === currentSelectedUser._id;

      if (!isMessageSentFromSelectedUser) return;

      const currentMessages = get().messages;
      set({ messages: [...currentMessages, newMessage] });

      if (get().isSoundEnabled) {
        const notificationSound = new Audio("/sounds/notification.mp3");
        notificationSound.currentTime = 0;
        notificationSound
          .play()
          .catch((e) => console.log("Audio play failed:", e));
      }
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (socket) {
      socket.off("newMessage");
      socket.off("typing");
      socket.off("messageReactionUpdate");
    }
  },
}));
