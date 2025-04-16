import { Place } from '../services/Types/index';

const LOCAL_STORAGE_KEY = 'places_data';

export const mockPlaces = (): Place[] => {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.error('Lỗi khi parse localStorage:', error);
    }
  }

  // Fallback dữ liệu mặc định nếu localStorage chưa có gì hoặc bị lỗi
  return [
    {
      id: 1,
      name: 'Vịnh Hạ Long',
      image: '/assets/halong.jpg',
      type: 'biển',
      price: 3000000,
      rating: 4.8,
    },
    {
      id: 2,
      name: 'Sapa',
      image: '/assets/sapa.jpg',
      type: 'núi',
      price: 2500000,
      rating: 4.7,
    },
    {
      id: 3,
      name: 'Hà Nội',
      image: '/assets/hanoi.jpg',
      type: 'thành phố',
      price: 2000000,
      rating: 4.5,
    },
  ];
};