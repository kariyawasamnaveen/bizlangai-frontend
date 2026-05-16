import { useState, useRef } from "react";
import api from "../api";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, FileSpreadsheet, CheckCircle2, AlertCircle, Database, ChevronRight, X } from "lucide-react";

function FileUpload() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [columns, setColumns] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    
    setIsUploading(true);
    setMessage("");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await api.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
          
      if (res.data.message) {
        setMessage("✅ Knowledge Base Updated Successfully");
        setColumns(res.data.columns);
      } else {
        setMessage("❌ Upload failed. Data stream corrupted.");
      }
    } catch (err) {
      setMessage("❌ Upload failed. Connection error.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (![
        "text/csv",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain"
      ].includes(selectedFile.type)) {
        alert("❌ Please upload a CSV, Excel, PDF, Word, or Text file.");
        return;
      }
      setFile(selectedFile);
      setMessage(""); // Reset message on new file selection
    }
  };

  const isSuccess = message.startsWith("✅");

  return (
    <div className="w-full bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-xl relative overflow-hidden group">
      {/* Subtle Glow Effect */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-transparent opacity-50" />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        
        {/* Left Side: Header & Input */}
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
              <Database className="text-blue-400" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold tracking-tight text-white/90 m-0 leading-tight">Data Source Connector</h3>
              <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Inject CSV / Excel Context</p>
            </div>
          </div>

          <form onSubmit={handleUpload} className="flex items-center gap-3 w-full max-w-lg">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".csv, .xlsx, .pdf, .docx, .txt"
              className="hidden"
            />
            
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 h-12 px-4 rounded-xl border border-dashed border-white/20 bg-white/5 hover:bg-white/10 transition-all flex items-center justify-between group/upload cursor-pointer"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <FileSpreadsheet size={18} className={file ? "text-cyan-400" : "text-neutral-500 group-hover/upload:text-cyan-400 transition-colors"} />
                <div className="flex flex-col items-start">
                  <span className={`text-sm font-medium truncate ${file ? "text-white" : "text-neutral-500"}`}>
                    {file ? file.name : "Select Dataset..."}
                  </span>
                  {!file && <p className="text-cyan-100/60 text-[10px] font-medium uppercase tracking-wider">CSV, Excel, PDF, Word, or TXT</p>}
                </div>
              </div>
              {file && (
                <div 
                  className="text-neutral-500 hover:text-red-400 p-1 rounded-md z-10" 
                  onClick={(e) => { e.stopPropagation(); setFile(null); setColumns([]); setMessage(""); }}
                >
                  <X size={16} />
                </div>
              )}
            </button>

            <button 
              type="submit" 
              disabled={!file || isUploading}
              className="h-12 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-sm tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(59,130,246,0.2)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isUploading ? "Syncing..." : "Upload"}
              {!isUploading && <UploadCloud size={16} />}
            </button>
          </form>

          {/* Status Message */}
          <AnimatePresence>
            {message && (
              <motion.initial initial={{ opacity: 0, h: 0 }} animate={{ opacity: 1, h: "auto" }} exit={{ opacity: 0, h: 0 }}>
                <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider mt-3 ${isSuccess ? 'text-emerald-400' : 'text-red-400'}`}>
                  {isSuccess ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                  {message.replace(/^[✅❌]\s*/, "")}
                </div>
              </motion.initial>
            )}
          </AnimatePresence>
        </div>

        {/* Right Side: Detected Columns */}
        {Array.isArray(columns) && columns.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 md:max-w-xs p-4 rounded-xl bg-black/40 border border-white/5 h-full"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <h4 className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold m-0">Detected Neural Nodes</h4>
            </div>
            <div className="flex flex-wrap gap-2 max-h-[80px] overflow-y-auto pr-2 custom-scrollbar">
              {columns.map((col, idx) => (
                <span key={idx} className="px-2.5 py-1 text-[10px] font-bold tracking-wider rounded-md bg-white/5 border border-white/10 text-cyan-200">
                  {col}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default FileUpload;
