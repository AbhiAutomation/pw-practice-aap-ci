let sharedValue = 0;

setTimeout(() => {
    sharedValue = 100;
  console.log(`PID: ${process.pid}, Updated Value: ${sharedValue}`);
}, 3000);

setInterval(() => {
    console.log(`PID: ${process.pid}, current  Value: ${sharedValue}`);

}, 1000);

/**
 * Run in two terminals node memory.js
 * Each Node.js process has its own heap memory

    This is exactly how Playwright workers behave.
 */
