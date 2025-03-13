import React, { useState, useEffect } from "react";
import './index.css'

// Định nghĩa kiểu dữ liệu
type Employee = {
  id: number;
  name: string;
  maxClientsPerDay: number;
  workSchedule: string[]; // Danh sách khung giờ làm việc (ví dụ: ["7h-12h", "13h-19h"])
  rating?: number; // Đánh giá trung bình
  totalRatings?: number; // Tổng số đánh giá
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
  employeeName:string;
  status: "Chờ duyệt" | "Xác nhận" | "Hoàn thành" | "Hủy";
  rating?: number; // Đánh giá của khách hàng
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

const TaskManagement = () => {
  const [employees, setEmployees] = useState<Employee[]>(getLocalData("employees"));
  const [services, setServices] = useState<Service[]>(getLocalData("services"));
  const [appointments, setAppointments] = useState<Appointment[]>(getLocalData("appointments"));

  const [newAppointment, setNewAppointment] = useState<Appointment>({
    id: 0,
    customerName: "",
    date: "",
    time: "",
    employeeId: 0,
    serviceId: 0,
    employeeName:"",
    status: "Chờ duyệt",
  });

  // Cập nhật localStorage khi danh sách appointments thay đổi
  useEffect(() => {
    localStorage.setItem("appointments", JSON.stringify(appointments));
  }, [appointments]);

  // Lấy danh sách thời gian làm việc của nhân viên
  const getEmployeeTimeSlots = (employeeId: number) => {
    const selectedEmployee = employees.find((emp) => emp.id === employeeId);
    if (!selectedEmployee) return [];

    const timeSlots: string[] = [];
    selectedEmployee.workSchedule.forEach((slot) => {
      const [start, end] = slot.split("-");
      const startTime = parseInt(start.replace("h", ""), 10);
      const endTime = parseInt(end.replace("h", ""), 10);

      for (let hour = startTime; hour < endTime; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          timeSlots.push(`${hour}:${minute === 0 ? "00" : minute}`);
        }
      }
    });

    return timeSlots;
  };

  const handleAddAppointment = () => {
    const { customerName, date, time, employeeId, serviceId } = newAppointment;

    if (!customerName.trim() || !date || !time || employeeId === 0 || serviceId === 0) {
      alert("Vui lòng điền đầy đủ thông tin đặt lịch!");
      return;
    }

    // Kiểm tra xem thời gian có nằm trong khung giờ làm việc của nhân viên không
    const selectedEmployee = employees.find((emp) => emp.id === employeeId);
    if (!selectedEmployee || !getEmployeeTimeSlots(employeeId).includes(time)) {
      alert("Nhân viên không làm việc vào thời gian này. Vui lòng chọn thời gian khác.");
      return;
    }

    setAppointments((prev) => [...prev, { ...newAppointment, id: prev.length + 1 }]);
    setNewAppointment({
      id: 0,
      customerName: "",
      date: "",
      time: "",
      employeeId: 0,
      serviceId: 0,
      employeeName:"",
      status: "Chờ duyệt",
    });
  };

  // Cập nhật đánh giá
  const handleRateAppointment = (id: number, rating: number) => {
    const updatedAppointments = appointments.map((app) =>
      app.id === id ? { ...app, rating } : app
    );
    setAppointments(updatedAppointments);

    // Cập nhật đánh giá trung bình của nhân viên
    const appointment = updatedAppointments.find((app) => app.id === id);
    if (appointment && appointment.employeeId) {
      const employee = employees.find((emp) => emp.id === appointment.employeeId);
      if (employee) {
        const totalRatings = (employee.totalRatings || 0) + 1;
        const newRating = ((employee.rating || 0) * (totalRatings - 1) + rating) / totalRatings;

        const updatedEmployees = employees.map((emp) =>
          emp.id === employee.id
            ? { ...emp, rating: newRating, totalRatings }
            : emp
        );
        setEmployees(updatedEmployees);
        localStorage.setItem("employees", JSON.stringify(updatedEmployees));
      }
    }
  };

  return (
    <div>
      <h1>Đặt lịch hẹn</h1>
      <input
        type="text"
        placeholder="Tên khách hàng"
        value={newAppointment.customerName}
        onChange={(e) => setNewAppointment({ ...newAppointment, customerName: e.target.value })}
      />
      <input
        type="date"
        value={newAppointment.date}
        onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
      />

      {/* Chọn nhân viên */}
      <select
        value={newAppointment.employeeId}
        onChange={(e) => {
          const employeeId = Number(e.target.value);
          setNewAppointment((prev) => ({
            ...prev,
            employeeId,
            time: "", // Reset thời gian khi chọn nhân viên mới
          }));
        }}
      >
        <option value={0} disabled>-- Chọn nhân viên --</option>
        {employees.map((emp) => (
          <option key={emp.id} value={emp.id}>
            {emp.name} (Đánh giá: {emp.rating ? emp.rating.toFixed(1) : "Chưa có"})
          </option>
        ))}
      </select>

      {/* Chọn thời gian */}
      <select
        value={newAppointment.time}
        onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
        disabled={!newAppointment.employeeId}
      >
        <option value="" disabled>-- Chọn thời gian --</option>
        {getEmployeeTimeSlots(newAppointment.employeeId).map((slot) => (
          <option key={slot} value={slot}>
            {slot}
          </option>
        ))}
      </select>

      {/* Chọn dịch vụ */}
      <select
        value={newAppointment.serviceId}
        onChange={(e) => setNewAppointment({ ...newAppointment, serviceId: Number(e.target.value) })}
      >
        <option value={0} disabled>-- Chọn dịch vụ --</option>
        {services.map((srv) => (
          <option key={srv.id} value={srv.id}>
            {srv.name} - {srv.price} VND (Thời gian: {srv.duration} phút)
          </option>
        ))}
      </select>

      <button onClick={handleAddAppointment}>Đặt lịch</button>

      <h2>Lịch hẹn</h2>
      <ul>
        {appointments.map((app) => (
          <li key={app.id}>
            {app.customerName} - {app.date} - {app.time} -{app.employeeName}- Trạng thái: {app.status}
            {app.status === "Hoàn thành" && !app.rating && (
              <div>
                <p>Đánh giá nhân viên:</p>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} onClick={() => handleRateAppointment(app.id, star)}>
                    {star} ⭐
                  </button>
                ))}
              </div>
            )}
            {app.rating && <p>Đánh giá: {app.rating} ⭐</p>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskManagement;