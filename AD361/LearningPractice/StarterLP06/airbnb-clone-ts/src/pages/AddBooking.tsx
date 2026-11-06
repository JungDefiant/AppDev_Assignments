import { useState, ChangeEvent, FormEvent } from "react";
import { useBooking } from "@/context/BookingContext";
import { useRentals } from "@/context/RentalContext";
import type { BookingFormData } from "@/types";

const AddBooking = () => {
  const [formData, setFormData] = useState<BookingFormData>({
    rental: "",
    date: "",
    guests: 1,
  });

  const { addBooking } = useBooking();
  const { rentals } = useRentals();

  const handleChange = (
    e: ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addBooking(formData);
  };

  return (
    <div>
      <h2>Book a Stay</h2>
      <form onSubmit={handleSubmit} data-cy="booking-form">
        <label>
          Rental:
          <select name="rental" onChange={handleChange} value={formData.rental}>
            {rentals.map((r) => (
              <option value={r.name} key={r.name}>
                {r.name}
              </option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Date:
          <input
            name="date"
            type="date"
            required
            onChange={handleChange}
            value={formData.date}
          />
        </label>
        <br />
        <label>
          Number of Guests:
          <input
            name="guests"
            type="number"
            min="1"
            onChange={handleChange}
            value={formData.guests}
          />
        </label>
        <br />
        <button type="submit">Confirm Booking</button>
      </form>
    </div>
  );
};

export default AddBooking;
