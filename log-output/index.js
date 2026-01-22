const http = require('http');
const fs = require('fs');

const filePath = '/usr/src/app/files/log.txt';

const server = http.createServer((req, res) => {
  if (req.url === '/' || req.url === '/status') {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end(content);
      console.log('Served log content');
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Error reading log file');
      console.error('Error:', err);
    }
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Reader server running on port ${PORT}`);
});