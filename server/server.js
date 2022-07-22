const express = require("express"), app = express();
require("dotenv").config();
const session = require("express-session");
var index_router = require("./routes/index.js");
var users_router = require("./routes/users.js");
var devices_router = require("./routes/devices.js");
const { EXPIRES_IN_SECONDS } = require("./config/auth.js");
var PouchDB = require('pouchdb');
const PouchSession = require("session-pouchdb-store");
//const mongoose = require("mongoose");
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");

const PORT = process.env.API_PORT || 5000;

//look at this for auth
//https://www.topcoder.com/thrive/articles/authentication-and-authorization-in-express-js-api-using-jwt

// generate a secret key if you don't have one (only need to run once, then put in .env)
//const secret = require('crypto').randomBytes(64).toString('hex');
//console.log(secret);

// Public resources
//const __filename = fileURLToPath(import.meta.url);
//const __dirname = dirname(__filename);
app.use(express.static(__dirname + '/public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use(cookieParser());
let db = new PouchDB("sessions", { adapter:'leveldb' });
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store : new PouchSession(db),
  cookie: {
    secure: process.env.NODE_ENV === "production", // if true and not running as HTTPS, the cookie will not be sent back
    httpOnly: true,
    maxAge: EXPIRES_IN_SECONDS,
  }
}));

// Connect to MongoDB
/*
mongoose
  .connect(
    process.env.MONGODB_EDIT_URI,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));
*/

// Connect to PouchDB
//PouchDB.debug.enable('*');
/*
var dbUser = new PouchDB("user");
var dbDevice = new PouchDB("device");
var dbLocation = new PouchDB("location");
var dbMatch = new PouchDB("match");
dbDevice.info().then(function (info) {
  console.log(info);
});
*/

// Routes
//const BASE_ROUTE = process.env.API_BASE_ROUTE || "localhost" + (PORT ? `:${PORT}` : "")
//console.log(BASE_ROUTE);
app.use("/", index_router);
app.use("/api/latest/users", users_router);
app.use("/api/latest/devices", devices_router);

// Web server
app.listen(PORT, console.log(`Server running on ${PORT}`));

// Socket server
const io = new Server(server, {
  /*
  cors: {
      origin: '*' //TODO: need to figure out how to get this to work with logged in user's host
      //origin: 'https://cdn.jsdelivr.net'
  }
  */
});
io.on("connection", socket => {
  console.log("a user connected");
  const transport = socket.conn.transport.name;
  console.log("current transport", transport);
  socket.conn.on("upgrade", () => {
    const newTransport = socket.conn.transport.name;
    console.log("new transport", newTransport);
  });
  // send a special something to the client
  socket.on("register", (data) => {
    console.log("device registered");
    console.log(obj);
    // do some database work
    const config = {};
    socket.emit("config", config, () => {});
  });
  socket.on("disconnect", (reason) => {
    console.log("user disconnected -", reason);
  });
  // send connection ack
  socket.emit("connected", {}, () => {});
});

//TODO 
// device assigned to player or device assigned to space?
//  > space is probably better choice
// once a device is assigned to a space+position, add the device's socket to that space's room
// once a player is assigned to a space+position, add the device's socket to that player's room
// once a space (piste / strip / field of play / match space) is assigned to a match, add the space's device sockets to the match's room
// once a match is complete, remove the space's device sockets from that match's room and remove the space's device sockets from that space's room
// add a page accessible to a referee on the local network to handle scoring, penalties, etc. for an assigned match
// add a page accessible to anyone on the local network to register their user and join player / place rooms and enter chat
