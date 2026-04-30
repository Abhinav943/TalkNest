import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggedIn: false,
  socket: null,
  onlineUsers: [],

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/protected");
      set({ authUser: res.data });

      get().connectSocket();
    } catch (error) {
      console.error("Error checking auth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });

      toast.success("Signup successful!");

      get().connectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error signing up");
      console.error("Error signing up:", error);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggedIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });

      toast.success("Login successful!");

      get().connectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error signing up");
      console.error("Error login:", error);
    } finally {
      set({ isLoggedIn: false });
    }
  },

  logout: async (data) => {
    try {
      await axiosInstance.post("/auth/logout", data);
      set({ authUser: null });

      get().disconnectSocket();

      toast.success("Logout successful!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error signing up");
      console.error("Error logout:", error);
    }
  },

  updateProfile: async (data) => {
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("Error in update profile:", error);
      toast.error(error.response.data.message);
    }
  },

  connectSocket: () => {
    const { authUser } = get();

    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      withCredentials: true,
    });
    socket.connect();

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
    });

    set({ socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  disconnectSocket: () => {
    if (get().socket?.disconnect) {
      get().socket.disconnect();
    }
  },
}));
