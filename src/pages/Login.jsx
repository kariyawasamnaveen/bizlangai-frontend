import { useState } from "react";
import api from "../api";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Activity } from "lucide-react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMsg("");
    try {
      const res = await api.post("/login", {
        email,
        password
      });
      localStorage.setItem("token", res.data.token);
      setMsg("Authentication Successful. Initializing Neural Grid...");
      setTimeout(() => navigate("/chat"), 1500);
    } catch (err) {
      setMsg("Authentication Failed. Invalid Credentials.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#050505] text-white overflow-hidden relative">
      {/* Background Ambient Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-cyan-500/10 blur-[150px] rounded-full animate-ambient" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[150px] rounded-full animate-ambient delay-1000" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      {/* Left Panel: The Gateway (Form) */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24 relative z-10"
      >
        <div className="w-full max-w-md space-y-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                <Activity className="text-cyan-400" size={20} />
              </div>
              <span className="text-sm font-black tracking-[0.3em] text-cyan-400 uppercase">BizLangAI</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase leading-none">
              Access <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Neural Node</span>
            </h1>
            <p className="text-neutral-400 font-medium">Authenticate your identity to access the decentralized language intelligence core.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              {/* Email Input */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-500 group-focus-within:text-cyan-400 transition-colors">
                  <Mail size={18} />
                </div>
                <input 
                  type="email" 
                  required
                  placeholder="Identity Email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-neutral-600 focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all font-medium"
                />
              </div>

              {/* Password Input */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-500 group-focus-within:text-cyan-400 transition-colors">
                  <Lock size={18} />
                </div>
                <input 
                  type="password" 
                  required
                  placeholder="Security Access Key" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-neutral-600 focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all font-medium"
                />
              </div>
            </div>

            {msg && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl text-xs font-bold uppercase tracking-widest border ${msg.includes("Successful") ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-red-500/10 border-red-500/30 text-red-400"}`}
              >
                {msg}
              </motion.div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-2xl font-black uppercase tracking-widest text-sm transition-all shadow-[0_0_40px_rgba(6,182,212,0.3)] hover:shadow-[0_0_60px_rgba(6,182,212,0.5)] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isLoading ? "Authenticating..." : "Initialize Session"} 
              {!isLoading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <p className="text-neutral-500 text-sm font-medium text-center">
            Unregistered Identity? <Link to="/register" className="text-cyan-400 hover:text-cyan-300 font-bold ml-1 transition-colors">Initialize Node Here</Link>
          </p>
        </div>
      </motion.div>

      {/* Right Panel: The Vision */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="hidden lg:block lg:w-1/2 relative border-l border-white/5 z-10"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent z-10" />
        <img 
          src="/assets/auth_hero.png" 
          alt="Neural Network Visualization" 
          className="w-full h-full object-cover opacity-80 mix-blend-screen"
        />
        
        {/* Futuristic Overlay Elements */}
        <div className="absolute top-12 right-12 z-20 flex items-center gap-3">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_10px_#22d3ee]" />
            <span className="text-[10px] font-black tracking-[0.4em] text-cyan-400 uppercase leading-none opacity-80">System Online</span>
        </div>
        
        <div className="absolute bottom-12 right-12 z-20 text-right">
            <h3 className="text-2xl font-black uppercase tracking-tighter text-white/90">BizLangAI</h3>
            <p className="text-[10px] font-black tracking-[0.4em] text-cyan-500 uppercase leading-none mt-2 opacity-80">Language Intelligence Core</p>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;
