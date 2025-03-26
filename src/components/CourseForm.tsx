import React from 'react';
import { Form, Input, Select, Button } from 'antd';
import { Course } from '../services/courseService';

const { Option } = Select;

interface Props {
  onSubmit: (values: Course) => void;
  initialValues?: Course;
}

const CourseForm: React.FC<Props> = ({ onSubmit, initialValues }) => {
  const [form] = Form.useForm();

  return (
    <Form
      form={form}
      onFinish={onSubmit}
      initialValues={initialValues}
      layout="vertical"
    >
      <Form.Item
        name="name"
        label="Tên khóa học"
        rules={[
          { required: true, message: 'Vui lòng nhập tên khóa học!' },
          { max: 100, message: 'Tên khóa học tối đa 100 ký tự!' }
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="instructor"
        label="Giảng viên"
        rules={[{ required: true, message: 'Vui lòng chọn giảng viên!' }]}
      >
        <Select>
          <Option value="Giảng viên A">Giảng viên A</Option>
          <Option value="Giảng viên B">Giảng viên B</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="description"
        label="Mô tả khóa học"
      >
        <Input.TextArea rows={4} />
      </Form.Item>

      <Form.Item
        name="status"
        label="Trạng thái"
        rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
      >
        <Select>
          <Option value="Đang mở">Đang mở</Option>
          <Option value="Đã kết thúc">Đã kết thúc</Option>
          <Option value="Tạm dừng">Tạm dừng</Option>
        </Select>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Lưu
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CourseForm;