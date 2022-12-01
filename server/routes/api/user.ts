import passport from "passport";
import { secret } from "../../config/env";
import User from "@models";
import jwt from "jsonwebtoken";
import { Router, Request, Response, NextFunction } from "express";
import {
  OkResponse,
  BadRequestResponse,
  UnauthorizedResponse,
} from "express-http-response";

const secret = require("../../config/env/development").secret,
  router = Router();

passport.use(strategy);

// user, admin, staff
router.post("/signup", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).send({ error: "Please provide all input fields!" });
  }
  const user = new User();
  user.email = email;
  user.role = 0;
  user.password = password;
  user
    .save()
    .then((data) => {
      if (!data) {
        res.send({ error: { message: "Signed up failed.Try again!" } });
      }
      res.send(user.toAuthJSON());
    })
    .catch((err) => {
      res.send({ error: { message: err.message } });
    });
});

// user, admin, staff
router.post("/login", function (req, res, next) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).send({
      error: {
        message: "Email and password field must be provided to login.",
      },
    });
  }
  passport.authenticate(
    "local",
    { session: false },
    function (err, user, info) {
      if (err) {
        return next(err);
      }
      if (user) {
        return res.json({ user: user.toAuthJSON() });
      } else {
        return res.status(422).json(info);
      }
    }
  )(req, res, next);
});

// admin
router.get("/all", auth.verifyToken, auth.isAdmin, (req, res) => {
  User.find({ role: 0 })
    .populate("vehicle", "model isBooked bookedAt endBooking")
    .select("id email vehicle")
    .then((data) => {
      if (!data) {
        return res.send(`No user found`);
      } else {
        return res.send(data);
      }
    })
    .catch((e) => {
      return res.send({ error: { message: `Try again`, more: e.message } });
    });
});

module.exports = router;
