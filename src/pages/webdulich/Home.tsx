import React, { useContext, useState } from 'react';
import { AppContext } from '../../components/context/AppContext';
import DestinationCard from '../../components/DestinationCard';
import FilterSortBar from '../../components/FilterSortBar';
import { Row, Col } from 'antd';

const Home: React.FC = () => {
  const { places, addToItinerary } = useContext(AppContext);
  const [filterType, setFilterType] = useState<string | null>(null);

  const filteredPlaces = filterType
    ? places.filter((p) => p.type === filterType)
    : places;

  return (
    <div>
      <h1>Khám phá điểm đến</h1>
      <FilterSortBar onFilterChange={setFilterType} />
      <Row gutter={[16, 16]}>
        {filteredPlaces.map((place) => (
          <Col xs={24} sm={12} md={8} key={place.id}>
            <DestinationCard place={place} onAdd={() => addToItinerary(place)} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Home;