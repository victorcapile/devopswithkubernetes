const http = require('http');

let counter = 0;

const server = http.createServer((req, res) => {
    if (req.url === '/pingpong') {
        counter++;
        const response = `pong ${counter}`;

        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(response);

        console.log(response);
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Ping-pong server running on port ${PORT}`);
});