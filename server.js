var app = require("./api/app.js");
const server = app.listen(8080, function () {
  console.log("Listening on port 8080");
});

module.exports = { server, app };
