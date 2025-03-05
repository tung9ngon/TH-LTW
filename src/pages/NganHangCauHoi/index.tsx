import { useState, useEffect } from "react";
import "../NganHangCauHoi/index.css";

interface Subject {
  id: string;
  name: string;
  credits: number;
  knowledgeBlocks: string[];
}

interface Question {
  id: string;
  subjectId: string;
  content: string;
  difficulty: "Dễ" | "Trung bình" | "Khó" | "Rất khó";
  knowledgeBlock: string;
}

interface Exam {
  id: string;
  subjectId: string;
  questions: Question[];
}

export default function QuestionBankManager() {
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>(JSON.parse(localStorage.getItem("subjects") || "[]"));
  const [questions, setQuestions] = useState<Question[]>(JSON.parse(localStorage.getItem("questions") || "[]"));
  const [exams, setExams] = useState<Exam[]>(JSON.parse(localStorage.getItem("exams") || "[]"));
  const [subjectName, setSubjectName] = useState("");
  const [questionContent, setQuestionContent] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("Dễ");

  useEffect(() => {
    localStorage.setItem("subjects", JSON.stringify(subjects));
    localStorage.setItem("questions", JSON.stringify(questions));
    localStorage.setItem("exams", JSON.stringify(exams));
  }, [subjects, questions, exams]);

  const addSubject = () => {
    if (!subjectName.trim()) {
      alert("Tên môn học không được để trống!");
      return;
    }
    if (subjects.some((s) => s.name.toLowerCase() === subjectName.toLowerCase())) {
      alert("Môn học đã tồn tại!");
      return;
    }
    setSubjects([...subjects, { id: Date.now().toString(), name: subjectName, credits: 3, knowledgeBlocks: ["Chủ đề 1", "Chủ đề 2"] }]);
    setSubjectName("");
  };

  const addQuestion = () => {
    if (!selectedSubject) {
      alert("Vui lòng chọn môn học!");
      return;
    }
    if (!questionContent.trim()) {
      alert("Nội dung câu hỏi không được để trống!");
      return;
    }
    setQuestions([...questions, { id: Date.now().toString(), subjectId: selectedSubject, content: questionContent, difficulty: selectedDifficulty as Question["difficulty"], knowledgeBlock: "Chủ đề 1" }]);
    setQuestionContent("");
  };

  const createExam = () => {
    if (selectedQuestions.length === 0) {
      alert("Vui lòng chọn ít nhất một câu hỏi để tạo đề thi.");
      return;
    }
    const selectedSubjectId = questions.find((q) => selectedQuestions.includes(q.id))?.subjectId;
    const newExam = {
      id: Date.now().toString(),
      subjectId: selectedSubjectId || "",
      questions: questions.filter((q) => selectedQuestions.includes(q.id)),
    };
    setExams([...exams, newExam]);
    setSelectedQuestions([]);
  };

  return (
    <div className="container">
      <h1>Quản lý ngân hàng câu hỏi</h1>
      
      <div className="section">
        <h2>Thêm Môn Học</h2>
        <input type="text" value={subjectName} onChange={(e) => setSubjectName(e.target.value)} placeholder="Tên môn học" />
        <button onClick={addSubject}>Thêm</button>
      </div>

      <div className="section">
        <h2>Thêm Câu Hỏi</h2>
        <select onChange={(e) => setSelectedSubject(e.target.value)}>
          <option value="">Chọn môn học</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
        <input type="text" value={questionContent} onChange={(e) => setQuestionContent(e.target.value)} placeholder="Nội dung câu hỏi" />
        <select onChange={(e) => setSelectedDifficulty(e.target.value)}>
          <option value="Dễ">Dễ</option>
          <option value="Trung bình">Trung bình</option>
          <option value="Khó">Khó</option>
          <option value="Rất khó">Rất khó</option>
        </select>
        <button onClick={addQuestion}>Thêm</button>
      </div>

      <div className="section">
        <h2>Danh Sách Câu Hỏi</h2>
        {subjects.map((subject) => (
          <div key={subject.id} className="subject">
            <h3>{subject.name}</h3>
            <ul>
              {questions.filter((q) => q.subjectId === subject.id).map((q) => (
                <li key={q.id}>
                  <input className="small-checkbox" type="checkbox" checked={selectedQuestions.includes(q.id)} onChange={() => setSelectedQuestions(selectedQuestions.includes(q.id) ? selectedQuestions.filter(qid => qid !== q.id) : [...selectedQuestions, q.id])} />
                  {q.content} ({q.difficulty})
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="section">
        <h2>Tạo Đề Thi</h2>
        <button onClick={createExam}>Tạo đề thi</button>
      </div>

      <div className="section">
        <h2>Danh Sách Đề Thi</h2>
        {exams.map((exam) => (
          <div key={exam.id} className="exam">
            <h3>{subjects.find((s) => s.id === exam.subjectId)?.name}</h3>
            <ul>
              {exam.questions.map((q) => (
                <li key={q.id}>{q.content} ({q.difficulty})</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}