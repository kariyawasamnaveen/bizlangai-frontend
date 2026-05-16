// src/App.jsx
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import RegisterForm from "./components/RegisterForm";
import Login from "./pages/Login";
import ChatPage from "./pages/ChatPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/login");
  };

  useEffect(() => {
    setToken(localStorage.getItem("token")); // refresh state on reload
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#050505] text-white selection:bg-cyan-500/30 selection:text-cyan-200">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default function WrappedApp() {
  // To use `useNavigate` hook outside Routes
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
