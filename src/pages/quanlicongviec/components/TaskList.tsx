import React, { useState, useEffect } from 'react';
import { Table, Button, Tag, Modal, Form, Input, Select, Space, message } from 'antd';
import { Task } from '../../../services/Types/in';
import { loadTasks, saveTasks } from '../../../utils/storage';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const { Option } = Select;

export const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [form] = Form.useForm();
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | undefined>(undefined);
  const [filterAssignee, setFilterAssignee] = useState<string | undefined>(undefined);

  // Load tasks when component mounts and set initial filtered tasks
  useEffect(() => {
    const storedTasks = loadTasks();
    setTasks(storedTasks);
    applyFilters(storedTasks, searchKeyword, filterStatus, filterAssignee);
  }, []);

  // Apply filters whenever dependencies change
  useEffect(() => {
    applyFilters(tasks, searchKeyword, filterStatus, filterAssignee);
  }, [tasks, searchKeyword, filterStatus, filterAssignee]);

  const openModal = (task?: Task) => {
    setEditingTask(task || null);
    form.setFieldsValue(task || {
      name: '',
      assignee: '',
      priority: 'Trung bình',
      status: 'Chưa làm',
    });
    setIsModalOpen(true);
  };

  const handleOk = () => {
    form.validateFields()
      .then((values) => {
        const newTask: Task = editingTask
          ? { ...editingTask, ...values }
          : { ...values, id: Date.now().toString() };

        const updatedTasks = editingTask
          ? tasks.map((t) => (t.id === editingTask.id ? newTask : t))
          : [...tasks, newTask];

        setTasks(updatedTasks);
        saveTasks(updatedTasks);
        message.success(editingTask ? 'Cập nhật công việc thành công' : 'Thêm công việc thành công');
        setIsModalOpen(false);
        setEditingTask(null);
        form.resetFields();
      })
      .catch(() => {
        message.error('Vui lòng kiểm tra lại thông tin');
      });
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Bạn có chắc muốn xóa công việc này?',
      content: 'Hành động này không thể hoàn tác',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: () => {
        const updatedTasks = tasks.filter((t) => t.id !== id);
        setTasks(updatedTasks);
        saveTasks(updatedTasks);
        message.success('Xóa công việc thành công');
      },
    });
  };

  const applyFilters = (tasksToFilter: Task[], keyword: string, status?: string, assignee?: string) => {
    let filtered = [...tasksToFilter];

    if (keyword) {
      filtered = filtered.filter((task) =>
        task.name.toLowerCase().includes(keyword.toLowerCase())
      );
    }

    if (status) {
      filtered = filtered.filter((task) => task.status === status);
    }

    if (assignee) {
      filtered = filtered.filter((task) => task.assignee === assignee);
    }

    setFilteredTasks(filtered);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
  };

  const handleStatusFilterChange = (value: string) => {
    setFilterStatus(value || undefined);
  };

  const handleAssigneeFilterChange = (value: string) => {
    setFilterAssignee(value || undefined);
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destIndex = result.destination.index;

    // Create new arrays to avoid mutation
    const newFilteredTasks = [...filteredTasks];
    const [removed] = newFilteredTasks.splice(sourceIndex, 1);
    newFilteredTasks.splice(destIndex, 0, removed);

    // Update the full tasks list to maintain consistency
    const newTasks = [...tasks];
    const taskIds = newFilteredTasks.map(task => task.id);
    
    // Reorder tasks based on the filtered order
    newTasks.sort((a, b) => {
      return taskIds.indexOf(a.id) - taskIds.indexOf(b.id);
    });

    setTasks(newTasks);
    saveTasks(newTasks);
  };

  const columns = [
    {
      title: 'Tên công việc',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Người được giao',
      dataIndex: 'assignee',
      key: 'assignee',
      filterDropdown: () => (
        <Select
          allowClear
          placeholder="Lọc theo người"
          style={{ width: 200 }}
          value={filterAssignee}
          onChange={handleAssigneeFilterChange}
        >
          {Array.from(new Set(tasks.map(task => task.assignee))).map(assignee => (
            <Option key={assignee} value={assignee}>{assignee}</Option>
          ))}
        </Select>
      ),
    },
    {
      title: 'Mức độ ưu tiên',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => {
        let color = '';
        switch (priority) {
          case 'Cao': color = 'red'; break;
          case 'Trung bình': color = 'orange'; break;
          case 'Thấp': color = 'green'; break;
          default: color = 'blue';
        }
        return <Tag color={color}>{priority}</Tag>;
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      filterDropdown: () => (
        <Select
          allowClear
          placeholder="Lọc theo trạng thái"
          style={{ width: 200 }}
          value={filterStatus}
          onChange={handleStatusFilterChange}
        >
          <Option value="Chưa làm">Chưa làm</Option>
          <Option value="Đang làm">Đang làm</Option>
          <Option value="Đã xong">Đã xong</Option>
        </Select>
      ),
      render: (status: string) => {
        let color = '';
        switch (status) {
          case 'Chưa làm': color = 'default'; break;
          case 'Đang làm': color = 'processing'; break;
          case 'Đã xong': color = 'success'; break;
          default: color = 'default';
        }
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_: any, record: Task) => (
        <Space>
          <Button onClick={() => openModal(record)} type="link">
            Sửa
          </Button>
          <Button onClick={() => handleDelete(record.id)} type="link" danger>
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 16, display: 'flex', gap: 16 }}>
        <Input.Search
          placeholder="Tìm kiếm công việc"
          value={searchKeyword}
          onChange={handleSearchChange}
          style={{ width: 300 }}
          allowClear
        />
        <Button type="primary" onClick={() => openModal()}>
          Thêm công việc
        </Button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="taskList">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              <Table
                dataSource={filteredTasks}
                columns={columns}
                rowKey="id"
                pagination={false}
                components={{
                  body: {
                    row: ({ className, style, ...props }: any) => {
                      const index = filteredTasks.findIndex(item => item.id === props['data-row-key']);
                      return (
                        <Draggable draggableId={props['data-row-key']} index={index}>
                          {(provided) => (
                            <tr
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              {...props}
                              style={{ ...style, ...provided.draggableProps.style }}
                            />
                          )}
                        </Draggable>
                      );
                    },
                  },
                }}
              />
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <Modal
        title={editingTask ? 'Chỉnh sửa công việc' : 'Thêm công việc'}
        visible={isModalOpen}
        onOk={handleOk}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        destroyOnClose
        okText={editingTask ? 'Cập nhật' : 'Thêm'}
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tên công việc"
            rules={[{ required: true, message: 'Vui lòng nhập tên công việc' }]}
          >
            <Input placeholder="Nhập tên công việc" />
          </Form.Item>
          <Form.Item
            name="assignee"
            label="Người được giao"
            rules={[{ required: true, message: 'Vui lòng nhập người được giao' }]}
          >
            <Input placeholder="Nhập người được giao" />
          </Form.Item>
          <Form.Item
            name="priority"
            label="Mức độ ưu tiên"
            rules={[{ required: true, message: 'Vui lòng chọn mức độ ưu tiên' }]}
          >
            <Select placeholder="Chọn mức độ ưu tiên">
              <Option value="Thấp">Thấp</Option>
              <Option value="Trung bình">Trung bình</Option>
              <Option value="Cao">Cao</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
          >
            <Select placeholder="Chọn trạng thái">
              <Option value="Chưa làm">Chưa làm</Option>
              <Option value="Đang làm">Đang làm</Option>
              <Option value="Đã xong">Đã xong</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};