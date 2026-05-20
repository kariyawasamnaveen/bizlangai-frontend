import { useState, useRef, useEffect } from "react";
import api, { API_URL } from "../api";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Activity, LogOut, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FileUpload from "../components/FileUpload";

function ChatPage() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  // Auto-scroll to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => scrollToBottom(), [messages, loading]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError("");

    // 🧑 Add user's question to messages
    const newMessages = [...messages, { sender: "user", text: prompt }];
    setMessages(newMessages);
    setPrompt("");

    try {
      const res = await api.post("/api/chat", { prompt, source: "openai" });

      if (res.data.response) {
        setMessages((prev) => [...prev, { sender: "bot", text: res.data.response }]);
      } else if (res.data.error) {
        setError(res.data.error);
      } else {
        setError("❌ Unknown response format from Neural Core.");
      }
    } catch (err) {
      console.error("Chat Error:", err);
      if (err.response && err.response.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        setError("❌ Connection to Neural Node lost.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex flex-col bg-[#050505] text-white overflow-hidden relative">
      {/* Background Ambient Effects & Image */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* The Advanced Background Image */}
        <img 
          src="/assets/chat_bg.png" 
          alt="Neural Background" 
          className="absolute inset-0 w-full h-full object-cover opacity-30 blur-[2px] mix-blend-screen"
        />
        <div className="absolute inset-0 bg-black/75 backdrop-blur-[1px]" />
        
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[150px] rounded-full animate-ambient" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[150px] rounded-full animate-ambient delay-1000" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      {/* Top Navigation Bar */}
      <header className="h-16 flex-shrink-0 border-b border-white/5 bg-black/50 backdrop-blur-xl relative z-20 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shadow-[0_0_10px_rgba(6,182,212,0.2)]">
            <Activity className="text-cyan-400" size={16} />
          </div>
          <div>
            <h1 className="text-sm font-black tracking-widest text-white/90 uppercase m-0 leading-tight">BizLangAI</h1>
            <p className="text-[9px] uppercase tracking-[0.3em] text-cyan-500 font-bold opacity-80">Neural Chat Node</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 hover:border-red-500/50 transition-all text-[10px] font-black uppercase tracking-widest"
        >
          <LogOut size={14} />
          Disconnect
        </button>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative z-10 w-full max-w-5xl mx-auto p-4 md:p-6 pt-4 md:pt-6 overflow-hidden">
        
        {/* Top Control Panel: File Upload */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-6 flex-shrink-0 w-full relative group"
        >
          {/* Advanced glowing aura behind the upload panel */}
          <div className="absolute -inset-1.5 bg-gradient-to-r from-cyan-500/20 via-blue-500/10 to-transparent rounded-3xl blur-xl group-hover:opacity-100 opacity-60 transition duration-700"></div>
          <div className="relative">
            <FileUpload />
          </div>
        </motion.div>

        {/* Chat History Container */}
        <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-6 pb-24 pr-4">
          
          {/* Welcome Message */}
          {messages.length === 0 && (
            <div className="flex flex-col items-center mt-auto mb-8 opacity-50 select-none">
              <Activity size={48} className="text-cyan-500/20 mb-4" />
              <p className="text-sm font-black tracking-widest uppercase text-neutral-500">Node Initialized</p>
              <p className="text-xs text-neutral-600 mt-2 font-medium">Awaiting input stream...</p>
            </div>
          )}

          {/* Messages Loop */}
          <AnimatePresence initial={false}>
            {messages.map((msg, index) => {
              const isUser = msg.sender === "user";
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-4 w-full ${isUser ? "flex-row-reverse" : "flex-row"}`}
                >
                  {/* Avatar */}
                  <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center border shadow-lg ${
                    isUser ? "bg-blue-500/20 border-blue-500/30" : "bg-white/5 border-white/10 backdrop-blur-md"
                  }`}>
                    {isUser ? <User size={16} className="text-blue-400" /> : <Bot size={16} className="text-cyan-400" />}
                  </div>

                  {/* Message Bubble */}
                  <div className={`max-w-[85%] md:max-w-[75%] rounded-2xl p-4 md:p-5 text-sm md:text-base leading-relaxed backdrop-blur-md ${
                    isUser 
                      ? "bg-blue-600/10 border border-blue-500/20 text-blue-50 rounded-tr-sm" 
                      : "bg-white/5 border border-white/10 text-neutral-200 rounded-tl-sm shadow-[0_4px_30px_rgba(0,0,0,0.1)]"
                  }`}>
                    
                    {/* Render logic for Text vs Charts */}
                    {msg.text.includes("/static/charts/") ? (
                      <div className="space-y-4">
                        <p className="text-cyan-100/90 font-medium">{msg.text.replace(/!\[Chart\]\(.*\)/, "").trim()}</p>
                        <div className="rounded-xl overflow-hidden border border-white/10 bg-black/50 p-2 shadow-2xl flex justify-center">
                          <img
                            src={`${API_URL}${msg.text.match(/\(\/static\/charts\/.*\.png\)/)?.[0].slice(1, -1)}`}
                            alt="AI Generated Chart"
                            className="w-full max-h-[350px] object-contain rounded-lg bg-white/5"
                          />
                        </div>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          
          {/* Thinking Indicator */}
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4 w-full flex-row">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center border bg-white/5 border-white/10 backdrop-blur-md">
                <Loader2 size={16} className="text-cyan-400 animate-spin" />
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm px-5 py-3 flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                 <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse delay-75" />
                 <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse delay-150" />
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Floating Input Area */}
      <div className="fixed bottom-0 w-full left-0 bg-gradient-to-t from-[#050505] via-[#050505] to-transparent pt-10 pb-2 px-4 z-30">
        <div className="max-w-4xl mx-auto relative">
          
          {/* Error Message Tooltip */}
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                className="absolute -top-12 left-0 right-0 mx-auto w-max px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-xs font-bold uppercase tracking-widest backdrop-blur-xl"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="relative group flex items-end bg-[#0f0f13] border border-white/10 rounded-3xl p-2 shadow-2xl focus-within:border-cyan-500/50 focus-within:shadow-[0_0_30px_rgba(6,182,212,0.15)] transition-all">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Query the Neural Node... (Press Enter to send)"
              className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-neutral-500 resize-none max-h-32 min-h-[44px] py-3 px-4 font-medium"
              rows={1}
            />
            <button 
              type="submit" 
              disabled={loading || !prompt.trim()}
              className="h-11 w-11 flex-shrink-0 flex items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] mb-0.5 mr-0.5"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} className="ml-1" />}
            </button>
          </form>
          <p className="text-center text-[10px] text-neutral-600 font-medium mt-1 mb-1">
            BizLangAI may produce inaccurate information about people, places, or facts.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
