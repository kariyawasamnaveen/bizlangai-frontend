import React, { useState } from 'react';

const ChatUI = () => {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!prompt) return;

    const newMsg = { type: 'user', text: prompt };
    setMessages((prev) => [...prev, newMsg]);
    setPrompt('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, source: 'flowise' }),
      });
      const data = await res.json();

      const botMsg = { type: 'bot', text: data.response };
      setMessages((prev) => [...prev, botMsg]);
    } catch (e) {
      setMessages((prev) => [...prev, { type: 'bot', text: '❌ Error contacting chatbot.' }]);
    }

    setLoading(false);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 flex flex-col items-center justify-start pt-12">
      <h1 className="text-4xl font-bold text-blue-700 mb-6">💬 BizLangAI Chat</h1>

      <div className="w-full max-w-2xl bg-white shadow-xl rounded-lg p-6 space-y-4">
        <div className="h-[400px] overflow-y-auto space-y-3 pr-2">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`p-3 rounded-lg w-fit max-w-[80%] ${
                msg.type === 'user' ? 'bg-blue-100 self-end ml-auto' : 'bg-green-100'
              }`}
            >
              {msg.text}
            </div>
          ))}
          {loading && (
            <div className="bg-yellow-100 px-3 py-2 rounded w-fit animate-pulse">Thinking...</div>
          )}
        </div>

        <textarea
          className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
          rows="3"
          placeholder="Type your question in Sinhala, Tamil or English..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKey}
        />

        <div className="text-right">
          <button
            onClick={sendMessage}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatUI;
