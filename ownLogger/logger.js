const fs = require("fs");
const os = require("os");
const EvenetEmitter = require("events");

class Logger extends EvenetEmitter {
  log(message) {
    this.emit("message", { message });
  }
}

const logger = new Logger();
const logFile = "./eventLog.txt";

const logToFile = (event) => {
  const logMessage = `${new Date().toISOString()} - ${event.message}`;
  fs.appendFileSync(logFile, logMessage);
};

logger.on("message", logToFile);

setInterval(() => {
  const memoryUsage = (os.freemem() / os.totalmem()) * 100;
  logger.log(`Current memory usage : ${memoryUsage.toFixed(2)}%`);
}, 3000);

logger.log("Application Started");
logger.log("Application event occured!");
