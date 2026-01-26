const express = require('express');
const fs = require('fs');
const path = require('path');
const https = require('https');

const app = express();
const PORT = process.env.PORT || 3000;

const IMAGE_DIR = '/usr/src/app/files';
const IMAGE_PATH = path.join(IMAGE_DIR, 'daily-image.jpg');
const TIMESTAMP_PATH = path.join(IMAGE_DIR, 'image-timestamp.txt');
const IMAGE_TTL = 10 * 60 * 1000; // 10 minutos em ms

// Garante que o diretório existe
if (!fs.existsSync(IMAGE_DIR)) {
  fs.mkdirSync(IMAGE_DIR, { recursive: true });
}

function isImageExpired() {
  try {
    if (!fs.existsSync(IMAGE_PATH) || !fs.existsSync(TIMESTAMP_PATH)) {
      return true;
    }
    const timestamp = parseInt(fs.readFileSync(TIMESTAMP_PATH, 'utf8'), 10);
    return Date.now() - timestamp > IMAGE_TTL;
  } catch (err) {
    return true;
  }
}

function downloadImage() {
  return new Promise((resolve, reject) => {
    console.log('Downloading new image from picsum.photos...');

    const request = https.get('https://picsum.photos/1200', (response) => {
      // Seguir redirect
      if (response.statusCode === 302 || response.statusCode === 301) {
        https.get(response.headers.location, (imgResponse) => {
          const fileStream = fs.createWriteStream(IMAGE_PATH);
          imgResponse.pipe(fileStream);
          fileStream.on('finish', () => {
            fileStream.close();
            fs.writeFileSync(TIMESTAMP_PATH, Date.now().toString());
            console.log('Image downloaded and cached');
            resolve();
          });
        }).on('error', reject);
      } else {
        const fileStream = fs.createWriteStream(IMAGE_PATH);
        response.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          fs.writeFileSync(TIMESTAMP_PATH, Date.now().toString());
          console.log('Image downloaded and cached');
          resolve();
        });
      }
    });

    request.on('error', reject);
  });
}

async function ensureImage() {
  if (isImageExpired()) {
    try {
      await downloadImage();
    } catch (err) {
      console.error('Error downloading image:', err.message);
    }
  }
}

// Servir a imagem
app.get('/image', async (req, res) => {
  await ensureImage();

  if (fs.existsSync(IMAGE_PATH)) {
    res.sendFile(IMAGE_PATH);
  } else {
    res.status(404).send('Image not found');
  }
});

// Todos hardcoded
const todos = [
  'Learn JavaScript',
  'Learn React',
  'Build a project'
];

// Rota principal
app.get('/', async (req, res) => {
  await ensureImage();

  const todoList = todos.map(todo => `<li>${todo}</li>`).join('\n        ');

  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Todo App</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          img { max-width: 600px; display: block; margin: 20px 0; }
          form { margin: 20px 0; }
          input[type="text"] { padding: 5px; width: 250px; }
          button { padding: 5px 15px; margin-left: 10px; }
          ul { list-style-type: disc; padding-left: 20px; }
          li { margin: 5px 0; }
        </style>
      </head>
      <body>
        <h1>The project App</h1>
        <img src="/image" alt="Random image" />
        <form>
          <input type="text" maxlength="140" placeholder="Enter todo (max 140 chars)" />
          <button type="submit">Create todo</button>
        </form>
        <ul>
        ${todoList}
        </ul>
        <p>DevOps with Kubernetes 2025</p>
      </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  ensureImage();
});
