import React, { useState } from "react";
import { Note } from "../../services/Types/t";

interface Props {
  onAdd: (note: Note) => void;
}

const NoteForm: React.FC<Props> = ({ onAdd }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tag, setTag] = useState("");
  const [important, setImportant] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newNote: Note = {
      id: Date.now().toString(),
      title,
      content,
      tag,
      date: new Date().toISOString().split("T")[0],
      important,
    };
    onAdd(newNote);
    setTitle("");
    setContent("");
    setTag("");
    setImportant(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
      <input placeholder="Tiêu đề" value={title} onChange={e => setTitle(e.target.value)} required />
      <textarea placeholder="Nội dung" value={content} onChange={e => setContent(e.target.value)} required />
      <input placeholder="Tag / Danh mục" value={tag} onChange={e => setTag(e.target.value)} />
      <label>
        <input type="checkbox" checked={important} onChange={e => setImportant(e.target.checked)} />
        Quan trọng
      </label>
      <button type="submit">Thêm</button>
    </form>
  );
};

export default NoteForm;
