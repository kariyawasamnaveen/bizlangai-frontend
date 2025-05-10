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
    <div style={{ padding: "20px" }}>
      <h1>🤖 BizLangAI</h1>

      <nav style={{ marginBottom: "20px" }}>
        <Link to="/register">Register</Link> |{" "}
        {token ? (
          <>
            <Link to="/chat">Chat</Link> |{" "}
            <button onClick={handleLogout} style={{ color: "red", background: "none", border: "none", cursor: "pointer" }}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </nav>

      <Routes>
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
