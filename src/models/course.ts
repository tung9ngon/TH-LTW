import { useState, useEffect } from 'react';
import { Course, getCourses, saveCourses } from '../services/courseService';

export const useCourseModel = () => {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    setCourses(getCourses());
  }, []);

  const addCourse = (newCourse: Course) => {
    const updatedCourses = [...courses, newCourse];
    setCourses(updatedCourses);
    saveCourses(updatedCourses);
  };

  const updateCourse = (updatedCourse: Course) => {
    const updatedCourses = courses.map(course =>
      course.id === updatedCourse.id ? updatedCourse : course
    );
    setCourses(updatedCourses);
    saveCourses(updatedCourses);
  };

  const deleteCourse = (id: number) => {
    const updatedCourses = courses.filter(course => course.id !== id);
    setCourses(updatedCourses);
    saveCourses(updatedCourses);
  };

  return { courses, addCourse, updateCourse, deleteCourse };
};