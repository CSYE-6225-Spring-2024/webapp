var express = require("express");
var routes = require("./routes/index.js");
const bodyParser = require("body-parser");
const { syncDatabase } = require("../api/models/user.js");

const app = express();

//Sync models with database
syncDatabase();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use((req, res, next) => {
  res.set({
    "Cache-Control": "no-cache, no-store",
    "X-Content-Type-Options": "nosniff",
  });
  next();
});

app.use((req, res, next) => {
  const contentType = req.get("Content-Type");
  if (contentType && contentType !== "application/json") {
    res.status(400).send();
    return;
  }

  if (
    !req.originalUrl.startsWith("/v2/user/verify") &&
    Object.keys(req.query).length != 0
  ) {
    res.status(400).send();
    return;
  }
  next();
});

app.use((req, res, next) => {
  routes(app);
  next();
});

module.exports = app;
