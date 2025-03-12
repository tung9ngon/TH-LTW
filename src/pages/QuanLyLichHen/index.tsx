import React, { useState, useEffect } from "react";

type Appointment = {
  id: number;
  name: string;
  date: string;
  time: string;
  service: string;
  status: "Chờ duyệt" | "Xác nhận" | "Hoàn thành" | "Hủy";
};

const MAX_APPOINTMENTS_PER_SLOT = 5;
const MIN_TIME_GAP = 30;

const getLocalAppointments = (): Appointment[] => {
  const data = localStorage.getItem("appointments");
  return data ? JSON.parse(data) : [];
};

const saveLocalAppointments = (appointments: Appointment[]) => {
  localStorage.setItem("appointments", JSON.stringify(appointments));
};

const AppointmentManagement: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>(getLocalAppointments);

  useEffect(() => {
    saveLocalAppointments(appointments);
  }, [appointments]);

  const handleAddAppointment = (newAppointment: Appointment) => {
    const sameDayAppointments = appointments.filter(
      (appt) => appt.date === newAppointment.date && appt.service === newAppointment.service
    );

    const isOverlapping = sameDayAppointments.some((appt) => {
      const apptTime = new Date(`${appt.date}T${appt.time}`);
      const newApptTime = new Date(`${newAppointment.date}T${newAppointment.time}`);
      const timeDiff = Math.abs(newApptTime.getTime() - apptTime.getTime()) / (1000 * 60);
      return timeDiff < MIN_TIME_GAP;
    });

    if (isOverlapping) {
      alert(`Lịch hẹn phải cách nhau ít nhất ${MIN_TIME_GAP} phút!`);
      return;
    }

    const sameSlotAppointments = sameDayAppointments.filter((appt) => appt.time === newAppointment.time);
    if (sameSlotAppointments.length >= MAX_APPOINTMENTS_PER_SLOT) {
      alert(`Khung giờ này đã đủ ${MAX_APPOINTMENTS_PER_SLOT} người!`);
      return;
    }

    const updatedAppointments = [...appointments, { ...newAppointment, id: Date.now() }];
    setAppointments(updatedAppointments);
  };

  const handleUpdateStatus = (id: number, status: Appointment["status"]) => {
    const updatedAppointments = appointments.map((appt) =>
      appt.id === id ? { ...appt, status } : appt
    );
    setAppointments(updatedAppointments);
  };

  return (
    <div>
      <h1>Quản lý Lịch Hẹn</h1>
      <AppointmentForm onAddAppointment={handleAddAppointment} />
      <AppointmentList appointments={appointments} onUpdateStatus={handleUpdateStatus} />
    </div>
  );
};

const AppointmentForm: React.FC<{ onAddAppointment: (appointment: Appointment) => void }> = ({ onAddAppointment }) => {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [service, setService] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddAppointment({ id: Date.now(), name, date, time, service, status: "Chờ duyệt" });
    setName("");
    setDate("");
    setTime("");
    setService("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Đặt Lịch Hẹn</h2>
      <input type="text" placeholder="Tên Khách Hàng" value={name} onChange={(e) => setName(e.target.value)} required />
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
      <select value={service} onChange={(e) => setService(e.target.value)} required>
        <option value="">Chọn dịch vụ</option>
        <option value="Cắt tóc">Cắt tóc</option>
        <option value="Gội đầu">Gội đầu</option>
        <option value="Spa">Spa</option>
      </select>
      <button type="submit">Đặt lịch</button>
    </form>
  );
};

const AppointmentList: React.FC<{ appointments: Appointment[]; onUpdateStatus: (id: number, status: Appointment["status"]) => void }> = ({ appointments, onUpdateStatus }) => {
  return (
    <div>
      <h2>Danh sách Lịch Hẹn</h2>
      <ul>
        {appointments.map((appointment) => (
          <li key={appointment.id}>
            {appointment.name} - {appointment.date} {appointment.time} ({appointment.service}) - {appointment.status}
        
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AppointmentManagement;
