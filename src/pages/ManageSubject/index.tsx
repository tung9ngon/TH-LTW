import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
// Định nghĩa interface cho dữ liệu
interface SubjectCategory {
  id: string;
  name: string;
}
interface StudySession {
  id: string;
  subjectId: string;
  subjectName: string;
  dateTime: string; // lưu theo định dạng ISO
  duration: number; // đơn vị: giờ
  content: string;
  notes: string;
}
interface MonthlyGoal {
  id: string;
  // Nếu subjectId rỗng thì hiểu là mục tiêu tổng cho tất cả các môn
  subjectId: string;
  goalHours: number;
  month: string; // định dạng "YYYY-MM"
}
// Các key trong localStorage
const LOCAL_STORAGE_KEYS = {
  subjects: "studyApp_subjects",
  studySessions: "studyApp_sessions",
  monthlyGoals: "studyApp_goals",
};
const App: React.FC = () => {
  const [subjects, setSubjects] = useState<SubjectCategory[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [goals, setGoals] = useState<MonthlyGoal[]>([]);
  const [selectedTab, setSelectedTab] = useState<"subjects" | "sessions" | "goals">(
    "subjects"
  );
  // Load dữ liệu từ localStorage khi component mount
  useEffect(() => {
    const storedSubjects = localStorage.getItem(LOCAL_STORAGE_KEYS.subjects);
    if (storedSubjects) setSubjects(JSON.parse(storedSubjects));
    const storedSessions = localStorage.getItem(LOCAL_STORAGE_KEYS.studySessions);
    if (storedSessions) setSessions(JSON.parse(storedSessions));
    const storedGoals = localStorage.getItem(LOCAL_STORAGE_KEYS.monthlyGoals);
    if (storedGoals) setGoals(JSON.parse(storedGoals));
  }, []);
  // Lưu dữ liệu vào localStorage khi có thay đổi
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.subjects, JSON.stringify(subjects));
  }, [subjects]);
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.studySessions, JSON.stringify(sessions));
  }, [sessions]);
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.monthlyGoals, JSON.stringify(goals));
  }, [goals]);
  return (
    <div style={{ padding: "20px" }}>
      <h1>Ứng dụng Quản lý Tiến độ Học tập</h1>
      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => setSelectedTab("subjects")}>
          Danh mục môn học
        </button>{" "}
        <button onClick={() => setSelectedTab("sessions")}>
          Tiến độ học tập
        </button>{" "}
        <button onClick={() => setSelectedTab("goals")}>
          Mục tiêu hàng tháng
        </button>
      </div>
      <div>
        {selectedTab === "subjects" && (
          <SubjectManager subjects={subjects} setSubjects={setSubjects} />
        )}
        {selectedTab === "sessions" && (
          <StudySessionManager
            sessions={sessions}
            setSessions={setSessions}
            subjects={subjects}
          />
        )}
        {selectedTab === "goals" && (
          <MonthlyGoalManager
            goals={goals}
            setGoals={setGoals}
            subjects={subjects}
            sessions={sessions}
          />
        )}
      </div>
    </div>
  );
};
// --- Component quản lý danh mục môn học ---
interface SubjectManagerProps {
  subjects: SubjectCategory[];
  setSubjects: React.Dispatch<React.SetStateAction<SubjectCategory[]>>;
}
const SubjectManager: React.FC<SubjectManagerProps> = ({
  subjects,
  setSubjects,
}) => {
  const [newSubject, setNewSubject] = useState<string>("");
  const [editingSubjectId, setEditingSubjectId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string>("");
  const addSubject = () => {
    if (newSubject.trim() === "") return;
    const newId = Date.now().toString();
    setSubjects([...subjects, { id: newId, name: newSubject }]);
    setNewSubject("");
  };
  const deleteSubject = (id: string) => {
    setSubjects(subjects.filter((s) => s.id !== id));
  };
  const startEdit = (id: string, name: string) => {
    setEditingSubjectId(id);
    setEditingName(name);
  };
  const saveEdit = () => {
    setSubjects(
      subjects.map((s) =>
        s.id === editingSubjectId ? { ...s, name: editingName } : s
      )
    );
    setEditingSubjectId(null);
    setEditingName("");
  };
  return (
    <div>
      <h2>Quản lý Danh mục Môn học</h2>
      <input
        type="text"
        placeholder="Thêm môn học mới"
        value={newSubject}
        onChange={(e) => setNewSubject(e.target.value)}
      />
      <button onClick={addSubject}>Thêm</button>
      <ul>
        {subjects.map((subject) => (
          <li key={subject.id}>
            {editingSubjectId === subject.id ? (
              <>
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                />
                <button onClick={saveEdit}>Lưu</button>
                <button onClick={() => setEditingSubjectId(null)}>Hủy</button>
              </>
            ) : (
              <>
                {subject.name}{" "}
                <button onClick={() => startEdit(subject.id, subject.name)}>
                  Sửa
                </button>{" "}
                <button onClick={() => deleteSubject(subject.id)}>Xóa</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
// --- Component quản lý tiến độ học tập (lịch học) ---
interface StudySessionManagerProps {
  sessions: StudySession[];
  setSessions: React.Dispatch<React.SetStateAction<StudySession[]>>;
  subjects: SubjectCategory[];
}
const StudySessionManager: React.FC<StudySessionManagerProps> = ({
  sessions,
  setSessions,
  subjects,
}) => {
  const [form, setForm] = useState({
    subjectId: "",
    dateTime: "",
    duration: "",
    content: "",
    notes: "",
  });
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };
  const addSession = () => {
    if (!form.subjectId || !form.dateTime || !form.duration) {
      alert("Các trường bắt buộc: Môn học, Thời gian, Thời lượng");
      return;
    }
    const subject = subjects.find((s) => s.id === form.subjectId);
    const newSession: StudySession = {
      id: Date.now().toString(),
      subjectId: form.subjectId,
      subjectName: subject ? subject.name : "",
      dateTime: form.dateTime,
      duration: parseFloat(form.duration),
      content: form.content,
      notes: form.notes,
    };
    setSessions([...sessions, newSession]);
    setForm({ subjectId: "", dateTime: "", duration: "", content: "", notes: "" });
  };
  const deleteSession = (id: string) => {
    setSessions(sessions.filter((s) => s.id !== id));
  };
  const startEdit = (session: StudySession) => {
    setEditingSessionId(session.id);
    setForm({
      subjectId: session.subjectId,
      dateTime: session.dateTime,
      duration: session.duration.toString(),
      content: session.content,
      notes: session.notes,
    });
  };
  const saveEdit = () => {
    setSessions(
      sessions.map((s) =>
        s.id === editingSessionId
          ? {
              ...s,
              subjectId: form.subjectId,
              subjectName:
                subjects.find((sub) => sub.id === form.subjectId)?.name || "",
              dateTime: form.dateTime,
              duration: parseFloat(form.duration),
              content: form.content,
              notes: form.notes,
            }
          : s
      )
    );
    setEditingSessionId(null);
    setForm({ subjectId: "", dateTime: "", duration: "", content: "", notes: "" });
  };
  return (
    <div>
      <h2>Quản lý Tiến độ Học tập</h2>
      <div style={{ marginBottom: "10px" }}>
        <select
          name="subjectId"
          value={form.subjectId}
          onChange={handleInputChange}
        >
          <option value="">Chọn môn học</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>{" "}
        <input
          type="datetime-local"
          name="dateTime"
          value={form.dateTime}
          onChange={handleInputChange}
        />{" "}
        <input
          type="number"
          name="duration"
          placeholder="Thời lượng (giờ)"
          value={form.duration}
          onChange={handleInputChange}
        />{" "}
        <input
          type="text"
          name="content"
          placeholder="Nội dung đã học"
          value={form.content}
          onChange={handleInputChange}
        />{" "}
        <textarea
          name="notes"
          placeholder="Ghi chú"
          value={form.notes}
          onChange={handleInputChange}
        />
      </div>
      {editingSessionId ? (
        <>
          <button onClick={saveEdit}>Lưu chỉnh sửa</button>{" "}
          <button
            onClick={() => {
              setEditingSessionId(null);
              setForm({
                subjectId: "",
                dateTime: "",
                duration: "",
                content: "",
                notes: "",
              });
            }}
          >
            Hủy
          </button>
        </>
      ) : (
        <button onClick={addSession}>Thêm lịch học</button>
      )}
      <ul>
        {sessions.map((session) => (
          <li key={session.id} style={{ margin: "10px 0" }}>
            <strong>{session.subjectName}</strong> - {session.dateTime} -{" "}
            {session.duration} giờ
            <br />
            Nội dung: {session.content}
            <br />
            Ghi chú: {session.notes}
            <br />
            <button onClick={() => startEdit(session)}>Sửa</button>{" "}
            <button onClick={() => deleteSession(session.id)}>Xóa</button>
          </li>
        ))}
      </ul>
    </div>
  );
};
// --- Component quản lý mục tiêu học tập hàng tháng ---
interface MonthlyGoalManagerProps {
  goals: MonthlyGoal[];
  setGoals: React.Dispatch<React.SetStateAction<MonthlyGoal[]>>;
  subjects: SubjectCategory[];
  sessions: StudySession[];
}
const MonthlyGoalManager: React.FC<MonthlyGoalManagerProps> = ({
  goals,
  setGoals,
  subjects,
  sessions,
}) => {
  const [form, setForm] = useState({
    subjectId: "",
    goalHours: "",
    month: "",
  });
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };
  const addGoal = () => {
    if (!form.month || !form.goalHours) {
      alert("Nhập đầy đủ thông tin");
      return;
    }
    const newGoal: MonthlyGoal = {
      id: Date.now().toString(),
      subjectId: form.subjectId, // nếu rỗng thì hiểu là tổng cho tất cả các môn
      goalHours: parseFloat(form.goalHours),
      month: form.month,
    };
    setGoals([...goals, newGoal]);
    setForm({ subjectId: "", goalHours: "", month: "" });
  };
  const deleteGoal = (id: string) => {
    setGoals(goals.filter((g) => g.id !== id));
  };
  const startEdit = (goal: MonthlyGoal) => {
    setEditingGoalId(goal.id);
    setForm({
      subjectId: goal.subjectId,
      goalHours: goal.goalHours.toString(),
      month: goal.month,
    });
  };
  const saveEdit = () => {
    setGoals(
      goals.map((g) =>
        g.id === editingGoalId
          ? {
              ...g,
              subjectId: form.subjectId,
              goalHours: parseFloat(form.goalHours),
              month: form.month,
            }
          : g
      )
    );
    setEditingGoalId(null);
    setForm({ subjectId: "", goalHours: "", month: "" });
  };
  // Hàm tính tổng thời lượng học của các buổi học trong tháng (và nếu có mục tiêu theo môn thì tính riêng)
  const calculateProgress = (goal: MonthlyGoal) => {
    let total = 0;
    sessions.forEach((session) => {
      const sessionMonth = session.dateTime.slice(0, 7); // Lấy "YYYY-MM"
      if (sessionMonth === goal.month) {
        // Nếu mục tiêu theo môn, chỉ tính các buổi của môn đó
        if (goal.subjectId && session.subjectId !== goal.subjectId) return;
        total += session.duration;
      }
    });
    return total;
  };
  return (
    <div>
      <h2>Thiết lập Mục tiêu Học tập Hàng tháng</h2>
      <div style={{ marginBottom: "10px" }}>
        <select
          name="subjectId"
          value={form.subjectId}
          onChange={handleInputChange}
        >
          <option value="">Tất cả các môn</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>{" "}
        <input
          type="month"
          name="month"
          value={form.month}
          onChange={handleInputChange}
        />{" "}
        <input
          type="number"
          name="goalHours"
          placeholder="Thời lượng mục tiêu (giờ)"
          value={form.goalHours}
          onChange={handleInputChange}
        />
      </div>
      {editingGoalId ? (
        <>
          <button onClick={saveEdit}>Lưu chỉnh sửa</button>{" "}
          <button
            onClick={() => {
              setEditingGoalId(null);
              setForm({ subjectId: "", goalHours: "", month: "" });
            }}
          >
            Hủy
          </button>
        </>
      ) : (
        <button onClick={addGoal}>Thêm mục tiêu</button>
      )}
      <ul>
        {goals.map((goal) => {
          const progress = calculateProgress(goal);
          return (
            <li key={goal.id} style={{ margin: "10px 0" }}>
              {goal.subjectId
                ? `Môn: ${subjects.find((s) => s.id === goal.subjectId)?.name}`
                : "Tất cả các môn"}{" "}
              - Tháng: {goal.month} - Mục tiêu: {goal.goalHours} giờ - Đã học:{" "}
              {progress} giờ -{" "}
              {progress >= goal.goalHours ? (
                <span style={{ color: "green" }}>Đạt</span>
              ) : (
                <span style={{ color: "red" }}>Chưa đạt</span>
              )}
              <br />
              <button onClick={() => startEdit(goal)}>Sửa</button>{" "}
              <button onClick={() => deleteGoal(goal.id)}>Xóa</button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
ReactDOM.render(<App />, document.getElementById("root"));
