```js
// Import required core Node.js modules
const fs = require("fs"); // File System module (for writing logs to a file)
const os = require("os"); // OS module (for system info like memory usage)
const EventEmitter = require("events"); // Events module (for custom event handling)

// Define a Logger class that extends EventEmitter
// This means Logger inherits all event-handling methods like `.on()`, `.emit()`
class Logger extends EventEmitter {
  // Custom log method
  log(message) {
    // Emit a custom event called "message"
    // Passing an object { message } as event data
    this.emit("message", { message });
  }
}

// Create a new Logger instance
const logger = new Logger();

// Log file path where events will be saved
const logFile = "./eventLog.txt";

// Function to handle logging event data to a file
const logToFile = (event) => {
  // Format the log message with timestamp + actual event message
  const logMessage = `${new Date().toISOString()} - ${event.message} \n`;

  // Append the log message to the log file synchronously
  // If the file doesn’t exist, it will be created
  fs.appendFileSync(logFile, logMessage);
};

// Register a listener for the "message" event
// Whenever "message" is emitted, logToFile will be executed
logger.on("message", logToFile);

// Emit a "message" event every 3 seconds with current memory usage info
setInterval(() => {
  // Calculate percentage of free memory (free / total * 100)
  const memoryUsage = (os.freemem() / os.totalmem()) * 100;

  // Emit a custom event with formatted memory usage (2 decimal places)
  logger.log(`Current memory usage : ${memoryUsage.toFixed(2)}%`);
}, 3000);

// Emit some initial log events at startup
logger.log("Application Started");
logger.log("Application event occurred!");
```
