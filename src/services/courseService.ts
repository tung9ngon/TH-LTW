export interface Course {
    id: number;
    name: string;
    instructor: string;
    students: number;
    status: string;
    description: string;
  }
  
  export const getCourses = (): Course[] => {
    return JSON.parse(localStorage.getItem("courses") || "[]");
  };
  
  export const saveCourses = (courses: Course[]) => {
    localStorage.setItem("courses", JSON.stringify(courses));
  };