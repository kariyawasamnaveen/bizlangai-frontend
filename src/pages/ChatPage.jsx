import { useState } from "react";
import axios from "axios";
import FileUpload from "../components/FileUpload";

function ChatPage() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // 🧑 Add user's question to messages
    const newMessages = [...messages, { sender: "user", text: prompt }];
    setMessages(newMessages);
    setPrompt("");

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:8000/api/chat",
        { prompt, source: "flowise" }, // or "openai"
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.response) {
        setMessages((prev) => [...prev, { sender: "bot", text: res.data.response }]);
      } else if (res.data.error) {
        setError(res.data.error);
      } else {
        setError("❌ Unknown response format from server.");
      }
    } catch (err) {
      console.error("Chat Error:", err);
      setError("❌ Error getting response from chatbot.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>💬 BizLangAI Chat</h2>

      {/* ✅ File upload section */}
      <div
        style={{
          marginBottom: "30px",
          border: "1px solid #ccc",
          padding: "20px",
          borderRadius: "10px",
        }}
      >
        <FileUpload />
      </div>

      {/* ✅ Chat input */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Ask something like: Total sales in Q4 2023?"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          style={{ width: "400px", marginRight: "10px", padding: "10px" }}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Thinking..." : "Send"}
        </button>
      </form>

      {/* ✅ Error display */}
      {error && (
        <div style={{ color: "red", marginTop: "10px" }}>
          <strong>{error}</strong>
        </div>
      )}

      {/* ✅ Chat history */}
      <div
        style={{
          marginTop: "20px",
          background: "#f8f8f8",
          padding: "15px",
          borderRadius: "5px",
          maxHeight: "1000px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              background: msg.sender === "user" ? "#d0f0fd" : "#e6ffe6",
              padding: "10px",
              borderRadius: "8px",
              maxWidth: "90%",
              alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
            }}
          >
            {msg.text.includes("/static/charts/") ? (
              <>
                <p>{msg.text.replace(/!\[Chart\]\(.*\)/, "").trim()}</p>
                <img
                  src={`http://localhost:8000${msg.text.match(/\(\/static\/charts\/.*\.png\)/)?.[0].slice(1, -1)}`}
                  alt="Generated Chart"
                  style={{ maxWidth: "100%", borderRadius: "5px", marginTop: "8px" }}
                />
              </>
            ) : (
              <p>{msg.text}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChatPage;
