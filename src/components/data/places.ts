import { Place } from '../../services/Types/index';

export const getLocalPlaces = (): Place[] => {
  const stored = localStorage.getItem('admin_places');
  try {
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};