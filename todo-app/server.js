const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

// Rota principal que retorna HTML
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Todo App</title>
      </head>
      <body>
        <h1>Todo App - Running on Kubernetes! 🚀</h1>
        <p>This is my DevOps with Kubernetes project</p>
        <p>Exercise 1.8 completed!</p>
      </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});