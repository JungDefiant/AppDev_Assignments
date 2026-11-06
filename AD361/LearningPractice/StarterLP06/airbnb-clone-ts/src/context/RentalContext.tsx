import React, { createContext, useState, useContext, ReactNode } from "react";
import type { Rental } from "@/types";

interface RentalsContextValue {
  rentals: Rental[];
  updateRentals: (newRentals: Rental[]) => void;
}

// Create a context for Rentals
const RentalsContext = createContext<RentalsContextValue | undefined>(
  undefined
);

// Create a provider component to wrap the app
export const RentalsProvider = ({ children }: { children: ReactNode }) => {
  const [rentals, setRentals] = useState<Rental[]>([]);

  const updateRentals = (newRentals: Rental[]) => {
    setRentals(newRentals);
  };

  return (
    <RentalsContext.Provider value={{ rentals, updateRentals }}>
      {children}
    </RentalsContext.Provider>
  );
};

// Custom hook to access the Rentals context
export const useRentals = (): RentalsContextValue => {
  const context = useContext(RentalsContext);
  if (!context) {
    throw new Error("useRentals must be used within a RentalsProvider");
  }
  return context;
};
