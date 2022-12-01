import { Strategy as LocalStrategy } from "passport-local";
import { User } from "@models";

const myStrategy = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  function (email: string | undefined, password: string | undefined, done: Function) {
    User.findOne({ email })
      .then((user: any) => {
        if (!user || !user.validPassword(password)) {
          return done(null, false, {
            errors: { message: "email or password is invalid" },
          });
        }
        return done(null, user);
      })
      .catch(done);
  }
);

module.exports = myStrategy;
