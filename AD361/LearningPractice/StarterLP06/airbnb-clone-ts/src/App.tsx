import { Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import AddBooking from "@/pages/AddBooking";
import Bookings from "@/pages/Bookings";
import { RentalsProvider } from "@/context/RentalContext";
import { BookingProvider } from "@/context/BookingContext";

function App() {
  return (
    <RentalsProvider>
      <BookingProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/bookings/add" element={<AddBooking />} />
          </Routes>
        </Layout>
      </BookingProvider>
    </RentalsProvider>
  );
}

export default App;
