const LocalStrategy = require("passport-local");
const bcrypt = require("bcryptjs");
const { getUser } = require("../service/userService.js");

const config_passport = (passport) => {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      console.log("LocalStrategy (constructor)", email, password);
      // PouchDB
      var dbUser = new PouchDB("user");
      dbUser.get(email).then(user => {
        console.log(user);
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'Password incorrect' });
          }
        });
      }).catch(err => {
        console.log(err);
        return done(null, false, { message: 'That email is not registered' });
      });
      // MongoDB
      /*
      User.findOne({
        email: email
      }).then(user => {
        if (!user) {
          return done(null, false, { message: 'That email is not registered' });
        }
        // Match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'Password incorrect' });
          }
        });
      });
      */
    })
  );

  passport.serializeUser(function(user, done) {
    console.log("serializeUser", user, done);
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    console.log("deserializeUser", id, done);
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
};

//export default config_passport;
