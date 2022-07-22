var PouchDB = require('pouchdb');

const DB_NAME = "user";

// Load models
//const User = require("../models/User.js");

/*
var dbDevice = new PouchDB("device");
var dbLocation = new PouchDB("location");
var dbMatch = new PouchDB("match");
*/
var dbUser = new PouchDB(DB_NAME);
dbUser.info().then(function (info) {
  console.log(info);
});
dbUser.allDocs({
  include_docs: true,
  attachments: true
}).then(function (result) {
  console.log(result);
}).catch(function (err) {
  console.log(err);
});

const getUser = async (id) => {
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
  User.findOne({ email: id })
    .then(user => {
      return user;
    })
    .catch(err => {
      return null;
    });
  }
  */
};

const getAllUsers = async (query) => {
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
  User.findAll({ email: id })
    .then(device => {
      return device;
    })
    .catch(err => {
      return null;
    });
  }
  */
};

const saveUser = async (obj) => {
  if (!obj) return null;
  const id = obj.email;
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
    .then(user => {
      return user;
    })
    .catch(err => console.log(err));
  */
}

const removeUser = async (obj) => {
  console.log("deleteUser:", obj)
  if (!obj) return null;
  const id = obj.email;
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
//console.log(removeUser({ email: "test@example.com" }));
//console.log(removeUser({ email: "test2@example.com" }));
//console.log(removeUser({ email: "test3@example.com" }));

module.exports = { getUser, getAllUsers, saveUser };
