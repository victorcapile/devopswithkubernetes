const { v4: uuidv4 } = require('uuid');

const randomString = uuidv4();

console.log('Application started. Random string:', randomString);

const printLog = () => {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp}: ${randomString}`);
};

printLog();

setInterval(printLog, 5000);

process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully');
  process.exit(0);
});
