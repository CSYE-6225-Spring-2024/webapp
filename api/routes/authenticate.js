var express = require("express");
var authenticate = require("../controllers/authenticate.js");
const router = express.Router();

router.route("/").post(authenticate.post);

router.route("/self").get(authenticate.get).put(authenticate.put);

module.exports = router;
