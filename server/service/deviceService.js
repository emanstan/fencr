var PouchDB = require('pouchdb');

const DB_NAME = "device";

// Load models
//const Device = require("../models/Device.js");

var dbDevice = new PouchDB(DB_NAME);
dbDevice.info().then(function (info) {
  console.log(info);
});
dbDevice.allDocs({
  include_docs: true,
  attachments: true
}).then(function (result) {
  console.log(result);
}).catch(function (err) {
  console.log(err);
});

const getDevice = async (id) => {
  // PouchDB
  try {
    var db = new PouchDB(DB_NAME);
    return await db.get(id);
  }
  catch (err) {
    if (!err && err.reason !== "missing") {
      console.log(err);
    }
    return null;
  }
  // MongoDB
  /*
  User.findOne({ licenseKey: id })
    .then(device => {
      return device;
    })
    .catch(err => {
      return null;
    });
  }
  */
};

const getAllDevices = async (query) => {
  // PouchDB
  try {
    var db = new PouchDB(DB_NAME);
    return await db.allDocs({
      include_docs: true,
      skip: (query.page >= 1 ? query.page - 1 : 0) * query.pageSize,
      limit: query.pageSize,
    });
  }
  catch (err) {
    if (!err && err.reason !== "missing") {
      console.log(err);
    }
    return null;
  }
  // MongoDB
  /*
  User.findAll({ licenseKey: id })
    .then(device => {
      return device;
    })
    .catch(err => {
      return null;
    });
  }
  */
};

const saveDevice = async (obj) => {
  if (!obj) return null;
  const id = obj.licenseKey;
  // PouchDB
  var db = new PouchDB(DB_NAME);
  try {
    var doc = await db.get(id);
    var response = await db.put({
      ...obj,
      _id: id,
      _rev: doc._rev,
    });
    if (response && response.ok) {
      return obj;
    }
    return null;
  }
  catch (err) {
    if (!err) return null;
    if (err.reason === "missing" || err.reason === "deleted") {
      var response = await db.put({
        ...obj,
        _id: id,
        _deleted: false,
      });
      if (response && response.ok) {
        return obj;
      }
    }
    console.log(err);
    return null;
  }
  // MongoDB
  /*
  obj
    .save()
    .then(device => {
      return device;
    })
    .catch(err => console.log(err));
  */
}

const removeDevice = async (obj) => {
  console.log("deleteDevice:", obj)
  if (!obj) return null;
  const id = obj.licenseKey;
  // PouchDB
  var db = new PouchDB(DB_NAME);
  try {
    var doc = await db.get(id);
    var response = await db.remove(doc);
    if (response && response.ok) {
      return obj;
    }
    return null;
  }
  catch (err) {
    if (!err) return null;
    if (err.reason === "missing") {
      return null;
    }
    console.log(err);
    return null;
  }
  // MongoDB
  /*
  ???
  */
}

/* delete any old test users here */
//console.log(removeDevice({ email: "test@example.com" }));
//console.log(removeDevice({ email: "test2@example.com" }));
//console.log(removeDevice({ email: "test3@example.com" }));

module.exports = { getDevice, getAllDevices, saveDevice };
