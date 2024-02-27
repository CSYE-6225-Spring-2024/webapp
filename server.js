var app = require("./api/app.js");
const server = app.listen(process.env.WEB_PORT || 8080, function () {
  console.log("Listening on port:", process.env.WEB_PORT);
});

module.exports = { server, app };
