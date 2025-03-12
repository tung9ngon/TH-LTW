import React, { useState, useEffect } from "react";

type Employee = {
  id: number;
  name: string;
  maxClientsPerDay: number;
  workSchedule: string[];
};

type Service = {
  id: number;
  name: string;
  price: number;
  duration: number; // Thời gian thực hiện (phút)
};

type Appointment = {
  id: number;
  customerName: string;
  date: string;
  time: string;
  employeeId: number;
  serviceId: number;
  status: "Chờ duyệt" | "Xác nhận" | "Hoàn thành" | "Hủy";
  rating?: number;
  feedback?: string;
};

// Hàm lấy dữ liệu từ localStorage
const getLocalData = (key: string) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(`Lỗi khi đọc dữ liệu từ localStorage (${key}):`, error);
    return [];
  }
};

const Quanlinhanvien = () => {
  const [employees, setEmployees] = useState<Employee[]>(getLocalData("employees"));
  const [services, setServices] = useState<Service[]>(getLocalData("services"));
  const [appointments, setAppointments] = useState<Appointment[]>(getLocalData("appointments"));

  // Lưu dữ liệu vào localStorage khi có thay đổi
  useEffect(() => {
    try {
      localStorage.setItem("employees", JSON.stringify(employees));
      localStorage.setItem("services", JSON.stringify(services));
      localStorage.setItem("appointments", JSON.stringify(appointments));
    } catch (error) {
      console.error("Lỗi khi lưu dữ liệu vào localStorage:", error);
    }
  }, [employees, services, appointments]);

  // Thêm/Sửa/Xóa nhân viên
  const [newEmployee, setNewEmployee] = useState<Employee>({ id: 0, name: "", maxClientsPerDay: 0, workSchedule: [] });
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const handleSaveEmployee = () => {
    if (!newEmployee.name.trim()) return alert("Tên nhân viên không được để trống!");

    if (editingEmployee) {
      setEmployees((prev) =>
        prev.map((emp) => (emp.id === editingEmployee.id ? editingEmployee : emp))
      );
      setEditingEmployee(null);
    } else {
      setEmployees((prev) => [...prev, { ...newEmployee, id: prev.length + 1 }]);
    }

    setNewEmployee({ id: 0, name: "", maxClientsPerDay: 0, workSchedule: [] });
  };

  const handleDeleteEmployee = (id: number) => {
    setEmployees((prev) => prev.filter((emp) => emp.id !== id));
  };

  // Thêm/Sửa/Xóa dịch vụ
  const [newService, setNewService] = useState<Service>({ id: 0, name: "", price: 0, duration: 0 });
  const [editingService, setEditingService] = useState<Service | null>(null);

  const handleSaveService = () => {
    if (!newService.name.trim()) return alert("Tên dịch vụ không được để trống!");

    if (editingService) {
      setServices((prev) =>
        prev.map((srv) => (srv.id === editingService.id ? editingService : srv))
      );
      setEditingService(null);
    } else {
      setServices((prev) => [...prev, { ...newService, id: prev.length + 1 }]);
    }

    setNewService({ id: 0, name: "", price: 0, duration: 0 });
  };

  const handleDeleteService = (id: number) => {
    setServices((prev) => prev.filter((srv) => srv.id !== id));
  };


  // Cập nhật trạng thái lịch hẹn
  const handleUpdateAppointmentStatus = (id: number, status: Appointment["status"]) => {
    const updatedAppointments = appointments.map((app) =>
      app.id === id ? { ...app, status } : app
    );
    
    setAppointments(updatedAppointments); // Cập nhật state
    localStorage.setItem("appointments", JSON.stringify(updatedAppointments)); // Lưu vào localStorage ngay lập tức
  };
  

  return (
    <div>
      <h1>Ứng dụng Đặt lịch hẹn</h1>

      {/* Quản lý Nhân viên */}
      <h2>Quản lý Nhân viên</h2>
      <input
        type="text"
        placeholder="Tên nhân viên"
        value={newEmployee.name}
        onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
      />
      <button onClick={handleSaveEmployee}>{editingEmployee ? "Cập nhật" : "Thêm"}</button>
      <ul>
        {employees.map((emp) => (
          <li key={emp.id}>
            {emp.name}{" "}
            <button onClick={() => setEditingEmployee(emp)}>Sửa</button>
            <button onClick={() => handleDeleteEmployee(emp.id)}>Xóa</button>
          </li>
        ))}
      </ul>

      {/* Quản lý Dịch vụ */}
      <h2>Quản lý Dịch vụ</h2>
      <input
        type="text"
        placeholder="Tên dịch vụ"
        value={newService.name}
        onChange={(e) => setNewService({ ...newService, name: e.target.value })}
      />
      <button onClick={handleSaveService}>{editingService ? "Cập nhật" : "Thêm"}</button>
      <ul>
        {services.map((srv) => (
          <li key={srv.id}>
            {srv.name}{" "}
            <button onClick={() => setEditingService(srv)}>Sửa</button>
            <button onClick={() => handleDeleteService(srv.id)}>Xóa</button>
          </li>
        ))}
      </ul>

      
      
      <h3>Lịch hẹn</h3>
      <ul>
        {appointments.map((app) => (
          <li key={app.id}>
            {app.customerName} - {app.date} - {app.status}
            <button onClick={() => handleUpdateAppointmentStatus(app.id, "Chờ duyệt")}>Chờ</button>
            <button onClick={() => handleUpdateAppointmentStatus(app.id, "Xác nhận")}>Xác nhận</button>
            <button onClick={() => handleUpdateAppointmentStatus(app.id, "Hủy")}>Hủy</button>
            <button onClick={() => handleUpdateAppointmentStatus(app.id, "Hoàn thành")}>Hoàn thành</button>
            
          </li>
        ))}
      </ul>
      
    </div>
  );
};

export default Quanlinhanvien;