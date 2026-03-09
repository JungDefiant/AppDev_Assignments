import recipes from "./recipes.json";
import { Card, CardContent, CardMedia, Grid, List, ListItem, Typography } from '@mui/material';

export default function RecipeGallery()
{
  return (
  <Grid container gap={8}>
    {recipes.map((val) => {
      return (
        <Card key={val.id} sx={{width: 400}}>
          <CardContent>
            <Typography variant="h4" textAlign={"left"}>{val.title}</Typography>
            <Typography variant="h5" textAlign={"left"}>Ingredients</Typography>
            <List>
            {val.ingredients.map((ing) => <ListItem>- {ing}</ListItem>)}
            </List>
            <CardMedia image={val.image} sx={{height: 120}} />
          </CardContent>
        </Card>
      );
    })}
  </Grid>);
}