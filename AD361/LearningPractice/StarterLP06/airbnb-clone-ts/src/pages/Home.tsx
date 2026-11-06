// Client pages render in the browser.
// This is a plain client-side React app (no server-side rendering).
// Routing is handled by react-router-dom in App.tsx instead of Next.js's
// file-based routing.

import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Container } from "@mui/material";
import { blue, orange } from "@mui/material/colors";
import { useState, useEffect, ChangeEvent } from "react";
import Rentals from "@/components/Rentals";
import { useRentals } from "@/context/RentalContext";
import type { Rental } from "@/types";

const theme = createTheme({
  typography: {
    fontFamily: '"Cabin", "Helvetica", "Arial", sans-serif',
  },
  palette: {
    primary: blue,
    secondary: orange,
  },
});

function Home() {
  const [searchRentals, setSearch] = useState<Rental[]>([]);

  const { updateRentals, rentals } = useRentals();

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    const res = await fetch(`http://localhost:3001/rentals`);
    const data: Rental[] = await res.json();
    setSearch(data);
    updateRentals(data);
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const filtered = rentals.filter((r) =>
      r.name.toLowerCase().includes(e.target.value.toLowerCase()),
    );
    setSearch(filtered);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="xl" className="App">
        <input
          type="text"
          placeholder="Search..."
          style={{ height: "30px", margin: "10px" }}
          onChange={handleSearch}
        />

        <Rentals rentals={searchRentals} />
      </Container>
    </ThemeProvider>
  );
}

export default Home;
