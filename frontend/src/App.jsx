import React, { useEffect } from "react";
import { Navigate, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import { useAuthStore } from "./store/useAuthStore.js";
import PageLoader from "./components/PageLoader.jsx";
import { Toaster } from "react-hot-toast";

function App() {
  const { authUser, isCheckingAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if(isCheckingAuth) return <PageLoader />;

  return (
    <div className="app-shell">
      <div className="app-bg" />
      <div className="app-grid" />

      <Routes>
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/" element={authUser ? <ChatPage /> : <Navigate to="/login" />} />
      </Routes>

      <Toaster
        toastOptions={{
          style: {
            background: "rgba(17, 27, 46, 0.75)",
            color: "rgba(226, 232, 240, 0.95)",
            border: "1px solid rgba(255,255,255,0.10)",
            backdropFilter: "blur(12px)",
          },
        }}
      />
    </div>
  );
}

export default App;
