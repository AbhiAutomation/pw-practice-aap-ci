 let counter = 0;

 setInterval(() => {
   counter += 1;
   console.log(`PID: ${process.pid}, Counter: ${counter}`);
 },1000);

 /** Memory management 
  * Experiment 1: Same file, two terminals 
  * Observation	Meaning
    Different PID	Different OS process
    Counter starts at 1 in both	Memory is NOT shared
    Stopping one doesn’t stop other	Fully isolated processes
 */