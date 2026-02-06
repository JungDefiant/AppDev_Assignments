const http = require("http");
const fs = require("fs").promises;

const server = http.createServer((req, res) => {

  const { method, url } = req;
  
  if (method === 'GET' && url === '/') {
    fs.readFile(`${__dirname}/home.html`)
      .then((contents) => {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(contents);
      })
      .catch((error) => {
        res.writeHead(500);
        console.log(`Error: ${error}`);
        res.end('Internal Server Error');
        return;
      })
    
  }
  else if (method === 'GET' && url === '/about') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('About Section!\n');
  }
  else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
  }
});


server.listen(3000, "localhost", () => {
  console.log("Server is running!");
})
