console.log(`Started PID: ${process.pid}`);

setTimeout(() => {
  throw new Error("Boom 💥");
}, 3000);

setInterval(() => {
  console.log(`PID: ${process.pid} still running`);
}, 1000);
/**
 * Run in two terminals node crash.js
 * Each Node.js process has its own heap memory

    This is exactly how Playwright workers behave.
 */