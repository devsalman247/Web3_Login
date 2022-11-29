const LocalStrategy = require("passport-local").Strategy,
  User = require("../models/User");

const myStrategy = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  (email, password, done) => {
    User.findOne({ email })
      .then((user) => {
        if (!user || !user.validPassword(password)) {
          return done(null, false, {
            errors: { message: "Email or Password is invalid" },
          });
        }
        return done(null, user);
      })
      .catch(done);
  }
);

module.exports = myStrategy;
