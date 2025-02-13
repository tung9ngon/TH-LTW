import { useState } from 'react';
import { Card, Modal, Input, Form, Row, Button } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const initialTasks = [
  { title: 'React', description: 'Learn all basic concepts of React'},
  { title: 'Python', description: 'Debugging in python project'},
  { title: 'Maths', description: 'Learn and practice some concepts of maths'},
  { title: 'Science', description: 'Science study'},
  { title: 'JS', description: 'Learn basic concepts of JavaScript'},
  { title: 'Dinner', description: 'Do dinner'},
  { title: 'Project', description: 'Make a small project of React'},
  { title: 'Cricket', description: 'Play cricket with friends'}
];

const TodoList = () => {
  const [taskList, setTaskList] = useState(initialTasks);
  const [editingIndex, setEditingIndex] = useState(false);
  const [visible, setVisible] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [form] = Form.useForm();

  // Tạo Task mới
  const handleCreateTask = () => {
    setEditingIndex(false);
    setEditIndex(null);
    form.resetFields();
    setVisible(true);
  };

  // Sửa Task
  const handleEditTask = (index) => {
    setEditingIndex(true);
    setEditIndex(index);
    form.setFieldsValue(taskList[index]);
    setVisible(true);
  };

  // Submit Task
  const handleSubmit = (values) => {
    if (editingIndex && editIndex !== null) {
      setTaskList((prevTasks) => {
        const updatedTasks = [...prevTasks];
        updatedTasks[editIndex] = values;
        return updatedTasks;
      });
    } else {
      setTaskList((prevTasks) => [...prevTasks, values]);
    }
    setVisible(false);
  };

  // Xóa Task
  const handleDelete = (index) => {
    setTaskList(taskList.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="bg-blue-100 text-center py-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold">Todo List</h1>
        <button onClick={handleCreateTask} className="bg-purple-500 text-white px-6 py-2 rounded-full mt-4 shadow-md hover:bg-purple-600">
          Create Task
        </button>
      </div>
      
      <h2 className="text-xl font-semibold mt-6">All Tasks</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {taskList.map((task, index) => (
          <Card key={index} className="shadow-lg p-4 border-t-4">
            <div className="flex justify-between items-center mb-2">
              <span className="bg-gray-200 px-3 py-1 rounded-full text-sm font-semibold">{task.title}</span>
            </div>
            <p className="text-gray-600 mb-4">{task.description}</p>
            <div className="flex justify-end gap-2">
              <EditOutlined style={{ color: 'blue', cursor: 'pointer', fontSize: '18px' }} onClick={() => handleEditTask(index)} />
              <DeleteOutlined style={{ color: 'red', cursor: 'pointer', fontSize: '18px' }} onClick={() => handleDelete(index)} />
            </div>
          </Card>
        ))}
      </div>

      <Modal
        forceRender={true}
        footer={null}
        title={editingIndex ? 'Chỉnh sửa Task' : 'Tạo Task'}
        visible={visible}
        onCancel={() => setVisible(false)}
      >
        <Form form={form} onFinish={handleSubmit}>
          <Form.Item label="Task" name="title" rules={[{ required: true, message: 'Vui lòng nhập tên task!' }]}> 
            <Input />
          </Form.Item>
          <Form.Item label="Description" name="description" rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}>  
            <Input />
          </Form.Item>
          <div className='form-footer'>
            <Button htmlType='submit' type='primary'>{editingIndex ? 'Chỉnh sửa' : 'Thêm mới'}</Button>
            <Button onClick={() => setVisible(false)}>Hủy</Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default TodoList;
