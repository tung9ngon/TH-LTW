import React, { useState, useEffect } from "react";
import { Note } from "../../services/Types/t";
import NoteForm from "./NoteForm";
import NoteCard from "./NoteCard";
import { saveNotes, loadNotes } from "../../utils/ut";

const App: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [search, setSearch] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [gridView, setGridView] = useState(false);

  useEffect(() => {
    setNotes(loadNotes());
  }, []);

  useEffect(() => {
    saveNotes(notes);
  }, [notes]);

  const addNote = (note: Note) => {
    setNotes(prev => [note, ...prev]);
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  const filteredNotes = notes
    .filter(n => (search ? n.title.includes(search) || n.content.includes(search) : true))
    .filter(n => (tagFilter ? n.tag === tagFilter : true))
    .filter(n => (dateFilter ? n.date === dateFilter : true))
    .sort((a, b) => Number(b.important) - Number(a.important));

  const uniqueTags = Array.from(new Set(notes.map(n => n.tag).filter(Boolean)));

  return (
    <div style={{ maxWidth: 800, margin: "auto", padding: 20 }}>
      <h1>📒 Ghi chú Cá nhân</h1>
      <NoteForm onAdd={addNote} />

      <div style={{ marginBottom: 10 }}>
        <input placeholder="Tìm kiếm..." value={search} onChange={e => setSearch(e.target.value)} />
        <select value={tagFilter} onChange={e => setTagFilter(e.target.value)}>
          <option value="">Tất cả tag</option>
          {uniqueTags.map(tag => <option key={tag} value={tag}>{tag}</option>)}
        </select>
        <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} />
        <button onClick={() => setGridView(!gridView)}>{gridView ? "Dạng danh sách" : "Dạng lưới"}</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: gridView ? "repeat(auto-fill, minmax(200px, 1fr))" : "1fr", gap: 10 }}>
        {filteredNotes.map(note => (
          <NoteCard key={note.id} note={note} onDelete={deleteNote} />
        ))}
      </div>
    </div>
  );
};

export default App;
