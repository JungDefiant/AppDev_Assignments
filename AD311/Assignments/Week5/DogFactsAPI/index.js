const express = require("express");
const dogFacts = require("./dog_facts-1");
const app = express();

app.get('/facts', (req, res) => {
  res.send(`{
      "facts": [${dogFacts.default.map(x => `${x}`)}]
    }`);
})

app.get('/facts/:number', (req, res) => {
  res.send(`{
      "facts": [${dogFacts.default.slice(0, req.params.number).map((x,ind) => `${x}`)}]
    }`);
});

app.use((req, res, next) => {
  res.status(404).send('Cannot find the page you are looking for!');
});

app.listen(3000, (error) => {
  console.log("Server started!");
});
