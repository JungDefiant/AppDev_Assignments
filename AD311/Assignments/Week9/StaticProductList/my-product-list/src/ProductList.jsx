import products from "./products.json";
import { Card, CardContent, CardMedia, Grid, List, ListItem, Typography } from '@mui/material';

export default function ProductList()
{
  console.log(products);
  return (
  <Grid container gap={4} justifyContent={"center"}>
    {products.map((val) => {
      return (
        <Card key={val.id} sx={{width: 400}}>
          <CardContent>
            {val.name && <Typography textAlign={"left"}><strong>Product:</strong> {val.name}</Typography>}
            {val.description && <Typography textAlign={"left"}><strong>Description:</strong> {val.description}</Typography>}
            {val.price && <Typography textAlign={"left"}><strong>Price:</strong> ${val.price}</Typography>}
          </CardContent>
        </Card>
      );
    })}
  </Grid>);
}