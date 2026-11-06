import { useBooking } from "@/context/BookingContext";

export default function Bookings() {
  const { bookings } = useBooking();

  return (
    <>
      {bookings.map((booking, index) => (
        <p key={index}>
          Rental: {booking.rental} Date: {booking.date} Guests: {booking.guests}
        </p>
      ))}
    </>
  );
}
