import React, { useState, useEffect } from "react";
import './index.css'

// Định nghĩa kiểu dữ liệu
type Employee = {
  id: number;
  name: string;
  maxClientsPerDay: number;
  workSchedule: string[]; // Danh sách khung giờ làm việc (ví dụ: ["7h-8h", "8h-9h"])
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
  employeeName:"";
  status: "Chờ duyệt" | "Xác nhận" | "Hoàn thành" | "Hủy";
  rating?: number;
  feedback?: string;
};

// Tạo danh sách khung giờ làm việc chi tiết
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 7; hour <= 19; hour++) {
    slots.push(`${hour}h-${hour + 1}h`);
  }
  return slots;
};

const availableTimeSlots = generateTimeSlots();

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

const HaircutManagement = () => {
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

  // Quản lý nhân viên
  const [newEmployee, setNewEmployee] = useState<Employee>({
    id: 0,
    name: "",
    maxClientsPerDay: 0,
    workSchedule: [],
  });
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const handleSaveEmployee = () => {
    if (!newEmployee.name.trim()) return alert("Tên nhân viên không được để trống!");

    if (editingEmployee) {
      setEmployees((prev) =>
        prev.map((emp) => (emp.id === editingEmployee.id ? { ...editingEmployee } : emp))
      );
      setEditingEmployee(null);
    } else {
      setEmployees((prev) => [
        ...prev,
        { ...newEmployee, id: prev.length + 1, workSchedule: [...newEmployee.workSchedule] },
      ]);
    }

    setNewEmployee({ id: 0, name: "", maxClientsPerDay: 0, workSchedule: [] });
  };

  const handleDeleteEmployee = (id: number) => {
    setEmployees((prev) => prev.filter((emp) => emp.id !== id));
  };

  const toggleWorkSchedule = (slot: string) => {
    if (editingEmployee) {
      setEditingEmployee((prev) =>
        prev
          ? {
              ...prev,
              workSchedule: prev.workSchedule.includes(slot)
                ? prev.workSchedule.filter((s) => s !== slot)
                : [...prev.workSchedule, slot],
            }
          : prev
      );
    } else {
      setNewEmployee((prev) => ({
        ...prev,
        workSchedule: prev.workSchedule.includes(slot)
          ? prev.workSchedule.filter((s) => s !== slot)
          : [...prev.workSchedule, slot],
      }));
    }
  };

  // Quản lý dịch vụ
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
    setAppointments(updatedAppointments);
  };

  return (
    <div>
      <h1>Quản lý Nhân viên</h1>
      <input
        type="text"
        placeholder="Tên nhân viên"
        value={newEmployee.name}
        onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
      />
      <input
        type="number"
        placeholder="Số khách tối đa/ngày"
        value={editingEmployee ? editingEmployee.maxClientsPerDay : newEmployee.maxClientsPerDay}
        onChange={(e) =>
          editingEmployee
            ? setEditingEmployee({ ...editingEmployee, maxClientsPerDay: Number(e.target.value) })
            : setNewEmployee({ ...newEmployee, maxClientsPerDay: Number(e.target.value) })
        }
      />
      <div>
        <p>Chọn khung giờ làm việc:</p>
        {availableTimeSlots.map((slot) => (
          <label key={slot}>
            <input
              type="checkbox"
              checked={
                editingEmployee
                  ? editingEmployee.workSchedule.includes(slot)
                  : newEmployee.workSchedule.includes(slot)
              }
              onChange={() => toggleWorkSchedule(slot)}
            />
            {slot}
          </label>
        ))}
      </div>
      <button onClick={handleSaveEmployee}>{editingEmployee ? "Cập nhật" : "Thêm"}</button>
      <ul>
        {employees.map((emp) => (
          <li key={emp.id}>
            {emp.name} - {emp.maxClientsPerDay} Khách/ngày - Lịch làm việc: {emp.workSchedule.join(", ")}
            <button onClick={() => setEditingEmployee(emp)}>Sửa</button>
            <button onClick={() => handleDeleteEmployee(emp.id)}>Xóa</button>
          </li>
        ))}
      </ul>

      <h2>Quản lý Dịch vụ</h2>
      <input
        type="text"
        placeholder="Tên dịch vụ"
        value={newService.name}
        onChange={(e) => setNewService({ ...newService, name: e.target.value })}
      />
      <input
        type="number"
        placeholder="Giá"
        value={editingService ? editingService.price : newService.price}
        onChange={(e) =>
          editingService
            ? setEditingService({ ...editingService, price: Number(e.target.value) })
            : setNewService({ ...newService, price: Number(e.target.value) })
        }
      />
      <input
        type="number"
        placeholder="Thời gian (phút)"
        value={editingService ? editingService.duration : newService.duration}
        onChange={(e) =>
          editingService
            ? setEditingService({ ...editingService, duration: Number(e.target.value) })
            : setNewService({ ...newService, duration: Number(e.target.value) })
        }
      />
      <button onClick={handleSaveService}>{editingService ? "Cập nhật" : "Thêm"}</button>
      <ul>
        {services.map((srv) => (
          <li key={srv.id}>
            {srv.name} - {srv.price} VND - {srv.duration} Phút
            <button onClick={() => setEditingService(srv)}>Sửa</button>
            <button onClick={() => handleDeleteService(srv.id)}>Xóa</button>
          </li>
        ))}
      </ul>

      <h3>Lịch hẹn</h3>
      <ul>
        {appointments.map((app) => (
          <li key={app.id}>
            {app.customerName} - {app.date} - {app.employeeName} - {app.status} 
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

export default HaircutManagement;