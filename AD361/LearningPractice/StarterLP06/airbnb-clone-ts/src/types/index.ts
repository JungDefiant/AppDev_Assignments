export interface Rental {
  name: string;
  price: number;
  location: string;
  img: string;
  description: string;
}

export interface Booking {
  rental: string;
  date: string;
  guests: number | string;
}

export interface BookingFormData {
  rental: string;
  date: string;
  guests: number | string;
}
