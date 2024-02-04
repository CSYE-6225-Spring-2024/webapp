var express = require("express");
var healthzController = require("../controllers/health.js");

const router = express.Router();

router
  .route("/")
  .head(healthzController.head)
  .get(healthzController.get)
  .all(healthzController.all);

module.exports = router;
