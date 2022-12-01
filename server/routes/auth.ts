import jwt from "jsonwebtoken";
import secret from "@secret";
import {
  OkResponse,
  BadRequestResponse,
  UnauthorizedResponse,
} from "express-http-response";
import { Request, Response, NextFunction } from "express";

const verifyToken = function (req: Request, res: Response, next: NextFunction) {
  const { authorization } = req.headers;
  if (
    (authorization && authorization.split(" ")[0] === "Token") ||
    (authorization && authorization.split(" ")[0] === "Bearer")
  ) {
    const token = authorization.split(" ")[1];
    try {
      jwt.verify(token, secret as any, (error: any, data: any) => {
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
