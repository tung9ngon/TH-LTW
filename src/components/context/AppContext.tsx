import React, { createContext, useState } from 'react';
import { Place, Budget } from '../../services/Types/index';
import { mockPlaces } from '../../assets/mockData';

interface AppContextType {
  places: Place[];
  itinerary: Place[];
  budget: Budget;
  setBudget: React.Dispatch<React.SetStateAction<Budget>>;
  addToItinerary: (place: Place) => void;
  removeFromItinerary: (id: number) => void;
}

export const AppContext = createContext<AppContextType>({} as AppContextType);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [places] = useState<Place[]>(mockPlaces);
  const [itinerary, setItinerary] = useState<Place[]>([]);
  const [budget, setBudget] = useState<Budget>({
    total: 10000000,
    food: 3000000,
    transport: 2000000,
    hotel: 3000000,
  });

  const addToItinerary = (place: Place) => {
    setItinerary([...itinerary, place]);
  };

  const removeFromItinerary = (id: number) => {
    setItinerary(itinerary.filter(p => p.id !== id));
  };

  return (
    <AppContext.Provider value={{
      places, itinerary, budget, setBudget, addToItinerary, removeFromItinerary
    }}>
      {children}
    </AppContext.Provider>
  );
};