var express = require("express");
var routes = require("./routes/index.js");
const bodyParser = require("body-parser");

const app = express();
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

routes(app);

module.exports = app;
