import React from "react";
import { Note } from "../../services/Types/t";

interface Props {
  note: Note;
  onDelete: (id: string) => void;
}

const NoteCard: React.FC<Props> = ({ note, onDelete }) => {
  return (
    <div style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10, background: note.important ? "#fffae6" : "#fff" }}>
      <h3>{note.title}</h3>
      <p>{note.content}</p>
      <small>{note.date} | #{note.tag}</small><br />
      <button onClick={() => onDelete(note.id)}>Xoá</button>
    </div>
  );
};

export default NoteCard;
