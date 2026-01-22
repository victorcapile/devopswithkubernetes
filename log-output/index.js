const http = require('http');

// Gera string aleatória no startup
const randomString = Math.random().toString(36).substring(7);

const server = http.createServer((req, res) => {
  // Responde tanto em / quanto em /log-output
  if (req.url === '/status' || req.url === '/' || req.url === '/log-output') {
    const timestamp = new Date().toISOString();
    const status = `${timestamp}: ${randomString}`;
    
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(status);
    
    console.log(status);
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Random string generated: ${randomString}`);
});