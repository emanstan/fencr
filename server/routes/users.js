const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { getUser, saveUser } = require("../service/userService.js");
const { hashPassword, comparePassword, createToken, verifyToken } = require("../config/auth.js");

const SALT_ROUNDS = 10;

const emailPattern = /^\w+[\+\.\w-]*@([\w-]+\.)*\w+[\w-]*\.([a-z]{2,4}|\d+)$/i;

const setupUser = (obj) => {
  // PouchDB
  return obj;
  // MongoDB
  /*
  return new User(obj);
  */
};

// List
router.post('/page/:page', verifyToken, async (req, res, next) => {
  let obj = null;
  let notification = null;
  let errors = [];
  console.log(req.body);
  try {
    obj = {
      page: req.params.page,
      pageSize: req.body.pagesize,
      search: req.body.search,
      filters: JSON.parse(req.body.filters),
    };
  }
  catch (err) {
    console.log(err);
    notification = { type: "error", msg: "Invalid query data." };
    //console.log(notification, errors);
    res.status(400)
      .send({ notification, errors });
    return;
  }
  const results = await getAllUsers(obj);
  console.log(results);
  res.status(200)
    .send(results);
});

// Get

// SignIn
router.post('/signin', async (req, res, next) => {
  let notification = null;
  let errors = [];
  let obj = null;
  try {
    obj = JSON.parse(req.body.data);
    //console.log(obj);
  }
  catch {
    notification = { type: "error", msg: "Invalid signin data." };
    //console.log(notification, errors);
    res.status(400)
      .send({ notification, errors });
    return;
  }
  if (obj == null) {
    notification = { type: "error", msg: "Invalid signin data." };
    //console.log(notification, errors);
    res.status(400)
      .send({ notification, errors });
    return;
  }
  const { email, password } = obj;
  if (!email || !password) {
    notification = { type: "warning", msg: "Please enter all fields." };
    //console.log(notification, errors);
    res.status(400)
      .send({ notification, errors });
    return;
  }
  if (email.trim().length < 1) {
    errors.push({ name: "email", msg: "This field is required." });
  }
  if (!emailPattern.test(email)) {
    errors.push({ name: "email", msg: "Must be a valid email address." });
  }
  if (password.trim().length < 1) {
    errors.push({ name: "password", msg: "This field is required." });
  }
  if (errors.length > 0) {
    notification = { type: "warning", msg: "Please check the fields in error and try again." };
    //console.log(notification, errors);
    res.status(400)
      .send({ notification, errors });
    return;
  }
  const user = await getUser(email);
  if (!user) {
    notification = { type: "error", msg: "Invalid credentials." };
    //cconsole.log(notification, errors);
    res.status(400)
      .send({ notification, errors });
    return;
  }
  try {
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        console.log("compare err:", err);
        notification = { type: "error", msg: "Invalid credentials."  };
        //console.log(notification, errors);
        res.status(401)
          .send({
            notification, errors,
            token: null,
          });
        return;
      }
      if (result) {
        const jwt = createToken(user);
        // create new cookie (httpOnly)
        req.session.token = jwt;
        notification = { type: "success", msg: "User sign-in successful!" };
        res.status(200)
          .send({
            notification, errors,
            token: jwt,
            user: {
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
            },
          });
        return;
      }
      notification = { type: "error", msg: "Invalid credentials." };
      //console.log(notification, errors);
      res.status(401)
        .send({
          notification, errors,
          token: null
        });
    });
  }
  catch (err) {
    console.log(err);
    notification = { type: "error", msg: "Invalid credentials." };
    //console.log(notification, errors);
    res.status(401)
      .send({
        notification, errors,
        token: null
      });
  }
});

// SignOut
router.get('/signout', (req, res, next) => {
  console.log(req, res);
  req.session.destroy((err) => console.log("/signout error:", err));
  //req.logout();
  req.user = undefined;
  res.json({
    token: null,
  });
});

// Register
router.post('/register', async (req, res, next) => {
  let notification = null;
  let errors = [];
  let obj = null;
  try {
    obj = JSON.parse(req.body.data);
  }
  catch {
    notification = { type: "error", msg: 'Invalid registration data' };
    //console.log(notification, errors);
    res.status(400)
      .send({ notification, errors });
    return;
  }
  if (obj == null) {
    notification = { type: "error", msg: 'Invalid registration data' };
    //console.log(notification, errors);
    res.status(400)
      .send({ notification, errors });
    return;
  }
  const { firstName, lastName, email, password, password2 } = obj;
  //console.log(firstName, lastName, email, password, password2);
  if (!firstName || !lastName || !email || !password || !password2) {
    notification = { type: "warning", msg: 'Please enter all fields' };
    //console.log(notification, errors);
    res.status(400)
      .send({ notification, errors });
    return;
  }
  if (firstName.trim().length < 1) {
    errors.push({ name: "firstName", msg: "Must be at least 1 character." });
  }
  if (lastName.trim().length < 1) {
    errors.push({ name: "lastName", msg: "Must be at least 1 character." });
  }
  if (email.trim().length < 1) {
    errors.push({ name: "email", msg: "Must be at least 1 character." });
  }
  if (!emailPattern.test(email)) {
    errors.push({ name: "email", msg: "Must be a valid email address." });
  }
  if (password.length < 8) {
    errors.push({ name: "password", msg: "Must be at least 8 characters." });
  }
  if (password !== password2) {
    errors.push({ name: "password2", msg: "Must match password." });
  }
  if (errors.length > 0) {
    notification = { type: "warning", msg: "Please check the fields in error and try again." };
    //console.log(notification, errors);
    res.status(400)
      .send({ notification, errors });
    return;
  }
  const user = await getUser(email);
  if (user) {
    notification = { type: "warning", msg: "That email address has already been registered." };
    errors.push({ name: "email", msg: "Already registered." });
    //console.log(notification, errors);
    res.status(400)
      .send({ notification, errors });
    return;
  }
  const newUser = await setupUser({ firstName, lastName, email, password });
  try {
    bcrypt.hash(newUser.password, SALT_ROUNDS, async (err, hash) => {
      if (err) {
        console.log("hash err:", err);
        notification = { type: "error", msg: "User registration failed." };
        //console.log(notification, errors);
        res.status(400)
          .send({ notification, errors });
        return;
      }
      newUser.password = hash;
      if (await saveUser(newUser)) {
        notification = { type: "success", msg: "User registered successfully!" };
        //console.log(notification, errors);
        res.status(200)
          .send({ notification, errors });
        return;
      }
      notification = { type: "error", msg: "User registration failed." };
      //console.log(notification, errors);
      res.status(400)
        .send({ notification, errors });
    });
  }
  catch (err) {
    console.log(err);
    notification = { type: "error", msg: "User registration failed." };
    //console.log(notification, errors);
    res.status(400)
      .send({ notification, errors });
  }
});

// Refresh
router.post('/refresh', verifyToken, async (req, res, next) => {
  console.log("/refresh req.user =", req.user);
  if (req.user) {
    res.json({
      token: createToken(req.user),
      user: {
        email: req.user.email,
        firsName: req.user.firstName,
        lastName: req.user.lastName,
      }
    });
    return;
  }
  res.json({
    token: null,
  });
});

module.exports = router;
