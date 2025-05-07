import React from 'react';
import { Task } from '../../../services/Types/in';
import { Card, Button, Tag } from 'antd';

interface Props {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  currentUser: string;
}

export const TaskItem: React.FC<Props> = ({ task, onEdit, onDelete, currentUser }) => {
  if (task.assignee !== currentUser) return null;

  return (
    <Card title={task.name} extra={<Tag color={getStatusColor(task.status)}>{task.status}</Tag>}>
      <p>Giao cho: {task.assignee}</p>
      <p>Ưu tiên: <Tag color={getPriorityColor(task.priority)}>{task.priority}</Tag></p>
      <Button onClick={() => onEdit(task)} style={{ marginRight: 8 }}>Sửa</Button>
      <Button danger onClick={() => onDelete(task.id)}>Xóa</Button>
    </Card>
  );
};

const getPriorityColor = (priority: string) => {
  return priority === 'Cao' ? 'red' : priority === 'Trung bình' ? 'orange' : 'green';
};

const getStatusColor = (status: string) => {
  return status === 'Đã xong' ? 'green' : status === 'Đang làm' ? 'blue' : 'gray';
};