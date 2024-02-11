var app = require("./api/app.js");
const server = app.listen(8080, function () {
  console.log("Listening on port 8080");
});

module.exports = { server, app };

async function syncing(req, res) {
  try {
    await User.sync({ force: true });
  } catch (err) {
    console.error("Error syncing User Model");
  }
}
