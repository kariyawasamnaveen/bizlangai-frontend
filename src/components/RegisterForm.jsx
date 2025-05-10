import { useState } from "react";
import axios from "axios";
import "../styles/form.css";



function RegisterForm() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "viewer",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/register", form);
      setMessage("✅ Registered Successfully!");
    } catch (err) {
      setMessage("❌ Registration Failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
      <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} required />

      <select name="role" onChange={handleChange}>
        <option value="viewer">Viewer</option>
        <option value="admin">Admin</option>
        <option value="manager">Manager</option>
      </select>

      <button type="submit">Register</button>

      {message && <p>{message}</p>}
    </form>
  );
}

export default RegisterForm;
