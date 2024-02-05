const { User } = require("../models/user.js");
const jsonValidator = require("jsonschema");
const userSchema = require("../../modules/schema/user.json");

const {
  hash_password,
  compare_password,
} = require("../../modules/authentication/auth.js");

async function getAuthUsrnamePwd(auth_header) {
  var encodedUsrPwd = auth_header.split(" ")[1];
  var decodedUsrPwd = Buffer.from(encodedUsrPwd, "base64").toString();
  var username = decodedUsrPwd.split(":")[0];
  var password = decodedUsrPwd.split(":")[1];
  return { username, password };
}

const get = async (req, res) => {
  const auth_check = req.headers.authorization;
  if (auth_check && auth_check.includes("Basic")) {
    const { username, password } = await getAuthUsrnamePwd(auth_check);
    const userDetail = await User.findOne({
      where: { username: username },
    });
    const isPwdExists = userDetail
      ? await compare_password(password, userDetail.password)
      : false;

    if (isPwdExists) {
      const {
        dataValues: { password, ...userWithoutPwd },
      } = userDetail;
      res.status(200).send(userWithoutPwd);
      return;
    }
  }
  res.status(401).send();
  return;
};

const post = async (req, res) => {
  const contentType = req.get("Content-Type");
  if (contentType === "application/json") {
    const data = jsonValidator.validate(req.body, userSchema);
    if (data.valid != true) {
      res.status(400).send();
      return;
    }
    try {
      const hashed_pwd = await hash_password(req.body.password);
      const new_user = await User.create({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        username: req.body.username,
        password: hashed_pwd,
      });
      const {
        dataValues: { password, ...userWithoutPwd },
      } = new_user;
      res.status(201).send(userWithoutPwd);
    } catch (error) {
      res.status(400).send();
    }
  } else {
    res.status(400).send();
  }
};

const put = async (req, res) => {
  const auth_check = req.headers.authorization;
  if (auth_check && auth_check.includes("Basic")) {
    const { username, password } = await getAuthUsrnamePwd(auth_check);
    const userDetail = await User.findOne({
      where: { username: username },
    });
    const isPwdExist = userDetail
      ? await compare_password(password, userDetail.password)
      : false;

    if (isPwdExist) {
      const contentType = req.get("Content-Type");
      if (contentType === "application/json") {
        const data = jsonValidator.validate(req.body, userSchema);
        if (data.valid == true && username === req.body.username) {
          const hashed_pwd = await hash_password(req.body.password);
          await User.update(
            {
              first_name: req.body.first_name,
              last_name: req.body.last_name,
              username: username,
              password: hashed_pwd,
            },
            {
              where: {
                username: username,
              },
            }
          );
          res.status(204).send();
        }
      }
      res.status(400).send();
      return;
    }
  }
  res.status(401).send();
  return;
};

module.exports = { get, post, put };
