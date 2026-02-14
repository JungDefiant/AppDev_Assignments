const express = require("express");
const { dogFacts } = require("./dog_facts-1");
const app = express();

app.get('/facts', (req, res) => {
  res.send(JSON.stringify({"facts": [dogFacts.map(x => `"${x}",`)]}));
})

app.get('/facts/:number', (req, res) => {
  const number = parseInt(req.params.number);
  if(number < 1 || (number != 0 && !number))
  {
    res.status(404).send('Cannot find the page you are looking for!');
  }

  res.send(JSON.stringify({"facts": [dogFacts.slice(0, req.params.number).map((x,ind) => `"${x}"`)]}));
});

app.use((req, res, next) => {
  res.status(404).send('Cannot find the page you are looking for!');
});

app.listen(3000, (error) => {
  console.log("Server started!");
});

module.exports = { app };
