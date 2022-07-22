require("dotenv").config();
const jwt = require("jsonwebtoken");
const { getDevice } = require("../service/deviceService.js");

const createDeviceToken = (device) => {
  console.log(device, process.env.API_SECRET);
  if (!device) return null;
  return jwt.sign({
      id: device.licenseKey
    }, process.env.API_SECRET, {
      expiresIn: 3600
    });
};

const verifyDeviceToken = (req, res, next) => {
  console.log(req.headers);
  if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
    jwt.verify(req.headers.authorization.split(' ')[1], process.env.API_SECRET, function (err, decode) {
      if (err) {
        req.device = undefined;
        next();
      }
      const device = getDevice(decode.id);
      if (device) {
        req.device = device;
        next();
      }
    });
  }
  req.device = undefined;
  next();
};

module.exports = { createDeviceToken, verifyDeviceToken };