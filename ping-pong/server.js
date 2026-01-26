const http = require('http');
const fs = require('fs');

const filePath = '/usr/src/app/files/pongs.txt';

// Lê o contador do arquivo ou começa em 0
let counter = 0;
try {
    const data = fs.readFileSync(filePath, 'utf8');
    counter = parseInt(data, 10) || 0;
    console.log(`Loaded counter from file: ${counter}`);
} catch (err) {
    console.log('No existing counter file, starting at 0');
}

const server = http.createServer((req, res) => {
    if (req.url === '/pingpong') {
        counter++;

        // Salva o contador no arquivo
        try {
            fs.writeFileSync(filePath, counter.toString());
            console.log(`Saved counter ${counter} to file`);
        } catch (writeErr) {
            console.error('Error writing file:', writeErr);
        }

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
