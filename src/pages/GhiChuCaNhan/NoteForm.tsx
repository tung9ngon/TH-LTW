import React from "react";
import { Note } from "../../services/Types/t";
import { Input, Button, Checkbox, Form } from "antd";

interface Props {
  onAdd: (note: Note) => void;
}

const NoteForm: React.FC<Props> = ({ onAdd }) => {
  const [form] = Form.useForm();

  const handleFinish = (values: any) => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: values.title,
      content: values.content,
      tag: values.tag || "",
      date: new Date().toISOString().split("T")[0],
      important: values.important || false,
    };
    onAdd(newNote);
    form.resetFields();
  };

  return (
    <Form form={form} onFinish={handleFinish} layout="vertical" style={{ marginBottom: "1rem" }}>
      <Form.Item
        label="Tiêu đề"
        name="title"
        rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}
      >
        <Input placeholder="Tiêu đề" />
      </Form.Item>

      <Form.Item
        label="Nội dung"
        name="content"
        rules={[{ required: true, message: "Vui lòng nhập nội dung!" }]}
      >
        <Input.TextArea placeholder="Nội dung" />
      </Form.Item>

      <Form.Item label="Tag / Danh mục" name="tag">
        <Input placeholder="Tag / Danh mục" />
      </Form.Item>

      <Form.Item name="important" valuePropName="checked">
        <Checkbox>Quan trọng</Checkbox>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Thêm
        </Button>
      </Form.Item>
    </Form>
  );
};

export default NoteForm;