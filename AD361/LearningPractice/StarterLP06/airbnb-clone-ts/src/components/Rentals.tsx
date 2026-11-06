import { Grid } from "@mui/material";
import RentalCard from "./RentalCard";
import type { Rental } from "@/types";

interface RentalsProps {
  rentals: Rental[];
}

const Rentals = ({ rentals }: RentalsProps) => {
  return (
    <Grid container spacing={4}>
      {rentals.map((rental, index) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
          <RentalCard rental={rental} />
        </Grid>
      ))}
    </Grid>
  );
};

export default Rentals;
