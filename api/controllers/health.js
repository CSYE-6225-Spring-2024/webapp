const { sq } = require("../../modules/database/connection.js");
const { logger } = require("../../modules/logger/logging.js");

const head = async (req, res) => {
  res.status(405).send();
};

const get = async (req, res) => {
  const contenTypeLen = req.get("content-type")
    ? req.get("content-type").length
    : 0;
  if (contenTypeLen === 0 && Object.keys(req.query).length == 0) {
    sq.authenticate()
      .then(() => {
        res.send();
        logger.info("Healthz Check Successful");
      })
      .catch(() => {
        res.status(503).send();
        logger.info("Healthz Check Unsuccessful");
      });
  } else {
    res.status(400).send();
    logger.info("Healthz: Bad Request");
  }
};

const all = async (req, res) => {
  res.status(405).send();
};

module.exports = { get, head, all };
