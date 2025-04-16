import React from 'react';
import { Select } from 'antd';

interface Props {
  onFilterChange: (value: string) => void;
}

const FilterSortBar: React.FC<Props> = ({ onFilterChange }) => {
  return (
    <Select
      placeholder="Lọc theo loại hình"
      style={{ width: 200, marginBottom: 20 }}
      onChange={onFilterChange}
      allowClear
    >
      <Select.Option value="biển">Biển</Select.Option>
      <Select.Option value="núi">Núi</Select.Option>
      <Select.Option value="thành phố">Thành phố</Select.Option>
    </Select>
  );
};

export default FilterSortBar;