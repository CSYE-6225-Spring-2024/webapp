var express = require("express");
var authenticate = require("../controllers/authenticate.js");
const router = express.Router();

router.route("/").post(authenticate.post).all(authenticate.all);

router.route("/verify").get(authenticate.verifyUser);

router
  .route("/self")
  .head(authenticate.head)
  .get(authenticate.get)
  .put(authenticate.put)
  .all(authenticate.all);

module.exports = router;
