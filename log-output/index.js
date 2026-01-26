const http = require('http');
const fs = require('fs');

const logFilePath = '/usr/src/app/files/log.txt';
const pongsFilePath = '/usr/src/app/shared/pongs.txt';

const server = http.createServer((req, res) => {
  if (req.url === '/' || req.url === '/status') {
    try {
      const logContent = fs.readFileSync(logFilePath, 'utf8').trim();

      let pongs = 0;
      try {
        pongs = parseInt(fs.readFileSync(pongsFilePath, 'utf8'), 10) || 0;
      } catch (err) {
        console.log('Could not read pongs file:', err.message);
      }

      const response = `${logContent}\nPing / Pongs: ${pongs}`;
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end(response);
      console.log('Served log content with pongs');
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
