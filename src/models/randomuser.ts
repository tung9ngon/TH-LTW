// src/models/randomuser.ts
import { useState, useEffect } from 'react';

export default () => {
  const [data, setData] = useState<any[]>([]);

  const getDataUser = () => {
    const localData = JSON.parse(localStorage.getItem('data') || '[]');
    setData(localData);
  };

  useEffect(() => {
    getDataUser();
  }, []);

  return {
    data,
    getDataUser,
  };
};
