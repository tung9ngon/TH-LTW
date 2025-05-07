import React, { useState, useEffect } from "react";
import { Note } from "../../services/Types/t";
import NoteForm from "./NoteForm";
import NoteCard from "./NoteCard";
import { saveNotes, loadNotes } from "../../utils/ut";
import { Input, Select, Button, Row, Col, Layout } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const { Option } = Select;
const { Header, Content } = Layout;

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
    <Layout style={{ maxWidth: 900, margin: "auto", padding: "20px" }}>
      <Header style={{ textAlign: "center", color: "#fff", fontSize: "2rem" }}> Ghi chú Cá nhân</Header>
      <Content>
        <NoteForm onAdd={addNote} />

        <Row gutter={16} style={{ marginBottom: 10 }}>
          <Col span={8}>
            <Input
              placeholder="Tìm kiếm..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              prefix={<SearchOutlined />}
            />
          </Col>
          <Col span={8}>
            <Select
              value={tagFilter}
              onChange={value => setTagFilter(value)}
              style={{ width: "100%" }}
              placeholder="Chọn tag"
            >
              <Option value="">Tất cả tag</Option>
              {uniqueTags.map(tag => (
                <Option key={tag} value={tag}>{tag}</Option>
              ))}
            </Select>
          </Col>
          <Col span={8}>
            <Input
              type="date"
              value={dateFilter}
              onChange={e => setDateFilter(e.target.value)}
              style={{ width: "100%" }}
            />
          </Col>
        </Row>

        <Button
          type="primary"
          onClick={() => setGridView(!gridView)}
          style={{ marginBottom: 10 }}
        >
          {gridView ? "Dạng danh sách" : "Dạng lưới"}
        </Button>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: gridView ? "repeat(auto-fill, minmax(200px, 1fr))" : "1fr",
            gap: 10,
          }}
        >
          {filteredNotes.map(note => (
            <NoteCard key={note.id} note={note} onDelete={deleteNote} />
          ))}
        </div>
      </Content>
    </Layout>
  );
};

export default App;