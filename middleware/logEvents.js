const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");
const { v4: uuid } = require("uuid");
const { format } = require("date-fns");
const logEvents = async (message, logFile) => {
  const date = `${format(new Date(), "yyyyMMdd\tHH:mm:ss")}`;
  const logItem = `${date}\t${uuid()}\t${message}\n`;
  console.log("logitem", logItem);
  try {
    if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
      await fsPromises.mkdir(path.join(__dirname, "..", "logs"));
    }
    //e
    await fsPromises.appendFile(
      path.join(__dirname, "..", "logs", logFile),
      logItem
    );
  } catch (err) {
    console.log(err);
  }
};
const logger = (req, res, next) => {
  logEvents(
    `${req.method} \t\t ${req.headers.origin} ${req.url}`,
    "reqLog.txt"
  );
  console.log(`${req.method} \t ${req.path}`);
  next();
};
module.exports = { logger, logEvents };
