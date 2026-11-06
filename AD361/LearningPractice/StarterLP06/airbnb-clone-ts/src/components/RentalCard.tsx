import {
  Typography,
  Button,
  ButtonGroup,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShareIcon from "@mui/icons-material/Share";
import type { Rental } from "@/types";

interface RentalCardProps {
  rental: Rental;
}

const RentalCard = ({
  rental: { name, price, location, img, description },
}: RentalCardProps) => {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardHeader title={name} subheader={location} />
      <CardMedia component="img" height="180" image={img} alt={name} />
      <CardContent>
        <Typography variant="body1" noWrap>
          ${price} / night
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          {description}
        </Typography>
      </CardContent>
      <CardActions
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <ButtonGroup size="small" color="secondary">
          <Button>More</Button>
          <Button>Save</Button>
        </ButtonGroup>
        <div>
          <FavoriteBorderIcon />
          <ShareIcon />
        </div>
      </CardActions>
    </Card>
  );
};

export default RentalCard;
