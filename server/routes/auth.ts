const jwt = require("jsonwebtoken"),
  secret = require("../config/env/index").secret;
const {
  OkResponse,
  BadRequestResponse,
  UnauthorizedResponse,
} = require("express-http-response");

const verifyToken = function (req, res, next) {
  const { authorization } = req.headers;
  if (
    (authorization && authorization.split(" ")[0] === "Token") ||
    (authorization && authorization.split(" ")[0] === "Bearer")
  ) {
    const token = authorization.split(" ")[1];
    try {
      jwt.verify(token, secret, (error, data) => {
        if (error) {
          next(new BadRequestResponse({ error: { message: "Log in first" } }));
        } else {
          req.user = data;
          next();
        }
      });
    } catch {
      next(
        new BadRequestResponse({
          error: { message: "Token expired.Please log in again!!" },
        })
      );
    }
  } else {
    next(
      new BadRequestResponse("You've to log in first to access this service.")
    );
  }
};

const auth = {
  verifyToken,
};

module.exports = auth;
