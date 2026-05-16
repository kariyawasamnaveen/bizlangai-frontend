import { useState } from "react";
import api from "../api";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, Lock, Shield, ArrowRight, Eye, Key } from "lucide-react";

function RegisterForm() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "viewer",
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRoleSelect = (selectedRole) => {
    setForm({ ...form, role: selectedRole });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    try {
      await api.post("/register", form);
      setMessage("Identity Registered. Initializing Node...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setMessage("Registration Failed. Data anomaly detected.");
      setIsLoading(false);
    }
  };

  const roles = [
    { id: "viewer", label: "Viewer", icon: Eye, color: "text-cyan-400" },
    { id: "manager", label: "Manager", icon: Shield, color: "text-blue-400" },
    { id: "admin", label: "Admin", icon: Key, color: "text-amber-400" },
  ];

  return (
    <div className="min-h-screen w-full flex bg-[#050505] text-white overflow-hidden relative">
      {/* Background Ambient Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[150px] rounded-full animate-ambient" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-500/10 blur-[150px] rounded-full animate-ambient delay-1000" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      {/* Left Panel: The Vision */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="hidden lg:block lg:w-1/2 relative border-r border-white/5 z-10"
      >
        <div className="absolute inset-0 bg-gradient-to-l from-[#050505] via-transparent to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent z-10" />
        <img 
          src="/assets/auth_hero.png" 
          alt="Neural Network Visualization" 
          className="w-full h-full object-cover opacity-80 mix-blend-screen scale-x-[-1]"
        />
        
        <div className="absolute top-12 left-12 z-20 flex items-center gap-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_#3b82f6]" />
            <span className="text-[10px] font-black tracking-[0.4em] text-blue-500 uppercase leading-none opacity-80">Registration Protocol</span>
        </div>
        
        <div className="absolute bottom-12 left-12 z-20">
            <h3 className="text-2xl font-black uppercase tracking-tighter text-white/90">BizLangAI</h3>
            <p className="text-[10px] font-black tracking-[0.4em] text-cyan-500 uppercase leading-none mt-2 opacity-80">Join the Core</p>
        </div>
      </motion.div>

      {/* Right Panel: The Gateway (Form) */}
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 xl:p-24 relative z-10"
      >
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-3">
            <h1 className="text-4xl font-black tracking-tighter uppercase leading-none">
              Register <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400">Identity</span>
            </h1>
            <p className="text-neutral-400 text-sm font-medium">Configure your access level and credentials.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {/* Username Input */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-500 group-focus-within:text-blue-400 transition-colors">
                  <User size={18} />
                </div>
                <input 
                  type="text" 
                  name="username"
                  required
                  placeholder="Designation Name (Username)" 
                  value={form.username} 
                  onChange={handleChange} 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder:text-neutral-600 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all font-medium text-sm"
                />
              </div>

              {/* Email Input */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-500 group-focus-within:text-blue-400 transition-colors">
                  <Mail size={18} />
                </div>
                <input 
                  type="email" 
                  name="email"
                  required
                  placeholder="Identity Email" 
                  value={form.email} 
                  onChange={handleChange} 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder:text-neutral-600 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all font-medium text-sm"
                />
              </div>

              {/* Password Input */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-500 group-focus-within:text-blue-400 transition-colors">
                  <Lock size={18} />
                </div>
                <input 
                  type="password" 
                  name="password"
                  required
                  placeholder="Security Access Key" 
                  value={form.password} 
                  onChange={handleChange} 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder:text-neutral-600 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all font-medium text-sm"
                />
              </div>
            </div>

            {/* Glowing Role Selection Cards */}
            <div className="space-y-3 pt-2">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 block">Access Clearance Level</span>
              <div className="grid grid-cols-3 gap-3">
                {roles.map((r) => {
                  const Icon = r.icon;
                  const isSelected = form.role === r.id;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => handleRoleSelect(r.id)}
                      className={`relative overflow-hidden rounded-xl py-3 flex flex-col items-center gap-2 border transition-all ${
                        isSelected 
                          ? "bg-blue-500/10 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.2)]" 
                          : "bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/10 text-neutral-500"
                      }`}
                    >
                      <Icon size={16} className={isSelected ? r.color : "text-neutral-500"} />
                      <span className={`text-[10px] font-black uppercase tracking-wider ${isSelected ? "text-white" : ""}`}>
                        {r.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {message && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className={`p-3.5 rounded-xl text-xs font-bold uppercase tracking-widest border ${message.includes("Registered") ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-red-500/10 border-red-500/30 text-red-400"}`}
              >
                {message}
              </motion.div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-2xl font-black uppercase tracking-widest text-sm transition-all shadow-[0_0_40px_rgba(59,130,246,0.3)] hover:shadow-[0_0_60px_rgba(59,130,246,0.5)] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group mt-2"
            >
              {isLoading ? "Validating..." : "Create Identity"} 
              {!isLoading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <p className="text-neutral-500 text-sm font-medium text-center pt-2">
            Already authenticated? <Link to="/login" className="text-blue-400 hover:text-blue-300 font-bold ml-1 transition-colors">Login Here</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default RegisterForm;
