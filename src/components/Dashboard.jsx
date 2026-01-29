import React, { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  // Fetch Notes
  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await api.get("/api/notes");
      setNotes(response.data);
    } catch (error) {
      if (error.response?.status === 403) navigate("/login");
    }
  };

  // Create Note
  const handleCreateNote = async (e) => {
    e.preventDefault();
    try {
      let imageKey = null;
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const uploadRes = await api.post("/api/notes/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        imageKey = uploadRes.data;
      }

      await api.post("/api/notes", { title, content, imageKey });

      setTitle("");
      setContent("");
      setFile(null);
      fetchNotes();
    } catch (error) {
      alert("Failed to create note");
    }
  };

  // DELETE Function
  const handleDeleteNote = async (noteId) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      await api.delete(`/api/notes/${noteId}`);
      // Remove from UI immediately without refreshing
      setNotes(notes.filter((note) => note.id !== noteId));
    } catch (error) {
      console.error("Delete failed", error);
      alert("Could not delete note.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    navigate("/login");
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "40px",
        }}
      >
        <h1 style={{ fontSize: "2rem", margin: 0 }}>
          CloudNote <span style={{ color: "var(--accent)" }}>App</span>
        </h1>
        <button onClick={handleLogout} className="btn-danger">
          Logout
        </button>
      </div>

      {/* Create Form */}
      <div className="card" style={{ marginBottom: "40px" }}>
        <h2 style={{ marginTop: 0, marginBottom: "20px" }}>Create New Note</h2>
        <form
          onSubmit={handleCreateNote}
          style={{ display: "flex", flexDirection: "column", gap: "15px" }}
        >
          <input
            type="text"
            placeholder="Title (e.g., AWS Project Ideas)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Write your thoughts here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="3"
            required
          />
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              style={{ width: "auto" }}
            />
            <button
              type="submit"
              className="btn-primary"
              style={{ marginLeft: "auto" }}
            >
              + Add Note
            </button>
          </div>
        </form>
      </div>

      {/* Notes Grid */}
      <div className="notes-grid">
        {notes.map((note) => (
          <div key={note.id} className="card" style={{ position: "relative" }}>
            {/* Note Image */}
            {note.imageKey && (
              <div
                style={{
                  width: "100%",
                  height: "180px",
                  overflow: "hidden",
                  borderRadius: "8px",
                  marginBottom: "15px",
                }}
              >
                <img
                  src={`https://djhs5va0359dq.cloudfront.net/${note.imageKey}`}
                  alt="Note Attachment"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            )}

            <h3
              style={{
                marginTop: 0,
                marginBottom: "10px",
                fontSize: "1.25rem",
              }}
            >
              {note.title}
            </h3>
            <p
              style={{
                color: "var(--text-secondary)",
                lineHeight: "1.6",
                marginBottom: "20px",
              }}
            >
              {note.content}
            </p>

            {/* Footer with Delete Button */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                borderTop: "1px solid var(--border)",
                paddingTop: "15px",
              }}
            >
              <button
                onClick={() => handleDeleteNote(note.id)}
                className="btn-danger"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {notes.length === 0 && (
        <div
          style={{
            textAlign: "center",
            color: "var(--text-secondary)",
            marginTop: "50px",
          }}
        >
          <p>No notes found. Start by creating one above! 🚀</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
