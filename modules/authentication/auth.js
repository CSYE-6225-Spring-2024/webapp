const bcrypt = require("bcrypt");

async function hash_password(password) {
  const hashPwd = await bcrypt.hash(password, 7);
  return hashPwd;
}

async function compare_password(password, hash) {
  const result = await bcrypt.compare(password, hash);
  return result;
}

module.exports = { hash_password, compare_password };
