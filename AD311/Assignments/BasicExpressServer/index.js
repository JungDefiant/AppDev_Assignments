const express = require("express");
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.get('/about', (req, res) => {
  res.send('About me');
});

app.get('/foo', (req, res, next) => {
  const rand = Math.round(Math.random(2));
  if (rand) {
    res.send('sometimes this');
  }
  else {
    next();
  }
});

app.get('/foo', (req, res) => {
  res.send('and sometimes that');
})

app.get('/user{name}', (req, res) => {
  res.send("USERNAME");
});

app.get('/user/:username', (req, res) => {
  res.send(`Hello, ${req.params.username}`);
});

app.get('/userquery', (req, res) => {
  if (req.query.username) {
    res.send(`Hello, ${req.query.username} (user query)`);
  }
});

app.use((req, res, next) => {
  res.status(404).send('Cannot find the page you are looking for!');
})

app.listen(3000, (error) => {
  console.log("Server started!");
});