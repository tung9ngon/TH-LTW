import React from 'react';
import { Card, Rate } from 'antd';
import { Place } from '../services/Types/index';

const ITINERARY_KEY = 'itinerary_places';

interface Props {
  place: Place;
  onAdd?: () => void;
}

const DestinationCard: React.FC<Props> = ({ place, onAdd }) => {
  const handleAddToItinerary = () => {
    const stored = localStorage.getItem(ITINERARY_KEY);
    let current: Place[] = [];
    if (stored) {
      try {
        current = JSON.parse(stored);
      } catch {}
    }
    const exists = current.find(p => p.id === place.id);
    if (!exists) {
      const updated = [...current, place];
      localStorage.setItem(ITINERARY_KEY, JSON.stringify(updated));
      if (onAdd) onAdd();
    }
  };

  return (
    <Card
      hoverable
      cover={<img alt={place.name} src={place.image} />}
      actions={[<a onClick={handleAddToItinerary}>Thêm vào lịch trình</a>]}
    >
      <Card.Meta title={place.name} description={`Giá: ${place.price.toLocaleString()} VND`} />
      <Rate disabled defaultValue={place.rating} />
    </Card>
  );
};

export default DestinationCard;