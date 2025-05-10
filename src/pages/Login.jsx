import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8000/login", {
        email,
        password
      });
      localStorage.setItem("token", res.data.token);
      setMsg("✅ Logged in!");
      setTimeout(() => navigate("/chat"), 1000);
    } catch (err) {
      setMsg("❌ Invalid credentials");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>🔐 Login</h2>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Login</button>
      <p>{msg}</p>
    </form>
  );
}

export default Login;
