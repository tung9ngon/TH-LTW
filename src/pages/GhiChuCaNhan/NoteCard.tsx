import React from "react";
import { Note } from "../../services/Types/t";
import { Card, Button } from "antd";

interface Props {
  note: Note;
  onDelete: (id: string) => void;
}

const NoteCard: React.FC<Props> = ({ note, onDelete }) => {
  return (
    <Card
      title={note.title}
      extra={<Button danger={true} onClick={() => onDelete(note.id)}>Xoá</Button>}
      style={{
        background: note.important ? "#fffae6" : "#fff",
        marginBottom: 10,
      }}
    >
      <p>{note.content}</p>
      <small>{note.date} | #{note.tag}</small>
    </Card>
  );
};

export default NoteCard;