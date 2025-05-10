import { useState } from "react";
import axios from "axios";

function FileUpload() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [columns, setColumns] = useState([]);

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);

    try {
        const res = await axios.post("http://localhost:8000/api/upload", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          
      // ✅ Set message if uploaded correctly
      if (res.data.message) {
        setMessage("✅ File Uploaded Successfully");
        setColumns(res.data.columns);
      } else {
        setMessage("❌ Upload failed");
      }
    } catch (err) {
      setMessage("❌ Upload failed");
    }
  };

  return (
    <div>
      <h3>📂 Upload CSV/Excel</h3>
      <form onSubmit={handleUpload}>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          accept=".csv, .xlsx"
        />
        <button type="submit">Upload</button>
      </form>

      {/* ✅ Show upload message */}
      {message && <p style={{ color: message.startsWith("✅") ? "green" : "red" }}>{message}</p>}

      {/* ✅ Show column list if available */}
      {Array.isArray(columns) && columns.length > 0 && (
        <div>
          <h4>📊 Columns:</h4>
          <ul>
            {columns.map((col, idx) => (
              <li key={idx}>{col}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default FileUpload;
