import React, { createContext, useState, useContext, ReactNode } from "react";
import type { Booking } from "@/types";

interface BookingContextValue {
  bookings: Booking[];
  addBooking: (newBooking: Booking) => void;
}

const BookingContext = createContext<BookingContextValue | undefined>(
  undefined
);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>([]);

  const addBooking = (newBooking: Booking) => {
    setBookings((prev) => [...prev, newBooking]);
  };

  return (
    <BookingContext.Provider value={{ bookings, addBooking }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking(): BookingContextValue {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
}
