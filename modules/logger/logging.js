const winston = require("winston");
const logger = new winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: "/var/log/webapp/webapp.log" }),
  ],
});

module.exports = {
  logger,
};
