import React, { useState, useEffect } from "react";

type Employee = {
  id: number;
  name: string;
};

type Service = {
  id: number;
  name: string;
  price: number;
};

type Appointment = {
  id: number;
  date: string;
  employeeId: number;
  serviceId: number;
  status: "Chờ duyệt" | "Xác nhận" | "Hoàn thành" | "Hủy";
};

const getLocalData = (key: string) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(`Lỗi khi đọc dữ liệu từ localStorage (${key}):`, error);
    return [];
  }
};

const Statistics = () => {
  const [employees, setEmployees] = useState<Employee[]>(getLocalData("employees"));
  const [services, setServices] = useState<Service[]>(getLocalData("services"));
  const [appointments, setAppointments] = useState<Appointment[]>(getLocalData("appointments"));

  // Thống kê số lượng lịch hẹn theo ngày
  const countAppointmentsByDate = () => {
    const count: Record<string, number> = {};
    appointments.forEach((app) => {
      count[app.date] = (count[app.date] || 0) + 1;
    });
    return count;
  };

  // Thống kê số lượng lịch hẹn theo tháng
  const countAppointmentsByMonth = () => {
    const count: Record<string, number> = {};
    appointments.forEach((app) => {
      const month = app.date.slice(0, 7);
      count[month] = (count[month] || 0) + 1;
    });
    return count;
  };

  // Thống kê doanh thu theo dịch vụ
  const revenueByService = () => {
    const revenue: Record<number, number> = {};
    appointments.forEach((app) => {
      if (app.status === "Hoàn thành") {
        const service = services.find((s) => s.id === app.serviceId);
        if (service) {
          revenue[service.id] = (revenue[service.id] || 0) + service.price;
        }
      }
    });
    return revenue;
  };

  // Thống kê doanh thu theo nhân viên
  const revenueByEmployee = () => {
    const revenue: Record<number, number> = {};
    appointments.forEach((app) => {
      if (app.status === "Hoàn thành") {
        const service = services.find((s) => s.id === app.serviceId);
        if (service) {
          revenue[app.employeeId] = (revenue[app.employeeId] || 0) + service.price;
        }
      }
    });
    return revenue;
  };

  return (
    <div>
      <h2>Thống kê số lượng lịch hẹn</h2>
      <h3>Theo ngày</h3>
      <ul>
        {Object.entries(countAppointmentsByDate()).map(([date, count]) => (
          <li key={date}>{date}: {count} lịch hẹn</li>
        ))}
      </ul>

      <h3>Theo tháng</h3>
      <ul>
        {Object.entries(countAppointmentsByMonth()).map(([month, count]) => (
          <li key={month}>{month}: {count} lịch hẹn</li>
        ))}
      </ul>

      <h2>Thống kê doanh thu</h2>
      <h3>Theo dịch vụ</h3>
      <ul>
        {Object.entries(revenueByService()).map(([serviceId, revenue]) => (
          <li key={serviceId}>{services.find(s => s.id === Number(serviceId))?.name}: {revenue} VND</li>
        ))}
      </ul>

      <h3>Theo nhân viên</h3>
      <ul>
        {Object.entries(revenueByEmployee()).map(([employeeId, revenue]) => (
          <li key={employeeId}>{employees.find(e => e.id === Number(employeeId))?.name}: {revenue} VND</li>
        ))}
      </ul>
    </div>
  );
};

export default Statistics;
