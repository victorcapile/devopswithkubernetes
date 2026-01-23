const fs = require('fs');

// gera string aleatória ao iniciar
const randomString = Math.random().toString(36).substring(7);
const filePath = '/usr/src/app/files/log.txt';

console.log(`Writer started with random string: ${randomString}`);

// escreve no arquivo a cada 5s
setInterval(() => {
  const timestamp = new Date().toISOString();
  const logLine = `${timestamp}: ${randomString}\n`;
  
  fs.writeFileSync(filePath, logLine);
  console.log(`Written: ${logLine.trim()}`);
}, 5000);

// Mantém o processo vivo
process.on('SIGTERM', () => {
  console.log('Writer shutting down...');
  process.exit(0);
});