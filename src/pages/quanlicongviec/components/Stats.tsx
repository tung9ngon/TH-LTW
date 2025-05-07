import React from 'react';
import { useTaskContext } from '../../../context/TaskContext';

export const Stats: React.FC = () => {
  const { tasks } = useTaskContext();
  const done = tasks.filter(t => t.status === 'Đã xong').length;

  return (
    <div style={{ marginTop: 16 }}>
      <strong>Tổng số công việc:</strong> {tasks.length} | 
      <strong> Đã hoàn thành:</strong> {done}
    </div>
  );
};