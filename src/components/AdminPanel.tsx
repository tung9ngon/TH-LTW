
import { Table, Button, Modal, Form, Input, InputNumber, Select, Popconfirm } from 'antd';
import { Place } from '../services/Types/index';
import { mockPlaces } from '../assets/mockData';
import React, { useState, useEffect } from 'react';

const LOCAL_STORAGE_KEY = 'places_data';

const AdminPanel: React.FC = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlace, setEditingPlace] = useState<Place | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      setPlaces(JSON.parse(stored));
    } else {
      setPlaces(mockPlaces);
    }
  }, []);

  const saveToLocalStorage = (data: Place[]) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  };

  const handleAddOrEdit = () => {
    form.validateFields().then(values => {
      if (editingPlace) {
        // Chế độ chỉnh sửa
        const updated = places.map(p =>
          p.id === editingPlace.id ? { ...p, ...values } : p
        );
        setPlaces(updated);
        saveToLocalStorage(updated);
      } else {
        // Chế độ thêm mới
        const newPlace: Place = {
          id: Date.now(),
          ...values,
          image: '/assets/default.jpg',
        };
        const updatedPlaces = [...places, newPlace];
        setPlaces(updatedPlaces);
        saveToLocalStorage(updatedPlaces);
      }

      setIsModalOpen(false);
      setEditingPlace(null);
      form.resetFields();
    });
  };

  const handleEdit = (place: Place) => {
    setEditingPlace(place);
    form.setFieldsValue(place);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    const updated = places.filter(p => p.id !== id);
    setPlaces(updated);
    saveToLocalStorage(updated);
  };

  const columns = [
    { title: 'Tên', dataIndex: 'name' },
    { title: 'Loại hình', dataIndex: 'type' },
    { title: 'Giá', dataIndex: 'price', render: (val: number) => `${val.toLocaleString()} VND` },
    { title: 'Đánh giá', dataIndex: 'rating' },
    {
      title: 'Hành động',
      render: (_: any, record: Place) => (
        <>
          <Button onClick={() => handleEdit(record)} type="link">Sửa</Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="link" danger>Xóa</Button>
          </Popconfirm>
        </>
      )
    }
  ];

  return (
    <>
      <Button type="primary" onClick={() => {
        setEditingPlace(null);
        form.resetFields();
        setIsModalOpen(true);
      }}>
        Thêm điểm đến
      </Button>

      <Table
        dataSource={places}
        columns={columns}
        rowKey="id"
        style={{ marginTop: 20 }}
      />

      <Modal
        title={editingPlace ? "Chỉnh sửa điểm đến" : "Thêm điểm đến"}
        visible={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingPlace(null);
          form.resetFields();
        }}
        onOk={handleAddOrEdit}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Tên điểm đến" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="type" label="Loại hình" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="biển">Biển</Select.Option>
              <Select.Option value="núi">Núi</Select.Option>
              <Select.Option value="thành phố">Thành phố</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="price" label="Giá" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="rating" label="Đánh giá" rules={[{ required: true }]}>
            <InputNumber min={1} max={5} step={0.1} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AdminPanel;