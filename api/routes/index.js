var healthz = require("./health.js");
var authenticate = require("./authenticate.js");

const routes = (app) => {
  app.use("/healthz", healthz);
  app.use("/v2/user", authenticate);
  app.all("/*", (req, res) => res.status(404).send());
};

module.exports = routes;
