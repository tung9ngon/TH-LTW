import React, { useState, useEffect } from 'react';
import { Modal, Input, Select } from 'antd';
import { Task, Priority, Status } from '../../../services/Types/in';

const { Option } = Select;

interface Props {
  visible: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
  initialTask?: Task;
}

export const TaskForm: React.FC<Props> = ({ visible, onClose, onSave, initialTask }) => {
  const [task, setTask] = useState<Task>(
    initialTask || {
      id: '',
      name: '',
      assignee: '',
      priority: 'Trung bình',
      status: 'Chưa làm',
    }
  );

  useEffect(() => {
    if (initialTask) setTask(initialTask);
  }, [initialTask]);

  const handleSave = () => {
    onSave({ ...task, id: initialTask?.id || Date.now().toString() });
    onClose();
  };

  return (
    <Modal title="Công việc" visible={visible} onOk={handleSave} onCancel={onClose}>
      <Input
        placeholder="Tên công việc"
        value={task.name}
        onChange={(e) => setTask({ ...task, name: e.target.value })}
        style={{ marginBottom: 8 }}
      />
      <Input
        placeholder="Người được giao"
        value={task.assignee}
        onChange={(e) => setTask({ ...task, assignee: e.target.value })}
        style={{ marginBottom: 8 }}
      />
      <Select
        value={task.priority}
        onChange={(value) => setTask({ ...task, priority: value as Priority })}
        style={{ width: '100%', marginBottom: 8 }}
      >
        <Option value="Thấp">Thấp</Option>
        <Option value="Trung bình">Trung bình</Option>
        <Option value="Cao">Cao</Option>
      </Select>
      <Select
        value={task.status}
        onChange={(value) => setTask({ ...task, status: value as Status })}
        style={{ width: '100%' }}
      >
        <Option value="Chưa làm">Chưa làm</Option>
        <Option value="Đang làm">Đang làm</Option>
        <Option value="Đã xong">Đã xong</Option>
      </Select>
    </Modal>
  );
};