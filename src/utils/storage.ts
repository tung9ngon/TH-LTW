import { Task } from '../services/Types/in';

const TASK_KEY = 'tasks';
const USER_KEY = 'currentUser';

export const saveTasks = (tasks: Task[]) => {
  localStorage.setItem(TASK_KEY, JSON.stringify(tasks));
};

export const loadTasks = (): Task[] => {
  try {
    const data = localStorage.getItem('tasks');
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Failed to load tasks:", e);
    return [];
  }
};


export const saveUser = (user: string) => {
  localStorage.setItem(USER_KEY, user);
};

export const loadUser = (): string | null => {
  return localStorage.getItem(USER_KEY);
};