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