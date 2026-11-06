// The layout is a special component used for headers, navigation, footers etc.
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import "@/styles/nav.css";
import { HeaderBanner } from "./HeaderBanner";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div>
      <HeaderBanner />
      <nav className="navbar">
        <Link to="/" className="nav-link">
          Home
        </Link>
        <Link to="/bookings/add" className="nav-link">
          Add Booking
        </Link>
        <Link to="/bookings" className="nav-link">
          Bookings
        </Link>
      </nav>
      <main>{children}</main>
    </div>
  );
}
