import React, { useState } from 'react';

const ChatForm = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!prompt) return;
    setLoading(true);

    try {
      const res = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, source: 'flowise' }) // 👈 source is flowise
      });

      const data = await res.json();
      setResponse(data.response);
    } catch (err) {
      console.error(err);
      setResponse('Error contacting chatbot.');
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto', paddingTop: '2rem' }}>
      <h2>🧠 BizLangAI Chat</h2>
      <textarea
        rows={4}
        style={{ width: '100%' }}
        placeholder="Type your question (e.g., 2023 Q4 සෙල්ස් කොච්චරද?)"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <br />
      <button onClick={sendMessage} disabled={loading}>
        {loading ? 'Thinking...' : 'Send'}
      </button>

      {response && (
        <div style={{ marginTop: '1rem', padding: '1rem', background: '#f3f3f3', borderRadius: '8px' }}>
          <strong>Response:</strong>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
};

export default ChatForm;
