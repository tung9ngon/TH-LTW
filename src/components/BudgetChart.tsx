import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { notification, InputNumber, Button } from 'antd';

// Define PlaceType and Place as per your requirements
export type PlaceType = 'biển' | 'núi' | 'thành phố';

export interface Place {
  id: number;
  name: string;
  image: string;
  type: PlaceType;
  price: number;
  rating: number;
}

export interface Budget {
  total: number;
  food: number;
  transport: number;
  hotel: number;
}

Chart.register(ArcElement, Tooltip, Legend);

const LOCAL_KEY_BUDGET = 'travel_budget';

const BudgetChart: React.FC = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [totalBudget, setTotalBudget] = useState<number>(() => {
    const saved = localStorage.getItem(LOCAL_KEY_BUDGET);
    return saved ? parseInt(saved) : 10000000;
  });

  // Lấy dữ liệu từ localStorage key "itinerary_places"
  useEffect(() => {
    const stored = localStorage.getItem('itinerary_places');
    if (stored) {
      try {
        const parsed: Place[] = JSON.parse(stored);
        setPlaces(parsed);
      } catch (err) {
        console.error('Lỗi khi parse dữ liệu itinerary_places:', err);
      }
    }
  }, []);

  // Tính tổng chi phí mà không bao gồm transport và hotel
  const totalSpent = places.reduce((sum, place) => {
    // Ensure we are only adding prices for valid places (biển, núi, thành phố)
    if (place.type !== 'biển' && place.type !== 'núi' && place.type !== 'thành phố') return sum;
    return sum + (place.price || 0);
  }, 0);

  const data = {
    labels: places
      .filter(place => place.type === 'biển' || place.type === 'núi' || place.type === 'thành phố')
      .map(p => p.name),
    datasets: [{
      data: places
        .filter(place => place.type === 'biển' || place.type === 'núi' || place.type === 'thành phố')
        .map(p => p.price),
      backgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#4BC0C0',
        '#9966FF',
        '#FF9F40'
      ],
    }],
  };

  const handleCheck = () => {
    if (totalSpent > totalBudget) {
      notification.error({
        message: 'Vượt ngân sách!',
        description: `Chi phí hiện tại (${totalSpent.toLocaleString()} VND) đã vượt ngân sách (${totalBudget.toLocaleString()} VND).`,
      });
    } else {
      notification.success({
        message: 'Ngân sách ổn định!',
        description: `Chi phí hiện tại là ${totalSpent.toLocaleString()} VND.`,
      });
    }
  };

  const handleBudgetChange = (val: number | null) => {
    const newBudget = val || 0;
    setTotalBudget(newBudget);
    localStorage.setItem(LOCAL_KEY_BUDGET, newBudget.toString());
  };

  return (
    <>
      <div style={{ marginBottom: 20 }}>
        <p><strong>Tổng ngân sách:</strong></p>
        <InputNumber
          value={totalBudget}
          onChange={handleBudgetChange}
          formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={value => parseInt(value?.replace(/,/g, '') || '0')}
        />
      </div>
      <Button type="primary" onClick={handleCheck}>Kiểm tra</Button>
      <div style={{ maxWidth: 400, marginTop: 30 }}>
        <Doughnut data={data} />
      </div>
    </>
  );
};

export default BudgetChart;