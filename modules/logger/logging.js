const winston = require("winston");
const logger = new winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports:
    process.env.NODE_ENV == "PRODUCTION"
      ? [
          new winston.transports.File({
            filename: "/var/log/webapp/webapp.log",
          }),
        ]
      : [new winston.transports.Console()],
});

module.exports = {
  logger,
};
