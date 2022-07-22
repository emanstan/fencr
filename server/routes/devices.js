const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { getDevice, getAllDevices, saveDevice } = require("../service/deviceService.js");
const { createToken, verifyToken } = require("../config/auth.js");
const { createDeviceToken, verifyDeviceToken } = require("../config/authDevice.js");

const STATUS_NONE = "";
const STATUS_AUTHORIZED = "authorized";
const STATUS_ASSIGNED = "assigned";
const STATUS_ACTIVE = "active";

const getData = (req, dataName) => {
  let obj = null;
  let notification = null;
  let errors = [];
  try {
    obj = JSON.parse(req.body.data);
  }
  catch {
    notification = { type: "error", msg: `Invalid ${dataName} data.` };
    //console.log(notification, errors);
    return [obj, notification, errors];
  }
  if (obj == null) {
    notification = { type: "error", msg: `Invalid ${dataName} data.` };
    //console.log(notification, errors);
    return [obj, notification, errors];
  }
  return [obj, notification, errors];
};

const setupDevice = (obj) => {
  // PouchDB
  return obj;
  // MongoDB
  /*
  return new Device(obj);
  */
};

const authorize = async (req, device) => {
  device.status = STATUS_AUTHORIZED;
  console.log("device.ipAddress (before) =", device.ipAddress);
  device.ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  console.log("device.ipAddress (after) =", device.ipAddress);
  device.lastUpdate = new Date();
  return await saveDevice(device);
};

const deauthorize = async (req, device) => {
  device.status = STATUS_NONE;
  console.log("device.ipAddress (before) =", device.ipAddress);
  device.ipAddress = "";
  console.log("device.ipAddress (after) =", device.ipAddress);
  device.lastUpdate = new Date();
  return await saveDevice(device);
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
  const results = await getAllDevices(obj);
  console.log(results);
  res.status(200)
    .send(results);
});

// Get

// Save
router.post('/save', verifyToken, async (req, res) => {
  let [obj, notification, errors] = getData(req, "save");
  if (!obj) {
    res.status(400)
      .send({ notification, errors });
    return;
  }
  const { licenseKey, venue, location, description } = obj;
  //console.log(licenseKey);
  if (!licenseKey) {
    notification = { type: "error", msg: "Invalid save data." };
    //console.log(notification, errors);
    res.status(400)
      .send({ notification, errors });
    return;
  }
  if (licenseKey.trim().length < 1) {
    errors.push({ name: "licenseKey", msg: "Missing or invalid." });
  }
  if (errors.length > 0) {
    notification = { type: "error", msg: "Invalid save data." };
    //console.log(notification, errors);
    res.status(400)
      .send({ notification, errors: [] });
    return;
  }
  const device = await getDevice(licenseKey);
  if (!device) {
    notification = { type: "warning", msg: "Invalid device." };
    //console.log(notification, errors);
    res.status(400)
      .send({ notification, errors });
    return;
  }
  const updatedDevice = {
    ...device,
    venue: venue,
    location: location,
    description: description,
    lastUpdate: new Date(),
  };
  if (await saveDevice(updatedDevice)) {
    notification = { type: "success", msg: "Device saved successfully!" };
    //console.log(notification, errors);
    res.status(200)
      .send({ notification, errors });
    return;
  }
  notification = { type: "error", msg: "Device save failed." };
  //console.log(notification, errors);
  res.status(400)
    .send({ notification, errors });
});

// Register
router.post('/register', verifyToken, async (req, res) => {
  let [obj, notification, errors] = getData(req, "registration");
  if (!obj) {
    res.status(400)
      .send({ notification, errors });
    return;
  }
  const { licenseKey, name, venue, description } = obj;
  //console.log(licenseKey);
  if (!licenseKey || !name) {
    notification = { type: "error", msg: "Invalid registration data." };
    //console.log(notification, errors);
    res.status(400)
      .send({ notification, errors });
    return;
  }
  if (licenseKey.trim().length < 1) {
    errors.push({ name: "licenseKey", msg: "Missing or invalid." });
  }
  if (name.trim().length < 1) {
    errors.push({ name: "name", msg: "Missing or invalid." });
  }
  if (errors.length > 0) {
    notification = { type: "error", msg: "Invalid registration data." };
    //console.log(notification, errors);
    res.status(400)
      .send({ notification, errors: [] });
    return;
  }
  const device = await getDevice(licenseKey);
  if (device) {
    notification = { type: "warning", msg: "That device has already been registered." };
    errors.push({ name: "licenseKey", msg: "Already registered." });
    //console.log(notification, errors);
    res.status(400)
      .send({ notification, errors });
    return;
  }
  const newDevice = await setupDevice({ 
    licenseKey, name, venue,
    location: null,
    position: null,
    status: STATUS_NONE,
    fencer: null,
    ipAddress: null,
    description,
    lastUpdate: new Date(),
  });
  if (await saveDevice(newDevice)) {
    notification = { type: "success", msg: "Device registered successfully!" };
    //console.log(notification, errors);
    res.status(200)
      .send({ notification, errors });
    return;
  }
  notification = { type: "error", msg: "Device registration failed." };
  //console.log(notification, errors);
  res.status(400)
    .send({ notification, errors });
});

// Authorize
router.post('/auth', async (req, res) => {
  let [obj, notification, errors] = getData(req, "authorization");
  if (!obj) {
    res.status(400)
      .send({ notification, errors });
    return;
  }
  const { licenseKey } = obj;
  //console.log(licenseKey);
  if (!licenseKey) {
    notification = { type: "error", msg: "Invalid authorization data." };
    //console.log(notification, errors);
    res.status(400)
      .send({ notification, errors });
    return;
  }
  if (licenseKey.trim().length < 1) {
    errors.push({ name: "licenseKey", msg: "Missing or invalid." });
  }
  if (errors.length > 0) {
    notification = { type: "error", msg: "Invalid authorization data." };
    //console.log(notification, errors);
    res.status(400)
      .send({ notification, errors: [] });
    return;
  }
  const device = await getDevice(licenseKey);
  if (!device) {
    const deauthorizedDevice = await deauthorize(req, device);
    notification = { type: "error", msg: "Invalid license." };
    //console.log(notification, errors);
    res.status(400)
      .send({ notification, errors });
    return;
  }
  if (licenseKey === device.licenseKey) {
    const authorizedDevice = await authorize(req, device);
    notification = { type: "success", msg: "Device authorization successful!" };
    res.status(200)
      .send({
        notification, errors,
        token: createToken(authorizedDevice),
        device: {
          name: authorizedDevice.name,
          status: authorizedDevice.status,
        },
      });
    return;
  }
  const deauthorizedDevice = await deauthorize(req, device);
  notification = { type: "error", msg: "Device authorization failed." };
  //console.log(notification, errors);
  res.status(400)
    .send({ notification, errors });
});

// Deauthorize
router.get('/deauth', async (req, res) => {
  let [obj, notification, errors] = getData(req, "deauthorization");
  if (!obj) {
    res.status(400)
      .send({ notification, errors });
    return;
  }
  const { licenseKey } = obj;
  //console.log(licenseKey);
  if (!licenseKey) {
    notification = { type: "error", msg: "Invalid deauthorization data." };
    //console.log(notification, errors);
    res.status(400)
      .send({ notification, errors });
    return;
  }
  if (licenseKey.trim().length < 1) {
    errors.push({ name: "licenseKey", msg: "Missing or invalid." });
  }
  if (errors.length > 0) {
    notification = { type: "error", msg: "Invalid authorization data." };
    //console.log(notification, errors);
    res.status(400)
      .send({ notification, errors: [] });
    return;
  }
  const device = await getDevice(licenseKey);
  if (device) {
    const deauthorizedDevice = await deauthorize(req, device);
    notification = { type: "success", msg: "Device deauthorization successful!" };
    res.status(200)
      .send({
        notification, errors,
        token: null,
        device: {
          name: deauthorizedDevice.name,
          status: deauthorizedDevice.status,
        },
      });
    return;
  }
  notification = { type: "error", msg: "Device deauthorization failed." };
  //console.log(notification, errors);
  res.status(400)
    .send({ notification, errors });
});

module.exports = router;
