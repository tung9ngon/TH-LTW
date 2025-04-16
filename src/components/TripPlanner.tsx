import React, { useEffect, useState } from 'react';
import { List, Button } from 'antd';
import { Place } from '../services/Types/index';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const LOCAL_KEY = 'itinerary_places';

const DraggableItem = ({ item, index, moveItem, onRemove }: any) => {
  const [, drag] = useDrag({ type: 'PLACE', item: { index } });
  const [, drop] = useDrop({
    accept: 'PLACE',
    hover: (dragged: any) => {
      if (dragged.index !== index) {
        moveItem(dragged.index, index);
        dragged.index = index;
      }
    },
  });

  return (
    <div ref={(node) => drag(drop(node))}>
      Ngày {index + 1}: {item.name}
      <Button danger style={{ float: 'right' }} onClick={() => onRemove(item.id)}>Xóa</Button>
    </div>
  );
};

const TripPlanner: React.FC = () => {
  const [itinerary, setItinerary] = useState<Place[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_KEY);
    if (stored) {
      try {
        setItinerary(JSON.parse(stored));
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(itinerary));
  }, [itinerary]);

  const moveItem = (from: number, to: number) => {
    const updated = [...itinerary];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    setItinerary(updated);
  };

  const removeFromItinerary = (id: number) => {
    const updated = itinerary.filter(p => p.id !== id);
    setItinerary(updated);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <List
        bordered
        dataSource={itinerary}
        renderItem={(item, index) => (
          <List.Item>
            <DraggableItem item={item} index={index} moveItem={moveItem} onRemove={removeFromItinerary} />
          </List.Item>
        )}
      />
    </DndProvider>
  );
};

export default TripPlanner;