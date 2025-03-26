import React, { useState } from 'react';
import { Table, Input, Select, Button, Modal, message } from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { useCourseModel } from '../../models/course';
import CourseForm from '../../components/CourseForm';
import { Course } from '../../services/courseService';
import './courseManagement.css';

const { Search } = Input;
const { Option } = Select;
const { confirm } = Modal;

const CourseManagement: React.FC = () => {
  const { courses, addCourse, updateCourse, deleteCourse } = useCourseModel();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterInstructor, setFilterInstructor] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterInstructor === 'all' || course.instructor === filterInstructor) &&
    (filterStatus === 'all' || course.status === filterStatus)
  );

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleAdd = () => {
    setSelectedCourse(null);
    setIsModalOpen(true);
  };

  const handleEdit = (course: Course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    const course = courses.find(c => c.id === id);
    if (course && course.students > 0) {
      message.error('Không thể xóa khóa học đã có học viên!');
      return;
    }

    confirm({
      title: 'Xác nhận xóa khóa học',
      icon: <ExclamationCircleOutlined />,
      content: 'Bạn có chắc chắn muốn xóa khóa học này?',
      onOk() {
        deleteCourse(id);
        message.success('Xóa khóa học thành công!');
      },
    });
  };

  const handleSubmit = (values: Course) => {
    if (selectedCourse) {
      // Kiểm tra trùng tên khi chỉnh sửa
      const existingCourse = courses.find(
        c => c.name === values.name && c.id !== selectedCourse.id
      );
      if (existingCourse) {
        message.error('Tên khóa học đã tồn tại!');
        return;
      }
      updateCourse({ ...selectedCourse, ...values });
      message.success('Cập nhật khóa học thành công!');
    } else {
      // Kiểm tra trùng tên khi thêm mới
      if (courses.some(c => c.name === values.name)) {
        message.error('Tên khóa học đã tồn tại!');
        return;
      }
      const newCourse = { ...values, id: Date.now(), students: 0 };
      addCourse(newCourse);
      message.success('Thêm khóa học thành công!');
    }
    setIsModalOpen(false);
  };

  return (
    <div>
      <h2>Quản lý khóa học</h2>
      <div className="actions">
        <Search
          placeholder="Tìm kiếm khóa học"
          onSearch={handleSearch}
          style={{ width: 200, marginRight: 16 }}
        />
        <Select
          defaultValue="all"
          onChange={setFilterInstructor}
          style={{ width: 150, marginRight: 16 }}
        >
          <Option value="all">Tất cả giảng viên</Option>
          <Option value="Giảng viên A">Giảng viên A</Option>
          <Option value="Giảng viên B">Giảng viên B</Option>
        </Select>
        <Select
          defaultValue="all"
          onChange={setFilterStatus}
          style={{ width: 150, marginRight: 16 }}
        >
          <Option value="all">Tất cả trạng thái</Option>
          <Option value="Đang mở">Đang mở</Option>
          <Option value="Đã kết thúc">Đã kết thúc</Option>
          <Option value="Tạm dừng">Tạm dừng</Option>
        </Select>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          Thêm mới
        </Button>
      </div>

      <Table
        dataSource={filteredCourses}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      >
        <Table.Column<Course>
    title="ID"
    dataIndex="id"
    sorter={(a, b) => a.id - b.id} // Không còn lỗi
  />
  <Table.Column<Course>
    title="Tên khóa học"
    dataIndex="name"
  />
  <Table.Column<Course>
    title="Giảng viên"
    dataIndex="instructor"
  />
  <Table.Column<Course>
    title="Số lượng học viên"
    dataIndex="students"
    sorter={(a, b) => a.students - b.students} // Không còn lỗi
  />
        <Table.Column
          title="Trạng thái"
          dataIndex="status"
        />
        <Table.Column
          title="Hành động"
          render={(text, record: Course) => (
            <>
              <Button
                icon={<EditOutlined />}
                onClick={() => handleEdit(record)}
                style={{ marginRight: 8 }}
              />
              <Button
                icon={<DeleteOutlined />}
                danger
                onClick={() => handleDelete(record.id)}
              />
            </>
          )}
        />
      </Table>

      <Modal
  title={selectedCourse ? 'Chỉnh sửa khóa học' : 'Thêm khóa học'}
  visible={isModalOpen} // Đổi 'open' thành 'visible'
  onCancel={() => setIsModalOpen(false)}
  footer={null}
>

        <CourseForm
          onSubmit={handleSubmit}
          initialValues={selectedCourse || undefined}
        />
      </Modal>
    </div>
  );
};

export default CourseManagement;