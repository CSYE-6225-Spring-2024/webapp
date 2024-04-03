const { User, UserVerified } = require("../models/user.js");
const updateSchema = require("../../modules/schema/update_user.json");
const jsonValidator = require("jsonschema");
const userSchema = require("../../modules/schema/user.json");
const { checkConnection } = require("../../modules/database/connection.js");
const { logger } = require("../../modules/logger/logging.js");
const { publishMesssgePubSub } = require("../services/pubsub-gcp.js");

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

const head = async (req, res) => {
  logger.warn("Request type NOT allowed", { method: req.method });
  res.status(405).send();
};

const get = async (req, res) => {
  try {
    if (Object.keys(req.body).length > 0) {
      res.status(400).send();
      logger.info("GET REQ: Request body is not empty");
      return;
    }
    await checkConnection(req, res);
    const auth_check = req.headers.authorization;
    if (auth_check && auth_check.includes("Basic")) {
      const { username, password } = await getAuthUsrnamePwd(auth_check);
      const userDetail = await User.findOne({
        where: { username: username },
      });
      if (process.env.NODE_ENV == "PRODUCTION") {
        const isVerified = await checkVerified(userDetail);
        if (!isVerified) {
          res.status(403).send();
          logger.info("GET REQ: Request blocked as user not verified");
          return;
        }
      }
      const isPwdExists = userDetail
        ? await compare_password(password, userDetail.password)
        : false;

      if (isPwdExists) {
        const {
          dataValues: { verify, password, ...userWithoutPwd },
        } = userDetail;
        res.status(200).send(userWithoutPwd);
        logger.info("GET REQ: User information retrieved successfully", {
          username: userWithoutPwd.username,
        });
        return;
      }
    }
    logger.debug("Incorrect password or username provided by user");
    res.status(401).send();
    logger.info("GET REQ: Authentication check failed");
    return;
  } catch (error) {
    res.status(400).send();
    logger.error("GET REQ: Bad Request");
  }
};

const post = async (req, res) => {
  try {
    await checkConnection(req, res);
    const data = jsonValidator.validate(req.body, userSchema);
    if (data.valid != true) {
      res.status(400).send("Invalid data provided");
      logger.info("POST REQ: Invalid data provided", {
        username: req.body.username,
      });
      return;
    }
    const hashed_pwd = await hash_password(req.body.password);
    const new_user = await User.create({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      username: req.body.username,
      password: hashed_pwd,
    });
    const {
      dataValues: { verify, password, ...userWithoutPwd },
    } = new_user;

    logger.info("POST REQ: Successful adding of user", {
      username: req.body.username,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
    });

    if (process.env.NODE_ENV === "PRODUCTION") {
      await publishMesssgePubSub("verify_email", userWithoutPwd);
    }

    res.status(201).send(userWithoutPwd);
  } catch (error) {
    logger.error("POST REQ: Bad request - Duplicate user");
    res.status(400).send();
  }
};

const put = async (req, res) => {
  try {
    if (Object.keys(req.body).length == 0) {
      res.status(400).send();
      logger.info("PUT REQ: Request body is empty");
      return;
    }
    await checkConnection(req, res);
    const auth_check = req.headers.authorization;
    if (auth_check && auth_check.includes("Basic")) {
      const { username, password } = await getAuthUsrnamePwd(auth_check);
      const userDetail = await User.findOne({
        where: { username: username },
      });
      if (process.env.NODE_ENV === "PRODUCTION") {
        const isVerified = await checkVerified(userDetail);
        if (!isVerified) {
          res.status(403).send();
          logger.info("PUT REQ: Request blocked as user not verified");
          return;
        }
      }
      const isPwdExist = userDetail
        ? await compare_password(password, userDetail.password)
        : false;

      if (isPwdExist) {
        const data = jsonValidator.validate(req.body, updateSchema);
        if (data.valid == true) {
          if (req.body.password != null) {
            var hashed_pwd = await hash_password(req.body.password);
            req.body.password = hashed_pwd;
          }
          userDetail.set(req.body);
          await userDetail.save();
          res.status(204).send();
          logger.info("PUT REQ: Updation successful");
          return;
        }
        logger.info("PUT REQ: Body is not valid");
        res.status(400).send();
        return;
      }
    }
    logger.debug("Incorrect password or username provided by user");
    res.status(401).send();
    logger.info("PUT REQ: Authorization failed");
    return;
  } catch (error) {
    res.status(400).send();
    logger.error("PUT REQ: Bad request");
  }
};

const all = async (req, res) => {
  logger.warn("Request type NOT allowed", { method: req.method });
  res.status(405).send();
};

const verifyUser = async (req, res) => {
  try {
    const token = req.query.token;
    if (!token) {
      logger.info("Token unavailable for the request");
      res.status(403).send();
      return;
    }
    const userDetail = await UserVerified.findOne({
      where: { id: token },
    });
    const currTime = Math.floor(Date.now() / 1000);
    const email_time = Math.floor(userDetail.email_sent_time / 1000);
    const diffTime = currTime - email_time;
    if (diffTime >= process.env.EMAIL_EXPIRY * 60) {
      logger.info("The link is expired for username:", {
        username: userDetail.username,
      });
      res.status(403).send();
      return;
    }

    const username = userDetail.username;
    if (username) {
      const user = await User.findOne({
        where: { username: username },
      });
      if (user) {
        await user.update({ verify: true });
        logger.info("Success in verifying the username", {
          username: username,
        });
        await userDetail.update({ email_verified_time: Date.now() });
      } else {
        logger.info("Failed to fetch user details using username", {
          username: username,
        });
        res.status(401).send();
        return;
      }
      res.status(200).send();
      return;
    } else {
      logger.error("Username not available in DB via token");
      res.status(401).send();
      return;
    }
  } catch (error) {
    logger.error(
      "Token expired || Error in verifying the user || Invalid token sequence",
      error
    );
    res.status(403).send();
  }
};

async function checkVerified(userDetail) {
  return userDetail.verify;
}

module.exports = { get, post, put, all, head, verifyUser };
