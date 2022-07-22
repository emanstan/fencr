require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { getUser } = require("../service/userService.js");

const SALT_ROUNDS = 10;
const EXPIRES_IN_SECONDS = 5*60*1000;//86400;

const hashPassword = async (user) => {
  // may move bcrypt hash based functions here
}

const comparePassword = () => {
  // may move bcrypt compare based functions here
}

const createToken = (user) => {
  console.log(user, process.env.API_SECRET);
  if (!user) return null;
  return jwt.sign({
      id: user.email
    }, process.env.API_SECRET, {
      expiresIn: 86400
    });
};

const verifyToken = async (req, res, next) => {
  console.log("headers =", req.headers);
  console.log("session =", req.session);
  if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    console.log("authorization =", req.headers.authorization.split(' '));
    await jwt.verify(req.headers.authorization.split(' ')[1], process.env.API_SECRET, async function (err, decode) {
      console.log("jwt.verify err =", err);
      if (err) {
        req.user = undefined;
        next();
      }
      console.log("jwt.verify decode =", decode);
      const user = await getUser(decode.id);
      if (user) {
        console.log("jwt.verify user =", user);
        req.user = user;
        next();
      }
    });
  }
  else if (req.session && req.session.token) {
    console.log("session.token =", req.session.token);
    await jwt.verify(req.session.token, process.env.API_SECRET, async function (err, decode) {
      console.log("jwt.verify err =", err);
      if (err) {
        req.user = undefined;
        next();
      }
      console.log("jwt.verify decode =", decode);
      const user = await getUser(decode.id);
      if (user) {
        console.log("jwt.verify user =", user);
        req.user = user;
        next();
      }
    });
  }
  else {
    req.user = undefined;
    next();
  }
};

module.exports = { EXPIRES_IN_SECONDS, hashPassword, comparePassword, createToken, verifyToken };
